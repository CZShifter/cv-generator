import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { FaEdit, FaRegFilePdf, FaFileInvoice, FaCopy } from "react-icons/fa";
import {
  SITE_URL,
  SITE_URL_SK,
  SITE_NAME_SK,
  OG_IMAGE_SK,
  FAVICON_URL_32,
  FAVICON_URL_192,
  APPLE_TOUCH_ICON_URL,
  GOOGLE_ADS,
  PRICING,
} from "@/config/site";
import { trackGAEvent, trackGaPurchase, trackGaPurchaseBeacon } from "@/utils/analytics";
import { trackAdsConversion } from "@/utils/adsPixel";
import { createClient } from "@supabase/supabase-js";
import styles from "@/scss/zaplaceno.module.scss";
import SecureSection from "@/components/sk/SecureSection";
import Head from "next/head";

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

// Generuje bezpečný názov súboru
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
  // Unconditional hooks
  const [remainingMs, setRemainingMs] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);
  const downloadLockRef = useRef(false);

  // Bezpečné ID na použitie v hookoch
  const entryId = data?.id;

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

  // Posiela konverziu do Google Ads (len raz na konkrétne entryId a len so súhlasom)
  useEffect(() => {
    if (!entryId) return;

    // len so súhlasom cookies
    if (!document.cookie.includes("cookie_consent_v1=accepted_all")) return;

    // deduplikácia – pošli pre dané id len raz (aj keď sa používateľ vracia)
    const key = `ads_conv_sent:${entryId}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, new Date().toISOString());

    // SK stránka → SK label + EUR cena/mena
    const sendTo = `${GOOGLE_ADS.ID}/${GOOGLE_ADS.LABEL_SK}`;
    const { amount, currency } = PRICING.SK;

    trackAdsConversion(sendTo, {
      value: amount,
      currency,
      transaction_id: entryId, // pomáha Ads s deduplikáciou
    });
  }, [entryId]);

  // GA4 purchase — len raz na entryId a len so súhlasom
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
      currency: currency || "EUR",
      items: [
        { item_id: "cv_pdf_SK", item_name: "Životopis_SK", price: amount, quantity: 1 },
      ],
    });
  
    // 2) beacon → server → GA4 MP (nové)
    trackGaPurchaseBeacon({
      transaction_id: entryId,
      value: amount,
      currency: currency || "EUR",
      items: [
        { item_id: "cv_pdf_SK", item_name: "Životopis_SK", price: amount, quantity: 1 },
      ],
    });
  }, [entryId]);

  if (!data) {
    return (
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Životopis nebol nájdený</h1>
        <p className={styles.message}>Záznam neexistuje alebo došlo k chybe.</p>
      </div>
    );
  }

  const { id, pdf_url, invoice_url, expires_at, pdf_generated_at, cv_json } = data;
  const isExpired = Date.now() > new Date(expires_at).getTime();

  const pageUrl = `${SITE_URL}/cs/zaplaceno/${id}/`;
  const pageUrlSk = `${SITE_URL_SK}/sk/zaplaceno/${id}/`;

  const name = cv_json?.name;
  const surname = cv_json?.surname;
  const filename = generateFilename(name, surname);

  const pdfPath = pdf_url?.split("/object/public/pdfs/")[1] ?? "";
  const invoicePath = invoice_url?.split("/object/public/invoices/")[1] ?? "";

  // Formátovanie odpočtu
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

  // Stiahnutie PDF
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
      console.error("❌ Chyba pri sťahovaní PDF:", error);
    } finally {
      setTimeout(() => {
        downloadLockRef.current = false;
      }, 1200);
    }
  };

  // Stiahnutie faktúry
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
      console.error("❌ Chyba pri sťahovaní faktúry:", error);
    } finally {
      setTimeout(() => {
        downloadLockRef.current = false;
      }, 1200);
    }
  };

  // Kopírovanie odkazu
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
        <title>{`Životopis bol úspešne vytvorený | ${SITE_NAME_SK}`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta
          name="description"
          content="Váš životopis bol úspešne vytvorený a je pripravený na stiahnutie."
        />
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Canonical */}
        <link rel="canonical" href={pageUrlSk} />
        {/* Hreflang (dynamické ID, absolútne URL) */}
        <link rel="alternate" href={pageUrl} hrefLang="cs-CZ" />
        <link rel="alternate" href={pageUrlSk} hrefLang="sk-SK" />
        <link rel="alternate" href={pageUrlSk} hrefLang="x-default" />
        {/* Open Graph na interné zdieľanie */}
        <meta
          property="og:title"
          content={`Životopis bol úspešne vytvorený | ${SITE_NAME_SK}`}
        />
        <meta
          property="og:description"
          content="Váš životopis bol úspešne vytvorený a je pripravený na stiahnutie."
        />
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Potvrdenie o úspešnom vytvorení životopisu" />
        <meta property="og:url" content={pageUrlSk} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Životopis bol úspešne vytvorený | ${SITE_NAME_SK}`}
        />
        <meta
          name="twitter:description"
          content="Váš životopis bol úspešne vytvorený a je pripravený na stiahnutie."
        />
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        <meta name="twitter:image:alt" content="Potvrdenie o úspešnom vytvorení životopisu" />
      </Head>
      <section className={styles.ZaplacenoWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.cardwrapper}>
            <h1 className={styles.title}>🎉 Váš životopis bol úspešne vytvorený!</h1>
            <button
              className={styles.link}
              id="cvbtn"
              onClick={() => {
                trackGAEvent("click", "download", "download_cv_pdf_sk");
                downloadPdf();
              }}
            >
              <FaRegFilePdf /> Stiahnuť životopis (PDF)
            </button>
            {invoice_url ? (
              <button
                className={styles.link}
                id="invoicebtn"
                onClick={() => {
                  trackGAEvent("click", "download", "download_cv_invoice_sk");
                  downloadInvoice();
                }}
              >
                <FaFileInvoice /> Doklad o zaplatení
              </button>
            ) : (
              <p className={styles.note}>Doklad zatiaľ nie je k dispozícii.</p>
            )}
            <div className={styles.edit}>
              {!isExpired ? (
                <a className={styles.link} id="editbtn" href={`/sk/edit/${id}`}>
                  <FaEdit /> Upraviť životopis
                </a>
              ) : (
                <p className={styles.expired}>
                  ⏰ Ubehlo 24h – možnosť úpravy vypršala.
                </p>
              )}
            </div>
            {!isExpired && (
              <p
                className={styles.editbtn}
                onClick={() => {
                  trackGAEvent("click", "edit", "uprava_cv_sk");
                }}
              >
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
              {isClient && remainingMs > 0 && (
                <>
                  Do vypršania možnosti úpravy zostáva:
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
