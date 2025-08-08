import type { NextApiRequest, NextApiResponse } from "next";
import { absoluteUrl } from "@/utils/baseUrl";
import { verifyPayment, PaymentPayload } from "@/utils/paymentToken";
import { getFinalizeMarker, setFinalizeMarker } from "@/utils/paymentIdem";

const COMGATE_BASE = "https://payments.comgate.cz";
const MERCHANT = process.env.COMGATE_MERCHANT!;
const SECRET   = process.env.COMGATE_SECRET!;
if (!MERCHANT) throw new Error("Missing env: COMGATE_MERCHANT");
if (!SECRET) throw new Error("Missing env: COMGATE_SECRET");

// ---- typy requestu/odpovědi
type VerifyFinalizeBody = {
  transId: string;
  refId: string;
  data: Record<string, unknown>; // tady nechávám volné, klidně si to časem zpřesni (Zod/TS interface)
  templateId: string;
  paymentToken: { payload: PaymentPayload; signature: string };
};

type ComgateStatus = {
  status?: "PAID" | "PENDING" | "CANCELLED" | string;
  refId?: string;
  price?: string; // přichází jako string (např. "9900")
  curr?: "CZK" | "EUR" | string;
  [k: string]: string | undefined;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { transId, refId, data, templateId, paymentToken } = req.body as VerifyFinalizeBody;

  if (!transId || !refId || !data || !templateId || !paymentToken) {
    return res.status(400).json({ error: "Missing payload" });
  }

  // 1) HMAC kontrola
  const ok = verifyPayment(paymentToken.payload, paymentToken.signature);
  if (!ok) return res.status(400).json({ error: "Invalid token" });
  if (
    paymentToken.payload.refId !== refId ||
    paymentToken.payload.transId !== transId ||
    paymentToken.payload.templateId !== templateId
  ) {
    return res.status(400).json({ error: "Token mismatch" });
  }

  // 2) Ověření stavu /status (jen PAID)
  const statusRes = await fetch(`${COMGATE_BASE}/v1.0/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ merchant: MERCHANT, transId, secret: SECRET }),
  });

  const text = await statusRes.text();
  const cg = Object.fromEntries(new URLSearchParams(text)) as ComgateStatus; // { status, refId, price, curr, ... }

  if (cg.status === "PENDING")   return res.json({ status: "PENDING" });
  if (cg.status === "CANCELLED") return res.json({ status: "CANCELLED" });
  if (cg.status !== "PAID" || cg.refId !== refId) {
    return res.status(409).json({ error: "Payment not confirmed" });
  }

  // 3) Amount/currency match
  const amount = Number(cg.price ?? 0);
  const curr = (cg.curr as "CZK" | "EUR") ?? "CZK";
  if (amount !== paymentToken.payload.amount || curr !== paymentToken.payload.curr) {
    return res.status(400).json({ error: "Amount/currency mismatch" });
  }

  // 4) Idempotence
  const existing = await getFinalizeMarker(transId).catch(() => null);
  if (existing?.previewUrl) {
    return res.json({ status: "PAID", previewUrl: existing.previewUrl });
  }

  // 5) Finalizace — zavolej tvůj PŮVODNÍ submit-cv
  const submitUrl = absoluteUrl(req, "/api/cs/submit-cv");
  const finalize = await fetch(submitUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, templateId }),
  });

  if (!finalize.ok) {
    const err = await finalize.text().catch(() => "");
    return res.status(500).json({ error: `submit-cv failed: ${err}` });
  }
  const json = await finalize.json() as { previewUrl?: string };
  if (!json?.previewUrl) return res.status(500).json({ error: "Missing previewUrl" });

  // 6) Zapiš marker
  try { await setFinalizeMarker(transId, { previewUrl: json.previewUrl }); } catch {}

  return res.json({ status: "PAID", previewUrl: json.previewUrl });
}
