import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store'); // Zákaz Cache
  
  if (req.method !== "POST") return res.status(405).end();

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const { id } = req.body;
  if (!id) return res.status(400).json({ status: "error", error: "Missing ID" });

  const { data, error } = await supabase
    .from("cv_entries")
    .select("expires_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({ status: "error", error: "CV nenalezeno" });
  }

  const expired = new Date() > new Date(data.expires_at);

  res.status(200).json({ status: expired ? "expired" : "valid" });
}
