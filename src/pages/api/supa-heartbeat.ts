import type { NextApiRequest, NextApiResponse } from "next";

// Pages API routes běží v Node.js; tělo požadavku heartbeat nepoužívá.
export const config = { api: { bodyParser: false }, maxDuration: 15 };

function isAuthorized(req: NextApiRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const legacySecret = process.env.HEARTBEAT_CRON_SECRET;

  return Boolean(
    (cronSecret && req.headers.authorization === `Bearer ${cronSecret}`) ||
      (legacySecret &&
        (req.headers["x-cron-key"] === legacySecret || req.query.key === legacySecret)),
  );
}

type InsertedRow = { id: number; created_at: string };
type HeartbeatResponse =
  | { ok: true; inserted: InsertedRow }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string };

async function insertHearthbeatRow(): Promise<InsertedRow> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  // Název hearthbeat odpovídá původní tabulce, včetně jeho pravopisu.
  const resp = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/hearthbeat`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Prefer: "return=representation",
    },
    // Prázdný záznam; databáze doplní výchozí id a created_at.
    body: JSON.stringify({}),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Supabase REST error ${resp.status}: ${txt}`);
  }

  const data = (await resp.json()) as InsertedRow[];
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Unexpected Supabase REST payload");
  }
  return data[0];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HeartbeatResponse>,
): Promise<void> {
  // Přepíše také globální Cache-Control z next.config.ts.
  res.setHeader("Cache-Control", "private, no-store, max-age=0");

  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  if (!isAuthorized(req)) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }

  // Vercel používá UTC. Ze dvou denních spuštění zapisuje jen česká půlnoc.
  // Kontrolujeme celou hodinu kvůli možné prodlevě plánovače na tarifu Hobby.
  const isVercelCron =
    Boolean(req.headers["x-vercel-cron-schedule"]) ||
    req.headers["user-agent"] === "vercel-cron/1.0";
  if (isVercelCron) {
    const pragueHour = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Prague",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date());
    if (pragueHour !== "00") {
      res.status(200).json({
        ok: true,
        skipped: true,
        reason: "Outside Europe/Prague midnight hour",
      });
      return;
    }
  }

  try {
    const inserted = await insertHearthbeatRow();
    res.status(201).json({ ok: true, inserted });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ ok: false, error: msg });
  }
}
