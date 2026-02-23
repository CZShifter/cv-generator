// /api/cs/create-payment.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { getBaseUrl } from "@/utils/baseUrl";
import { createClient } from "@supabase/supabase-js";

const COMGATE_BASE = "https://payments.comgate.cz";
const MERCHANT = process.env.COMGATE_MERCHANT!;
const SECRET   = process.env.COMGATE_SECRET!;
const TEST     = (process.env.COMGATE_TEST ?? "true") === "true";
const PRICE_CV_CZK = Number(process.env.PRICE_CV_CZK ?? "0"); // např. 89
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!MERCHANT) throw new Error("Missing env: COMGATE_MERCHANT");
if (!SECRET) throw new Error("Missing env: COMGATE_SECRET");
if (!SUPABASE_URL) throw new Error("Missing env: SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");

type RequestBody = { templateId: string; data: Record<string, unknown> };
type ComgateCreateOk  = { code: 0; redirect: string; transId: string };
type ComgateCreateErr = { code: number; message?: string };

// typy pro /v2.0/method.json
type ComgateMethodItem = { id?: string; group?: string };
type ComgateMethodsResponse = { methods?: ComgateMethodItem[] };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  if (!Number.isFinite(PRICE_CV_CZK) || PRICE_CV_CZK <= 0) {
    return res.status(500).json({ error: "Missing or invalid PRICE_CV_CZK" });
  }

  const { templateId, data } = req.body as RequestBody;
  if (!templateId || !data) {
    return res.status(400).json({ error: "Missing templateId or data" });
  }

  const BASE   = getBaseUrl(req);
  const refId  = crypto.randomUUID();
  const amount = Math.round(PRICE_CV_CZK * 100); // haléře

  // --- 1) Zjisti dostupné metody přes v2.0 GET /method.json (Basic Auth)
  const auth = Buffer.from(`${MERCHANT}:${SECRET}`).toString("base64");
  const qs = new URLSearchParams({ country: "CZ", curr: "CZK", type: "json" });
  const ua = req.headers["user-agent"];
  if (typeof ua === "string" && ua) qs.set("userAgent", ua);

  let methodExpr: string = "CARD_ALL"; // bezpečný fallback — aspoň karta
  try {
    const methodsRes = await fetch(`${COMGATE_BASE}/v2.0/method.json?${qs}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    let data: ComgateMethodsResponse | null = null;
    try {
      data = (await methodsRes.json()) as ComgateMethodsResponse;
    } catch {
      data = null;
    }

    const methods: ComgateMethodItem[] = Array.isArray(data?.methods) ? data!.methods! : [];

    // Povolíme cokoliv ze skupiny CARD + Apple/Google Pay (id jsou APPLEPAY_REDIRECT/GOOGLEPAY_REDIRECT)
    const allowed = new Set<string>();
    for (const m of methods) {
      const id = (m.id ?? "").toString().toUpperCase();
      const group = (m.group ?? "").toString().toUpperCase();
      if (group === "CARD" && id) allowed.add(id); // konkrétní karetní poskytovatelé (např. CARD_CZ_COMGATE)
      if (id === "APPLEPAY_REDIRECT" || id === "GOOGLEPAY_REDIRECT") allowed.add(id);
    }
    if (allowed.size > 0) {
      // Složíme výraz "A+B+C". Pokud Apple/Google nejsou pro tohle UA/účet dostupné,
      // zůstane jen karetní metoda.
      methodExpr = Array.from(allowed).join("+");
    }
  } catch {
    // necháme fallback "CARD_ALL"
  }

  // --- 2) Vytvoř platbu
  const payload = {
    test: TEST,
    price: amount,
    curr: "CZK",
    country: "CZ",
    label: "CV",
    refId,
    method: methodExpr,  // např. "CARD_CZ_COMGATE+APPLEPAY_REDIRECT"
    lang: "cs",
    url_paid:      `${BASE}/cs/po-platbe?status=paid&refId=${refId}`,
    url_cancelled: `${BASE}/cs/po-platbe?status=cancelled&refId=${refId}`,
    url_pending:   `${BASE}/cs/po-platbe?status=pending&refId=${refId}`,
  };

  const r = await fetch(`${COMGATE_BASE}/v2.0/payment.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const cg = (await r.json()) as ComgateCreateOk | ComgateCreateErr;

  if ("code" in cg && cg.code === 0 && "redirect" in cg && "transId" in cg) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const id = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    let normalized = { ...data };
    const photo = (normalized as Record<string, unknown>)?.photo;
    if (typeof photo === "string" && photo.startsWith("data:image")) {
      const base64 = photo.split(",")[1];
      const binary = Buffer.from(base64, "base64");
      const ext = photo.match(/^data:image\/(png|jpeg|jpg)/)?.[1] || "png";
      const photoPath = `photos/${id}.${ext}`;

      const { error: photoError } = await supabase.storage
        .from("photos")
        .upload(photoPath, binary, {
          contentType: `image/${ext}`,
          upsert: true,
        });

      if (photoError) {
        return res.status(500).json({ error: photoError.message });
      }

      const { data: photoPublic } = supabase.storage.from("photos").getPublicUrl(photoPath);
      normalized = { ...(normalized as Record<string, unknown>), photo: photoPublic.publicUrl };
    }

    const { error: insertError } = await supabase
      .from("cv_entries")
      .insert([
        {
          id,
          cv_json: normalized,
          template_id: templateId,
          paid: false,
          amount: PRICE_CV_CZK,
          expires_at: expiresAt.toISOString(),
          comgate_ref_id: refId,
          comgate_trans_id: cg.transId,
          payment_tx_id: cg.transId,
          payment_status: "created",
          pdf_status: "not_started",
        },
      ]);

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    return res.json({
      redirectUrl: cg.redirect,
      transId: cg.transId,
      refId,
      cvId: id,
    });
  }

  return res.status(400).json({ error: (cg as ComgateCreateErr)?.message || "Create payment failed" });
}
