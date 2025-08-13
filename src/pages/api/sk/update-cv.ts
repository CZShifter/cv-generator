// /pages/api/update-cv.ts
import { createClient } from '@supabase/supabase-js';
import { renderCvHtml } from '@/utils/sk/renderCvHtml';
import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';

function envBool(name: string, fallback = false): boolean {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback; // ← použij fallback, když není nastavena

  const v = String(raw).trim().toLowerCase();
  if (v === "1" || v === "true" || v === "yes" || v === "on") return true;
  if (v === "0" || v === "false" || v === "no"  || v === "off") return false;

  return fallback; // ← použij fallback i pro neznámé hodnoty
}

const PDF_SANDBOX = envBool("PDFENDPOINT_SANDBOX", false);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0"); //Zakázat cache na 100 %
  
  try {
    if (req.method !== 'POST') return res.status(405).end();

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const { id, data, templateId } = req.body;
    if (!id) return res.status(400).json({ error: "Missing ID." });

    // Fotka
    let photoUrl = '';
    if (data.photo?.startsWith("data:image")) {
      /* console.log("Zpracovávám novou fotku..."); */
      const base64 = data.photo.split(",")[1];
      const binary = Buffer.from(base64, 'base64');
      const ext = data.photo.match(/^data:image\/(png|jpeg|jpg)/)?.[1] || "png";
      const photoPath = `photos/${id}.${ext}`;

      const { error: photoError } = await supabase.storage
        .from("photos")
        .upload(photoPath, binary, {
          contentType: `image/${ext}`,
          upsert: true,
        });

      if (photoError) {
        console.error("Chyba při nahrávání fotky:", photoError);
        return res.status(500).json({ error: photoError });
      }

      const { data: photoPublic } = supabase.storage.from("photos").getPublicUrl(photoPath);
      photoUrl = photoPublic.publicUrl;
      data.photo = photoUrl;
    }

    // Aktualizace záznamu v DB
   /*  console.log("Aktualizuji záznam v databázi..."); */
    const { error: updateError } = await supabase
      .from("cv_entries")
      .update({
        cv_json: data,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Chyba při UPDATE v DB:", updateError);
      return res.status(500).json({ error: updateError });
    }

    // Render HTML
   /*  console.log("Renderuji HTML..."); */
    const html = renderCvHtml(data, templateId);

    // PDF Endpoint
   /*  console.log("Odesílám HTML k renderu..."); */
    const result = await axios.post("https://api.pdfendpoint.com/v1/convert", {
      html,
      sandbox: PDF_SANDBOX,
      orientation: "vertical",
      page_width: "794px",
      page_height: "1122px",
      print_media: "true",
      no_blank_pages: true,
      margin_top: "0px",
      margin_bottom: "0px",
      margin_left: "0px",
      margin_right: "0px",
      viewport: "794x1123"
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.PDFENDPOINT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const pdfUrl = result.data?.data?.url;
    if (!pdfUrl) {
      console.error("PDF endpoint nevrátil URL.");
      return res.status(500).json({ error: "PDF endpoint nevrátil URL." });
    }

   /*  console.log("PDF URL:", pdfUrl); */

    const pdfFile = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    const filename = `${id}.pdf`;
    const pdfPath = `pdfs/${filename}`;

    const { error: pdfUploadError } = await supabase.storage
      .from("pdfs")
      .upload(pdfPath, pdfFile.data, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (pdfUploadError) {
      console.error("Chyba při nahrávání PDF:", pdfUploadError);
      return res.status(500).json({ error: pdfUploadError });
    }

    const { data: pdfPublic } = supabase.storage.from("pdfs").getPublicUrl(pdfPath);
    const finalPdfUrl = pdfPublic.publicUrl;

   /*  console.log("PDF uloženo, odpověď bude vygenerována"); */

    await supabase.from("cv_entries").update({
      pdf_url: finalPdfUrl,
    }).eq("id", id);

    res.status(200).json({
      previewUrl: `/sk/zaplaceno/${id}`,
      pdfUrl: finalPdfUrl,
    });

  } catch (err: unknown) {
  console.error("Globální chyba v /api/sk/update-cv:", err);
  if (err instanceof Error) {
    res.status(500).json({ error: err.message || "Unknown server error" });
  } else {
    // Pro chyby, které nejsou typu Error, vrátíme obecnou zprávu
    res.status(500).json({ error: "Unknown server error" });
  }
}
}