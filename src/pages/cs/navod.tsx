import Head from "next/head";
import { SITE_URL, SITE_URL_SK, OG_IMAGE, SITE_NAME } from "@/config/site";
import NavodSection from '@/components/cs/NavodSection';
import CallToActionSection from '@/components/cs/CallToActionSection';
export default function NavodPage() {
  return ( 
      <>
      <Head>
        <title>{`Návod – Jak vyplnit online životopis krok za krokem | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content="Podrobný návod, jak jednoduše a správně vyplnit online životopis. Ukázky všech kroků s obrázky a tipy, na co si dát pozor. Zvládne to každý – podívejte se na postup!"/>
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta property="og:title" content={`Návod – Jak vyplnit online životopis krok za krokem | ${SITE_NAME}`} />
        <meta
          property="og:description"
          content="Podrobný návod na vyplnění online životopisu. Projděte si jednotlivé kroky, podívejte se na ukázky a začněte tvořit své vlastní CV bez stresu."/>
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Postup vyplnění online životopisu – návod krok za krokem" />
        <meta property="og:url" content={`${SITE_URL}/cs/navod/`} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Návod – Jak vyplnit online životopis krok za krokem | ${SITE_NAME}`} />
        <meta
          name="twitter:description"
          content="Podrobný návod na vyplnění online životopisu. Projděte si jednotlivé kroky, podívejte se na ukázky a začněte tvořit své vlastní CV bez stresu."/>
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Postup vyplnění online životopisu – návod krok za krokem" />
        {/* Canonical + hreflang (absolutní URL, oboustranně .cz ↔ .sk) */}
        <link rel="canonical" href={`${SITE_URL}/cs/navod/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/navod/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/navod/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/cs/navod/`} hrefLang="x-default" />

        {/* Structured data - HowTo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "Jak vyplnit online životopis krok za krokem",
              "description": "Podrobný návod pro vyplnění online životopisu, doplněný obrázky a postupem, který zvládne každý.",
              "image": OG_IMAGE,
              "inLanguage": "cs-CZ",
              "totalTime": "PT10M",
              "tool": ["Aplikace na online tvorbu životopisu"],
              "url": `${SITE_URL}/cs/navod/`,
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Zadání kontaktních údajů",
                  "text": "Vyplňte jméno, příjmení, pracovní zaměření, telefon, e-mail a další kontaktní údaje. Nezapomeňte na krátký text o sobě.",
                  "image": `${SITE_URL}/img/navod/krok1.png`
                },
                {
                  "@type": "HowToStep",
                  "name": "Vzdělání",
                  "text": "Zadejte dosažené vzdělání, vystudovaný obor, školu a rok. Uveďte všechny důležité školy.",
                  "image": `${SITE_URL}/img/navod/krok2.png`
                },
                {
                  "@type": "HowToStep",
                  "name": "Kurzy a certifikáty",
                  "text": "Doplňte všechny relevantní kurzy, certifikáty nebo školení, včetně roku absolvování.",
                  "image": `${SITE_URL}/img/navod/krok3.png`
                },
                {
                  "@type": "HowToStep",
                  "name": "Jazyky",
                  "text": "Přidejte všechny jazyky, které ovládáte, a zvolte úroveň znalosti.",
                  "image": `${SITE_URL}/img/navod/krok4.png`
                },
                {
                  "@type": "HowToStep",
                  "name": "Dovednosti",
                  "text": "Vyberte své nejdůležitější dovednosti relevantní k pracovní pozici.",
                  "image": `${SITE_URL}/img/navod/krok5.png`
                },
                {
                  "@type": "HowToStep",
                  "name": "Pracovní zkušenosti",
                  "text": "Zadejte pracovní pozice, zaměstnavatele a popište svou náplň práce i úspěchy na každé pozici.",
                  "image": `${SITE_URL}/img/navod/krok6.png`
                }
              ]
            })
          }}
        />
      </Head>
      <NavodSection />
      <CallToActionSection />
    </>
  );
}
