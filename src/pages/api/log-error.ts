// pages/api/log-error.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// limit payloadu, ať tě nikdo nezahltí
export const config = { api: { bodyParser: { sizeLimit: "32kb" } } };

// Supabase (server‑side only). Když nejsou env, upload se přeskočí.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
   res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // best‑effort IP + rate‑limit v paměti
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";
  if (!rateLimit(ip)) return res.status(204).end();

  try {
    const { message, stack, url, extra, dedupKey, release } = req.body ?? {};
    if (!message || typeof message !== "string") return res.status(400).end();

    const key = dedupKey || sha1(`${message}|${String(stack ?? "").slice(0, 300)}`).slice(0, 16);
    const safeExtra = sanitizeExtra(extra);

    // Sestav jednotný event objekt (použijeme pro log i pro storage)
    const event = {
      type: "user_error" as const,
      ts: new Date().toISOString(),
      message: message.slice(0, 2000),
      stack: typeof stack === "string" ? stack.slice(0, 8000) : undefined,
      url: typeof url === "string" ? url : undefined,
      ua: req.headers["user-agent"],
      ip,
      dedupKey: key,
      release: typeof release === "string" ? release : undefined,
      env: process.env.NODE_ENV,
      extra: safeExtra,
    };

    // ↓ Tohle uvidíš ve Vercel Logs (filtruj text:"user_error")
    console.error(JSON.stringify(event));

    // ——— Supabase Storage upload (varianta B): každý error = 1 JSON soubor ———
    if (supabase) {
      try {
        const day = event.ts.slice(0, 10); // YYYY-MM-DD
        const filename = `${Date.now()}-${event.dedupKey}.json`;
        const path = `user-errors/${day}/${filename}`;

        // V Node prostředí použijeme Buffer
        const payload = Buffer.from(JSON.stringify(event), "utf8");

        const { error: upErr } = await supabase.storage
          .from("logs") // <- název bucketu (vytvoř si ve Storage)
          .upload(path, payload, {
            cacheControl: "no-cache",
            contentType: "application/json",
            upsert: false, // nový soubor pro každý event
          });

        if (upErr) {
          // Tiché zalogování selhání uploadu do Vercel Logs
          console.error(
            JSON.stringify({
              type: "user_error_storage_upload_failed",
              ts: new Date().toISOString(),
              path,
              error: upErr.message,
            })
          );
        }
      } catch (err) {
        console.error(
          JSON.stringify({
            type: "user_error_storage_exception",
            ts: new Date().toISOString(),
            error: (err as Error).message,
          })
        );
      }
    }

    return res.status(204).end();
  } catch (e) {
    console.error("user_error_log_failed", e);
    return res.status(500).end();
  }
}

// ——— helpers ———
const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_EVENTS = 60;

function rateLimit(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (b.count >= MAX_EVENTS) return false;
  b.count++;
  return true;
}

function sha1(s: string) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

function sanitizeExtra(extra: unknown) {
  if (!extra || typeof extra !== "object") return undefined;
  try {
    return JSON.parse(
      JSON.stringify(extra, (_k, v) => (JSON.stringify(v)?.length > 2000 ? "[TRUNCATED]" : v))
    );
  } catch {
    return undefined;
  }
}
