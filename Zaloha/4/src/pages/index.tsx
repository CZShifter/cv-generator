import Head from "next/head";
import { SITE_URL, OG_IMAGE, SITE_NAME } from "../config/site";
import HeroSection from '@/components/cs/HeroSection';
import HookSection from '@/components/cs/HookSection';
import SecureSection from '@/components/cs/SecureSection';
import NarrativeSection from '@/components/cs/NarrativeSection';
import FeaturesSection from '@/components/cs/FeaturesSection';
import NarrativeSection2 from '@/components/cs/NarrativeSection2';
import StatsSection from '@/components/cs/StatsSection';
import CallToActionSection from '@/components/cs/CallToActionSection';
export default function Home() {
  return ( 
    <>
      <Head>
        <title>{`Vytvořte moderní životopis online – Profesionální CV za 5 minut | ${SITE_NAME}`}</title>
        <meta name="description" content="Vytvořte si moderní a profesionální životopis během pár minut. Jednoduše, bez registrace, okamžitě v PDF. Vyberte si šablonu a získejte náskok na trhu práce!" />
        {/* OpenGraph */}
        <meta property="og:title" content="Vytvořte moderní životopis online | Profesionální CV za 5 minut" />
        <meta property="og:description" content="Vytvořte si moderní životopis rychle a jednoduše. Výběr šablon, bez registrace, PDF ihned." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:type" content="website" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vytvořte moderní životopis online | Profesionální CV za 5 minut" />
        <meta name="twitter:description" content="Vytvořte si moderní životopis rychle a jednoduše. Výběr šablon, bez registrace, PDF ihned." />
        <meta name="twitter:image" content={OG_IMAGE} />
        {/* Structured data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": SITE_NAME,
              "url": `${SITE_URL}/`,
              "description": "Vytvořte moderní životopis online – vytvořte si profesionální CV během pár minut. Okamžité PDF, bez registrace, výběr moderních šablon.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${SITE_URL}/?q={search_term_string}`,
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
