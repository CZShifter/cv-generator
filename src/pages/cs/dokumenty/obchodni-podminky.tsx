import Head from "next/head";
import {
  SITE_URL,
  SITE_URL_SK,
  PRICE_CV,
  SITE_MAIL,
  SITE_NAME,
  FAVICON_URL_32,
  FAVICON_URL_192,
  APPLE_TOUCH_ICON_URL,
  OG_IMAGE,
  SELLER_COMPANY,
  SELLER_ADDRESS,
  SELLER_ADDRESS_CITY,
  SELLER_IC
} from "@/config/site";
import React from "react";
import styles from "@/scss/Dokumenty.module.scss";
import Link from 'next/link'

export default function ObchodniPodminky() {
  return (
    <>
      <Head>
        <title>{`Obchodní podmínky | ${SITE_NAME}`}</title>
        <meta name="description" content="Obchodní podmínky používání služby a nákupu produktů, včetně platebních a reklamačních pravidel." />
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        <link rel="canonical" href={`${SITE_URL}/cs/dokumenty/obchodni-podminky/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/dokumenty/obchodni-podminky/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/cs/dokumenty/obchodni-podminky/`} hrefLang="x-default" />
        <meta property="og:title" content={`Obchodní podmínky | ${SITE_NAME}`} />
        <meta property="og:description" content="Obchodní podmínky používání služby a nákupu produktů, včetně platebních a reklamačních pravidel." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Informace o obchodních podmínkách" />
        <meta property="og:url" content={`${SITE_URL}/cs/dokumenty/obchodni-podminky/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Obchodní podmínky | ${SITE_NAME}`} />
        <meta name="twitter:description" content="Obchodní podmínky používání služby a nákupu produktů, včetně platebních a reklamačních pravidel." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Obchodní podmínky",
              url: `${SITE_URL}/cs/dokumenty/obchodni-podminky/`,
              inLanguage: "cs-CZ",
              description: "Obchodní podmínky používání služby a nákupu produktů, včetně platebních a reklamačních pravidel."
            })
          }}
        />
      </Head>
      <section className={styles.dokument_section}>
        <div className={styles.dokument_wrapper}>
          <h1>Obchodní podmínky služby {SITE_NAME}</h1>

          <h2>1. Úvodní ustanovení</h2>
          <p>
            Tyto obchodní podmínky upravují vztahy mezi poskytovatelem služby a uživatelem
            vznikající při nákupu digitálního obsahu prostřednictvím webových stránek{" "}
            <Link href={SITE_URL}>{SITE_URL}</Link>.
          </p>
          <p>
            Tyto obchodní podmínky jsou určeny zejména pro spotřebitele. Práva spotřebitele
            vyplývající z obecně závazných právních předpisů nejsou těmito podmínkami dotčena.
          </p>

          <h2>2. Identifikace poskytovatele služby</h2>
          <div>
            <p><strong>Jméno:</strong> {SELLER_COMPANY}</p>
            <p><strong>Adresa:</strong> {SELLER_ADDRESS}, {SELLER_ADDRESS_CITY}</p>
            <p><strong>IČO:</strong> {SELLER_IC}</p>
            <p><strong>Kontaktní e-mail:</strong> <Link href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</Link></p>
          </div>

          <h2>3. Popis služby</h2>
          <p>
            Poskytovatel nabízí uživatelům vytvoření digitálního životopisu (CV) ve formátu PDF.
            Služba je poskytována na základě údajů, které uživatel vyplní do online formuláře.
            Před odesláním platby má uživatel možnost zkontrolovat a upravit zadané údaje.
          </p>
          <p>
            Uživatel vyplní online formulář, potvrdí souhlas s těmito obchodními podmínkami a
            u digitálního obsahu dodávaného bezprostředně po zaplacení také výslovný souhlas
            se zahájením plnění před uplynutím lhůty pro odstoupení od smlouvy. Smlouva je
            uzavírána v českém jazyce prostřednictvím webového rozhraní a je uzavřena okamžikem
            úspěšného potvrzení platby.
          </p>
          <p>
            Po úspěšné platbě uživatel ihned získává:
          </p>
          <ul>
            <li>odkaz s možností editovat své CV po dobu 24 hodin,</li>
            <li>možnost stáhnout vytvořený životopis ve formátu PDF,</li>
            <li>účtenku ve formátu PDF.</li>
          </ul>
          <p>
            Služba spočívá v jednorázovém zpřístupnění digitálního obsahu. Digitální obsah je
            určen pro běžná zařízení a software schopné zobrazit soubor PDF a používat moderní
            webové rozhraní.
          </p>

          <h2>4. Doprava a platba</h2>
          <p>
            Jelikož se jedná o digitální obsah, není poskytována žádná fyzická doprava.
            Vytvořený životopis si uživatel stáhne přímo z webových stránek po zaplacení.
          </p>
          <p>
            Poskytovatel používá pro zpracování plateb zabezpečenou platební bránu{" "}
            <strong>Comgate, a.s.</strong> Více informací o poskytovateli je k dispozici na
            adrese:{" "}
            <Link href="https://www.comgate.cz/cz/platebni-brana" target="_blank" rel="noopener noreferrer">
              https://www.comgate.cz/cz/platebni-brana
            </Link>.
          </p>
          <p>
            Podporované platební metody:
          </p>
          <ul>
            <li>
              <strong>Platba kartou</strong> – platba probíhá online přes zabezpečené rozhraní,
              po zadání údajů z karty je částka okamžitě stržena a platba potvrzena (
              <Link href="https://help.comgate.cz/v1/docs/cs/platby-kartou" target="_blank" rel="noopener noreferrer">
                více informací
              </Link>
              ).
            </li>
            <li><strong>Google Pay</strong> – rychlá platba prostřednictvím účtu Google, bez nutnosti zadávat údaje z karty.</li>
            <li><strong>Apple Pay</strong> – rychlá platba prostřednictvím účtu Apple, bez nutnosti zadávat údaje z karty.</li>
          </ul>
          <p>
            Kontaktní údaje na poskytovatele platební brány pro případ reklamací nebo dotazů k platbám:
          </p>
          <address>
            Comgate, a.s.<br />
            Gočárova třída 1754/48b, Hradec Králové<br />
            E-mail: <Link href="mailto:platby-podpora@comgate.cz">platby-podpora@comgate.cz</Link><br />
            Tel: +420 228 224 267
          </address>

          <h2>5. Cena služby a platba</h2>
          <p>
            Cena za vytvoření a stažení životopisu je <strong>{PRICE_CV} Kč</strong>.
            Poskytovatel není plátce DPH. Uvedená cena je konečná a zahrnuje veškeré poplatky
            spojené s poskytnutím služby.
          </p>
          <p>
            Platba probíhá výhradně přes zabezpečenou platební bránu Comgate.
          </p>

          <h2>6. Dodání služby</h2>
          <p>
            Digitální obsah (PDF životopis a účtenka) je dodán uživateli ihned po zaplacení
            prostřednictvím webového rozhraní. Dodání je splněno okamžikem, kdy je uživateli
            digitální obsah zpřístupněn ke stažení nebo k dalšímu použití.
          </p>
          <p>
            Pokud dojde k technickému problému s dodáním obsahu nebo zpřístupněním služby,
            uživatel kontaktuje poskytovatele na e-mail{" "}
            <Link href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</Link>. Poskytovatel zajistí nápravu
            bez zbytečného odkladu, zpravidla nejpozději do 48 hodin, pokud tomu nebrání okolnosti
            mimo jeho kontrolu.
          </p>

          <h2>7. Reklamace</h2>
          <p>
            Uživatel má právo uplatnit reklamaci, pokud má poskytnutý digitální obsah nebo služba
            vadu, zejména pokud nejsou zpřístupněny řádně, neodpovídají popisu, objednávce,
            zvolené šabloně nebo obvyklým vlastnostem digitálního obsahu tohoto druhu.
          </p>
          <p>
            Poskytovatel odpovídá za to, že digitální obsah je při zpřístupnění bez vad a že
            odpovídá sjednaným i obvyklým vlastnostem. Tím nejsou dotčena zákonná práva
            spotřebitele z vadného plnění.
          </p>
          <p>
            Reklamaci lze uplatnit e-mailem na adrese{" "}
            <Link href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</Link>. V reklamaci je vhodné uvést
            identifikaci objednávky nebo platby, popis vady a kontaktní údaj pro vyřízení reklamace.
          </p>
          <p>
            Poskytovatel reklamaci posoudí a vyřídí bez zbytečného odkladu, nejpozději ve lhůtě
            přiměřené povaze digitálního obsahu a účelu, pro který byl pořízen. Je-li reklamace
            oprávněná, poskytovatel podle povahy vady zajistí nápravu, zejména odstranění vady,
            nové zpřístupnění digitálního obsahu, přiměřenou slevu nebo vrácení ceny služby.
          </p>
          <p>
            Poskytovatel neodpovídá za vady způsobené výhradně nesprávnými, neúplnými nebo
            nepravdivými údaji vloženými uživatelem ani za vady vzniklé používáním služby
            v rozporu s uvedenými technickými požadavky.
          </p>

          <h2>8. Odstoupení od smlouvy (14denní lhůta)</h2>
          <p>
            Jelikož se jedná o digitální obsah, který je dodáván bezprostředně po zaplacení,
            uživatel před provedením platby výslovně souhlasí se zahájením plnění před uplynutím
            14denní lhůty pro odstoupení od smlouvy a bere na vědomí, že po úplném dodání
            digitálního obsahu tím ztrácí právo od smlouvy odstoupit ve lhůtě 14 dnů,
            v souladu s § 1837 písm. l) občanského zákoníku.
          </p>
          <p>
            Tento souhlas je uživatel povinen výslovně potvrdit zaškrtnutím příslušného pole
            (checkboxu) před provedením platby.
          </p>

          <h2>9. Autorská práva</h2>
          <p>
            Uživatel má právo volně používat vytvořený životopis pro své vlastní potřeby.
            Poskytovatel si nečiní nárok na autorská práva k obsahu, který do životopisu
            vloží uživatel. Uživatel odpovídá za to, že vložený obsah neporušuje práva třetích osob.
          </p>

          <h2>10. Odpovědnost poskytovatele</h2>
          <p>
            Poskytovatel nenese odpovědnost za obsah vložený uživatelem, jeho správnost,
            úplnost ani pravdivost. Uživatel odpovídá za to, že vložený obsah neporušuje práva
            třetích osob ani právní předpisy.
          </p>
          <p>
            Tím není dotčena odpovědnost poskytovatele za vady digitálního obsahu nebo služby
            v rozsahu stanoveném právními předpisy.
          </p>

          <h2>11. Technické požadavky</h2>
          <p>
            Pro použití služby potřebuje uživatel připojení k internetu a aktuální webový
            prohlížeč podporující technologie JavaScript (React, Next.js), moderní CSS
            (např. CSS Grid, SCSS) a další moderní webové standardy. Služba je optimalizována pro:
          </p>
          <ul>
            <li>prohlížeče: Chrome, Firefox, Safari, Edge (nejnovější 2 hlavní verze),</li>
            <li>operační systémy: Android (verze 10 a vyšší), iOS (verze 13 a vyšší), Windows 10 a vyšší, macOS 10.15 a vyšší,</li>
            <li>zařízení a software schopné otevřít nebo zobrazit soubor PDF.</li>
          </ul>
          <p>
            Poskytovatel negarantuje bezproblémový chod na starších nebo nepodporovaných verzích
            systémů a prohlížečů ani při zásahu do běžného fungování webu ze strany uživatele.
          </p>

          <h2>12. Závěrečná ustanovení</h2>
          <p>
            Tyto obchodní podmínky se řídí právním řádem České republiky. Veškeré případné
            spory budou přednostně řešeny smírnou cestou. Pokud nedojde k dohodě, spor bude
            řešen v souladu s platnými zákony České republiky.
          </p>
          <p>
            Spotřebitel má právo na mimosoudní řešení spotřebitelského sporu. Subjektem
            mimosoudního řešení spotřebitelských sporů je Česká obchodní inspekce,
            Štěpánská 567/15, 120 00 Praha 2, e-mail:{" "}
            <Link href="mailto:adr@coi.cz">adr@coi.cz</Link>, web:{" "}
            <Link href="https://www.adr.coi.cz" target="_blank" rel="noopener noreferrer">
              www.adr.coi.cz
            </Link>.
          </p>
          <p>
            Poskytovatel si vyhrazuje právo kdykoliv tyto podmínky změnit. Nové podmínky jsou
            účinné okamžikem zveřejnění na webových stránkách{" "}
            <Link href={SITE_URL}>{SITE_URL}</Link>.
          </p>
          <p><strong>Datum poslední aktualizace: 17. 3. 2026</strong></p>
        </div>
      </section>
    </>
  );
}
