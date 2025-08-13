// utils/adsPixel.ts
export function extractConvId(awId?: string) {
  const m = awId?.match(/AW-(\d+)/i);
  return m ? m[1] : null; // "AW-123..." -> "123..."
}

export async function fireAdsPixel(opts: {
  convId: string;
  label: string;
  value: number;
  currency: "CZK" | "EUR";
  orderId?: string; // volitelné, pro deduplikaci a přehledy
}) {
  const { convId, label, value, currency, orderId } = opts;
  const u = new URL(`https://www.googleadservices.com/pagead/conversion/${convId}/`);
  u.searchParams.set("label", label);
  u.searchParams.set("value", String(value));
  u.searchParams.set("currency_code", currency);
  if (orderId) u.searchParams.set("order_id", orderId);
  u.searchParams.set("guid", "ON");
  u.searchParams.set("script", "0");
  await fetch(u.toString(), { method: "GET" }).catch(() => {});
}
