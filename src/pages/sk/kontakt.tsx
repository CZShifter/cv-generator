import Head from "next/head";
import { SITE_URL, SITE_URL_SK, OG_IMAGE_SK, SITE_NAME_SK } from "@/config/site";
import KontaktSection from '@/components/sk/KontaktSection';
import CallToActionSection from '@/components/sk/CallToActionSection';
export default function KontaktPage() {
  return ( 
    <>
      <Head>
        <title>{`Kontakt – Podpora a otázky k generátoru životopisov | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content="Máte otázku alebo potrebujete poradiť? Kontaktujte nás. Radi pomôžeme s tvorbou životopisu, platbou alebo technickými otázkami. Odpovedáme zvyčajne do 24 hodín."/>
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta
          property="og:title"
          content={`Kontakt – Podpora a otázky k generátoru životopisov | ${SITE_NAME_SK}`}/>
        <meta
          property="og:description"
          content="Máte otázku alebo potrebujete poradiť? Kontaktujte nás, radi vám pomôžeme s tvorbou životopisu alebo technickými záležitosťami."/>
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Kontakt na podporu generátora životopisov" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/kontakt/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Kontakt – Podpora a otázky k generátoru životopisov | ${SITE_NAME_SK}`}/>
        <meta
          name="twitter:description"
          content="Máte otázku alebo potrebujete poradiť? Kontaktujte nás, radi vám pomôžeme s tvorbou životopisu alebo technickými záležitosťami."/>
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        <meta name="twitter:image:alt" content="Kontakt na podporu generátora životopisov" />
        {/* Canonical + hreflang (obojsmerne .cz ↔ .sk) */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk/kontakt/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/kontakt/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/kontakt/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/kontakt/`} hrefLang="x-default" />
        {/* Structured data - ContactPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "url": `${SITE_URL_SK}/sk/kontakt/`,
              "name": `Kontakt - ${SITE_NAME_SK}`,
              "inLanguage": "sk-SK",
              "description":
                "Máte otázku k životopisu, platbe alebo technický problém? Kontaktujte nás e-mailom na info@cvgen.cz, zvyčajne odpovieme do 24 hodín."
            })
          }}
        />
      </Head>
      <KontaktSection />
      <CallToActionSection />
    </>
  );
}