import Head from "next/head";
import { SITE_URL, SITE_URL_SK, OG_IMAGE_SK, SITE_NAME_SK } from "@/config/site";
import DopisSection from '@/components/sk/DopisSection';
import NarrativeSection3 from '@/components/sk/NarrativeSection3';
import HookSection2 from '@/components/sk/HookSection2';
import AISection2 from '@/components/sk/AISection2';
import StatsSection from '@/components/cs/StatsSection';
import CallToActionSection from '@/components/sk/CallToActionSection';
export default function MotivacniDopisPage() {
  return ( 
    <>
      <Head>
        <title>{`Vytvorte motivačný list online a zadarmo | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content="Vytvorte si profesionálny motivačný list online zadarmo. Jednoduchý generátor motivačných listov – export do Wordu (.docx). Zistite, ako jednoducho a rýchlo vytvoriť motivačný list, ktorý zaujme personalistov."/>
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta property="og:title" content={`Vytvorte motivačný list online a zadarmo | ${SITE_NAME_SK}`} />
        <meta
          property="og:description"
          content="Vytvorte si profesionálny motivačný list online zadarmo. Generátor s exportom do Wordu (.docx) a bez registrácie."/>
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Ukážka motivačného listu vytvoreného online" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/motivacni-dopis/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Motivačný list online zadarmo | ${SITE_NAME_SK}`} />
        <meta
          name="twitter:description"
          content="Vytvorte si motivačný list online zadarmo. Generátor motivačných listov s exportom do Wordu a bez registrácie. Ideálne riešenie, ako napísať a stiahnuť motivačný list na mieru."/>
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        <meta name="twitter:image:alt" content="Ukážka motivačného listu vytvoreného online" />
        {/* Canonical + hreflang */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk/motivacni-dopis/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/motivacni-dopis/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/motivacni-dopis/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/motivacni-dopis/`} hrefLang="x-default" />
        {/* Structured data - WebPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "url": `${SITE_URL_SK}/sk/motivacni-dopis/`,
              "name": `Vytvorte motivačný list online zadarmo | ${SITE_NAME_SK}`,
              "inLanguage": "sk-SK",
              "description":
                "Generátor motivačných listov online zadarmo. Export do Wordu (.docx) a rýchle vytvorenie motivačného listu, ktorý zaujme personalistov. Zistite, ako napísať motivačný list za pár minút."
            })
          }}
        />
      </Head>
      <NarrativeSection3 />
      <DopisSection />
      <HookSection2 />
      <AISection2 />
      <StatsSection />
      <CallToActionSection />
    </>
  );
}