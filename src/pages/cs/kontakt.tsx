import Head from "next/head";
import { SITE_URL, OG_IMAGE, SITE_NAME } from "@/config/site";
import KontaktSection from '@/components/cs/KontaktSection';
import CallToActionSection from '@/components/cs/CallToActionSection';
export default function KontaktPage() {
  return ( 
    <>
      <Head>
        <title>{`Kontakt – Podpora a dotazy ke generátoru životopisů | ${SITE_NAME}`}</title>
        <meta name="description" content="Máte otázku nebo potřebujete poradit? Kontaktujte tým CvGen.cz. Rádi pomůžeme s tvorbou životopisu, platbou nebo technickými dotazy. Odpovídáme většinou do 24 hodin." />
        <meta name="language" content="cs" />
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta property="og:title" content="Kontakt | CvGen.cz – Podpora a dotazy ke generátoru životopisů" />
        <meta property="og:description" content="Máte otázku nebo potřebujete poradit? Kontaktujte nás, rádi vám pomůžeme s tvorbou životopisu nebo technickými záležitostmi." />
        <meta property="og:image" content={OG_IMAGE}/>
        <meta property="og:url" content={`${SITE_URL}/kontakt`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kontakt | CvGen.cz – Podpora a dotazy ke generátoru životopisů" />
        <meta name="twitter:description" content="Máte otázku nebo potřebujete poradit? Kontaktujte nás, rádi vám pomůžeme s tvorbou životopisu nebo technickými záležitostmi." />
        <meta name="twitter:image" content={OG_IMAGE}/>
        {/* Structured data - ContactPage + FAQ */}
        <link rel="canonical" href={`${SITE_URL}/cs/kontakt`} />
        <link rel="alternate" href={`${SITE_URL}/cs/kontakt`} hrefLang="cs" />
        <link rel="alternate" href={`${SITE_URL}/sk/kontakt`} hrefLang="sk" />
        <link rel="alternate" href={`${SITE_URL}/`} hrefLang="x-default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "url": `${SITE_URL}/kontakt`,
              "name": `Kontakt - ${SITE_NAME}`,
              "description": "Máte otázku k životopisu, platbě nebo technický problém? Kontaktujte nás přes e-mail info@cvgen.cz, odpovídáme do 24 hodin."
            })
          }}
        />
      </Head>
      <KontaktSection />
      <CallToActionSection />
    </>
  );
}