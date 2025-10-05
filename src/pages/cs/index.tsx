import Head from "next/head";
import { SITE_URL, SITE_URL_SK, OG_IMAGE, SITE_NAME, PRICE_CV, SELLER_COMPANY, SELLER_ADDRESS } from "@/config/site";
import HeroSection from '@/components/cs/HeroSection';
import HookSection from '@/components/cs/HookSection';
import SecureSection from '@/components/cs/SecureSection';
import NarrativeSection from '@/components/cs/NarrativeSection';
import FeaturesSection from '@/components/cs/FeaturesSection';
import AISection from '@/components/cs/AISection';
import StatsSection from '@/components/cs/StatsSection';
import CallToActionSection from '@/components/cs/CallToActionSection';
import PriceSection from '@/components/cs/PriceSection';
import PlatMetody from '@/components/PlatMetodySection';
export default function Home() {
  return ( 
    <>
      <Head>
        <title>{`Vytvořte moderní životopis online snadno a rychle do 5 minut | ${SITE_NAME}`}</title>
        <meta name="description" content="Vytvořte si moderní a profesionální životopis během pár minut. Jednoduše, bez registrace, okamžitě v PDF. Vyberte si šablonu a získejte náskok na trhu práce!" />
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta property="og:title" content={`Vytvořte moderní životopis online snadno a rychle do 5 minut | ${SITE_NAME}`} />
        <meta property="og:description" content="Vytvořte si moderní životopis rychle a jednoduše. Výběr šablon, bez registrace, PDF ihned." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Ukázka moderního životopisu z aplikace" />
        <meta property="og:url" content={`${SITE_URL}/cs/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Vytvořte moderní životopis online – Profesionální CV za 5 minut | ${SITE_NAME}`} />
        <meta name="twitter:description" content="Vytvořte si moderní životopis rychle a jednoduše. Výběr šablon, bez registrace, PDF ihned." />
        <meta name="twitter:image" content={OG_IMAGE} />
        {/* Hreflang – absolutní URL a oboustranně na .cz i .sk */}
        <link rel="canonical" href={`${SITE_URL}/cs/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/cs/`} hrefLang="x-default" />
        {/* Structured data - WebSite (jazyková URL + inLanguage) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": SITE_NAME,
                "url": `${SITE_URL}/cs/`,
                "inLanguage": "cs-CZ",
                "description": "Vytvořte moderní životopis online – profesionální PDF během pár minut. Bez registrace, výběr moderních šablon."
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": `${SITE_URL}/#org`,
                "name": SITE_NAME,
                "legalName": `${SELLER_COMPANY}`,
                "url": `${SITE_URL}/cs/`,
                "logo": {
                  "@type": "ImageObject",
                  "url": `${SITE_URL}/img/logo_nove_barevny.png`
                },
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": `${SELLER_ADDRESS}`,
                  "addressLocality": "Jíloviště",
                  "postalCode": "252 02",
                  "addressCountry": "CZ"
                },
                "areaServed": "CZ",
                "sameAs": [
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Online tvorba životopisu",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "url": `${SITE_URL}/cs/`,
                "inLanguage": "cs-CZ",
                "description": "Webová aplikace pro rychlou tvorbu moderního životopisu. Bez registrace, PDF ihned.",
                "image": OG_IMAGE,
                "brand": { "@id": `${SITE_URL}/#org` },
                "isAccessibleForFree": false,
                "offers": {
                  "@type": "Offer",
                  "url": `${SITE_URL}/cs/`,
                  "price": Number(PRICE_CV).toFixed(2),
                  "priceCurrency": "CZK",
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
