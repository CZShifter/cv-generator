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
import { preloadGaLoader } from "@/utils/analytics";

const COOKIE_NAME = "cookie_consent_v1";
const ONE_YEAR = 60 * 60 * 24 * 365;

type CookieState = "unset" | "accepted_all" | "essential_only";

// ——— helpers ———
function setCookie(name: string, value: string, maxAge = ONE_YEAR) {
  if (typeof document === "undefined") return;
  const secure =
    typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const item = document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="))
    ?.split("=")[1];
  return item ? decodeURIComponent(item) : null;
}

/**
 * Zajistí existenci window.dataLayer a window.gtag proxy funkce,
 * aby šly volat consent/gtag dřív, než se stáhne loader.
 */
function ensureGtag(): boolean {
  if (typeof window === "undefined") return false;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    // proxy zapisující argumenty do dataLayer (gtag.js si je přečte po načtení)
    window.gtag = ((...args: unknown[]) => {
      window.dataLayer!.push(args as unknown);
    }) as unknown as Window["gtag"];
  }
  return true;
}

const CookieConsent: React.FC = () => {
  const [state, setState] = useState<CookieState>("unset");
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 0) Založ gtag/dataLayer a nastav Consent Mode default (denied)
    ensureGtag();
    setConsentDefaults();
    preloadGaLoader();

    // 1) Načti uložený stav (LS preferován, cookie fallback)
    const ls = typeof window !== "undefined" ? localStorage.getItem(COOKIE_NAME) : null;
    const ck = getCookie(COOKIE_NAME);
    const consent = (ls ?? ck) as CookieState | null;

    if (consent === "accepted_all") {
      setState("accepted_all");

      // ① nejdřív povol consent do GA
      ensureGtag();
      updateConsentGranted();

      // ② potom inicializace měření (config + náš ruční page_view v appce)
      initGoogleAnalytics();
      initSklik();
      initGoogleAds();

      // sync uložených hodnot
      if (!ls) localStorage.setItem(COOKIE_NAME, "accepted_all");
      if (!ck) setCookie(COOKIE_NAME, "accepted_all");
    } else if (consent === "essential_only") {
      setState("essential_only");

      ensureGtag();
      updateConsentRevoked();

      if (!ls) localStorage.setItem(COOKIE_NAME, "essential_only");
      if (!ck) setCookie(COOKIE_NAME, "essential_only");
    }

    // 2) Zobraz popup jen pokud není rozhodnuto
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const acceptAll = () => {
    // ulož stav
    localStorage.setItem(COOKIE_NAME, "accepted_all");
    setCookie(COOKIE_NAME, "accepted_all");
    setState("accepted_all");

    // pořadí je důležité: nejdřív consent, pak init
    ensureGtag();
    updateConsentGranted();
    initGoogleAnalytics();
    initSklik();
    initGoogleAds();
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_NAME, "essential_only");
    setCookie(COOKIE_NAME, "essential_only");
    setState("essential_only");

    ensureGtag();
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