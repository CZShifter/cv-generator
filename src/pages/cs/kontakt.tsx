import Head from "next/head";
import { SITE_URL, SITE_URL_SK, OG_IMAGE, SITE_NAME } from "@/config/site";
import KontaktSection from '@/components/cs/KontaktSection';
import CallToActionSection from '@/components/cs/CallToActionSection';
import AISection from '@/components/cs/AISection';
import StatsSection from '@/components/cs/StatsSection';
export default function KontaktPage() {
  return ( 
    <>
      <Head>
        <title>{`Kontakt – Podpora a dotazy ke generátoru životopisů | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content="Máte otázku nebo potřebujete poradit? Kontaktujte tým CvGen.cz. Rádi pomůžeme s tvorbou životopisu, platbou nebo technickými dotazy. Odpovídáme většinou do 24 hodin."/>
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta
          property="og:title"
          content={`Kontakt – Podpora a dotazy ke generátoru životopisů | ${SITE_NAME}`}/>
        <meta
          property="og:description"
          content="Máte otázku nebo potřebujete poradit? Kontaktujte nás, rádi vám pomůžeme s tvorbou životopisu nebo technickými záležitostmi."/>
        <meta property="og:image" content={OG_IMAGE}/>
        <meta property="og:image:alt" content="Kontakt na podporu generátoru životopisů" />
        <meta property="og:url" content={`${SITE_URL}/cs/kontakt/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Kontakt – Podpora a dotazy ke generátoru životopisů | ${SITE_NAME}`}/>
        <meta
          name="twitter:description"
          content="Máte otázku nebo potřebujete poradit? Kontaktujte nás, rádi vám pomůžeme s tvorbou životopisu nebo technickými záležitostmi."/>
        <meta name="twitter:image" content={OG_IMAGE}/>
        <meta name="twitter:image:alt" content="Kontakt na podporu generátoru životopisů" />
        {/* Canonical + hreflang (oboustranně .cz ↔ .sk, absolutní URL) */}
        <link rel="canonical" href={`${SITE_URL}/cs/kontakt/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/kontakt/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/kontakt/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/cs/kontakt/`} hrefLang="x-default" />

        {/* Structured data - ContactPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "url": `${SITE_URL}/cs/kontakt/`,
              "name": `Kontakt - ${SITE_NAME}`,
              "inLanguage": "cs-CZ",
              "description": "Máte otázku k životopisu, platbě nebo technický problém? Kontaktujte nás přes e-mail info@cvgen.cz, odpovídáme do 24 hodin."
            })
          }}
        />
      </Head>
      <KontaktSection />
      <AISection />
      <StatsSection />
      <CallToActionSection />
    </>
  );
}