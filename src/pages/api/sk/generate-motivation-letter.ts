import type { NextApiRequest, NextApiResponse } from "next";
import { askChatGPT } from "@/pages/api/chatgpt";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0"); //Zakázat cache na 100 %
  
  if (req.method !== "POST") return res.status(405).end();

  const { motivation } = req.body;
  if (!motivation) return res.status(400).json({ error: "Chýba vstup pre motivačný list." });

  try {
    const prompt = `Napíš prirodzený motivačný list v rozsahu približne 300–400 slov určený na žiadosť o pracovnú pozíciu. Vychádzaj z týchto informácií: "${motivation}". Píš v prvej osobe, zameraj sa na osobnú motiváciu a prínos pre firmu. Využi všetky informácie zadané používateľom. Text štruktúruj do odstavcov a buď konkrétny. Ak používateľ niečo neuviedol, nevytváraj prázdne miesta na doplnenie. Pracuj iba s tým, čo je uvedené.`;

    const aiMotivation = await askChatGPT([
      { role: "system", content: "Si skúsený HR špecialista, ktorý vytvára motivačné listy v slovenčine na základe zadania používateľa." },
      { role: "user", content: prompt }
    ]);

    res.status(200).json({ motivation: aiMotivation });
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(500).json({ error: e.message || "Chyba při komunikaci s AI." });
    } else {
      res.status(500).json({ error: "Chyba při komunikaci s AI." });
    }
  }
}