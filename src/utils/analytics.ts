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
let gaScriptReady = false; // <script> dojel (onload)
let gaGetReady = false;    // gtag('get', ...) callback proběhl (knihovna je živá)

// fronta callbacků, které se mají spustit, až je GA připravené
const readyQueue: Array<() => void> = [];
function whenGaReady(cb: () => void) {
  if (gaScriptReady || gaGetReady) cb();
  else readyQueue.push(cb);
}
function notifyReady() {
  const q = readyQueue.splice(0);
  for (const cb of q) {
    try { cb(); } catch { /* ignore */ }
  }
}

/** Jsme skutečně připraveni posílat přes gtag (ne jen do proxy)? */
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

/** Vytvoří proxy gtag (push do dataLayer), dokud nepřijede loader. */
function ensureGtag(): Window["gtag"] | null {
  if (typeof window === "undefined") return null;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    // DŮLEŽITÉ: používej 'arguments' (IArguments), ne pole – gtag loader s tím umí počítat 100% spolehlivě
    window.gtag = function gtagProxy(this: unknown): void {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments as unknown);
    } as unknown as Window["gtag"];
  }
  return window.gtag ?? null;
}

/** Forward na gtag, bez union typového zacyklení. */
function pushGtag(...args: unknown[]): void {
  if (!hasWindow()) return;
  if (typeof window.gtag === "function") {
    (window.gtag as (...a: unknown[]) => void)(...args);
  } else {
    // ✅ zajisti proxy a použij ji – ta pushuje `arguments`
    const g = ensureGtag();
    (g as (...a: unknown[]) => void)(...args);
  }
}

/** Ready signál přes undocumented "get" – zavolá se, až když je GA klient hotový. */
function watchGtagGetReady(): void {
  try {
    window.gtag?.("get", GA_ID, "client_id", () => {
      gaGetReady = true;
      notifyReady();
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
      mode: "no-cors",         // ⬅️ přidej
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

/** Přidá GA loader a volitelný callback po načtení */
export function initGoogleAnalytics(onReady?: () => void): void {
  if (!hasWindow() || !hasDocument() || gaLoaded || !GA_ID) return;
  gaLoaded = true;

  const el = loadScriptOnce(
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`,
    "ga4-loader"
  );

  if (el) {
    // standardní ready z <script> onload
    el.addEventListener("load", () => {
      gaScriptReady = true;
      notifyReady();
    });
  }

  // pokud už byl loader ready (preload dřív), zavolej onReady hned
  if (gaScriptReady || gaGetReady) {
    notifyReady();
  }

  ensureGtag();
  watchGtagGetReady(); // až dojede knihovna, zvedne gaGetReady a zavolá notifyReady()

  pushGtag("js", new Date());
  pushGtag("config", GA_ID, {
    send_page_view: false,
    linker: { domains: CROSS_DOMAIN },
    ...(GA_DEBUG ? { debug_mode: true } : {}),
  });

  if (onReady) whenGaReady(onReady);

  (window as Window).gtagInitialized = true;
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
    notifyReady();
  });

  ensureGtag();
  watchGtagGetReady();
}
export type GaPurchaseParams = {
  transaction_id: string;
  value: number;
  currency: "CZK" | "EUR";
  coupon?: string;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    price?: number;
    quantity?: number;
  }>;
};

export function trackGaPurchase(p: GaPurchaseParams): void {
  if (typeof window === "undefined") return;

  const payload: Record<string, unknown> = {
    transaction_id: p.transaction_id,
    value: p.value,
    currency: p.currency,
    ...(p.coupon ? { coupon: p.coupon } : {}),
    ...(p.items ? { items: p.items } : {}),
  };

  (window as any).dataLayer = (window as any).dataLayer || [];
  if (typeof (window as any).gtag !== "function") {
    (window as any).gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      (window as any).dataLayer.push(arguments);
    };
  }

  (window as any).gtag("event", "purchase", payload);
}
