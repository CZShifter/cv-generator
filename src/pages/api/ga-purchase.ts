import type { NextApiRequest, NextApiResponse } from "next";

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID!; // např. "G-XXXXXXX"
const API_SECRET = process.env.GA4_API_SECRET!;         // vytvořte v GA4 Admin → Data streams → Measurement Protocol API secrets

// … nahoře beze změn …

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { cid, sid, transaction_id, value, currency, items, dl, dt } = req.body ?? {};

    const payload = {
      client_id: String(cid || `${Date.now()}.${Math.floor(Math.random() * 1e6)}`),
      non_personalized_ads: false,
      events: [
        {
          name: "purchase",
          params: {
            transaction_id,
            value: Number(value),
            currency: String(currency || "CZK"),
            items: Array.isArray(items) ? items : [],
            session_id: sid ? Number(sid) : undefined,
            page_location: dl || undefined,
            page_title: dt || undefined,
            engagement_time_msec: 1,
          },
        },
      ],
    };

    const qs = new URLSearchParams({
      measurement_id: MEASUREMENT_ID,
      api_secret: API_SECRET,
    });

    const resp = await fetch(`https://www.google-analytics.com/mp/collect?${qs}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.status(resp.ok ? 204 : resp.status).end();
  } catch {
    return res.status(500).json({ error: "mp_failed" });
  }
}
