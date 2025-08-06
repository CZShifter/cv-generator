import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { FaEdit, FaRegFilePdf, FaFileInvoice, FaCopy } from "react-icons/fa";
import { SITE_URL_SK, SITE_NAME } from "@/config/site";
import { trackGAEvent } from "@/utils/analytics";
import { createClient } from "@supabase/supabase-js";
import styles from "@/scss/zaplaceno.module.scss";
import Head from "next/head";

type CvEntry = {
  id: string;
  pdf_url: string;
  invoice_url: string | null;
  expires_at: string;
  cv_json: {
    name?: string;
    surname?: string;
  };
};

type Props = {
  data: CvEntry | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const id = context.params?.id as string;
  const { data, error } = await supabase
    .from("cv_entries")
    .select("id, pdf_url, invoice_url, expires_at, cv_json")
    .eq("id", id)
    .single();

  if (error || !data) {
    return { props: { data: null } };
  }

  return {
    props: { data },
  };
};

// Generuje bezpečný název souboru
function generateFilename(name?: string, surname?: string): string {
  const sanitize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\./g, "_")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .trim();

  const first = sanitize(name || "Uzivatel");
  const last = sanitize(surname || "Bezejmeny");

  return `Zivotopis_${first}_${last}.pdf`;
}

export default function ZaplacenoPage({ data }: Props) {
  if (!data) {
    return (
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Životopis nebol nájdený</h1>
        <p className={styles.message}>Záznam neexistuje alebo došlo k chybe.</p>
      </div>
    );
  }

  const { id, pdf_url, invoice_url, expires_at, cv_json } = data;
  const isExpired = new Date() > new Date(expires_at);

  const name = cv_json?.name;
  const surname = cv_json?.surname;
  const filename = generateFilename(name, surname);

  const pdfPath = pdf_url?.split("/object/public/pdfs/")[1] ?? "";
  const invoicePath = invoice_url?.split("/object/public/invoices/")[1] ?? "";

  const expiresDate = new Date(expires_at);
  const [remainingMs, setRemainingMs] = useState(0); // nebo null
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const update = () => setRemainingMs(expiresDate.getTime() - Date.now());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresDate]);

  // Formátovací funkce
    function formatCountdown(ms: number) {
      if (ms <= 0) return "vypršelo";
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      let result = "";
      if (hours > 0) result += `${hours} h `;
      if (minutes > 0 || hours > 0) result += `${minutes} min `;
      result += `${seconds} s`;
      return result.trim();
    }

  // Funkce pro programové stažení PDF
  const downloadPdf = async () => {
    try {
      const res = await fetch(`/api/download-pdf?path=${encodeURIComponent(pdfPath)}&filename=${filename}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Chyba při stahování PDF:", error);
    }
  };

  // Funkce pro programové stažení faktury
  const downloadInvoice = async () => {
    try {
      const res = await fetch(`/api/download-invoice?path=${encodeURIComponent(invoicePath)}&filename=Doklad_${id}.pdf`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Doklad_o_zaplaceni_${id}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Chyba při stahování faktury:", error);
    }
  };

  // ---- Funkce pro kopírování odkazu ----
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${SITE_URL_SK}/sk/edit/${id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`Životopis byl úspěšně vytvořen | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
      <section className={styles.ZaplacenoWrapper}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>🎉 Váš životopis bol úspešne vytvorený!</h1>
          <button className={styles.link} id="cvbtn" onClick={() => {trackGAEvent('click', 'download', 'download_cv_pdf_sk');downloadPdf(); }}>
            <FaRegFilePdf /> Stiahnuť životopis (PDF)
          </button>
          {invoice_url ? (
            <button className={styles.link} id="invoicebtn" onClick={() => {trackGAEvent('click', 'download', 'download_cv_invoice_sk');downloadInvoice(); }}>
              <FaFileInvoice /> Doklad o zaplatení
            </button>
          ) : (
            <p className={styles.note}>Doklad zatiaľ nie je k dispozícii.</p>
          )}
          <div className={styles.edit}>
            {!isExpired ? (
              <>
                <a className={styles.link} id="editbtn" href={`/sk/edit/${id}`}>
                  <FaEdit /> Upraviť životopis
                </a>
              </>
            ) : (
              <p className={styles.expired}>⏰ Ubehlo 24h – možnosť úpravy vypršala.</p>
            )}
          </div>
          {!isExpired && (
            <p className={styles.editbtn} onClick={() => {
              trackGAEvent('click', 'edit', 'uprava_cv_sk');}}>
              {`${SITE_URL_SK}/sk/edit/${id}`}
            </p>
           )}
          {!isExpired && (
            <div className={styles.copylinkwrapper}>
              <p className={styles.editbtnremind}>
                Tento odkaz si uložte, aby ste sa mohli vrátiť k prípadnej úprave!
              </p>
              <button
                type="button"
                className={styles.copyButton}
                onClick={handleCopy}
                title="Skopírovať odkaz"
              >
                <FaCopy style={{ marginRight: 4 }} />
                {copied ? "Skopírované!" : "Skopírovať"}
              </button>
            </div>
          )}
          <p className={styles.expiry}>
            {isClient && remainingMs > 0
              ? <>Do vypršania možnosti úpravy zostáva:<br /><strong>{formatCountdown(remainingMs)}</strong></>
              : null
            }
          </p>
        </div>
      </section>
    </>
  );
}