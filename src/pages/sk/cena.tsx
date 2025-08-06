import Head from "next/head";
import { SITE_URL_SK, OG_IMAGE_SK, SITE_NAME_SK } from "@/config/site";
import PriceSection from '@/components/sk/PriceSection';
import AISection from '@/components/sk/AISection';
import HookSection2 from '@/components/sk/HookSection2';
import FeaturesSection from '@/components/sk/FeaturesSection';
import CallToActionSection from '@/components/sk/CallToActionSection';
export default function CenaPage() {
  return ( 
    <>
      <Head>
        <title>{`Cena online životopisu – Moderní CV jen za 89 Kč | ${SITE_NAME_SK}`}</title>
        <meta name="description" content="Kompletní profesionální životopis v PDF získáte za 89 Kč. Žádné skryté poplatky, bez registrace. Okamžitý export, moderní šablony a úprava dat po dobu 24 hodin." />
        <meta name="language" content="sk" />
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta property="og:title" content={`Cena moderního životopisu online – Moderní CV jen za 89 Kč | ${SITE_NAME_SK}`} />
        <meta property="og:description" content="Životopis na míru v PDF formátu jen za 89 Kč. Vyberte si šablonu, vyplňte údaje a stáhněte ihned." />
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:url" content={`${SITE_URL_SK}/cena`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Cena moderního životopisu online – Moderní CV jen za 89 Kč | ${SITE_NAME_SK}`} />
        <meta name="twitter:description" content="Životopis na míru v PDF formátu jen za 89 Kč. Vyberte si šablonu, vyplňte údaje a stáhněte ihned." />
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        {/* Structured data - Product */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk/cena`} />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/cena`} hrefLang="sk" />
        <link rel="alternate" href={`${SITE_URL_SK}/cs/cena`} hrefLang="cs" />
        <link rel="alternate" href={`${SITE_URL_SK}`} hrefLang="x-default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "Online životopis PDF",
              "image": OG_IMAGE_SK,
              "description": "Kompletní profesionální životopis v PDF za 89 Kč. Vyberte šablonu, vyplňte údaje a stáhněte životopis ihned bez registrace.",
              "brand": SITE_NAME_SK,
              "offers": {
                "@type": "Offer",
                "url": `${SITE_URL_SK}/cena`,
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
