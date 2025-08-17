// pages/_app.tsx
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  FAVICON_URL_32,
  FAVICON_URL_192,
  APPLE_TOUCH_ICON_URL,
  GA_MEASUREMENT_ID,
} from "@/config/site";

import HeaderCs from "@/components/cs/Header";
import FooterCs from "@/components/cs/Footer";
import CookieConsentCs from "@/components/cs/CookieConsent";
import HeaderSk from "@/components/sk/Header";
import FooterSk from "@/components/sk/Footer";
import CookieConsentSk from "@/components/sk/CookieConsent";

// ── NOVÉ: speciální varianty headeru a footeru ─────────────────────────────────
import SpecialHeaderCs from "@/components/cs/SpecialHeader";
import SpecialHeaderSk from "@/components/sk/SpecialHeader";
import SpecialFooterCs from "@/components/cs/SpecialFooter";
import SpecialFooterSk from "@/components/sk/SpecialFooter";

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

// Přečtení souhlasu z cookie (stejný název jako v CookieConsent)
function hasAdsConsent() {
  if (typeof document === "undefined") return false;
  const m = document.cookie.match(/(?:^|;\s*)cookie_consent_v1=([^;]+)/);
  return m ? decodeURIComponent(m[1]) === "accepted_all" : false;
}

// ── NOVÉ: seznam segmentů, kde chceme SPECIAL header+footer ───────────────────
const SPECIAL_SEGMENTS = ["edit", "preview"]; // ← sem můžeš snadno přidávat další stránky

// ── NOVÉ: detekce speciální cesty podle prvního segmentu za /cs|/sk ───────────
function isSpecialRoute(pathname: string): boolean {
  // Očekáváme /cs/<segment>/... nebo /sk/<segment>/...
  // Příklady: /cs/edit/123, /sk/preview, /cs/preview?id=...
  const m = pathname.match(/^\/(cs|sk)\/([^\/?]+)/i);
  if (!m) return false;
  const firstSegment = m[2].toLowerCase();
  return SPECIAL_SEGMENTS.includes(firstSegment);
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  const isSk = router.pathname.startsWith("/sk");
  const DefaultHeader = isSk ? HeaderSk : HeaderCs;
  const SpecialHeader = isSk ? SpecialHeaderSk : SpecialHeaderCs;

  const DefaultFooter = isSk ? FooterSk : FooterCs;
  const SpecialFooter = isSk ? SpecialFooterSk : SpecialFooterCs;

  const CookieConsent = isSk ? CookieConsentSk : CookieConsentCs;

  // SPA pageview: nasadíme listener vždy,
  // ale hit odešleme jen když (až když) je consent + gtag načten.
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!hasAdsConsent()) return;
      if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
        window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Nastavení <html lang> při načtení i po každé změně routy
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

  if (Component.noLayout) {
    return <Component {...pageProps} />;
  }

  const useSpecialLayout = isSpecialRoute(router.pathname);

  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
      </Head>

      {useSpecialLayout ? <SpecialHeader /> : <DefaultHeader />}

      <Component {...pageProps} />

      <CookieConsent />
      {useSpecialLayout ? <SpecialFooter /> : <DefaultFooter />}
    </>
  );
}