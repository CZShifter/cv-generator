import { createClient } from '@supabase/supabase-js';
import { renderCvHtml } from '@/utils/sk/renderCvHtml';
import { renderInvoiceHtml } from "@/utils/sk/renderInvoiceHtml";
import { SITE_NAME_SK, PRICE_CV, PDF_SANDBOX } from "@/config/site";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import crypto from 'crypto';


// Pomocná funkce na ošetření jména
function sanitizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")       // odstraní diakritiku
    .replace(/\./g, "_")                   // tečky na _
    .replace(/\s+/g, "_")                  // mezery na _
    .replace(/[^a-zA-Z0-9_]/g, "")         // odstraní speciální znaky
    .trim();
}

function generatePdfFilename(name: string, surname: string): string {
  const firstName = sanitizeString(name || "Uzivatel");
  const lastName = sanitizeString(surname || "Bezejmeny");
  return `Zivotopis_${firstName}_${lastName}.pdf`;
}

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

    const { data, templateId } = req.body;
    /* console.log("⬇Příchozí data:", { templateId, name: data.name, surname: data.surname }); */

    const id = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const amount = PRICE_CV;

    // Fotka
    let photoUrl = '';
    if (data.photo?.startsWith("data:image")) {
      /* console.log("Zpracovávám fotku..."); */
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

    // Uložení záznamu do DB
    /* console.log("Ukládám záznam do databáze..."); */
    const { data: inserted, error } = await supabase
      .from("cv_entries")
      .insert([{
        id,
        cv_json: data,
        template_id: templateId,
        paid: true,
        amount,
        expires_at: expiresAt.toISOString(),
      }])
      .select("order_number");

    if (error) {
      console.error("Chyba při INSERT do DB:", error);
      return res.status(500).json({ error });
    }

    const orderNumber = inserted[0].order_number;

    // Render HTML
    /* console.log("Renderuji HTML..."); */
    const html = renderCvHtml(data, templateId);

    // PDF Endpoint
    /* console.log("Odesílám HTML na PDF endpoint..."); */
    const result = await axios.post("https://api.pdfendpoint.com/v1/convert", {
      html,
      sandbox: true,
      orientation: "vertical",
      page_width: "794px",
      page_height: "1122px",
      no_blank_pages: PDF_SANDBOX,
      margin_top: "0px",
      margin_bottom: "0px",
      margin_left: "0px",
      margin_right: "0px",
      footer_html: `<div style="font-size:9px; width:100%; color:#505050; text-align:center;">Vytvorené pomocou ${SITE_NAME_SK}</div>`,
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

    /* console.log("PDF URL:", pdfUrl); */
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

    /* console.log("PDF uloženo, generuji odpověď"); */
    await supabase.from("cv_entries").update({
      pdf_url: finalPdfUrl,
    }).eq("id", id);

    // 1) sestavíme číslo faktury ve formátu YY + orderNumber
    const yearSuffix = now.getFullYear().toString().slice(-2);          // ← ZMĚNA
    const invoiceNumber = `${yearSuffix}${orderNumber}`;               // ← ZMĚNA
    // 2) vygenerujeme HTML faktury
    const invoiceHtml = renderInvoiceHtml({                             // ← ZMĚNA
      invoiceNumber,
      date: now,                                                      // ← ZMĚNA
    });
    // 3) odešleme na PDFendpoint
    const invRes = await axios.post("https://api.pdfendpoint.com/v1/convert", {
      html: invoiceHtml,
      sandbox: PDF_SANDBOX,
      orientation: "vertical",
      page_width: "794px",
      page_height: "1122px",
      no_blank_pages: true,
      margin_top: "0px",
      margin_bottom: "0px",
      margin_left: "0px",
      margin_right: "0px",
      footer_html: `<div style="font-size:9px; width:100%; color:#505050; text-align:center;">Vytvorené pomocou ${SITE_NAME_SK}</div>`,
      viewport: "794x1123"
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.PDFENDPOINT_API_KEY}`, // ← ZMĚNA: stejné API klíče
        "Content-Type": "application/json",
      },
    });

    const invUrl = invRes.data?.data?.url;                             // ← ZMĚNA
    if (!invUrl) {
      console.error("Invoice endpoint nevrátil URL.");
      return res.status(500).json({ error: "Invoice endpoint nevrátil URL." });
    }

    const invFile = await axios.get(invUrl, { responseType: "arraybuffer" }); // ← ZMĚNA

    const invFilename = `Doklad_${invoiceNumber}.pdf`;               // ← ZMĚNA
    const invPath = `invoices/${invFilename}`;                        // ← ZMĚNA

    const { error: invUploadError } = await supabase.storage
      .from("invoices")
      .upload(invPath, invFile.data, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (invUploadError) {
      console.error("Chyba při nahrávání faktury:", invUploadError);
      return res.status(500).json({ error: invUploadError });
    }

    const { data: invPublic } = supabase.storage.from("invoices").getPublicUrl(invPath); // ← ZMĚNA
    const finalInvoiceUrl = invPublic.publicUrl;                                         // ← ZMĚNA

    await supabase.from("cv_entries").update({
      invoice_url: finalInvoiceUrl,                                                      // ← ZMĚNA
    }).eq("id", id);                                                                     // ← ZMĚNA
    // KONEC ZMĚN PRO FAKTURU

    res.status(200).json({
      previewUrl: `/sk/zaplaceno/${id}`,
      editUrl: `/sk/edit/${id}`,
      pdfUrl: finalPdfUrl,
      orderNumber,
    });

  } catch (err: any) {
    console.error("Globální chyba v /api/sk/submit-cv:", err);
    res.status(500).json({ error: err.message || "Unknown server error" });
  }
}
