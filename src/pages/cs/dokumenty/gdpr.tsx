import Head from "next/head";
import Link from 'next/link'
import { SITE_MAIL, SITE_URL, SITE_URL_SK, SITE_NAME, FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL, OG_IMAGE } from "@/config/site";
import React from "react";
import styles from "@/scss/Dokumenty.module.scss";
export default function Gdpr() {
  return (
     <>
      <Head>
        <title>{`Zásady ochrany osobních údajů (GDPR) | ${SITE_NAME}`}</title>
        <meta name="description" content="Zásady zpracování osobních údajů a informace o ochraně soukromí." />
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Canonical + hreflang (konzistentně cs-CZ / sk-SK) */}
        <link rel="canonical" href={`${SITE_URL}/cs/dokumenty/gdpr/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/dokumenty/gdpr/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/gdpr/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/`} hrefLang="x-default" />
        {/* Open Graph */}
        <meta property="og:title" content={`Zásady ochrany osobních údajů (GDPR) | ${SITE_NAME}`} />
        <meta property="og:description" content="Zásady zpracování osobních údajů a informace o ochraně soukromí." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Informace o ochraně osobních údajů" />
        <meta property="og:url" content={`${SITE_URL}/cs/dokumenty/gdpr/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Zásady ochrany osobních údajů (GDPR) | ${SITE_NAME}`} />
        <meta name="twitter:description" content="Zásady zpracování osobních údajů a informace o ochraně soukromí." />
        <meta name="twitter:image" content={OG_IMAGE} />
        {/* Structured data – WebPage (+ volitelně props na úrovni Organization) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Zásady ochrany osobních údajů (GDPR)",
              "url": `${SITE_URL}/cs/dokumenty/gdpr/`,
              "inLanguage": "cs-CZ",
              "description": "Zásady zpracování osobních údajů a informace o ochraně soukromí."
            })
          }}
        />
      </Head>
      <section className={styles.dokument_section}>
        <div className={styles.dokument_wrapper}>
          <h1>Zásady ochrany osobních údajů</h1>
          <p>
            Tento dokument popisuje, jakým způsobem zpracovávám osobní údaje v souladu s nařízením 
            Evropského parlamentu a Rady (EU) 2016/679 (GDPR).
          </p>
          <h2>1. Správce údajů</h2>
          <div>
            <p><strong>Jméno:</strong> Tomáš Tippl</p>
            <p><strong>Adresa:</strong> Strnady 137, Jíloviště 252 02</p>
            <p><strong>IČO:</strong> 88520510</p>
            <p><strong>E-mail:</strong> <Link href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</Link></p>
          </div>
          <h2>2. Jaké údaje zpracovávám</h2>
          <p>Zpracovávám výhradně údaje, které uživatel dobrovolně vyplní do formuláře za účelem vytvoření a stažení životopisu. Jedná se zejména o:</p>
          <ul>
            <li>jméno a příjmení</li>
            <li>kontaktní údaje (e-mail, telefon, LinkedIn profil)</li>
            <li>pracovní zkušenosti, vzdělání, dovednosti, jazykové znalosti, ukončené kurzy a další údaje uvedené v životopisu</li>
            <li>vloženou fotografii (volitelně)</li>
            <li>IP adresu (pro technické účely)</li>
          </ul>
          <h2>3. Účel zpracování</h2>
          <p>Osobní údaje zpracovávám za účelem:</p>
          <ul>
            <li>vytvoření a stažení životopisu (CV)</li>
            <li>dočasné zpřístupnění životopisu ke zpětné úpravě po zaplacení</li>
            <li>automatického odstranění po 24 hodinách</li>
            <li>generování anonymních účtenek (bez jména)</li>
            <li>měření návštěvnosti a zlepšování webu (Google Analytics)</li>
          </ul>
          <h2>4. Kdo má přístup k údajům</h2>
          <p>
            K osobním údajům má přístup výhradně správce (já). Data nejsou poskytována žádným třetím osobám,
            kromě nezbytných technických poskytovatelů služeb:
          </p>
          <ul>
            <li>Supabase – databáze a úložiště</li>
            <li>Vercel – hosting a zpracování požadavků</li>
            <li>Comgate – platební brána (nepředávají se žádné osobní údaje)</li>
            <li>PDFendpoint – zpracování dokumentu</li>
            <li>ChatGPTApi – generování textů</li>
          </ul>
          <h2>5. Doba uchování údajů</h2>
          <p>
            Osobní údaje a související soubory (např. PDF) jsou automaticky mazány do 24 hodin od vytvoření.
            Nejsou uchovávány pro žádné další účely.
          </p>
          <h2>6. Vaše práva</h2>
          <p>Máte právo:</p>
          <ul>
            <li>požádat o přístup k osobním údajům</li>
            <li>požádat o opravu nebo výmaz údajů</li>
            <li>podat stížnost u ÚOOÚ (<Link href="https://www.uoou.cz">www.uoou.cz</Link>), pokud se domníváte, že došlo k porušení Vašich práv</li>
          </ul>
          <p>
            Úprava životopisu je možná po dobu 24 hodin od vytvoření přes jedinečný odkaz. Po uplynutí této lhůty
            jsou všechna data nenávratně smazána.
          </p>
          <h2>7. Cookies a analytika</h2>
          <p>
            Tento web používá soubory cookies za účelem zajištění základní funkčnosti, měření návštěvnosti a případně i marketingových účelů.
          </p>
          <h3>Typy cookies, které můžeme používat:</h3>
          <ul>
            <li><strong>Nezbytné cookies</strong> – slouží k zajištění správného fungování webu, např. pro uložení aktuální relace nebo jazykového nastavení.</li>
            <li><strong>Analytické cookies</strong> – pomáhají nám porozumět, jak návštěvníci používají náš web. Například pomocí Google Analytics.</li>
            <li><strong>Marketingové cookies</strong> – umožňují personalizaci obsahu nebo měření efektivity reklamních kampaní (např. Facebook Pixel, pokud je použit).</li>
          </ul>
          <h3>Jak cookies spravovat:</h3>
          <p>
            Při první návštěvě webu si uživatel může vybrat, zda přijme všechny cookies, nebo pouze nezbytné. Tento výběr lze kdykoli změnit pomocí odkazu „Nastavení cookies“ ve spodní části stránky (pokud je tato funkce aktivní).
          </p>
          <p>
            Uživatel může také spravovat nebo blokovat cookies ve svém prohlížeči. V takovém případě však může dojít k omezení funkčnosti některých částí webu.
          </p>
          <h3>Další informace:</h3>
          <p>
            Údaje získané prostřednictvím cookies mohou být zpracovávány společnostmi třetích stran, zejména společností Google Inc., v souladu s jejich vlastními zásadami ochrany soukromí.
          </p>
          <h2>8. Automatické rozhodování a profilování</h2>
          <p>
            Na základě Vámi poskytnutých údajů nejsou prováděna žádná rozhodnutí s právními účinky. Web slouží pouze ke generování CV.
          </p>
          <h2>9. Změny zásad</h2>
          <p>
            Tyto zásady mohou být průběžně aktualizovány.<br></br> Datum poslední aktualizace: <strong>26. 7. 2025</strong>.
          </p>
        </div>
      </section>
    </>
  );
}
