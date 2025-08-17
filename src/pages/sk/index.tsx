import Head from "next/head";
import { SITE_URL, SITE_URL_SK, OG_IMAGE_SK, SITE_NAME_SK, SELLER_COMPANY, SELLER_ADDRESS, PRICE_CV_SK } from "@/config/site";
import HeroSection from '@/components/sk/HeroSection';
import HookSection from '@/components/sk/HookSection';
import SecureSection from '@/components/sk/SecureSection';
import NarrativeSection from '@/components/sk/NarrativeSection';
import FeaturesSection from '@/components/sk/FeaturesSection';
import AISection from '@/components/sk/AISection';
import PriceSection from '@/components/sk/PriceSection';
import StatsSection from '@/components/sk/StatsSection';
import CallToActionSection from '@/components/sk/CallToActionSection';
import PlatMetody from '@/components/PlatMetodySection';
export default function Home() {
  return ( 
    <>
      <Head>
        <title>{`Vytvorte moderný životopis online – Profesionálne CV za 5 minút | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content="Vytvorte si moderný a profesionálny životopis za pár minút. Jednoducho, bez registrácie, okamžite v PDF. Vyberte si šablónu a získajte náskok na trhu práce!"/>
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta
          property="og:title"
          content={`Vytvorte moderný životopis online – Profesionálne CV za 5 minút | ${SITE_NAME_SK}`}/>
        <meta
          property="og:description"
          content="Vytvorte si moderný životopis rýchlo a jednoducho. Výber šablón, bez registrácie, PDF ihneď."/>
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Ukážka moderného životopisu z aplikácie" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Vytvorte moderný životopis online – Profesionálne CV za 5 minút | ${SITE_NAME_SK}`}/>
        <meta
          name="twitter:description"
          content="Vytvorte si moderný životopis rýchlo a jednoducho. Výber šablón, bez registrácie, PDF ihneď."/>
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        <meta name="twitter:image:alt" content="Ukážka moderného životopisu z aplikácie" />
        {/* Hreflang – absolútne URL, obojsmerne .cz ↔ .sk */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/`} hrefLang="x-default" />
        {/* Structured data - WebSite (jazyková URL + inLanguage) */}
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": SITE_NAME_SK,
              "url": `${SITE_URL_SK}/sk/`,
              "inLanguage": "sk-SK",
              "description": "Vytvorte moderný životopis online – profesionálne PDF za pár minút. Bez registrácie, výber moderných šablón."
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_URL_SK}/#org`,
              "name": SITE_NAME_SK,
              "legalName": `${SELLER_COMPANY}`,
              "url": `${SITE_URL_SK}/sk/`,
              "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL_SK}/img/logo_nove_barevny.png`
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": `${SELLER_ADDRESS}`,
                "addressLocality": "Jíloviště",
                "postalCode": "252 02",
                "addressCountry": "CZ"
              },
              "areaServed": "SK",
              "sameAs": []
            },
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Online tvorba životopisov",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "url": `${SITE_URL_SK}/sk/`,
              "inLanguage": "sk-SK",
              "description": "Webová aplikácia na rýchlu tvorbu moderného životopisu. Bez registrácie, PDF ihneď.",
              "image": OG_IMAGE_SK,
              "brand": { "@id": `${SITE_URL_SK}/#org` },
              "isAccessibleForFree": false,
              "offers": {
                "@type": "Offer",
                "url": `${SITE_URL_SK}/sk/`,
                "price": Number(PRICE_CV_SK).toFixed(2),
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
              }
            }
          ])
        }}
      />
      </Head>
      <HeroSection />
      <FeaturesSection />
      <HookSection />
      <StatsSection />
      <NarrativeSection />
      <AISection />
      <PriceSection />
      <PlatMetody />
      <SecureSection />
      <CallToActionSection />
    </>
  );
}
