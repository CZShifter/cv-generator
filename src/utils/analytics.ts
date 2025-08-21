// src/utils/analytics.ts
import { GA_MEASUREMENT_ID, SKLIK_ID, GOOGLE_ADS_ID } from "@/config/site";

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
const CONSENT_COOKIE = "cookie_consent_v1";

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

/**
 * Zajistí, že je k dispozici window.gtag (proxy přes dataLayer),
 * a vrátí typovaný odkaz na funkci gtag. Neprovádí žádný network load.
 */
function ensureGtag(): Window["gtag"] | null {
  if (!hasWindow()) return null;

  // dataLayer musí existovat dříve, než začneme volat gtag proxy
  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== "function") {
    // Proxy: posílá argumenty do dataLayer (viz standardní snippet Google)
    const proxy = (...args: unknown[]) => {
      // dataLayer očekává položky typu "unknown"
      window.dataLayer!.push(args as unknown);
    };
    window.gtag = proxy as Window["gtag"];
  }
  return window.gtag!;
}

// přesný typ pro Consent Mode příkaz do dataLayer (default/update)
type ConsentFlag = "granted" | "denied";
type ConsentCmd =
  | [
      "consent",
      "default",
      {
        ad_storage: ConsentFlag;
        ad_user_data: ConsentFlag;
        ad_personalization: ConsentFlag;
        analytics_storage: ConsentFlag;
      }
    ]
  | [
      "consent",
      "update",
      {
        ad_storage: ConsentFlag;
        ad_user_data: ConsentFlag;
        ad_personalization: ConsentFlag;
        analytics_storage: ConsentFlag;
      }
    ];

function pushConsent(cmd: ConsentCmd): void {
  if (!hasWindow()) return;
  window.dataLayer = window.dataLayer || [];
  // dataLayer má typ unknown[] → pushujeme jako unknown
  window.dataLayer.push(cmd as unknown);
}

// Načtení hodnoty souhlasu z cookie (klient)
function getConsentCookie(): string | null {
  if (!hasWindow()) return null;
  const re = new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]+)`);
  const m = document.cookie.match(re);
  return m ? decodeURIComponent(m[1]) : null;
}

// True, pokud uživatel povolil marketing (náš banner zapisuje "accepted_all")
function isAdsConsentGranted(): boolean {
  return getConsentCookie() === "accepted_all";
}

// ──────────────────────────────────────────────────────────────────────────────
// Consent Mode v2
export function setConsentDefaults(): void {
  pushConsent([
    "consent",
    "default",
    {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    },
  ]);
}

export function updateConsentGranted(): void {
  pushConsent([
    "consent",
    "update",
    {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    },
  ]);
}

export function updateConsentRevoked(): void {
  pushConsent([
    "consent",
    "update",
    {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    },
  ]);
}

// ──────────────────────────────────────────────────────────────────────────────
// GA4 – hlavní init (provedeme jen při uděleném souhlasu)
export function initGoogleAnalytics(): void {
  if (!GA_MEASUREMENT_ID || !hasWindow() || window.gtagInitialized) return;
  if (!isAdsConsentGranted()) return; // ⟵ bez souhlasu GA nespouštíme

  // Načti gtag.js jen pokud ještě není vložen
  if (
    !document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`
    )
  ) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);
  }

  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);

  window.gtagInitialized = true;
}

// ──────────────────────────────────────────────────────────────────────────────
// Google Ads – remarketing / konverze (jen při souhlasu)
export function initGoogleAds(): void {
  if (!GOOGLE_ADS_ID || !hasWindow() || window.gadsInitialized) return;
  if (!isAdsConsentGranted()) return; // ⟵ bez souhlasu nespouštíme

  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("config", GOOGLE_ADS_ID);
  window.gadsInitialized = true;
}

export function trackAdsConversion(
  label: string,
  value = 0,
  currency = "CZK"
): void {
  if (!hasWindow() || !GOOGLE_ADS_ID) return;
  if (!isAdsConsentGranted()) return; // ⟵ bez souhlasu neposílat
  if (!window.gadsInitialized) initGoogleAds(); // pro jistotu inicializuj

  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    value,
    currency,
  });
}

// ──────────────────────────────────────────────────────────────────────────────
/** GA4 event helper – posílat jen při souhlasu a po initu */
export function trackGAEvent(
  action: string,
  category: string,
  label: string,
  value?: number
): void {
  if (!hasWindow()) return;
  if (!isAdsConsentGranted()) return; // ⟵ bez souhlasu vůbec nepushuj
  if (!window.gtagInitialized) return; // ⟵ jistota, že GA je načtené

  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Sklik (pouštět jen při souhlasu)
export function initSklik(): void {
  if (!SKLIK_ID || !hasWindow() || window.sklikInitialized) return;
  if (!isAdsConsentGranted()) return; // ⟵ bez souhlasu nespouštět

  const SRC = "https://c.seznam.cz/js/rc.js";

  const attachAndInit = () => {
    if (typeof window.skw === "function") {
      window.skw("rt", SKLIK_ID);
      window.sklikInitialized = true;
    }
  };

  if (!document.querySelector(`script[src="${SRC}"]`)) {
    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    script.onload = attachAndInit;
    document.head.appendChild(script);
  } else {
    attachAndInit();
  }
}
