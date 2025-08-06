import Head from "next/head";
import { SITE_URL_SK, OG_IMAGE_SK, SITE_NAME_SK } from "@/config/site";
import HeroSection from '@/components/sk/HeroSection';
import HookSection from '@/components/sk/HookSection';
import SecureSection from '@/components/sk/SecureSection';
import NarrativeSection from '@/components/sk/NarrativeSection';
import FeaturesSection from '@/components/sk/FeaturesSection';
import NarrativeSection2 from '@/components/sk/NarrativeSection2';
import StatsSection from '@/components/sk/StatsSection';
import CallToActionSection from '@/components/sk/CallToActionSection';
export default function Home() {
  return ( 
    <>
      <Head>
        <title>{`Vytvořte moderní životopis online – Profesionální CV za 5 minut | ${SITE_NAME_SK}`}</title>
        <meta name="description" content="Vytvořte si moderní a profesionální životopis během pár minut. Jednoduše, bez registrace, okamžitě v PDF. Vyberte si šablonu a získejte náskok na trhu práce!" />
        <meta name="language" content="sk" />
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta property="og:title" content="Vytvořte moderní životopis online | Profesionální CV za 5 minut" />
        <meta property="og:description" content="Vytvořte si moderní životopis rychle a jednoduše. Výběr šablon, bez registrace, PDF ihned." />
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:url" content={`${SITE_URL_SK}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vytvořte moderní životopis online | Profesionální CV za 5 minut" />
        <meta name="twitter:description" content="Vytvořte si moderní životopis rychle a jednoduše. Výběr šablon, bez registrace, PDF ihned." />
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        {/* Structured data - WebSite */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk`} />
        <link rel="alternate" href={`${SITE_URL_SK}/sk`} hrefLang="sk" />
        <link rel="alternate" href={`${SITE_URL_SK}/cs`} hrefLang="cs" />
        <link rel="alternate" href={`${SITE_URL_SK}`} hrefLang="x-default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": SITE_NAME_SK,
              "url": `${SITE_URL_SK}/`,
              "description": "Vytvořte moderní životopis online – vytvořte si profesionální CV během pár minut. Okamžité PDF, bez registrace, výběr moderních šablon.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${SITE_URL_SK}/?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>
      <HeroSection />
      <HookSection />
      <NarrativeSection />
      <SecureSection />
      <FeaturesSection />
      <NarrativeSection2 />
      <StatsSection />
      <CallToActionSection />
    </>
  );
}
