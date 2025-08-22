// /utils/analytics.ts
// GA4 + Consent Mode v2 + cross-domain linker + SPA page_view
// Voláno z CookieConsent.tsx: setConsentDefaults, updateConsentGranted, updateConsentRevoked, initGoogleAnalytics
// Pro Ads/Sklik re-export: mějte je v adsPixel.ts (nenačítejte GA dvakrát!)

export { initSklik, initGoogleAds } from "./adsPixel";

// ——— Config ———
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-MDV0NDEVYR";
const GA_DEBUG = process.env.NEXT_PUBLIC_GA_DEBUG === "1";

const CROSS_DOMAIN: string[] = [
  "rychlyzivotopis.cz",
  "www.rychlyzivotopis.cz",
  "rychlyzivotopis.sk",
  "www.rychlyzivotopis.sk",
];

// ——— Interní stav ———
let gaLoaded = false;

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
  (document.head || document.getElementsByTagName("head")[0]).appendChild(s);
}

/** Vytvoří proxy gtag (push do dataLayer), dokud nepřijede loader. */
function ensureGtag(): Window["gtag"] | null {
  if (!hasWindow()) return null;

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  if (typeof window.gtag !== "function") {
    const proxy = ((...args: unknown[]) => {
      if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
      window.dataLayer.push(args);
    }) as unknown as Window["gtag"];
    window.gtag = proxy;
  }
  return window.gtag ?? null;
}

/** Bezpečné volání gtag bez typových kolizí (funguje i bez loaderu). */
function pushGtag(...args: unknown[]): void {
  if (!hasWindow()) return;
  if (typeof window.gtag === "function") {
    (window.gtag as unknown as (...a: unknown[]) => void)(...args);
  } else {
    if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
    window.dataLayer.push(args);
  }
}

// ——— Measurement Protocol fallback (když gtag ještě „nepálí“) ———
const GA_MP_ENDPOINT = "https://www.google-analytics.com/g/collect";

function hasConsentAccepted(): boolean {
  if (!hasDocument()) return false;
  try {
    const m = document.cookie.match(/(?:^|;\s*)cookie_consent_v1=([^;]+)/);
    return !!(m && decodeURIComponent(m[1]) === "accepted_all");
  } catch {
    return false;
  }
}
function getOrCreateCid(): string {
  try {
    const k = "_ga_cid_v1";
    const ex = window.localStorage.getItem(k);
    if (ex) return ex;
    const cid = `${Math.floor(Math.random() * 1e10)}.${Math.floor(Math.random() * 1e10)}`;
    window.localStorage.setItem(k, cid);
    return cid;
  } catch {
    return `${Date.now()}.${Math.floor(Math.random() * 1e6)}`;
  }
}
function getOrCreateSid(): string {
  try {
    const k = "_ga_sid_v1";
    const ttlMs = 30 * 60 * 1000; // 30 min
    const now = Date.now();
    const raw = window.localStorage.getItem(k);
    if (raw) {
      const parsed = JSON.parse(raw) as { sid: number; ts: number };
      if (now - parsed.ts < ttlMs) {
        window.localStorage.setItem(k, JSON.stringify({ sid: parsed.sid, ts: now }));
        return String(parsed.sid);
      }
    }
    const sid = Math.floor(now / 1000);
    window.localStorage.setItem(k, JSON.stringify({ sid, ts: now }));
    return String(sid);
  } catch {
    return String(Math.floor(Date.now() / 1000));
  }
}

/** Odeslání eventu přímo do GA4 (fallback), jen pokud je souhlas. */
function mpSend(eventName: string, extra: Record<string, unknown> = {}): void {
  if (!hasWindow() || !hasDocument() || !GA_ID || !hasConsentAccepted()) return;

  const params = new URLSearchParams();
  params.set("v", "2");
  params.set("tid", GA_ID);
  params.set("en", eventName);
  params.set("_p", String(Math.floor(Math.random() * 1e10)));
  params.set("cid", getOrCreateCid());
  params.set("sid", getOrCreateSid());
  params.set("sct", "1");
  params.set("seg", "1");
  params.set("dl", window.location.href);
  params.set("dt", document.title);

  // extra parametry jako ep.*
  for (const [k, v] of Object.entries(extra)) {
    if (v == null) continue;
    params.set(`ep.${k}`, String(v));
  }
  if (GA_DEBUG) params.set("ep.debug_mode", "1");

  // ⚠️ DŮLEŽITÉ: posíláme STRING, ne URLSearchParams/Blob — kvůli TS/ESLint kompatibilitě
  const body = params.toString();

  const ok =
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function" &&
    navigator.sendBeacon(GA_MP_ENDPOINT, body);

  if (!ok) {
    void fetch(GA_MP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  }
}

// ——— Consent Mode v2 ———
export function setConsentDefaults(): void {
  if (!hasWindow()) return;
  ensureGtag();
  pushGtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function updateConsentGranted(): void {
  if (!hasWindow()) return;
  ensureGtag();
  pushGtag("consent", "update", {
    ad_storage: "granted",
    analytics_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
}

export function updateConsentRevoked(): void {
  if (!hasWindow()) return;
  ensureGtag();
  pushGtag("consent", "update", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

// ——— GA4 init ———
export function initGoogleAnalytics(): void {
  if (!hasWindow() || !hasDocument() || gaLoaded || !GA_ID) return;
  gaLoaded = true;

  // 1) Loader
  loadScriptOnce(
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`,
    "ga4-loader"
  );

  // 2) Bootstrap + config
  ensureGtag();
  pushGtag("js", new Date());
  pushGtag("config", GA_ID, {
    send_page_view: false, // SPA PV posílá _app.tsx
    linker: { domains: CROSS_DOMAIN },
    ...(GA_DEBUG ? { debug_mode: true } : {}),
  });

  // 3) První page_view po inicializaci (aktuální URL)
  sendPageView();

  // 4) SPA page_view řeší _app.tsx (routeChangeComplete)
  window.gtagInitialized = true;
}

// ——— Pageviews ———
function sendPageView(): void {
  if (!hasWindow()) return;

  const href = window.location.href;
  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const title = hasDocument() ? document.title : "";

  if (typeof window.gtag === "function" && window.gtagInitialized) {
    pushGtag("event", "page_view", {
      page_location: href,
      page_path: path,
      page_title: title,
      ...(GA_DEBUG ? { debug_mode: true } : {}),
    });
  } else {
    // Fallback (když gtag ještě „nepálí“)
    mpSend("page_view");
  }
}

// ——— Helper pro vlastní eventy ———
export function trackGAEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
): void {
  if (!hasWindow()) return;

  const eventName = action || category || "event";
  const params: Record<string, unknown> = {
    event_category: category,
    ...(label ? { event_label: label } : {}),
    ...(typeof value === "number" ? { value } : {}),
    ...(GA_DEBUG ? { debug_mode: true } : {}),
  };

  if (typeof window.gtag === "function" && window.gtagInitialized) {
    pushGtag("event", eventName, params);
  } else {
    // Fallback – neztratí se kliky před configem
    mpSend(eventName, params);
  }
}

// ——— Early loader pro validátory/Preview (bez configu) ———
export function preloadGaLoader(): void {
  if (!hasWindow() || !hasDocument()) return;

  const id = "ga4-loader";
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.async = true;
    el.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    (document.head || document.getElementsByTagName("head")[0]).appendChild(el);
  }

  // Proxy gtag/dataLayer – ať consent default/update zapisují i bez dojetého loaderu
  ensureGtag();
}
