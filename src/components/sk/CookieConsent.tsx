import React, { useEffect, useState } from "react";
import {
  initGoogleAnalytics,
  initFacebookPixel,
  initSklik,
  initGoogleAds
} from "@/utils/analytics";
import styles from "@/scss/CookieConsent.module.scss"; // Uprav cestu dle svého projektu

const COOKIE_NAME = "cookie_consent_v1";
type CookieState = "unset" | "accepted_all" | "essential_only";

const CookieConsent: React.FC = () => {
  const [state, setState] = useState<CookieState>("unset");
  const [show, setShow] = useState(false); // kontrola zobrazení

  useEffect(() => {
    // 1) Ověření consentu
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

    // 2) Nastavení zpoždění pro zobrazení popupu
    const timer = setTimeout(() => setShow(true), 1000); // zpoždění v ms
    return () => clearTimeout(timer);
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

  // Zobrazí se jen když je "unset" a po uplynutí timeoutu
  if (!show || state !== "unset") return null;

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
