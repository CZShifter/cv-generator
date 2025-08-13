import Head from "next/head";
import { SITE_URL, SITE_URL_SK, OG_IMAGE, SITE_NAME, PRICE_CV } from "@/config/site";
import PriceSection from '@/components/cs/PriceSection';
import PlatMetody from '@/components/PlatMetodySection';
import AISection from '@/components/cs/AISection';
import HookSection2 from '@/components/cs/HookSection2';
import FeaturesSection from '@/components/cs/FeaturesSection';
import CallToActionSection from '@/components/cs/CallToActionSection';
export default function CenaPage() {
  return ( 
    <>
      <Head>
        <title>{`Cena online životopisu – Moderní CV jen za ${PRICE_CV} Kč | ${SITE_NAME}`}</title>
        <meta name="description"
          content={`Kompletní profesionální životopis v PDF získáte za ${PRICE_CV} Kč. Žádné skryté poplatky, bez registrace. Okamžitý export, moderní šablony a úprava dat po dobu 24 hodin.`}/>
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta property="og:title"
          content={`Cena moderního životopisu online – Moderní CV jen za ${PRICE_CV} Kč | ${SITE_NAME}`}/>
        <meta property="og:description"
          content={`Životopis na míru v PDF formátu jen za ${PRICE_CV} Kč. Vyberte si šablonu, vyplňte údaje a stáhněte ihned.`}/>
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Ukázka moderního životopisu v PDF" />
        <meta property="og:url" content={`${SITE_URL}/cs/cena/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title"
          content={`Cena moderního životopisu online – Moderní CV jen za ${PRICE_CV} Kč | ${SITE_NAME}`}/>
        <meta name="twitter:description"
          content={`Životopis na míru v PDF formátu jen za ${PRICE_CV} Kč. Vyberte si šablonu, vyplňte údaje a stáhněte ihned.`}/>
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Ukázka moderního životopisu v PDF" />
        {/* Canonical + hreflang (oboustranně .cz ↔ .sk, absolutní URL) */}
        <link rel="canonical" href={`${SITE_URL}/cs/cena/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/cena/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/cena/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/cs/cena/`} hrefLang="x-default" />

        {/* Structured data - Product (jazyková URL + inLanguage) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "Online životopis PDF",
              "image": OG_IMAGE,
              "description": `Kompletní profesionální životopis v PDF za ${PRICE_CV} Kč. Vyberte šablonu, vyplňte údaje a stáhněte životopis ihned bez registrace.`,
              "brand": SITE_NAME,
              "inLanguage": "cs-CZ",
              "offers": {
                "@type": "Offer",
                "url": `${SITE_URL}/cs/cena/`,
                "priceCurrency": "CZK",
                "price": PRICE_CV,
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      </Head>
      <PriceSection />
      <PlatMetody />
      <HookSection2 />
      <AISection />
      <FeaturesSection />
      <CallToActionSection />
    </>
  );
}
