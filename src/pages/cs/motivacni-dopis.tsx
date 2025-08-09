import Head from "next/head";
import { SITE_URL, SITE_URL_SK, OG_IMAGE, SITE_NAME } from "@/config/site";
import DopisSection from '@/components/cs/DopisSection';
import NarrativeSection3 from '@/components/cs/NarrativeSection3';
import HookSection2 from '@/components/cs/HookSection2';
import AISection from '@/components/cs/AISection';
import CallToActionSection from '@/components/cs/CallToActionSection';
export default function MotivacniDopisPage() {
  return ( 
    <>
      <Head>
        <title>{`Vytvořte motivační dopis online a zdarma | ${SITE_NAME}`}</title>
        <meta name="description" content="Vytvořte si profesionální motivační dopis online zdarma. Jednoduchý generátor motivačních dopisů – export do Wordu (.docx). Zjistěte, jak snadno a rychle vytvořit motivační dopis, který personalisty zaujme."/>
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Ukázka motivačního dopisu vytvořeného online" />
        <meta property="og:url" content={`${SITE_URL}/cs/motivacni-dopis/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Motivační dopis online zdarma | ${SITE_NAME}`}/>
        <meta name="twitter:description" content="Vytvořte si motivační dopis online zdarma. Generátor motivačních dopisů s exportem do Wordu a bez registrace. Ideální řešení jak napsat a stáhnout motivační dopis na míru."/>
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Ukázka motivačního dopisu vytvořeného online" />
        {/* Structured data - WebPage */}
        <link rel="canonical" href={`${SITE_URL}/cs/motivacni-dopis/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/motivacni-dopis/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/motivacni-dopis/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/`} hrefLang="x-default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "url": `${SITE_URL}/cs/motivacni-dopis/`,
              "name": `Vytvořte motivační dopis online zdarma | ${SITE_NAME}`,
              "inLanguage": "cs-CZ",
              "description":
                "Generátor motivačních dopisů online zdarma. Export do Wordu (.docx) a rychlé vytvoření motivačního dopisu, který zaujme personalisty. Zjistěte, jak napsat motivační dopis během pár minut."
            })
          }}
        />
      </Head>
      <DopisSection />
      <NarrativeSection3 />
      <HookSection2 />
      <AISection />
      <CallToActionSection />
    </>
  );
}