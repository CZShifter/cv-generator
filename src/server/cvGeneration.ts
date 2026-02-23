import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { renderCvHtml as renderCvHtmlCs } from "@/utils/cs/renderCvHtml";
import { renderInvoiceHtml as renderInvoiceHtmlCs } from "@/utils/cs/renderInvoiceHtml";
import { renderCvHtml as renderCvHtmlSk } from "@/utils/sk/renderCvHtml";
import { renderInvoiceHtml as renderInvoiceHtmlSk } from "@/utils/sk/renderInvoiceHtml";
import { SITE_NAME, SITE_NAME_SK } from "@/config/site";
import type { CvData } from "@/data/CvData";

type Locale = "cs" | "sk";

function envBool(name: string, fallback = false): boolean {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  const v = String(raw).trim().toLowerCase();
  if (v === "1" || v === "true" || v === "yes" || v === "on") return true;
  if (v === "0" || v === "false" || v === "no" || v === "off") return false;
  return fallback;
}

const PDF_SANDBOX = envBool("PDFENDPOINT_SANDBOX", false);

function admin() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url) throw new Error("Missing env: SUPABASE_URL");
  if (!key) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

async function ensurePhotoUploaded(
  supabase: ReturnType<typeof admin>,
  cvId: string,
  data: Record<string, unknown>
) {
  const photo = data?.photo;
  if (typeof photo !== "string" || !photo.startsWith("data:image")) return data;

  const base64 = photo.split(",")[1];
  const binary = Buffer.from(base64, "base64");
  const ext = photo.match(/^data:image\/(png|jpeg|jpg)/)?.[1] || "png";
  const photoPath = `photos/${cvId}.${ext}`;

  const { error: photoError } = await supabase.storage
    .from("photos")
    .upload(photoPath, binary, {
      contentType: `image/${ext}`,
      upsert: true,
    });

  if (photoError) {
    throw new Error(`Photo upload failed: ${photoError.message}`);
  }

  const { data: photoPublic } = supabase.storage.from("photos").getPublicUrl(photoPath);
  return { ...data, photo: photoPublic.publicUrl };
}

export async function generateCvArtifacts(cvId: string, locale: Locale) {
  const supabase = admin();

  const { data: row, error } = await supabase
    .from("cv_entries")
    .select("id, cv_json, template_id, order_number, pdf_status, pdf_url, invoice_url")
    .eq("id", cvId)
    .single();

  if (error || !row) {
    throw new Error("CV entry not found");
  }

  if (row.pdf_status === "ready" && row.pdf_url) {
    return { pdfUrl: row.pdf_url, invoiceUrl: row.invoice_url ?? null, status: "ready" };
  }

  const { data: locked } = await supabase
    .from("cv_entries")
    .update({ pdf_status: "generating" })
    .eq("id", cvId)
    .in("pdf_status", ["not_started", "failed"])
    .select("id");

  if (!locked || locked.length === 0) {
    return { pdfUrl: row.pdf_url ?? null, invoiceUrl: row.invoice_url ?? null, status: "skipped" };
  }

  const normalized = (await ensurePhotoUploaded(
    supabase,
    cvId,
    row.cv_json as Record<string, unknown>
  )) as CvData;

  const renderCvHtml = locale === "sk" ? renderCvHtmlSk : renderCvHtmlCs;
  const renderInvoiceHtml = locale === "sk" ? renderInvoiceHtmlSk : renderInvoiceHtmlCs;
  const siteName = locale === "sk" ? SITE_NAME_SK : SITE_NAME;
  const footerText =
    locale === "sk"
      ? `Vytvorené pomocou ${siteName}`
      : `Vytvořeno pomocí ${siteName}`;

  const html = renderCvHtml(normalized, row.template_id);

  const result = await axios.post(
    "https://api.pdfendpoint.com/v1/convert",
    {
      html,
      sandbox: PDF_SANDBOX,
      orientation: "vertical",
      page_width: "794px",
      page_height: "1122px",
      no_blank_pages: true,
      margin_top: "0px",
      margin_bottom: "0px",
      margin_left: "0px",
      margin_right: "0px",
      viewport: "794x1123",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PDFENDPOINT_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const pdfUrl = result.data?.data?.url;
  if (!pdfUrl) throw new Error("PDF endpoint did not return URL");

  const pdfFile = await axios.get(pdfUrl, { responseType: "arraybuffer" });
  const filename = `${cvId}.pdf`;
  const pdfPath = `pdfs/${filename}`;

  const { error: pdfUploadError } = await supabase.storage
    .from("pdfs")
    .upload(pdfPath, pdfFile.data, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (pdfUploadError) throw new Error(`PDF upload failed: ${pdfUploadError.message}`);

  const { data: pdfPublic } = supabase.storage.from("pdfs").getPublicUrl(pdfPath);
  const finalPdfUrl = pdfPublic.publicUrl;

  const now = new Date();
  const yearSuffix = now.getFullYear().toString().slice(-2);
  const invoiceNumber = `${yearSuffix}${row.order_number}`;
  const invoiceHtml = renderInvoiceHtml({ invoiceNumber, date: now });

  const invRes = await axios.post(
    "https://api.pdfendpoint.com/v1/convert",
    {
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
      footer_html: `<div style="font-size:9px; width:100%; color:#505050; text-align:center;">${footerText}</div>`,
      viewport: "794x1123",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PDFENDPOINT_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const invUrl = invRes.data?.data?.url;
  if (!invUrl) throw new Error("Invoice endpoint did not return URL");

  const invFile = await axios.get(invUrl, { responseType: "arraybuffer" });
  const invFilename = `Doklad_${invoiceNumber}.pdf`;
  const invPath = `invoices/${invFilename}`;

  const { error: invUploadError } = await supabase.storage
    .from("invoices")
    .upload(invPath, invFile.data, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (invUploadError) throw new Error(`Invoice upload failed: ${invUploadError.message}`);

  const { data: invPublic } = supabase.storage.from("invoices").getPublicUrl(invPath);
  const finalInvoiceUrl = invPublic.publicUrl;

  await supabase
    .from("cv_entries")
    .update({
      cv_json: normalized,
      pdf_url: finalPdfUrl,
      invoice_url: finalInvoiceUrl,
      pdf_status: "ready",
      pdf_generated_at: new Date().toISOString(),
    })
    .eq("id", cvId);

  return { pdfUrl: finalPdfUrl, invoiceUrl: finalInvoiceUrl, status: "ready" };
}
