import { GA_MEASUREMENT_ID, SKLIK_ID, GOOGLE_ADS_ID } from "@/config/site";

// Rozšíření window
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    gtagInitialized?: boolean;
    skw?: (...args: any[]) => void;
    sklikInitialized?: boolean;
    gadsInitialized?: boolean;
    dataLayer?: any[];
  }
}

// Funkce sledování chování uživatele
export function trackGAEvent(
  action: string,
  category: string,
  label: string,
  value?: number
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Google Analytics 4
export function initGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || window.gtagInitialized) return;

  // Načti gtag.js pokud už není
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);
  }

  // Inicializuj dataLayer a gtag
  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: any[]) => { window.dataLayer!.push(args); };
  window.gtag = window.gtag || gtag;

  if (typeof window.gtag === "function") {
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }
  window.gtagInitialized = true;
}

// Sklik
export function initSklik() {
  if (!SKLIK_ID || window.sklikInitialized) return;

  // Načti rc.js skript pouze jednou
  if (!document.querySelector(`script[src="https://c.seznam.cz/js/rc.js"]`)) {
    const script = document.createElement("script");
    script.src = "https://c.seznam.cz/js/rc.js";
    script.async = true;
    script.onload = () => {
      // Spusť RT tracking
      if (window.skw) {
        window.skw('rt', SKLIK_ID);
        window.sklikInitialized = true;
      }
    };
    document.head.appendChild(script);
  } else {
    // Pokud už je skript načten, jen spusť
    if (window.skw) {
      window.skw('rt', SKLIK_ID);
      window.sklikInitialized = true;
    }
  }
}

// Google Ads Remarketing (přes gtag)
export function initGoogleAds() {
  if (!GOOGLE_ADS_ID || window.gadsInitialized) return;

  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: any[]) => { window.dataLayer!.push(args); };
  window.gtag = window.gtag || gtag;
  if (typeof window.gtag === "function") {
    window.gtag('config', GOOGLE_ADS_ID);
  }
  window.gadsInitialized = true;
}