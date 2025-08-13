import React, { useEffect, useState } from "react";
import {
  initGoogleAnalytics,
  initSklik,
  initGoogleAds,
  setConsentDefaults,
  updateConsentGranted,
  updateConsentRevoked,
} from "@/utils/analytics";
import styles from "@/scss/CookieConsent.module.scss";

const COOKIE_NAME = "cookie_consent_v1";
const ONE_YEAR = 60 * 60 * 24 * 365;
type CookieState = "unset" | "accepted_all" | "essential_only";

// ——— helpers ———
function setCookie(name: string, value: string, maxAge = ONE_YEAR) {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const item = document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="))
    ?.split("=")[1];
  return item ? decodeURIComponent(item) : null;
}

const CookieConsent: React.FC = () => {
  const [state, setState] = useState<CookieState>("unset");
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 0) Consent Mode default (bezpečné volat opakovaně)
    setConsentDefaults();

    // 1) Načti uložený souhlas – preferuj localStorage, fallback na cookie
    const ls = typeof window !== "undefined" ? localStorage.getItem(COOKIE_NAME) : null;
    const ck = getCookie(COOKIE_NAME);
    const consent = (ls ?? ck) as CookieState | null;

    if (consent === "accepted_all") {
      setState("accepted_all");
      updateConsentGranted();
      initGoogleAnalytics();
      initSklik();
      initGoogleAds();
      // sync oběma směry
      if (!ls) localStorage.setItem(COOKIE_NAME, "accepted_all");
      if (!ck) setCookie(COOKIE_NAME, "accepted_all");
    } else if (consent === "essential_only") {
      setState("essential_only");
      updateConsentRevoked();
      if (!ls) localStorage.setItem(COOKIE_NAME, "essential_only");
      if (!ck) setCookie(COOKIE_NAME, "essential_only");
    }

    // 2) Zobrazení popupu (jen když není rozhodnuto)
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_NAME, "accepted_all");
    setCookie(COOKIE_NAME, "accepted_all");
    setState("accepted_all");
    updateConsentGranted();
    initGoogleAnalytics();
    initSklik();
    initGoogleAds();
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_NAME, "essential_only");
    setCookie(COOKIE_NAME, "essential_only");
    setState("essential_only");
    updateConsentRevoked();
  };

  if (!show || state !== "unset") return null;

  return (
    <div className={styles.cookieConsent}>
      <div className={styles.cookieConsentText}>
        Tento web používá cookies pro správné fungování, analýzu návštěvnosti a marketing.
        Více informací najdete v&nbsp;
        <a href="/cs/dokumenty/gdpr" target="_blank" rel="noopener noreferrer">
          zásadách ochrany osobních údajů
        </a>
        .
      </div>
      <div className={styles.cookieConsentButtons}>
        <button className={styles.acceptAll} onClick={acceptAll}>
          Povolit vše
        </button>
        <button className={styles.acceptEssential} onClick={acceptEssential}>
          Pouze nezbytné
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
