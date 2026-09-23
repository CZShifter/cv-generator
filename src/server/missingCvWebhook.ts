import type { NextApiResponse } from "next";

// A deleted CV may still receive a final cancellation notification.
// Acknowledge only a successful server-to-server verification, never the payload status.
export async function handleMissingCvWebhook(
  res: NextApiResponse,
  merchant: string,
  secret: string,
  transId?: string,
  refId?: string,
) {
  if (!transId) return res.status(404).json({ error: "CV not found for webhook" });

  try {
    const response = await fetch("https://payments.comgate.cz/v1.0/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ merchant, secret, transId }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const status = new URLSearchParams(await response.text());
    if (!response.ok || status.get("code") !== "0" ||
        status.get("transId") !== transId ||
        (refId && status.get("refId") !== refId)) {
      return res.status(502).json({ error: "Comgate status verification failed" });
    }
    if (status.get("status") === "CANCELLED") {
      return res.status(200).json({ ok: true });
    }
    // Do not silently acknowledge a paid or unresolved order without its CV.
    return res.status(404).json({ error: "CV not found for webhook" });
  } catch {
    return res.status(502).json({ error: "Comgate status verification failed" });
  }
}
