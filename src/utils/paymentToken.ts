import crypto from "crypto";

export type PaymentPayload = {
  refId: string;
  transId: string;
  amount: number;   // haléře/centy
  curr: "CZK" | "EUR";
  templateId: string;
  iat: number;
  exp: number;      // TTL (např. +2h)
};

const KEY = process.env.PAYMENT_SIGNING_KEY!;
if (!KEY) throw new Error("Missing env: PAYMENT_SIGNING_KEY");

export function signPayment(p: Omit<PaymentPayload, "iat" | "exp">, ttlSec = 7200) {
  const payload: PaymentPayload = {
    ...p,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ttlSec,
  };
  const data = JSON.stringify(payload);
  const signature = crypto.createHmac("sha256", KEY).update(data).digest("hex");
  return { payload, signature };
}

export function verifyPayment(payload: PaymentPayload, signature: string) {
  const data = JSON.stringify(payload);
  const sig = crypto.createHmac("sha256", KEY).update(data).digest("hex");
  const ok = timingSafeEqual(sig, signature);
  const now = Math.floor(Date.now() / 1000);
  return ok && payload.exp > now;
}

function timingSafeEqual(a: string, b: string) {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}
