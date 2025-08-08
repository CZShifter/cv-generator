import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { getBaseUrl } from "@/utils/baseUrl";
import { signPayment } from "@/utils/paymentToken";

const COMGATE_BASE = "https://payments.comgate.cz";
const MERCHANT = process.env.COMGATE_MERCHANT_SK!;
const SECRET   = process.env.COMGATE_SECRET_SK!;
const TEST     = (process.env.COMGATE_TEST ?? "true") === "true";
const PRICE_CV_EUR = Number(process.env.PRICE_CV_EUR ?? "0"); // napr. 9.9 (€)

if (!MERCHANT) throw new Error("Missing env: COMGATE_MERCHANT_SK");
if (!SECRET) throw new Error("Missing env: COMGATE_SECRET_SK");

type RequestBody = {
  templateId: string;
  // žiadna cena z klienta
};

type ComgateCreateOk = { code: 0; redirect: string; transId: string };
type ComgateCreateErr = { code: number; message?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  if (!Number.isFinite(PRICE_CV_EUR) || PRICE_CV_EUR <= 0) {
    return res.status(500).json({ error: "Missing or invalid PRICE_CV_EUR" });
  }

  const { templateId } = req.body as RequestBody;

  const BASE = getBaseUrl(req);
  const refId = crypto.randomUUID();
  const amount = Math.round(PRICE_CV_EUR * 100); // centy

  const payload = {
    test: TEST,
    price: amount,
    curr: "EUR",
    label: "CV",
    refId,
    method: "CARD_ALL", // karta + Apple Pay/Google Pay
    lang: "sk",
    url_paid:      `${BASE}/sk/po-platbe?status=paid&refId=${refId}`,
    url_cancelled: `${BASE}/sk/po-platbe?status=cancelled&refId=${refId}`,
    url_pending:   `${BASE}/sk/po-platbe?status=pending&refId=${refId}`,
  };

  const auth = Buffer.from(`${MERCHANT}:${SECRET}`).toString("base64");
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
      curr: "EUR",
      templateId,
    });

    return res.json({
      redirectUrl: cg.redirect,
      transId: cg.transId,
      refId,
      paymentToken,
    });
  }

  return res
    .status(400)
    .json({ error: (cg as ComgateCreateErr)?.message || "Create payment failed" });
}