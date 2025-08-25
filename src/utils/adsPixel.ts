// /utils/adsPixel.ts
// Spouštět až po souhlasu uživatele (CookieConsent → initSklik(), initGoogleAds())

let sklikLoaded = false;
let gadsLoaded = false;

const ADS_ID =
  process.env.NEXT_PUBLIC_ADS_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ||
  ""; // např. "AW-1234567890"

const ADS_DEBUG = process.env.NEXT_PUBLIC_GA_DEBUG === "1";

function hasWindow(): boolean { return typeof window !== "undefined"; }
function hasDocument(): boolean { return typeof document !== "undefined"; }

/** Kompatibilní proxy gtag – pushuje `arguments`, aby loader vyzvedl frontu. */
function ensureGtag(): Window["gtag"] | null {
  if (!hasWindow()) return null;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtagProxy(this: unknown): void {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments as unknown);
    } as unknown as Window["gtag"];
  }
  return window.gtag ?? null;
}

/** Forward na gtag bez union-pekla. */
function pushGtag(...args: unknown[]): void {
  if (!hasWindow()) return;
  if (typeof window.gtag === "function") {
    (window.gtag as (...a: unknown[]) => void)(...args);
  } else {
    if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
    window.dataLayer.push(args);
  }
}

/* ------------------------------ SKLIK (Seznam) ------------------------------ */
// Doplň případné window.skw(...) registrace dle účtu.
export function initSklik(): void {
  if (!hasWindow() || !hasDocument() || sklikLoaded) return;
  sklikLoaded = true;

  (window as Window).sklikInitialized = true;

  const SCRIPT_ID = "seznam-rtg";
  if (document.getElementById(SCRIPT_ID)) return;

  const js = document.createElement("script");
  js.id = SCRIPT_ID;
  js.async = true;
  js.src = "https://c.seznam.cz/js/rc.js";

  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(js, firstScript);
}

/* --------------------------- GOOGLE ADS (konverze) -------------------------- */

export function initGoogleAds(): void {
  if (!hasWindow() || !hasDocument() || gadsLoaded || !ADS_ID) return;
  gadsLoaded = true;

  // Nepřidávej nový loader, pokud už je nějaký gtag loader v DOM
  const hasAnyGtagLoader = Array.from(document.scripts).some(
    (s) => typeof s.src === "string" && s.src.includes("googletagmanager.com/gtag/js")
  );

  if (!hasAnyGtagLoader) {
    const s = document.createElement("script");
    s.id = "ga-ads-loader";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ADS_ID)}`;
    (document.head || document.getElementsByTagName("head")[0]).appendChild(s);
  }

  ensureGtag();

  // Ads config – conversion linker + Enhanced Conversions povolené
  pushGtag("config", ADS_ID, {
    conversion_linker: true,
    allow_enhanced_conversions: true,
    ...(ADS_DEBUG ? { debug_mode: true } : {}),
  });

  try {
    (window as Window).gadsInitialized = true;
  } catch {
    /* noop */
  }
}

/** Odeslání konverze Google Ads.
 *  @param sendTo  např. "AW-1234567890/AbCdEfGhIj" (tvůj conversion label)
 *  @param params  např. { value: 199, currency: "CZK", transaction_id: "123" }
 */
export function trackAdsConversion(
  sendTo: string,
  params: Record<string, unknown> = {}
): void {
  if (!hasWindow() || !sendTo) return;

  const payload: Record<string, unknown> = {
    send_to: sendTo,
    ...(ADS_DEBUG ? { debug_mode: true } : {}),
    ...params,
  };

  pushGtag("event", "conversion", payload);
}

/** Volitelné: remarketing ping (většinou stačí samotný config).
 *  Použij třeba na zobrazení výpisu šablon.
 */
export function trackAdsRemarketing(params: Record<string, unknown> = {}): void {
  if (!hasWindow() || !ADS_ID) return;

  const payload: Record<string, unknown> = {
    send_to: ADS_ID,
    ...(ADS_DEBUG ? { debug_mode: true } : {}),
    ...params,
  };

  // nejčastěji "page_view" pro RMK
  pushGtag("event", "page_view", payload);
}

/* ---------------------- ENHANCED CONVERSIONS (volitelné) -------------------- */
/** EC – email (gtag sám bezpečně zhashuje). Volat jen se souhlasem. */
export function setEnhancedConversionEmail(email: string): void {
  if (!hasWindow() || !ADS_ID || !email) return;
  ensureGtag();
  pushGtag("set", "user_data", { email });
}

/** EC – rozšířená data (gtag sám hashuje). Volat jen se souhlasem. */
export function setEnhancedConversionData(data: {
  email?: string;
  phone_number?: string;
  address?: {
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string; // ISO 3166-1 alpha-2, např. "CZ"
  };
}): void {
  if (!hasWindow() || !ADS_ID) return;
  ensureGtag();
  pushGtag("set", "user_data", data);
}
