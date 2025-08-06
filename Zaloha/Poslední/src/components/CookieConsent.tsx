import React, { useEffect, useState } from "react";
import {
  initGoogleAnalytics,
  initFacebookPixel,
  initSklik,
  initGoogleAds
} from "../utils/analytics";
import styles from "@/scss/CookieConsent.module.scss"; // Uprav cestu dle svého projektu

const COOKIE_NAME = "cookie_consent_v1";

type CookieState = "unset" | "accepted_all" | "essential_only";

const CookieConsent: React.FC = () => {
  const [state, setState] = useState<CookieState>("unset");

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_NAME);
    if (consent === "accepted_all") {
      setState("accepted_all");
      initGoogleAnalytics();
      initFacebookPixel();
      initSklik();
      initGoogleAds();
    } else if (consent === "essential_only") {
      setState("essential_only");
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_NAME, "accepted_all");
    setState("accepted_all");
    initGoogleAnalytics();
    initFacebookPixel();
    initSklik();
    initGoogleAds();
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_NAME, "essential_only");
    setState("essential_only");
  };

  if (state !== "unset") return null;

  return (
    <div className={styles.cookieConsent}>
      <div className={styles.cookieConsentText}>
        Tento web používá cookies pro správné fungování, analýzu návštěvnosti a marketing.
        Více informací najdete v&nbsp;
        <a href="/dokumenty/gdpr" target="_blank" rel="noopener noreferrer">
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