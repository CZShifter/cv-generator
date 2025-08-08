import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { getBaseUrl } from "@/utils/baseUrl";
import { signPayment } from "@/utils/paymentToken";

const COMGATE_BASE = "https://payments.comgate.cz";
const MERCHANT = process.env.COMGATE_MERCHANT!;
const SECRET   = process.env.COMGATE_SECRET!;
const TEST     = (process.env.COMGATE_TEST ?? "true") === "true";

if (!MERCHANT) throw new Error("Missing env: COMGATE_MERCHANT");
if (!SECRET) throw new Error("Missing env: COMGATE_SECRET");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { data, templateId, priceCZK } = req.body as {
    data: any; templateId: string; priceCZK: number;
  };

  const BASE = getBaseUrl(req);
  const refId = crypto.randomUUID();
  const amount = Math.round(Number(priceCZK) * 100); // haléře

  const payload = {
    test: TEST,
    price: amount,
    curr: "CZK",
    label: "CV",
    refId,
    method: "CARD_ALL",      // karta + Apple Pay/Google Pay
    lang: "cs",
    url_paid:      `${BASE}/cs/po-platbe?status=paid&refId=${refId}`,
    url_cancelled: `${BASE}/cs/po-platbe?status=cancelled&refId=${refId}`,
    url_pending:   `${BASE}/cs/po-platbe?status=pending&refId=${refId}`,
  };

  const auth = Buffer.from(`${MERCHANT}:${SECRET}`).toString("base64");
  const r = await fetch(`${COMGATE_BASE}/v2.0/payment.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const cg = await r.json();
  if (!(cg?.code === 0 && cg?.redirect && cg?.transId)) {
    return res.status(400).json({ error: cg?.message || "Create payment failed" });
  }

  const paymentToken = signPayment({
    refId,
    transId: cg.transId,
    amount,
    curr: "CZK",
    templateId,
  });

  return res.json({ redirectUrl: cg.redirect, transId: cg.transId, refId, paymentToken });
}
