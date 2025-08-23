import React, { useEffect, useState, useRef } from "react";
import {
  initGoogleAnalytics,
  initSklik,
  initGoogleAds,
  setConsentDefaults,
  updateConsentGranted,
  updateConsentRevoked,
  preloadGaLoader,
  trackPageView,
} from "@/utils/analytics";
import styles from "@/scss/CookieConsent.module.scss";

const COOKIE_NAME = "cookie_consent_v1";
const ONE_YEAR = 60 * 60 * 24 * 365;
const FIRST_PV_FALLBACK_MS = 1500;

type CookieState = "unset" | "accepted_all" | "essential_only";

// ——— helpers ———
function setCookie(name: string, value: string, maxAge = ONE_YEAR) {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
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

/** Zajistí existenci dataLayer a proxy gtag, aby šly volat consent/gtag dřív, než se stáhne loader. */
function ensureGtag(): boolean {
  if (typeof window === "undefined") return false;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = ((...args: unknown[]) => {
      window.dataLayer!.push(args as unknown);
    }) as unknown as Window["gtag"];
  }
  return true;
}

const CookieConsent: React.FC = () => {
  const [state, setState] = useState<CookieState>("unset");
  const [show, setShow] = useState(false);
  const firstPvSent = useRef(false);

  /** Spustí GA init a zajistí první PV přes onReady + fallback */
  const startAnalyticsWithFirstPV = () => {
    ensureGtag();
    updateConsentGranted();

    // onReady: odešleme PV až když je loader hotový
    initGoogleAnalytics(() => {
      if (!firstPvSent.current) {
        trackPageView(window.location.href);
        firstPvSent.current = true;
      }
    });

    // fallback: kdyby onReady nepřišel (třeba kvůli preloaderu/edge-case), pošleme PV po timeoutu
    window.setTimeout(() => {
      if (!firstPvSent.current) {
        trackPageView(window.location.href);
        firstPvSent.current = true;
      }
    }, FIRST_PV_FALLBACK_MS);

    // marketingové pixely (nezávisle na GA ready)
    initSklik();
    initGoogleAds();
  };

  useEffect(() => {
    // 0) připrav gtag + Consent default a předehřej loader
    ensureGtag();
    setConsentDefaults();
    preloadGaLoader();

    // 1) načti uložený stav souhlasu
    const ls = typeof window !== "undefined" ? localStorage.getItem(COOKIE_NAME) : null;
    const ck = getCookie(COOKIE_NAME);
    const consent = (ls ?? ck) as CookieState | null;

    if (consent === "accepted_all") {
      setState("accepted_all");
      startAnalyticsWithFirstPV();

      // sync persistencí
      if (!ls) localStorage.setItem(COOKIE_NAME, "accepted_all");
      if (!ck) setCookie(COOKIE_NAME, "accepted_all");

      setShow(false);
    } else if (consent === "essential_only") {
      setState("essential_only");
      ensureGtag();
      updateConsentRevoked();

      if (!ls) localStorage.setItem(COOKIE_NAME, "essential_only");
      if (!ck) setCookie(COOKIE_NAME, "essential_only");

      setShow(false);
    } else {
      // 2) zobraz popup jen pokud není rozhodnuto
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_NAME, "accepted_all");
    setCookie(COOKIE_NAME, "accepted_all");
    setState("accepted_all");

    startAnalyticsWithFirstPV();
    setShow(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_NAME, "essential_only");
    setCookie(COOKIE_NAME, "essential_only");
    setState("essential_only");

    ensureGtag();
    updateConsentRevoked();

    setShow(false);
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
