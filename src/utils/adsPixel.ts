// /utils/adsPixel.ts
// Spouštět až po souhlasu uživatele (CookieConsent → initSklik(), initGoogleAds())

let sklikLoaded = false;
let gadsLoaded = false;

function hasWindow(): boolean {
  return typeof window !== "undefined";
}
function hasDocument(): boolean {
  return typeof document !== "undefined";
}

// ——— Sklik (Seznam) ———
// Doplňte případné window.skw(...) registrace dle vašeho účtu.
export function initSklik(): void {
  if (!hasWindow() || !hasDocument() || sklikLoaded) return;
  sklikLoaded = true;

  window.sklikInitialized = true;

  const SCRIPT_ID = "seznam-rtg";
  if (document.getElementById(SCRIPT_ID)) return;

  const js = document.createElement("script");
  js.id = SCRIPT_ID;
  js.async = true;
  js.src = "https://c.seznam.cz/js/rc.js";

  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(js, firstScript);
}

// ——— Google Ads (remarketing/konverze) ———
// Pokud Ads nepoužíváte, ponechte NEXT_PUBLIC_ADS_ID prázdné.
const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID || ""; // např. "AW-123456789"

export function initGoogleAds(): void {
  if (!hasWindow() || !hasDocument() || gadsLoaded || !ADS_ID) return;
  gadsLoaded = true;

  // 1) Loader (pokud už nenačítá GA loader s GA_ID)
  if (!document.getElementById("ga4-ads-loader")) {
    const s = document.createElement("script");
    s.id = "ga4-ads-loader";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ADS_ID)}`;
    document.head.appendChild(s);
  }

  // 2) Bootstrap gtag (bezpečný, idempotentní)
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }

  if (typeof window.gtag !== "function") {
    const proxy: NonNullable<Window["gtag"]> = ((...args: unknown[]) => {
      window.dataLayer!.push(args);
    }) as unknown as NonNullable<Window["gtag"]>;

    window.gtag = proxy;

    // ✅ proxy je NonNullable<Window["gtag"]>, takže volání je typově správné
    proxy("js", new Date());
  }

  // 3) Ads config – tady už si vezmeme jistou referenci
  const gtag = window.gtag as NonNullable<Window["gtag"]>;
  gtag("config", ADS_ID);

  window.gadsInitialized = true;
}
