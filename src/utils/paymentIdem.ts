import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!SUPABASE_URL) throw new Error("Missing env: SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");

const BUCKET = process.env.PAYMENT_IDEM_BUCKET || "system";

function admin() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export async function getFinalizeMarker(transId: string) {
  const supa = admin();
  const path = `payments/consumed/${transId}.json`;
  const { data, error } = await supa.storage.from(BUCKET).download(path);
  if (error || !data) return null;
  try {
    const text = await data.text();
    return JSON.parse(text) as { previewUrl: string; cvId?: string; at: string };
  } catch {
    return null;
  }
}

export async function setFinalizeMarker(transId: string, payload: { previewUrl: string; cvId?: string }) {
  const supa = admin();
  const path = `payments/consumed/${transId}.json`;
  const body = Buffer.from(JSON.stringify({ ...payload, at: new Date().toISOString() }), "utf8");
  await supa.storage.from(BUCKET).upload(path, body, { contentType: "application/json", upsert: false });
}
