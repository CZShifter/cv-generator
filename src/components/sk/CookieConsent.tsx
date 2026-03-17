import React, { useCallback, useEffect, useRef, useState } from "react";
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
const FIRST_PV_SESSION_KEY = "ga:first_pv_sent";

type CookieState = "unset" | "accepted_all" | "essential_only";

/* -------------------------------- HELPERS ---------------------------------- */

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

/** Kompatibilní proxy gtag – pushuje `arguments` (ne pole), aby loader vyzvedl frontu. */
function ensureGtag(): boolean {
  if (typeof window === "undefined") return false;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtagProxy(this: unknown): void {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments as unknown);
    } as unknown as Window["gtag"];
  }
  return true;
}

/* ------------------------------ COMPONENT ---------------------------------- */

const CookieConsent: React.FC = () => {
  const [state, setState] = useState<CookieState>("unset");
  const [show, setShow] = useState(false);

  // „jednou a dost“ v rámci aktuální session (zabrání duplicitám při remountech / hot-reloadu)
  const firstPvSent = useRef(false);
  const fallbackTimer = useRef<number | null>(null);

  const syncStateFromStorage = () => {
    const ls = typeof window !== "undefined" ? localStorage.getItem(COOKIE_NAME) : null;
    const ck = getCookie(COOKIE_NAME);
    const consent = (ls ?? ck) as CookieState | null;

    if (consent === "accepted_all") {
      setState("accepted_all");
      return "accepted_all";
    }
    if (consent === "essential_only") {
      setState("essential_only");
      return "essential_only";
    }
    setState("unset");
    return "unset";
  };

  const sendFirstPVOnce = useCallback(() => {
    if (firstPvSent.current) return;

    // pojistka přes sessionStorage v rámci jedné session
    try {
      if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(FIRST_PV_SESSION_KEY) === "1") {
        firstPvSent.current = true;
        return;
      }
    } catch {
      /* ignore */
    }

    trackPageView(window.location.href); // pokud gtag není ready, odešle se přes MP
    firstPvSent.current = true;

    try {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(FIRST_PV_SESSION_KEY, "1");
      }
    } catch {
      /* ignore */
    }
  }, [trackPageView]);

  /** Spustí GA init a zajistí první PV: hned (MP), po onReady i s pojistkou. */
  const startAnalyticsWithFirstPV = useCallback(() => {
    ensureGtag();
    updateConsentGranted();

    // 1) HNED po souhlasu (MP fallback / nebo gtag, když je ready)
    sendFirstPVOnce();

    // 2) Až dojede loader, zkus to znovu (už se nepošle podruhé)
    initGoogleAnalytics(() => {
      sendFirstPVOnce();
    });

    // 3) Fallback pojistka (např. adblock edge case)
    fallbackTimer.current = window.setTimeout(sendFirstPVOnce, FIRST_PV_FALLBACK_MS);

    // 4) Marketingové pixely
    initSklik();
    initGoogleAds();
  }, [sendFirstPVOnce]);

  // zruš fallback timeout při unmountu
  useEffect(() => {
    return () => {
      if (fallbackTimer.current) {
        clearTimeout(fallbackTimer.current);
        fallbackTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // 0) připrav gtag + Consent default a předehřej loader
    ensureGtag();
    setConsentDefaults();
    preloadGaLoader();

    // 1) načti uložený stav souhlasu
    const consent = syncStateFromStorage();

    if (consent === "accepted_all") {
      startAnalyticsWithFirstPV();

      // sync persistencí
      if (!localStorage.getItem(COOKIE_NAME)) localStorage.setItem(COOKIE_NAME, "accepted_all");
      if (!getCookie(COOKIE_NAME)) setCookie(COOKIE_NAME, "accepted_all");

      setShow(false);
    } else if (consent === "essential_only") {
      ensureGtag();
      updateConsentRevoked();

      if (!localStorage.getItem(COOKIE_NAME)) localStorage.setItem(COOKIE_NAME, "essential_only");
      if (!getCookie(COOKIE_NAME)) setCookie(COOKIE_NAME, "essential_only");

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

  useEffect(() => {
    const onOpen = () => {
      syncStateFromStorage();
      setShow(true);
    };
    window.addEventListener("cookie:open", onOpen as EventListener);
    return () => window.removeEventListener("cookie:open", onOpen as EventListener);
  }, [startAnalyticsWithFirstPV]);

  if (!show) return null;

  return (
    <div className={styles.cookieConsent}>
      <div className={styles.cookieConsentText}>
        Tento web používa súbory cookie na správne fungovanie, analýzu návštevnosti a marketing.
        Viac informácií nájdete v&nbsp;
        <a href="/sk/dokumenty/gdpr" target="_blank" rel="noopener noreferrer">
          zásadách ochrany osobných údajov
        </a>
        .
      </div>
      <div className={styles.cookieConsentButtons}>
        <button className={styles.acceptAll} onClick={acceptAll}>
          Povoliť všetko
        </button>
        <button className={styles.acceptEssential} onClick={acceptEssential}>
          Iba nevyhnutné
        </button>
        {state !== "unset" && (
          <button className={styles.close} onClick={() => setShow(false)}>
            Zavrieť
          </button>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;




