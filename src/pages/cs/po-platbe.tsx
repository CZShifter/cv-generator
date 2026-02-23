import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "@/scss/PoPlatbe.module.scss";
import { SITE_NAME, SITE_URL_SK, SITE_URL, OG_IMAGE, FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL } from "@/config/site";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegCircleXmark } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { LuInfo } from "react-icons/lu";
import SecureSection from '@/components/cs/SecureSection';

type StatusKind = "verifying" | "cancelled" | "error" | "info";

export default function PoPlatbe() {
  const [status, setStatus] = useState<StatusKind>("verifying");
  const [msg, setMsg] = useState<React.ReactNode>("Ověřujeme platbu");

  // Retry: zpět na /cs/preview se stejnou šablonou a rovnou krok 6
  const handleRetry = () => {
  try { localStorage.removeItem("cv_payment"); } catch {}
  window.location.href = "/cs/preview";
};

  useEffect(() => {
    let cancelled = false;
    let t: ReturnType<typeof setTimeout> | null = null;

    const paymentRaw = localStorage.getItem("cv_payment");

    if (!paymentRaw) {
      setStatus("error");
      setMsg("Chybí data platby. Vraťte se k objednávce.");
      return;
    }
    const payment = JSON.parse(paymentRaw);

    const cvId: string | undefined = payment?.cvId;
    const refId: string | undefined = payment?.refId;

    if (!cvId && !refId) {
      setStatus("error");
      setMsg("Chybí identifikátor platby. Vraťte se k objednávce.");
      return;
    }

    const tick = async () => {
      if (cancelled) return;
      try {
        const params = new URLSearchParams();
        if (cvId) params.set("id", cvId);
        if (refId) params.set("refId", refId);
        const r = await fetch(`/api/cs/payment-status?${params.toString()}`);
        const j = await r.json();

        if (j.status === "PENDING" || j.status === "CREATED") {
          if (!cancelled) t = setTimeout(tick, 1500);
          return;
        }

        if (j.status === "CANCELLED" || j.status === "FAILED") {
          try { localStorage.removeItem("cv_payment"); } catch {}
          setStatus("cancelled");
          setMsg(
            <>
            <span>Platba byla zamítnuta. Můžete ji zopakovat.</span><br></br>
            <small>Vaše data jsou dočasně uložena u Vás v prohlížeči. Stačí znovu vybrat šablonu a přejit ke kroku 6: &ldquo;Dokončit&ldquo;.</small>
            </>
          );
          return;
        }

        if (j.status === "PAID" && j.pdfStatus !== "ready") {
          setStatus("info");
          setMsg("Platba přijata, připravujeme PDF. Chvilku strpení...");
          if (!cancelled) t = setTimeout(tick, 1500);
          return;
        }

        if (j.previewUrl) {
          try {
            localStorage.removeItem("cv_draft");
            localStorage.removeItem("cv_payment");
          } catch {}
          window.location.href = j.previewUrl; // -> /cs/zaplaceno/[id]
          return;
        }

        setStatus("error");
        setMsg(j.error || "Platba ověřena, ale dokončení selhalo.");
      } catch {
        setStatus("error");
        setMsg("Chyba při ověřování platby. Zkuste to prosím znovu.");
      }
    };

    // start ověřování
    setStatus("verifying");
    setMsg("Ověřujeme platbu");
    tick();

    return () => {
      cancelled = true;
      if (t) clearTimeout(t);
    };
  }, []);

  // vyber ikonu podle stavu
  const renderIcon = () => {
    switch (status) {
      case "verifying":
        return <AiOutlineLoading3Quarters className={`${styles.StatusIcon} ${styles.Spin} ${styles.IconVerifying}`} aria-hidden="true" />;
      case "cancelled":
        return <FaRegCircleXmark className={`${styles.StatusIcon} ${styles.IconCancelled}`} aria-hidden="true" />;
      case "error":
        return <MdErrorOutline className={`${styles.StatusIcon} ${styles.IconError}`} aria-hidden="true" />;
      case "info":
      default:
        return <LuInfo className={`${styles.StatusIcon} ${styles.IconInfo}`} aria-hidden="true" />;
    }
  };

  return (
    <>
      <Head>
        <title>{`Platební brána – průběh platby | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        {/* Volitelný popis – spíš pro UX/sdílení */}
        <meta
          name="description"
          content="Probíhá zpracování platby. Tato stránka není indexována ve vyhledávačích."/>
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Hreflang pro jazykové verze */}
        <link rel="alternate" href={`${SITE_URL}/cs/po-platbe/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/po-platbe/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/cs/po-platbe/`} hrefLang="x-default" />
        {/* Volitelně OG/Twitter metadata, pokud stránku sdílíte */}
        <meta property="og:title" content={`Platební brána – průběh platby | ${SITE_NAME}`} />
        <meta property="og:description" content="Probíhá zpracování platby. Tato stránka není indexována ve vyhledávačích." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Ilustrace platební brány" />
      </Head>
      <main className={styles.MainWrapper}>
        <div className={styles.Wrapper}>
          <h1>Platební brána</h1>
          <div className={styles.StatusBlock}>
            {renderIcon()}
            <p className={styles.Msg} aria-live="polite">
              {status === "verifying" ? (
                <>
                  Ověřujeme platbu
                  <span className={styles.Ellipsis} aria-hidden="true" />
                </>
              ) : (
                msg
              )}
            </p>
          </div>

          {(status === "cancelled" || status === "error") && (
            <button className={styles.MainButton} onClick={handleRetry}>
              Zkusit zaplatit znovu
            </button>
          )}
        </div>
        <SecureSection />
      </main>
    </>
  );
}
