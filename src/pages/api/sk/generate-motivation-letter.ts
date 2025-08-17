// src/pages/api/generate-motivation.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { askChatGPT } from "@/pages/api/chatgpt5";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "POST") return res.status(405).end();

  const { motivation } = req.body as { motivation?: string };
  if (!motivation) return res.status(400).json({ error: "Chýba vstup pre motivačný list." });

  try {
    const prompt =
      `Napíš prirodzený motivačný list v rozsahu približne 300–400 slov, určený na žiadosť o prácu. ` +
      `Vychádzaj z týchto informácií: "${motivation}". ` +
      `Píš v prvej osobe, zdôrazni osobnú motiváciu aj prínos pre firmu. ` +
      `Využi všetky informácie zadané používateľom. ` +
      `Text štruktúruj do odsekov a buď konkrétny. ` +
      `Ak používateľ niečo neuvedie, nevytváraj prázdne miesta na doplnenie. ` +
      `Pracuj len s tým, čo je uvedené.`;

    const aiMotivation = await askChatGPT([
      { role: "system", content: "Si skúsený HR špecialista, ktorý vytvára motivačné listy v slovenčine na základe zadania používateľa." },
      { role: "user", content: prompt },
    ]);

    res.status(200).json({ motivation: aiMotivation });
  } catch (e: any) {
    console.error("Chyba API generate-motivation:", e?.message || e);
    res.status(500).json({ error: e?.message || "Chyba pri komunikácii s AI." });
  }
}