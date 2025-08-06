//Pomocná funkce pro testování!!!
import type { NextApiRequest, NextApiResponse } from "next";
import { SITE_URL, OG_IMAGE, SITE_NAME } from "@/config/site";
import axios from "axios";
import { renderCvHtml } from "@/utils/cs/renderCvHtml";
import { SAMPLE_CV_DATA } from "@/data/sampleCvData2";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  try {
    const data = SAMPLE_CV_DATA["cvtemplate4"];
    if (!data) {
      res.status(404).json({ error: "Data nenalezena." });
      return;
    }

    const html = renderCvHtml(data);

    const PDFENDPOINT_API_KEY = process.env.PDFENDPOINT_API_KEY;
    // Funkce pro odstranění diakritiky
    const removeDiacritics = (str: string) => {
      return str
    .normalize("NFD") // Rozloží znaky s diakritikou na základní znak a diakritiku
    .replace(/[\u0300-\u036f]/g,""); // Odstraní kombinující diakritické znaky
    };
    const firstName = removeDiacritics((data.name || "Jan").trim()) // Odstraní diakritiku a ořízne mezery
    .replace(/\s*\.\s*/g, "_"); // Nahradí tečku a jakékoli okolní mezery jedním podtržítkem
    const lastName = removeDiacritics((data.surname || "Novák").trim()) // Odstraní diakritiku a ořízne mezery
    .replace(/\s*\.\s*/g, "_"); // Nahradí tečku a jakékoli okolní mezery jedním podtržítkem
    const filename = `Zivotopis_${firstName}_${lastName}`;

    // 1. Nejprve pošli request na PDFendpoint
    const result = await axios({
      method: "POST",
      url: "https://api.pdfendpoint.com/v1/convert",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PDFENDPOINT_API_KEY}`,
        "Accept": "application/json",
      },
      data: {
        html,
        sandbox: true,
        orientation: "vertical",
        page_width: "794px",
        page_height: "1122px",
        margin_top: "0px",
        margin_bottom: "0px",
        margin_left: "0px",
        margin_right: "0px",
        no_blank_pages: true,
        footer_html: `<div style="font-size:9px; width:100%; color:#505050; text-align:center;">Vytvořeno pomocí ${SITE_NAME}</div>`,
        viewport: "794x1123"
      },
    });

    const pdfUrl = result.data?.data?.url;
    if (!pdfUrl) {
      res.status(500).json({ error: "PDF endpoint nevrátil URL ke stažení PDF." });
      return;
    }

    // 2. Pak stáhni samotný PDF soubor z výsledné URL
    const pdfResponse = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
      headers: {
        "Accept": "application/pdf",
      }
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.send(Buffer.from(pdfResponse.data));
  } catch (err: any) {
    console.error("[PDFendpoint] Error:", err?.response?.status, err?.response?.data, err?.message);
    res
      .status(500)
      .send(
        err?.response?.data
          ? typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data)
          : err.message ?? "PDF endpoint error"
      );
  }
}
