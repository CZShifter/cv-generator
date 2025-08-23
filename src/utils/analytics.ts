// /utils/analytics.ts
// GA4 + Consent Mode v2 + cross-domain linker + SPA page_view
// Pokud měříš přes tento kód, měj GA4 tagy v GTM pauznuté.

export { initSklik, initGoogleAds } from "./adsPixel";

/* ---------------------------------- CONFIG --------------------------------- */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-MDV0NDEVYR";
const GA_DEBUG = process.env.NEXT_PUBLIC_GA_DEBUG === "1";
const GA_FORCE_MP = process.env.NEXT_PUBLIC_GA_FORCE_MP === "1";

const CROSS_DOMAIN: string[] = [
  "rychlyzivotopis.cz",
  "www.rychlyzivotopis.cz",
  "rychlyzivotopis.sk",
  "www.rychlyzivotopis.sk",
];

/* -------------------------------- INTERNAL --------------------------------- */

let gaLoaded = false;
let gaScriptReady = false;
let gaGetReady = false;

function isGtagReady(): boolean {
  return hasWindow() && typeof window.gtag === "function" && (gaScriptReady || gaGetReady);
}

/* -------------------------------- HELPERS ---------------------------------- */

function hasWindow(): boolean { return typeof window !== "undefined"; }
function hasDocument(): boolean { return typeof document !== "undefined"; }

function loadScriptOnce(src: string, id: string): HTMLScriptElement | null {
  if (!hasDocument()) return null;
  const existing = document.getElementById(id) as HTMLScriptElement | null;
  if (existing) return existing;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  (document.head || document.getElementsByTagName("head")[0]).appendChild(s);
  return s;
}

function ensureGtag(): Window["gtag"] | null {
  if (!hasWindow()) return null;
  if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
  if (typeof window.gtag !== "function") {
    const proxy = ((...args: any[]) => {
      if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
      window.dataLayer.push(args);
    }) as Window["gtag"];
    window.gtag = proxy;
  }
  return window.gtag ?? null;
}

/** Volně typované volání gtag (vyhne se konfliktu s přesným unionem v global.d.ts). */
function pushGtag(...args: any[]): void {
  if (!hasWindow()) return;
  if (typeof window.gtag === "function") {
    (window.gtag as any)(...args);
  } else {
    if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
    window.dataLayer.push(args);
  }
}

/** Signál připravenosti (využívá undocumented "get"). */
function watchGtagGetReady(): void {
  try {
    window.gtag?.("get", GA_ID, "client_id", () => {
      gaGetReady = true;
    });
  } catch {
    // ignore
  }
}

/* --------------------------- MEASUREMENT PROTOCOL -------------------------- */

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
    const ttlMs = 30 * 60 * 1000;
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

  for (const [k, v] of Object.entries(extra)) {
    if (v == null) continue;
    params.set(`ep.${k}`, String(v));
  }
  if (GA_DEBUG) params.set("ep.debug_mode", "1");

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
      keepalive: true,
    });
  }
}

/* ------------------------------ CONSENT MODE ------------------------------- */

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

/* ---------------------------------- GA INIT -------------------------------- */

export function initGoogleAnalytics(): void {
  if (!hasWindow() || !hasDocument() || gaLoaded || !GA_ID) return;
  gaLoaded = true;

  const el = loadScriptOnce(
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`,
    "ga4-loader"
  );
  if (el) {
    el.addEventListener("load", () => {
      gaScriptReady = true;
    });
  }

  ensureGtag();
  watchGtagGetReady();

  pushGtag("js", new Date());
  pushGtag("config", GA_ID, {
    send_page_view: false,
    linker: { domains: CROSS_DOMAIN },
    ...(GA_DEBUG ? { debug_mode: true } : {}),
  });

  try {
    (window as any).gtagInitialized = true;
  } catch {
    /* noop */
  }
}

/* -------------------------------- PAGEVIEWS -------------------------------- */

export function trackPageView(url: string, title?: string): void {
  if (!hasWindow()) return;
  const u = new URL(url, window.location.origin);
  const href = u.href;
  const path = u.pathname + u.search + u.hash;
  const pageTitle = title || (hasDocument() ? document.title : "");

  if (!GA_FORCE_MP && isGtagReady()) {
    pushGtag("event", "page_view", {
      page_location: href,
      page_path: path,
      page_title: pageTitle,
      ...(GA_DEBUG ? { debug_mode: true } : {}),
    });
  } else {
    mpSend("page_view");
  }
}

/* --------------------------------- EVENTS ---------------------------------- */

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

  if (!GA_FORCE_MP && isGtagReady()) {
    pushGtag("event", eventName, params);
  } else {
    mpSend(eventName, params);
  }
}

/* ------------------------------ EARLY PRELOAD ------------------------------ */

export function preloadGaLoader(): void {
  if (!hasWindow() || !hasDocument() || !GA_ID) return;
  const id = "ga4-loader";
  let el = document.getElementById(id) as HTMLScriptElement | null;

  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.async = true;
    el.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    (document.head || document.getElementsByTagName("head")[0]).appendChild(el);
  }

  el.addEventListener("load", () => {
    gaScriptReady = true;
  });

  ensureGtag();
  watchGtagGetReady();
}
