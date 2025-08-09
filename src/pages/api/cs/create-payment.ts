// /api/cs/create-payment.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { getBaseUrl } from "@/utils/baseUrl";
import { signPayment } from "@/utils/paymentToken";

const COMGATE_BASE = "https://payments.comgate.cz";
const MERCHANT = process.env.COMGATE_MERCHANT!;
const SECRET   = process.env.COMGATE_SECRET!;
const TEST     = (process.env.COMGATE_TEST ?? "true") === "true";
const PRICE_CV_CZK = Number(process.env.PRICE_CV_CZK ?? "0"); // např. 89

if (!MERCHANT) throw new Error("Missing env: COMGATE_MERCHANT");
if (!SECRET) throw new Error("Missing env: COMGATE_SECRET");

type RequestBody = { templateId: string };
type ComgateCreateOk  = { code: 0; redirect: string; transId: string };
type ComgateCreateErr = { code: number; message?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  if (!Number.isFinite(PRICE_CV_CZK) || PRICE_CV_CZK <= 0) {
    return res.status(500).json({ error: "Missing or invalid PRICE_CV_CZK" });
  }

  const { templateId } = req.body as RequestBody;

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

    // Očekáváme: { methods: [{ id, group, ... }, ...] }
    const data = await methodsRes.json().catch(() => null) as any;
    const methods: Array<{ id?: string; group?: string }> = Array.isArray(data?.methods) ? data.methods : [];

    // Povolíme cokoliv ze skupiny CARD + Apple/Google Pay (id jsou APPLEPAY_REDIRECT/GOOGLEPAY_REDIRECT)
    const allowed = new Set<string>();
    for (const m of methods) {
      const id = String(m.id ?? "").toUpperCase();
      const group = String(m.group ?? "").toUpperCase();
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
    const paymentToken = signPayment({
      refId,
      transId: cg.transId,
      amount,
      curr: "CZK",
      templateId,
    });

    return res.json({
      redirectUrl: cg.redirect,
      transId: cg.transId,
      refId,
      paymentToken,
    });
  }

  return res.status(400).json({ error: (cg as ComgateCreateErr)?.message || "Create payment failed" });
}
