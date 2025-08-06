import type { AppProps } from 'next/app';
import Head from 'next/head';
import { FAVICON_URL_32,FAVICON_URL_192, APPLE_TOUCH_ICON_URL } from '@/config/site';
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


export default function App({ Component, pageProps }: AppProps) {
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
