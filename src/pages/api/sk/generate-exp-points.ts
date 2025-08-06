import type { NextApiRequest, NextApiResponse } from "next";
import { askChatGPT } from "@/pages/api/chatgpt";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0"); //Zakázat cache na 100 %
  
  if (req.method !== "POST") return res.status(405).end();

  const { position } = req.body;
  if (!position) return res.status(400).json({ error: "Chýba názov pracovnej pozície." });

  try {
    const prompt = `
Napíš 4 až 6 odrážok, ktoré by zhrnuli hlavnú pracovnú náplň človeka na pozícii "${position}" v životopise.
- Píš po slovensky
- Každú odrážku začni znakom "-"
- Každú odrážku na nový riadok, bez úvodu a záveru
- Maximálne 8 slov na odrážku
- Výstup musí byť iba jednotlivé odrážky, bez ďalšieho textu
`;

    const aiPoints = await askChatGPT([
      { role: "system", content: "Si HR špecialista, ktorý pomáha s tvorbou životopisov v slovenčine." },
      { role: "user", content: prompt }
    ]);

    console.log("Výstup askChatGPT:", aiPoints);

    let points: string[] = [];

    if (typeof aiPoints === "string") {
      points = aiPoints
      .split(/(?:\n| {2,})/)
      .map(s => s.trim().replace(/^[-–•*]\s*/, ""))
      .filter(Boolean);
    }

    // Pokud po rozparsování je pole stále prázdné, pošli zpět i původní string pro debugging
    if (points.length === 0) {
      return res.status(200).json({ points: [], raw: aiPoints });
    }

    res.status(200).json({ points });
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(500).json({ error: e.message || "Chyba při komunikaci s AI." });
    } else {
      res.status(500).json({ error: "Chyba při komunikaci s AI." });
    }
  }
}