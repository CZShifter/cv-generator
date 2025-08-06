import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store"); // ← Zákaz cacheování PDF
  
  const { path, filename } = req.query;

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: "Chybí parametr 'path'" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.storage
    .from("pdfs")
    .download(path);

  if (error || !data) {
    return res.status(500).json({ error: "Soubor nelze stáhnout." });
  }

  // převedeme Blob na Buffer
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(buffer);
}
