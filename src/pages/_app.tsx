// pages/_app.tsx
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react"; // ← přidán import React kvůli ErrorBoundary
import { useRouter } from "next/router";
import {
  FAVICON_URL_32,
  FAVICON_URL_192,
  APPLE_TOUCH_ICON_URL,
  SITE_URL,
  SITE_URL_SK,
  SITE_NAME,
  SITE_NAME_SK,
  PRICE_CV,
  PRICE_CV_SK,
  LOGO_SCHEMA_URL,
  LOGO_SCHEMA_URL_SK,
} from "@/config/site";

import HeaderCs from "@/components/cs/Header";
import FooterCs from "@/components/cs/Footer";
import CookieConsentCs from "@/components/cs/CookieConsent";
import HeaderSk from "@/components/sk/Header";
import FooterSk from "@/components/sk/Footer";
import CookieConsentSk from "@/components/sk/CookieConsent";
import ScrollToTop from "@/components/ui/ScrollToTop";

// ── NOVÉ: speciální varianty headeru a footeru ─────────────────────────────────
import SpecialHeaderCs from "@/components/cs/SpecialHeader";
import SpecialHeaderSk from "@/components/sk/SpecialHeader";
import SpecialFooterCs from "@/components/cs/SpecialFooter";
import SpecialFooterSk from "@/components/sk/SpecialFooter";

import { trackPageView } from "@/utils/analytics";

import "@/styles/globals.scss";
import "@/scss/main.scss";

export type NextPageWithLayout = NextPage & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Helper pro určení jazyka z cesty
function getLangFromPath(pathname: string) {
  if (pathname.startsWith("/sk")) return "sk";
  if (pathname.startsWith("/cs")) return "cs";
  return "cs"; // fallback
}

// ── NOVÉ: seznam segmentů, kde chceme SPECIAL header+footer ───────────────────
const SPECIAL_SEGMENTS = ["edit", "preview"]; // ← sem můžeš snadno přidávat další stránky
const SCROLL_TOP_EXCLUDE = ["preview", "po-platbe", "edit", "zaplaceno"];

// ── NOVÉ: detekce speciální cesty podle prvního segmentu za /cs|/sk ───────────
function isSpecialRoute(pathname: string): boolean {
  const m = pathname.match(/^\/(cs|sk)\/([^\/?]+)/i);
  if (!m) return false;
  const firstSegment = m[2].toLowerCase();
  return SPECIAL_SEGMENTS.includes(firstSegment);
}

function shouldShowScrollToTop(pathname: string): boolean {
  const m = pathname.match(/^\/(cs|sk)\/([^\/?]+)/i);
  if (!m) return true;
  const firstSegment = m[2].toLowerCase();
  return !SCROLL_TOP_EXCLUDE.includes(firstSegment);
}

/* --------------------------- LOGOVÁNÍ CHYB ---------------------------------- */

const LOG_ENABLED = process.env.NODE_ENV === "production";
const RELEASE = (process.env.NEXT_PUBLIC_APP_VERSION ?? "dev").slice(0, 7);

function hashLite(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return ("h" + (h >>> 0).toString(16)).slice(0, 12);
}

function throttleSameError(dedupKey: string, ttlMs = 5 * 60_000) {
  try {
    const key = "__err_seen__";
    const raw = localStorage.getItem(key);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    const now = Date.now();
    for (const k of Object.keys(map)) if (now - map[k] > ttlMs) delete map[k];
    if (map[dedupKey] && now - map[dedupKey] < ttlMs) return true;
    map[dedupKey] = now;
    localStorage.setItem(key, JSON.stringify(map));
    return false;
  } catch {
    return false;
  }
}

function useGlobalErrorLogging() {
  useEffect(() => {
    if (!LOG_ENABLED) return;

    const send = (payload: Record<string, unknown>) => {
      const body = JSON.stringify(payload);
      try {
        if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
          const ok = navigator.sendBeacon("/api/log-error", body);
          if (!ok) {
            void fetch("/api/log-error", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              keepalive: true,
              body,
            });
          }
        } else {
          void fetch("/api/log-error", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body,
          });
        }
      } catch {
        // ignore – logování nesmí shodit UI
      }
    };

    const onError = (event: ErrorEvent): void => {
      try {
        const msg = event?.message ?? "Unknown error";
        const st = event?.error?.stack ?? undefined;
        const url = typeof window !== "undefined" ? window.location.href : undefined;
        const dedupKey = hashLite(`${msg}|${st?.slice(0, 300) ?? ""}|${url ?? ""}`);
        if (throttleSameError(dedupKey)) return;
        send({ message: msg, stack: st, url, dedupKey, release: RELEASE });
      } catch {
        // ignore
      }
    };

    const onRejection = (event: PromiseRejectionEvent): void => {
      try {
        const r = event?.reason as { message?: unknown; stack?: unknown } | unknown;
        const msg =
          r && typeof (r as { message?: unknown }).message === "string"
            ? ((r as { message: string }).message)
            : String((r as unknown) ?? "Unhandled rejection");
        const st =
          r && typeof (r as { stack?: unknown }).stack === "string"
            ? ((r as { stack: string }).stack)
            : undefined;
        const url = typeof window !== "undefined" ? window.location.href : undefined;
        const dedupKey = hashLite(`${msg}|${st?.slice(0, 300) ?? ""}|${url ?? ""}`);
        if (throttleSameError(dedupKey)) return;
        send({ message: msg, stack: st, url, dedupKey, release: RELEASE });
      } catch {
        // ignore
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
}

// React ErrorBoundary pro render chyby
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    if (!LOG_ENABLED) return;

    const payload: Record<string, unknown> = {
      message: error?.message ?? "Render error",
      stack: error?.stack,
      extra: { componentStack: info?.componentStack?.slice(0, 2000) },
      url: typeof window !== "undefined" ? window.location.href : undefined,
      release: RELEASE,
    };
    const body = JSON.stringify(payload);

    try {
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const ok = navigator.sendBeacon("/api/log-error", body);
        if (!ok) {
          void fetch("/api/log-error", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body,
          });
        }
      } else {
        void fetch("/api/log-error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body,
        });
      }
    } catch {
      // ignore
    }
  }

  render() {
    if (this.state.hasError) return null; // případně fallback UI
    return this.props.children;
  }
}
/* ------------------------- KONEC: LOGOVÁNÍ CHYB ---------------------------- */

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  const isSk = router.pathname.startsWith("/sk");
  const siteUrl = isSk ? SITE_URL_SK : SITE_URL;
  const siteName = isSk ? SITE_NAME_SK : SITE_NAME;
  const siteLogo = isSk ? LOGO_SCHEMA_URL_SK : LOGO_SCHEMA_URL;
  const price = isSk ? PRICE_CV_SK : PRICE_CV;
  const currency = isSk ? "EUR" : "CZK";
  const DefaultHeader = isSk ? HeaderSk : HeaderCs;
  const SpecialHeader = isSk ? SpecialHeaderSk : SpecialHeaderCs;

  const DefaultFooter = isSk ? FooterSk : FooterCs;
  const SpecialFooter = isSk ? SpecialFooterSk : SpecialFooterCs;

  const CookieConsent = isSk ? CookieConsentSk : CookieConsentCs;

   // NOVÉ: Volání trackPageView při každé změně routy
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // NOVÉ: Nastavení <html lang> při načtení i po každé změně routy
  useEffect(() => {
    const applyLang = (url: string) => {
      const lang = getLangFromPath(new URL(url, window.location.origin).pathname);
      if (document.documentElement.lang !== lang) {
        document.documentElement.lang = lang;
      }
    };

    // při načtení
    applyLang(window.location.href);

    // po každé změně routy
    const handleRouteChange = (url: string) => applyLang(url);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // ← Aktivuj globální zachytávání chyb
  useGlobalErrorLogging();

  if (Component.noLayout) {
    return (
      <>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
        <CookieConsent />
      </>
    );
  }

  const useSpecialLayout = isSpecialRoute(router.pathname);
  const showScrollToTop = shouldShowScrollToTop(router.pathname);


  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="seznam-wmt"
          content={isSk ? "GymOn2qDbXWcHdkSoXsYiiVZAMC3WPNN" : "cxiiNfR161OyA8q2JjZbKQFz645Tx0dg"}
        />
        <meta
          name="yandex-verification"
          content={isSk ? "f119a658cb450613" : "8902e254184f9008"}
        />
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": siteName,
              "url": siteUrl,
              "logo": siteLogo,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": siteName,
              "url": siteUrl,
              "inLanguage": isSk ? "sk-SK" : "cs-CZ",
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${siteUrl}/${isSk ? "sk" : "cs"}/profese?search={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": isSk ? "Aplikácia na online tvorbu životopisu" : "Aplikace na online tvorbu životopisu",
              "description": isSk
                ? "Vytvorte si profesionálny životopis online a exportujte ho do PDF."
                : "Vytvořte si profesionální životopis online a exportujte ho do PDF.",
              "image": siteLogo,
              "brand": { "@type": "Brand", "name": siteName, "logo": siteLogo },
              "offers": {
                "@type": "Offer",
                "price": price,
                "priceCurrency": currency,
                "url": `${siteUrl}/${isSk ? "sk" : "cs"}/preview`,
                "availability": "https://schema.org/InStock",
                "hasMerchantReturnPolicy": {
                  "@type": "MerchantReturnPolicy",
                  "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                  "applicableCountry": isSk ? "SK" : "CZ",
                },
                "shippingDetails": {
                  "@type": "OfferShippingDetails",
                  "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": 0,
                    "currency": currency,
                  },
                  "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": isSk ? "SK" : "CZ",
                  },
                  "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                      "@type": "QuantitativeValue",
                      "minValue": 0,
                      "maxValue": 0,
                      "unitCode": "DAY",
                    },
                    "transitTime": {
                      "@type": "QuantitativeValue",
                      "minValue": 0,
                      "maxValue": 0,
                      "unitCode": "DAY",
                    },
                  },
                },
              },
            }),
          }}
        />
      </Head>

      {useSpecialLayout ? <SpecialHeader /> : <DefaultHeader />}

      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>

      <CookieConsent />
      {showScrollToTop ? <ScrollToTop /> : null}
      {useSpecialLayout ? <SpecialFooter /> : <DefaultFooter />}
    </>
  );
}
