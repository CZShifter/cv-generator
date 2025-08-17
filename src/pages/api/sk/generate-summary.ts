import type { NextApiRequest, NextApiResponse } from "next";
import { askChatGPT } from "@/pages/api/chatgpt";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0"); //Zakázat cache na 100 %
   
  if (req.method !== "POST") return res.status(405).end();

  const { summary } = req.body;
  if (!summary) return res.status(400).json({ error: "Chýba popis pracovnej pozície v summary." });

  try {
    const prompt = `Napíš popis človeka v rozsahu 30 až 60 slov, ktorý sa opisuje takto: "${summary}", do sekcie "O mne" v životopise. Píš v prvej osobe a vystihni najmä jeho motiváciu.`;

    const aiSummary = await askChatGPT([
      { role: "system", content: "Si HR špecialista, ktorý pomáha s tvorbou životopisov v slovenčine." },
      { role: "user", content: prompt }
    ]);

    res.status(200).json({ summary: aiSummary });
 } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(500).json({ error: e.message || "Chyba při komunikaci s AI." });
    } else {
      res.status(500).json({ error: "Chyba při komunikaci s AI." });
    }
  }
}
