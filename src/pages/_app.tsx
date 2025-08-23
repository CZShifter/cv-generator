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

import { initGoogleAnalytics, trackPageView } from "@/utils/analytics";

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

// ── NOVÉ: detekce speciální cesty podle prvního segmentu za /cs|/sk ───────────
function isSpecialRoute(pathname: string): boolean {
  const m = pathname.match(/^\/(cs|sk)\/([^\/?]+)/i);
  if (!m) return false;
  const firstSegment = m[2].toLowerCase();
  return SPECIAL_SEGMENTS.includes(firstSegment);
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

      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>

      <CookieConsent />
      {useSpecialLayout ? <SpecialFooter /> : <DefaultFooter />}
    </>
  );
}
