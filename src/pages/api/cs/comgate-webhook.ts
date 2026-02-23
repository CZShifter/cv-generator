import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { generateCvArtifacts } from "@/server/cvGeneration";

const COMGATE_BASE = "https://payments.comgate.cz";
const MERCHANT = process.env.COMGATE_MERCHANT!;
const SECRET = process.env.COMGATE_SECRET!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!MERCHANT) throw new Error("Missing env: COMGATE_MERCHANT");
if (!SECRET) throw new Error("Missing env: COMGATE_SECRET");
if (!SUPABASE_URL) throw new Error("Missing env: SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");

type ComgateStatus = {
  status?: "PAID" | "PENDING" | "CANCELLED" | string;
  refId?: string;
  price?: string;
  curr?: "CZK" | "EUR" | string;
  [k: string]: string | undefined;
};

function readParam(req: NextApiRequest, key: string): string | undefined {
  const body = req.body as Record<string, unknown> | string | undefined;
  if (body && typeof body === "object" && key in body) {
    const v = body[key];
    return typeof v === "string" ? v : undefined;
  }
  if (typeof body === "string") {
    const p = new URLSearchParams(body);
    return p.get(key) ?? undefined;
  }
  const q = req.query[key];
  return typeof q === "string" ? q : undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const transId =
    readParam(req, "transId") ||
    readParam(req, "trans_id") ||
    readParam(req, "id");
  const refId =
    readParam(req, "refId") ||
    readParam(req, "ref_id") ||
    readParam(req, "refid");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  let row:
    | { id: string; payment_status: string | null; pdf_status: string | null; comgate_trans_id: string | null }
    | null = null;

  if (transId) {
    const { data } = await supabase
      .from("cv_entries")
      .select("id, payment_status, pdf_status, comgate_trans_id")
      .eq("comgate_trans_id", transId)
      .single();
    row = data ?? null;
  }

  if (!row && refId) {
    const { data } = await supabase
      .from("cv_entries")
      .select("id, payment_status, pdf_status, comgate_trans_id")
      .eq("comgate_ref_id", refId)
      .single();
    row = data ?? null;
  }

  if (!row) {
    return res.status(404).json({ error: "CV not found for webhook" });
  }

  const statusRes = await fetch(`${COMGATE_BASE}/v1.0/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      merchant: MERCHANT,
      transId: transId || row.comgate_trans_id || "",
      secret: SECRET,
    }),
  });

  const text = await statusRes.text();
  const cg = Object.fromEntries(new URLSearchParams(text)) as ComgateStatus;

  if (cg.status === "CANCELLED") {
    await supabase
      .from("cv_entries")
      .update({ payment_status: "cancelled" })
      .eq("id", row.id);
    return res.json({ ok: true });
  }

  if (cg.status !== "PAID") {
    await supabase
      .from("cv_entries")
      .update({ payment_status: "pending" })
      .eq("id", row.id);
    return res.json({ ok: true });
  }

  const paidAt = new Date();
  const expiresAt = new Date(paidAt.getTime() + 24 * 60 * 60 * 1000);

  await supabase
    .from("cv_entries")
    .update({
      paid: true,
      payment_status: "paid",
      payment_tx_id: transId ?? row.comgate_trans_id ?? null,
      comgate_trans_id: transId ?? row.comgate_trans_id ?? null,
      comgate_ref_id: refId ?? null,
      paid_at: paidAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .eq("id", row.id);

  if (row.pdf_status !== "ready") {
    await generateCvArtifacts(row.id, "cs");
  }

  return res.json({ ok: true });
}
