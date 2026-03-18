import Head from "next/head";
import { SITE_URL, SITE_URL_SK, OG_IMAGE_SK, SITE_NAME_SK } from "@/config/site";
import NavodSection from '@/components/sk/NavodSection';
import CallToActionSection from '@/components/sk/CallToActionSection';
export default function NavodPage() {
  return ( 
      <>
      <Head>
        <title>{`Návod ako vyplniť životopis online krok za krokom | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content="Podrobný návod, ako jednoducho a správne vyplniť online životopis. Ukážky všetkých krokov s obrázkami a tipy, na čo si dať pozor. Zvládne to každý – pozrite si postup!"/>
        <meta name="robots" content="index, follow" />
        {/* OpenGraph */}
        <meta property="og:title" content={`Návod ako vyplniť životopis online krok za krokom | ${SITE_NAME_SK}`} />
        <meta
          property="og:description"
          content="Podrobný návod na vyplnenie online životopisu. Prejdite si jednotlivé kroky, pozrite si ukážky a začnite tvoriť svoje vlastné CV bez stresu."/>
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Postup vyplnenia online životopisu – návod krok za krokom" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/navod/`} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Návod ako vyplniť životopis online krok za krokom | ${SITE_NAME_SK}`} />
        <meta
          name="twitter:description"
          content="Podrobný návod na vyplnenie online životopisu. Prejdite si jednotlivé kroky, pozrite si ukážky a začnite tvoriť svoje vlastné CV bez stresu."/>
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        <meta name="twitter:image:alt" content="Postup vyplnenia online životopisu – návod krok za krokom" />
        {/* Canonical + hreflang */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk/navod/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/navod/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/navod/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/navod/`} hrefLang="x-default" />
        {/* Structured data - HowTo (SK) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "Ako vyplniť online životopis krok za krokom",
              "description": "Podrobný návod na vyplnenie online životopisu, doplnený obrázkami a postupom, ktorý zvládne každý.",
              "image": OG_IMAGE_SK,
              "inLanguage": "sk-SK",
              "totalTime": "PT10M",
              "tool": ["Aplikácia na online tvorbu životopisu"],
              "url": `${SITE_URL_SK}/sk/navod/`,
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Zadanie kontaktných údajov",
                  "text": "Vyplňte meno, priezvisko, pracovné zameranie, telefón, e-mail a ďalšie kontaktné údaje. Nezabudnite na krátky text o sebe.",
                  "image": `${SITE_URL_SK}/img/navod/krok1.png`
                },
                {
                  "@type": "HowToStep",
                  "name": "Vzdelanie",
                  "text": "Zadajte dosiahnuté vzdelanie, študijný odbor, školu a rok. Uveďte všetky dôležité školy.",
                  "image": `${SITE_URL_SK}/img/navod/krok2.png`
                },
                {
                  "@type": "HowToStep",
                  "name": "Kurzy a certifikáty",
                  "text": "Doplňte všetky relevantné kurzy, certifikáty alebo školenia vrátane roku absolvovania.",
                  "image": `${SITE_URL_SK}/img/navod/krok3.png`
                },
                {
                  "@type": "HowToStep",
                  "name": "Jazyky",
                  "text": "Pridajte všetky jazyky, ktoré ovládate, a zvoľte úroveň znalosti.",
                  "image": `${SITE_URL_SK}/img/navod/krok4.png`
                },
                {
                  "@type": "HowToStep",
                  "name": "Zručnosti",
                  "text": "Vyberte svoje najdôležitejšie zručnosti relevantné k pracovnej pozícii.",
                  "image": `${SITE_URL_SK}/img/navod/krok5.png`
                },
                {
                  "@type": "HowToStep",
                  "name": "Pracovné skúsenosti",
                  "text": "Zadajte pracovné pozície, zamestnávateľov a popíšte svoju náplň práce aj úspechy na každej pozícii.",
                  "image": `${SITE_URL_SK}/img/navod/krok6.png`
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
