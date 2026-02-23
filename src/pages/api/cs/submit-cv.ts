import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { generateCvArtifacts } from "@/server/cvGeneration";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!SUPABASE_URL) throw new Error("Missing env: SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  try {
    if (req.method !== "POST") return res.status(405).end();

    const { cvId } = req.body as { cvId?: string };
    if (!cvId) return res.status(400).json({ error: "Missing cvId." });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data: row, error } = await supabase
      .from("cv_entries")
      .select("id, payment_status")
      .eq("id", cvId)
      .single();

    if (error || !row) return res.status(404).json({ error: "CV not found." });
    if (row.payment_status !== "paid") {
      return res.status(409).json({ error: "Payment not confirmed." });
    }

    const result = await generateCvArtifacts(cvId, "cs");

    return res.status(200).json({
      previewUrl: `/cs/zaplaceno/${cvId}`,
      pdfUrl: result.pdfUrl ?? null,
      invoiceUrl: result.invoiceUrl ?? null,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message || "Unknown server error" });
    } else {
      res.status(500).json({ error: "Unknown server error" });
    }
  }
}
