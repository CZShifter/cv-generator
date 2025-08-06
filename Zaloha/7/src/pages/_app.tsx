import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL, GA_MEASUREMENT_ID } from '@/config/site';
import Header from '@/components/cs/Header';
import Footer from '@/components/cs/Footer';
import CookieConsent from "@/components/cs/CookieConsent";
import "@/styles/globals.scss";
import '@/scss/main.scss';
import '@fontsource-variable/montserrat';
import "@fontsource/poppins/600.css"; // Specify weight
import "@fontsource/poppins/600-italic.css"; // Specify weight and style
import "@fontsource/poppins/500.css"; // Specify weight
import "@fontsource/poppins/500-italic.css"; // Specify weight and style
import "@fontsource/poppins/400.css"; // Specify weight
import "@fontsource/poppins/400-italic.css"; // Specify weight and style
import "@fontsource/poppins/300.css"; // Specify weight
import "@fontsource/poppins/300-italic.css"; // Specify weight and style

const COOKIE_NAME = "cookie_consent_v1";

export default function App({ Component, pageProps }: AppProps) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const router = useRouter();

  // Zjisti při načtení, zda má uživatel povolenou analytiku
  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem(COOKIE_NAME);
      setAnalyticsEnabled(consent === "accepted_all");
    }
  }, []);

  // Odesílá pageview při změně cesty, pokud je analytika povolena
  useEffect(() => {
    if (!analyticsEnabled) return;
    const handleRouteChange = (url: string) => {
      if (window.gtag && GA_MEASUREMENT_ID) {
        window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [analyticsEnabled, router.events]);

  // Pokud komponenta má prop "noLayout", nevkládej Header/Footer (JEN PRO LADĚNÍ!!!)
  if ((Component as any).noLayout) {
    return <Component {...pageProps} />;
  }
  return (
    <>
      {/* Globální meta tagy v <Head> */}
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32"/>
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180"/>
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        <meta name="robots" content="index,follow" />
        <meta httpEquiv="Content-Language" content="cs" />
      </Head>
      <Header />
      <Component {...pageProps} />
      <CookieConsent />
      <Footer />
    </>
  );
}
