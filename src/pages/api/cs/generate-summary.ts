import type { NextApiRequest, NextApiResponse } from "next";
import { askChatGPT } from "@/pages/api/chatgpt";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0"); //Zakázat cache na 100 %
   
  if (req.method !== "POST") return res.status(405).end();

  const { summary } = req.body;
  if (!summary) return res.status(400).json({ error: "Chybí popis pracovní pozice v summary." });

  try {
    const prompt = `Napiš popis o rozsahu 30 až 60 slov, který by vystihoval člověka na pozici "${summary}" do sekce "O mně" v životopisu. Piš v první osobě, vystihni hlavně motivaci.`;

    const aiSummary = await askChatGPT([
      { role: "system", content: "Jsi HR specialista, který pomáhá s tvorbou životopisů v češtině." },
      { role: "user", content: prompt }
    ]);

    res.status(200).json({ summary: aiSummary });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Chyba při komunikaci s AI." });
  }
}
