import { GA_MEASUREMENT_ID, FB_PIXEL_ID, SKLIK_ID, GOOGLE_ADS_ID } from "../config/site";

// Rozšíření window
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    gtagInitialized?: boolean;
    fbq?: (...args: any[]) => void;
    fbqInitialized?: boolean;
    skw?: (...args: any[]) => void;
    sklikInitialized?: boolean;
    gadsInitialized?: boolean;
    dataLayer?: any[];
    _fbq?: any;
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
  function gtag(...args: any[]) { window.dataLayer!.push(args); }
  window.gtag = window.gtag || gtag;

  if (typeof window.gtag === "function") {
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }
  window.gtagInitialized = true;
}

// Facebook Pixel
export function initFacebookPixel() {
  if (!FB_PIXEL_ID || window.fbqInitialized) return;

  // --- BOOTSTRAP fbq, pokud ještě není ---
 // --- BOOTSTRAP fbq, pokud ještě není ---
if (typeof window.fbq !== "function") {
  (function(f: any, b: any, e: any, v?: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
  })(window, document, "script", undefined);
}
  // --- KONEC BOOTSTRAPU ---

  // 1. Načti pixel skript pokud už není
  if (!document.querySelector(`script[src="https://connect.facebook.net/en_US/fbevents.js"]`)) {
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.fbq === "function" && !window.fbqInitialized) {
        window.fbq("init", FB_PIXEL_ID);
        window.fbq("track", "PageView");
        window.fbqInitialized = true;
      }
    };
    document.head.appendChild(script);
  } else {
    // Pokud už je skript načten, jen případně inicializuj
    if (typeof window.fbq === "function" && !window.fbqInitialized) {
      window.fbq("init", FB_PIXEL_ID);
      window.fbq("track", "PageView");
      window.fbqInitialized = true;
    }
  }
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
  function gtag(...args: any[]) { window.dataLayer!.push(args); }
  window.gtag = window.gtag || gtag;
  if (typeof window.gtag === "function") {
    window.gtag('config', GOOGLE_ADS_ID);
  }
  window.gadsInitialized = true;
}
