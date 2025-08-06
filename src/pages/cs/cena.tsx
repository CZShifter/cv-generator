import Head from "next/head";
import { SITE_URL, OG_IMAGE, SITE_NAME } from "@/config/site";
import PriceSection from '@/components/cs/PriceSection';
import AISection from '@/components/cs/AISection';
import HookSection2 from '@/components/cs/HookSection2';
import FeaturesSection from '@/components/cs/FeaturesSection';
import CallToActionSection from '@/components/cs/CallToActionSection';
export default function CenaPage() {
  return ( 
    <>
      <Head>
        <title>{`Cena online životopisu – Moderní CV jen za 89 Kč | ${SITE_NAME}`}</title>
        <meta name="description" content="Kompletní profesionální životopis v PDF získáte za 89 Kč. Žádné skryté poplatky, bez registrace. Okamžitý export, moderní šablony a úprava dat po dobu 24 hodin." />
        <meta name="language" content="cs" />
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta property="og:title" content={`Cena moderního životopisu online – Moderní CV jen za 89 Kč | ${SITE_NAME}`} />
        <meta property="og:description" content="Životopis na míru v PDF formátu jen za 89 Kč. Vyberte si šablonu, vyplňte údaje a stáhněte ihned." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={`${SITE_URL}/cena`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Cena moderního životopisu online – Moderní CV jen za 89 Kč | ${SITE_NAME}`} />
        <meta name="twitter:description" content="Životopis na míru v PDF formátu jen za 89 Kč. Vyberte si šablonu, vyplňte údaje a stáhněte ihned." />
        <meta name="twitter:image" content={OG_IMAGE} />
        {/* Structured data - Product */}
        <link rel="canonical" href={`${SITE_URL}/cs/cena`} />
        <link rel="alternate" href={`${SITE_URL}/cs/cena`} hrefLang="cs" />
        <link rel="alternate" href={`${SITE_URL}/sk/cena`} hrefLang="sk" />
        <link rel="alternate" href={`${SITE_URL}/`} hrefLang="x-default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "Online životopis PDF",
              "image": OG_IMAGE,
              "description": "Kompletní profesionální životopis v PDF za 89 Kč. Vyberte šablonu, vyplňte údaje a stáhněte životopis ihned bez registrace.",
              "brand": SITE_NAME,
              "offers": {
                "@type": "Offer",
                "url": `${SITE_URL}/cena`,
                "priceCurrency": "CZK",
                "price": "89",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      </Head>
      <PriceSection />
      <HookSection2 />
      <AISection />
      <FeaturesSection />
      <CallToActionSection />
    </>
  );
}
