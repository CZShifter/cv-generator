import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!SUPABASE_URL) throw new Error("Missing env: SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const id = typeof req.query.id === "string" ? req.query.id : undefined;
  const refId = typeof req.query.refId === "string" ? req.query.refId : undefined;

  if (!id && !refId) {
    return res.status(400).json({ error: "Missing id or refId" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  let q = supabase
    .from("cv_entries")
    .select("id, payment_status, pdf_status")
    .limit(1);

  q = id ? q.eq("id", id) : q.eq("comgate_ref_id", refId!);

  const { data, error } = await q.single();
  if (error || !data) {
    return res.status(404).json({ error: "Not found" });
  }

  const paymentStatus = (data.payment_status || "created").toString().toUpperCase();
  const pdfStatus = (data.pdf_status || "not_started").toString().toLowerCase();

  return res.json({
    status: paymentStatus,
    paymentStatus: data.payment_status,
    pdfStatus,
    cvId: data.id,
    previewUrl: paymentStatus === "PAID" && pdfStatus === "ready" ? `/sk/zaplaceno/${data.id}` : undefined,
  });
}
