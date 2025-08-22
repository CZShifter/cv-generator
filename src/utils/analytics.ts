// /utils/analytics.ts
// GA4 + Consent Mode v2 + cross-domain linker + SPA page_view
// Voláno z CookieConsent.tsx: setConsentDefaults, updateConsentGranted, updateConsentRevoked, initGoogleAnalytics
// Re-exportuje initSklik / initGoogleAds z adsPixel.ts

import { initSklik, initGoogleAds } from "./adsPixel";
export { initSklik, initGoogleAds };

// ——— Config ———
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-MDV0NDEVYR";
const CROSS_DOMAIN: string[] = [
  "rychlyzivotopis.cz",
  "www.rychlyzivotopis.cz",
  "rychlyzivotopis.sk",
  "www.rychlyzivotopis.sk",
];

// ——— Interní stav ———
let gaLoaded = false;
let spaBound = false;

// ——— Helpers ———
function hasWindow(): boolean {
  return typeof window !== "undefined";
}
function hasDocument(): boolean {
  return typeof document !== "undefined";
}
function loadScriptOnce(src: string, id: string): void {
  if (!hasDocument()) return;
  const existing = document.getElementById(id) as HTMLScriptElement | null;
  if (existing) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function ensureGtag(): Window["gtag"] | null {
  if (!hasWindow()) return null;

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }

  if (typeof window.gtag !== "function") {
    const proxy = ((...args: unknown[]) => {
      // ukládáme volání do dataLayer; gtag.js si je přečte po načtení
      window.dataLayer!.push(args);
    }) as unknown as Window["gtag"];

    window.gtag = proxy;
  }

  return window.gtag!;
}

// ——— Consent Mode v2 ———
export function setConsentDefaults(): void {
  if (!hasWindow()) return;
  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function updateConsentGranted(): void {
  if (!hasWindow()) return;
  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("consent", "update", {
    ad_storage: "granted",
    analytics_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
}

export function updateConsentRevoked(): void {
  if (!hasWindow()) return;
  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("consent", "update", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

// ——— GA4 init ———
export function initGoogleAnalytics(): void {
  if (!hasWindow() || !hasDocument() || gaLoaded) return;
  if (!GA_ID) return;

  gaLoaded = true;

  // 1) Loader
  loadScriptOnce(
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`,
    "ga4-loader"
  );

  // 2) Bootstrap + základní config
  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("js", new Date());
  gtag("config", GA_ID, {
    send_page_view: false,          // SPA: page_view si posíláme sami
    linker: { domains: CROSS_DOMAIN }, // cross-domain
  });

  // 3) První page_view po inicializaci
  sendPageView();

  // 4) SPA navigace
  bindSpaPageviews();
  window.gtagInitialized = true;
}

// ——— Pageviews ———
function sendPageView(): void {
  if (!hasWindow()) return;
  const gtag = window.gtag;
  if (!gtag) return;

  const href = window.location.href;
  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const title = typeof document !== "undefined" ? document.title : "";

  gtag("event", "page_view", {
    page_location: href,
    page_path: path,
    page_title: title,
  });
}

function bindSpaPageviews(): void {
  if (spaBound || !hasWindow()) return;
  spaBound = true;

  // Preferovaný: Next.js router, je-li dostupný v runtime
  const w = window as unknown as {
    next?: { router?: { events?: { on?: (e: string, cb: (url?: unknown) => void) => void } } };
  };
  const events = w.next?.router?.events;
  if (events?.on) {
    events.on("routeChangeComplete", () => sendPageView());
    return;
  }

  // Fallback: patch History API
  const origPush = history.pushState.bind(history);
  const origReplace = history.replaceState.bind(history);

  history.pushState = (...args) => {
    const ret = origPush(...args);
    queueMicrotask(sendPageView);
    return ret;
  };
  history.replaceState = (...args) => {
    const ret = origReplace(...args);
    queueMicrotask(sendPageView);
    return ret;
  };
  window.addEventListener("popstate", () => queueMicrotask(sendPageView));
}
// Přidejte do /utils/analytics.ts (třeba pod trackEvent)
export function trackGAEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  // V GA4 je klíčové "jméno události". Vezmeme ho z `action` (smysluplnější než "click").
  const eventName = action || category || "event";

  const params: Record<string, unknown> = {
    category,           // UA-styl pro kompatibilitu (volitelné)
    label,              // UA-styl pro kompatibilitu (volitelné)
  };
  if (typeof value === "number") params.value = value;

  window.gtag("event", eventName, params);
}

