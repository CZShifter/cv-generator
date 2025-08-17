import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "@/scss/PoPlatbe.module.scss";
import { SITE_NAME_SK, SITE_URL, SITE_URL_SK, FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL, OG_IMAGE_SK } from "@/config/site";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegCircleXmark } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { LuInfo } from "react-icons/lu";
import SecureSection from '@/components/sk/SecureSection';

type StatusKind = "verifying" | "cancelled" | "error" | "info";

export default function PoPlatbe() {
  const [status, setStatus] = useState<StatusKind>("verifying");
  const [msg, setMsg] = useState<React.ReactNode>("Overujeme platbu");

  // Retry: späť na /sk/preview
  const handleRetry = () => {
    try { localStorage.removeItem("cv_payment"); } catch {}
    window.location.href = "/sk/preview";
  };

  useEffect(() => {
    let cancelled = false;
    let t: ReturnType<typeof setTimeout> | null = null;

    const paymentRaw = localStorage.getItem("cv_payment");
    const draftRaw = localStorage.getItem("cv_draft");

    if (!paymentRaw) {
      setStatus("error");
      setMsg("Chýbajú údaje platby. Vráťte sa k objednávke.");
      return;
    }
    if (!draftRaw) {
      setStatus("error");
      setMsg("Chýba rozpracovaný návrh (draft). Vráťte sa k objednávke.");
      return;
    }

    const payment = JSON.parse(paymentRaw);
    const draft = JSON.parse(draftRaw);

    const transId: string | undefined = payment?.transId;
    const refId: string | undefined = payment?.refId;
    const paymentToken: unknown = payment?.paymentToken;
    const templateId: string | undefined =
      payment?.paymentToken?.payload?.templateId ?? payment?.templateId;

    const data = draft?.data ?? draft;

    if (!transId || !refId || !paymentToken || !templateId || !data) {
      setStatus("error");
      setMsg("Chýbajú potrebné dáta (platba/šablóna/formulár). Vráťte sa k objednávke.");
      return;
    }

    const tick = async () => {
      if (cancelled) return;
      try {
        const r = await fetch("/api/sk/verify-and-finalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transId, refId, data, templateId, paymentToken }),
        });
        const j = await r.json();

        if (j.status === "PENDING") {
          if (!cancelled) t = setTimeout(tick, 1500);
          return;
        }

        if (j.status === "CANCELLED") {
          try { localStorage.removeItem("cv_payment"); } catch {}
          setStatus("cancelled");
          setMsg(
            <>
              <span>Platba bola zamietnutá. Môžete ju zopakovať.</span>
              <br />
              <small>Vaše údaje sú dočasne uložené u vás v prehliadači. Stačí znovu vybrať šablónu a prejsť na krok 6: &ldquo;Dokončiť&ldquo;.</small>
            </>
          );
          return;
        }

        if (j.previewUrl) {
          try {
            localStorage.removeItem("cv_draft");
            localStorage.removeItem("cv_payment");
          } catch {}
          window.location.href = j.previewUrl; // -> /sk/zaplaceno/[id]
          return;
        }

        setStatus("error");
        setMsg(j.error || "Platba overená, ale dokončenie zlyhalo.");
      } catch {
        setStatus("error");
        setMsg("Chyba pri overovaní platby. Skúste to prosím znova.");
      }
    };

    // štart overovania
    setStatus("verifying");
    setMsg("Overujeme platbu");
    tick();

    return () => {
      cancelled = true;
      if (t) clearTimeout(t);
    };
  }, []);

  // vyber ikonu podľa stavu
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
        <title>{`Platobná brána – priebeh platby | ${SITE_NAME_SK}`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        {/* Voliteľný popis – skôr pre UX/zdieľanie */}
        <meta
          name="description"
          content="Prebieha spracovanie platby. Táto stránka nie je indexovaná vo vyhľadávačoch."/>
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Hreflang pre jazykové verzie */}
        <link rel="alternate" href={`${SITE_URL}/cs/po-platbe/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/po-platbe/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/po-platbe/`} hrefLang="x-default" />
        {/* Open Graph (voliteľné, ak sa stránka zdieľa) */}
        <meta property="og:title" content={`Platobná brána – priebeh platby | ${SITE_NAME_SK}`} />
        <meta
          property="og:description"
          content="Prebieha spracovanie platby. Táto stránka nie je indexovaná vo vyhľadávačoch."/>
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Ilustrácia platobnej brány" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/po-platbe/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Platobná brána – priebeh platby | ${SITE_NAME_SK}`} />
        <meta
          name="twitter:description"
          content="Prebieha spracovanie platby. Táto stránka nie je indexovaná vo vyhľadávačoch."/>
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        <meta name="twitter:image:alt" content="Ilustrácia platobnej brány" />
      </Head>
      <main className={styles.MainWrapper}>
        <div className={styles.Wrapper}>
          <h1>Platobná brána</h1>

          <div className={styles.StatusBlock}>
            {renderIcon()}
            <p className={styles.Msg} aria-live="polite">
              {status === "verifying" ? (
                <>
                  Overujeme platbu
                  <span className={styles.Ellipsis} aria-hidden="true" />
                </>
              ) : (
                msg
              )}
            </p>
          </div>
          {(status === "cancelled" || status === "error") && (
            <button className={styles.MainButton} onClick={handleRetry}>
              Skúsiť zaplatiť znova
            </button>
          )}
        </div>
        <SecureSection />
      </main>
    </>
  );
}