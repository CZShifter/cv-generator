import Head from "next/head";
import { SITE_URL, SITE_URL_SK, OG_IMAGE_SK, SITE_NAME_SK, PRICE_CV_SK } from "@/config/site";
import PriceSection from '@/components/sk/PriceSection';
import AISection from '@/components/sk/AISection';
import HookSection2 from '@/components/sk/HookSection2';
import FeaturesSection from '@/components/sk/FeaturesSection';
import CallToActionSection from '@/components/sk/CallToActionSection';
export default function CenaPage() {
  return ( 
    <>
        <Head>
        <title>{`Cena online životopisu – Moderné CV už za ${PRICE_CV_SK} € | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content={`Kompletný profesionálny životopis v PDF získate za ${PRICE_CV_SK} €. Žiadne skryté poplatky, bez registrácie. Okamžitý export, moderné šablóny a úprava údajov počas 24 hodín.`}/>
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta
          property="og:title"
          content={`Cena moderného životopisu online – Moderné CV už za ${PRICE_CV_SK} € | ${SITE_NAME_SK}`}/>
        <meta
          property="og:description"
          content={`Životopis na mieru v PDF formáte už za ${PRICE_CV_SK} €. Vyberte si šablónu, vyplňte údaje a stiahnite ihneď.`}/>
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Ukážka moderného životopisu v PDF" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/cena/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Cena moderného životopisu online – Moderné CV už za ${PRICE_CV_SK} € | ${SITE_NAME_SK}`}/>
        <meta
          name="twitter:description"
          content={`Životopis na mieru v PDF formáte už za ${PRICE_CV_SK} €. Vyberte si šablónu, vyplňte údaje a stiahnite ihneď.`}/>
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        <meta name="twitter:image:alt" content="Ukážka moderného životopisu v PDF" />
        {/* Canonical + hreflang (obojstranne .cz ↔ .sk, absolútne URL) */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk/cena/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/cena/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/cena/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/`} hrefLang="x-default" />
        {/* Structured data - Product (jazyková URL + inLanguage) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "Online životopis PDF",
              "image": OG_IMAGE_SK,
              "description": `Kompletný profesionálny životopis v PDF za ${PRICE_CV_SK} €. Vyberte šablónu, vyplňte údaje a stiahnite životopis ihneď bez registrácie.`,
              "brand": SITE_NAME_SK,
              "inLanguage": "sk-SK",
              "offers": {
                "@type": "Offer",
                "url": `${SITE_URL_SK}/sk/cena/`,
                "priceCurrency": "EUR",
                "price": PRICE_CV_SK,
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
