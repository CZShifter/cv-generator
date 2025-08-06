import type { NextApiRequest, NextApiResponse } from "next";
import { askChatGPT } from "@/pages/api/chatgpt";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0"); //Zakázat cache na 100 %
  
  if (req.method !== "POST") return res.status(405).end();

  const { position } = req.body;
  if (!position) return res.status(400).json({ error: "Chybí název pracovní pozice." });

  try {
    const prompt = `
Napiš 4 až 6 odrážek, které by shrnuly hlavní pracovní náplň člověka na pozici "${position}" v životopisu.
- Piš česky
- Každou odrážku začni znakem "-"
- Každou odrážku na nový řádek, bez úvodu a závěru
- Maximálně 8 slov k odrážce
- Výstup musí být pouze jednotlivé odrážky, bez dalšího textu
`;

    const aiPoints = await askChatGPT([
      { role: "system", content: "Jsi HR specialista, který pomáhá s tvorbou životopisů v češtině." },
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