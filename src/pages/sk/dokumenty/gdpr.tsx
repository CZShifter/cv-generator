import Head from "next/head";
import Link from 'next/link';
import { SITE_MAIL, SITE_URL, SITE_URL_SK, SITE_NAME_SK, FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL, OG_IMAGE_SK } from "@/config/site";
import React from "react";
import styles from "@/scss/Dokumenty.module.scss";
export default function Gdpr() {
  return (
     <>
      <Head>
        <title>{`Zásady ochrany osobných údajov (GDPR) | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content="Zásady spracúvania osobných údajov a informácie o ochrane súkromia."/>
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Canonical + hreflang */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk/dokumenty/gdpr/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/dokumenty/gdpr/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/gdpr/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/gdpr/`} hrefLang="x-default" />
        {/* Open Graph */}
        <meta property="og:title" content={`Zásady ochrany osobných údajov (GDPR) | ${SITE_NAME_SK}`} />
        <meta property="og:description" content="Zásady spracúvania osobných údajov a informácie o ochrane súkromia." />
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Informácie o ochrane osobných údajov" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/dokumenty/gdpr/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Zásady ochrany osobných údajov (GDPR) | ${SITE_NAME_SK}`} />
        <meta name="twitter:description" content="Zásady spracúvania osobných údajov a informácie o ochrane súkromia." />
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        {/* Structured data – WebPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Zásady ochrany osobných údajov (GDPR)",
              "url": `${SITE_URL_SK}/sk/dokumenty/gdpr/`,
              "inLanguage": "sk-SK",
              "description": "Zásady spracúvania osobných údajov a informácie o ochrane súkromia."
            })
          }}
        />
      </Head>
      <section className={styles.dokument_section}>
        <div className={styles.dokument_wrapper}>
          <h1>Zásady ochrany osobných údajov</h1>
          <p>
            Tento dokument opisuje spôsob, akým spracúvam osobné údaje v súlade s Nariadením 
            Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR) a zákonom č. 18/2018 Z. z. o ochrane osobných údajov.
          </p>
          <h2>1. Prevádzkovateľ údajov</h2>
          <div>
            <p><strong>Meno:</strong> Tomáš Tippl</p>
            <p><strong>Adresa:</strong> Strnady 137, Jíloviště 252 02</p>
            <p><strong>IČO:</strong> 88520510</p>
            <p><strong>E-mail:</strong> <Link href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</Link></p>
          </div>
          <h2>2. Aké údaje spracúvam</h2>
          <p>Spracúvam výhradne údaje, ktoré používateľ dobrovoľne vyplní do formulára za účelom vytvorenia a stiahnutia životopisu. Ide najmä o:</p>
          <ul>
            <li>meno a priezvisko</li>
            <li>kontaktné údaje (e-mail, telefón, LinkedIn profil)</li>
            <li>pracovné skúsenosti, vzdelanie, zručnosti, jazykové znalosti, absolvované kurzy a ďalšie údaje uvedené v životopise</li>
            <li>vloženú fotografiu (voliteľne)</li>
            <li>IP adresu (na technické účely)</li>
          </ul>
          <h2>3. Účel spracúvania</h2>
          <p>Osobné údaje spracúvam na účely:</p>
          <ul>
            <li>vytvorenia a stiahnutia životopisu (CV)</li>
            <li>dočasného sprístupnenia životopisu na spätnú úpravu po zaplatení</li>
            <li>automatického odstránenia po 24 hodinách</li>
            <li>generovania anonymných účteniek (bez mena)</li>
            <li>merania návštevnosti a zlepšovania webu (Google Analytics)</li>
          </ul>
          <h2>4. Kto má prístup k údajom</h2>
          <p>
            K osobným údajom má prístup výhradne prevádzkovateľ (ja). Údaje nie sú poskytované žiadnym tretím osobám, 
            okrem nevyhnutných technických poskytovateľov služieb:
          </p>
          <ul>
            <li>Supabase – databáza a úložisko</li>
            <li>Vercel – hosting a spracovanie požiadaviek</li>
            <li>Comgate – platobná brána (neprenášajú sa žiadne osobné údaje)</li>
            <li>PDFendpoint – spracovanie dokumentu</li>
            <li>ChatGPTApi – generovanie textov</li>
          </ul>
          <h2>5. Doba uchovávania údajov</h2>
          <p>
            Osobné údaje a súvisiace súbory (napr. PDF) sa automaticky mažú do 24 hodín od vytvorenia. 
            Nie sú uchovávané na žiadne ďalšie účely.
          </p>
          <h2>6. Vaše práva</h2>
          <p>Máte právo:</p>
          <ul>
            <li>požiadať o prístup k osobným údajom</li>
            <li>požiadať o opravu alebo vymazanie údajov</li>
            <li>podať sťažnosť na Úrad na ochranu osobných údajov SR (<Link href="https://dataprotection.gov.sk">www.dataprotection.gov.sk</Link>), ak sa domnievate, že došlo k porušeniu Vašich práv</li>
          </ul>
          <p>
            Úprava životopisu je možná počas 24 hodín od vytvorenia prostredníctvom jedinečného odkazu. Po uplynutí tejto lehoty 
            sú všetky údaje nenávratne zmazané.
          </p>
          <h2>7. Cookies a analytika</h2>
          <p>
            Tento web používa súbory cookies na zabezpečenie základnej funkčnosti, meranie návštevnosti a prípadne aj marketingové účely.
          </p>
          <h3>Typy cookies, ktoré môžeme používať:</h3>
          <ul>
            <li><strong>Nevyhnutné cookies</strong> – slúžia na zabezpečenie správneho fungovania webu, napr. uloženie aktuálnej relácie alebo jazykového nastavenia.</li>
            <li><strong>Analytické cookies</strong> – pomáhajú nám pochopiť, ako návštevníci používajú náš web. Napríklad pomocou služby Google Analytics.</li>
            <li><strong>Marketingové cookies</strong> – umožňujú personalizáciu obsahu alebo meranie efektívnosti reklamných kampaní (napr. Facebook Pixel, ak je použitý).</li>
          </ul>
          <h3>Ako spravovať cookies:</h3>
          <p>
            Pri prvej návšteve webu si používateľ môže vybrať, či prijme všetky cookies, alebo iba nevyhnutné. Tento výber je možné kedykoľvek zmeniť pomocou odkazu „Nastavenia cookies“ v spodnej časti stránky (ak je táto funkcia aktívna).
          </p>
          <p>
            Používateľ môže spravovať alebo blokovať cookies aj vo svojom prehliadači. V takom prípade však môže dôjsť k obmedzeniu funkčnosti niektorých častí webu.
          </p>
          <h3>Ďalšie informácie:</h3>
          <p>
            Údaje získané prostredníctvom cookies môžu byť spracúvané spoločnosťami tretích strán, najmä spoločnosťou Google Inc., v súlade s ich vlastnými zásadami ochrany súkromia.
          </p>
          <h2>8. Automatizované rozhodovanie a profilovanie</h2>
          <p>
            Na základe Vami poskytnutých údajov sa nevykonávajú žiadne rozhodnutia s právnymi účinkami. Web slúži výhradne na generovanie CV.
          </p>
          <h2>9. Zmeny zásad</h2>
          <p>
            Tieto zásady môžu byť priebežne aktualizované.<br /> Dátum poslednej aktualizácie: <strong>26. 7. 2025</strong>.
          </p>
        </div>
      </section>
    </>
  );
}
