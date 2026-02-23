import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { FaEdit, FaRegFilePdf, FaFileInvoice, FaCopy } from "react-icons/fa";
import {
  SITE_URL,
  SITE_URL_SK,
  SITE_NAME,
  OG_IMAGE,
  FAVICON_URL_32,
  FAVICON_URL_192,
  APPLE_TOUCH_ICON_URL,
  GOOGLE_ADS,
  PRICING,
} from "@/config/site";
import { trackGAEvent, trackGaPurchase, trackGaPurchaseBeacon } from "@/utils/analytics";
import { createClient } from "@supabase/supabase-js";
import { trackAdsConversion } from "@/utils/adsPixel";
import styles from "@/scss/zaplaceno.module.scss";
import Head from "next/head";
import SecureSection from "@/components/cs/SecureSection";

type CvEntry = {
  id: string;
  pdf_url: string;
  invoice_url: string | null;
  expires_at: string;
  pdf_generated_at?: string | null;
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
    .select("id, pdf_url, invoice_url, expires_at, pdf_generated_at, cv_json")
    .eq("id", id)
    .single();

  if (error || !data) {
    return { props: { data: null } };
  }

  return { props: { data } };
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
  // ——— stavy (hooks musí být vždy volané) ———
  const [remainingMs, setRemainingMs] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);
  const downloadLockRef = useRef(false);

  // Bezpečné ID pro hooky (může být undefined při prvním renderu nebo když data nejsou)
  const entryId = data?.id;

  // Countdown efekt — hook je vždy zaregistrovaný
  useEffect(() => {
    if (!data) return;

    setIsClient(true);
    const expiresDate = new Date(data.expires_at);

    const update = () => {
      setRemainingMs(expiresDate.getTime() - Date.now());
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [data]);

  // Google Ads konverze — jen se souhlasem a jen jednou na konkrétní entryId
  useEffect(() => {
    if (!entryId) return;
    if (!document.cookie.includes("cookie_consent_v1=accepted_all")) return;

    const key = `ads_conv_sent:${entryId}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, new Date().toISOString());

    // CZ stránka → CZ label + CZ cena/měna
    const sendTo = `${GOOGLE_ADS.ID}/${GOOGLE_ADS.LABEL_CZ}`;
    const { amount, currency } = PRICING.CZ;

    trackAdsConversion(sendTo, {
      value: amount,
      currency,
      transaction_id: entryId,
    });
  }, [entryId]);

  // GA4 purchase — jen se souhlasem a jen jednou na konkrétní entryId
  useEffect(() => {
  if (!entryId) return;
  if (!document.cookie.includes("cookie_consent_v1=accepted_all")) return;

  const key = `ga4_purchase_sent:${entryId}`;
  if (localStorage.getItem(key)) return;
  localStorage.setItem(key, new Date().toISOString());

  const { amount, currency } = PRICING.CZ;

  // 1) gtag – standardní cesta (zůstává)
  trackGaPurchase({
    transaction_id: entryId,
    value: amount,
    currency: currency || "CZK",
    items: [
      { item_id: "cv_pdf_CZ", item_name: "Životopis_CZ", price: amount, quantity: 1 },
    ],
  });

  // 2) beacon → server → GA4 MP (nové)
  trackGaPurchaseBeacon({
    transaction_id: entryId,
    value: amount,
    currency: currency || "CZK",
    items: [
      { item_id: "cv_pdf_CZ", item_name: "Životopis_CZ", price: amount, quantity: 1 },
    ],
  });
}, [entryId]);


  // ——— early return až po registraci všech hooků ———
  if (!data) {
    return (
      <div className={styles.Errorwrapper}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Životopis nebyl nalezen!</h1>
          <p className={styles.message}>Záznam neexistuje, nebo došlo k chybě.</p>
        </div>
      </div>
    );
  }

  // Dál už můžeš pracovat s konkrétními daty
  const { id, pdf_url, invoice_url, expires_at, pdf_generated_at, cv_json } = data;
  const isExpired = Date.now() > new Date(expires_at).getTime();

  const pageUrl = `${SITE_URL}/cs/zaplaceno/${id}/`;
  const pageUrlSk = `${SITE_URL_SK}/sk/zaplaceno/${id}/`;

  const name = cv_json?.name;
  const surname = cv_json?.surname;
  const filename = generateFilename(name, surname);

  const pdfPath = pdf_url?.split("/object/public/pdfs/")[1] ?? "";
  const invoicePath = invoice_url?.split("/object/public/invoices/")[1] ?? "";

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
    if (downloadLockRef.current) return;
    downloadLockRef.current = true;
    try {
      const url = `/api/download-pdf?path=${encodeURIComponent(pdfPath)}&filename=${filename}&v=${encodeURIComponent(pdf_generated_at || "")}`;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();
    } catch (error) {
      console.error("❌ Chyba při stahování PDF:", error);
    } finally {
      setTimeout(() => {
        downloadLockRef.current = false;
      }, 1200);
    }
  };

  // Funkce pro programové stažení faktury
  const downloadInvoice = async () => {
    if (downloadLockRef.current) return;
    downloadLockRef.current = true;
    try {
      const url = `/api/download-invoice?path=${encodeURIComponent(
        invoicePath
      )}&filename=Doklad_${id}.pdf`;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();
    } catch (error) {
      console.error("❌ Chyba při stahování faktury:", error);
    } finally {
      setTimeout(() => {
        downloadLockRef.current = false;
      }, 1200);
    }
  };

  // Kopírování odkazu
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${SITE_URL}/cs/edit/${id}`);
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
        <meta
          name="description"
          content="Váš životopis byl úspěšně vytvořen a je připraven ke stažení."
        />
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Hreflang pro jazykové verze */}
        <link rel="alternate" href={pageUrl} hrefLang="cs-CZ" />
        <link rel="alternate" href={pageUrlSk} hrefLang="sk-SK" />
        <link rel="alternate" href={pageUrl} hrefLang="x-default" />
        {/* OG/Twitter metadata pro interní sdílení */}
        <meta property="og:title" content={`Životopis byl úspěšně vytvořen | ${SITE_NAME}`} />
        <meta
          property="og:description"
          content="Váš životopis byl úspěšně vytvořen a je připraven ke stažení."
        />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Potvrzení o úspěšném vytvoření životopisu" />
      </Head>

      <section className={styles.ZaplacenoWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.cardwrapper}>
            <h1 className={styles.title}>🎉 Váš životopis byl úspěšně vytvořen!</h1>

            <button
              className={styles.link}
              id="cvbtn"
              onClick={() => {
                trackGAEvent("click", "download", "download_cv_pdf");
                downloadPdf();
              }}
            >
              <FaRegFilePdf /> Stáhnout životopis (PDF)
            </button>

            {invoice_url ? (
              <button
                className={styles.link}
                id="invoicebtn"
                onClick={() => {
                  trackGAEvent("click", "download", "download_cv_invoice");
                  downloadInvoice();
                }}
              >
                <FaFileInvoice /> Doklad o zaplacení
              </button>
            ) : (
              <p className={styles.note}>Doklad zatím není k dispozici.</p>
            )}

            <div className={styles.edit}>
              {!isExpired ? (
                <a className={styles.link} id="editbtn" href={`/cs/edit/${id}`}>
                  <FaEdit /> Upravit životopis
                </a>
              ) : (
                <p className={styles.expired}>⏰ Uběhlo 24h - možnost úpravy vypršela.</p>
              )}
            </div>

            {!isExpired && (
              <p
                className={styles.editbtn}
                onClick={() => {
                  trackGAEvent("click", "edit", "uprava_cv");
                }}
              >
                {`${SITE_URL}/cs/edit/${id}`}
              </p>
            )}

            {!isExpired && (
              <div className={styles.copylinkwrapper}>
                <p className={styles.editbtnremind}>
                  Tento odkaz si uložte, abyste se mohli vrátit k případné editaci!
                </p>
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={handleCopy}
                  title="Zkopírovat odkaz"
                >
                  <FaCopy style={{ marginRight: 4 }} />
                  {copied ? "Zkopírováno!" : "Kopírovat"}
                </button>
              </div>
            )}

            <p className={styles.expiry}>
              {isClient && remainingMs > 0 && (
                <>
                  Do vypršení možnosti úpravy zbývá:
                  <br />
                  <strong>{formatCountdown(remainingMs)}</strong>
                </>
              )}
            </p>
          </div>
        </div>

        <SecureSection />
      </section>
    </>
  );
}
