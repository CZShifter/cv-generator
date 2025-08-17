import type { NextApiRequest, NextApiResponse } from "next";
import { askChatGPT } from "@/pages/api/chatgpt5";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0"); //Zakázat cache na 100 %
  
  if (req.method !== "POST") return res.status(405).end();

  const { motivation } = req.body;
  if (!motivation) return res.status(400).json({ error: "Chybí vstup pro motivační dopis." });

  try {
    const prompt = `Napiš přirozený motivační dopis o délce cca 300-400 slov, určený k žádosti o práci. Vycházej z těhto informací: "${motivation}". Piš v první osobě, dbej na osobní motivaci i přínos pro firmu. Využij veškeré uživatelem zadané informace. Text strukturalizuj do odstavců a buď konkrétní. Pokud uživatel něco neuvede, nedělej prázdná místa na doplnění. Pracuj jen s tím, co je uvedeno.`;

    const aiMotivation = await askChatGPT([
      { role: "system", content: "Jsi zkušený HR specialista, který vytváří motivační dopisy v češtině na základě zadání uživatele." },
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