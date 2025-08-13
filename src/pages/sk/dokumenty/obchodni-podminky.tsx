import Head from "next/head";
import { SITE_URL, SITE_URL_SK, PRICE_CV_SK, SITE_MAIL, SITE_NAME_SK, FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL, OG_IMAGE_SK } from "@/config/site";
import React from "react";
import styles from "@/scss/Dokumenty.module.scss";
import Link from 'next/link';
export default function ObchodniPodminky() {
  return (
    <>
      <Head>
        <title>{`Obchodné podmienky | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content="Obchodné podmienky používania služby a nákupu produktov, vrátane platobných a reklamačných pravidiel."/>
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Canonical + hreflang */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/dokumenty/obchodni-podminky/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`} hrefLang="x-default" />
        {/* Open Graph */}
        <meta property="og:title" content={`Obchodné podmienky | ${SITE_NAME_SK}`} />
        <meta
          property="og:description"
          content="Obchodné podmienky používania služby a nákupu produktov, vrátane platobných a reklamačných pravidiel."/>
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Informácie o obchodných podmienkach" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Obchodné podmienky | ${SITE_NAME_SK}`} />
        <meta
          name="twitter:description"
          content="Obchodné podmienky používania služby a nákupu produktov, vrátane platobných a reklamačných pravidiel."/>
        <meta name="twitter:image" content={OG_IMAGE_SK} />     
        {/* Structured data – WebPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Obchodné podmienky",
              "url": `${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`,
              "inLanguage": "sk-SK",
              "description":
                "Obchodné podmienky používania služby a nákupu produktov, vrátane platobných a reklamačných pravidiel."
            })
          }}
        />
      </Head>
      <section className={styles.dokument_section}>
        <div className={styles.dokument_wrapper}>
          <h1>Obchodné podmienky služby {SITE_NAME_SK}</h1>

          <h2>1. Úvodné ustanovenia</h2>
          <p>
            Tieto obchodné podmienky upravujú vzťahy medzi poskytovateľom služby a používateľom vznikajúce pri kúpe digitálneho obsahu prostredníctvom webových stránok <Link href='/sk'>{SITE_URL_SK}</Link>.
          </p>

          <h2>2. Identifikácia poskytovateľa služby</h2>
          <div>
            <p><strong>Tomáš Tippl</strong></p>
            <p><strong>Adresa:</strong> Strnady 137, Jíloviště 252 02</p>
            <p><strong>IČO:</strong> 88520510</p>
            <p><strong>Kontaktný e-mail:</strong> <Link href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</Link></p>
          </div>

          <h2>3. Popis služby</h2>
          <p>
            Poskytovateľ ponúka používateľom vytvorenie digitálneho životopisu (CV) vo formáte PDF. Používateľ vyplní online formulár, potvrdí súhlas s týmito podmienkami a uhradí cenu za službu. Platba prebieha prostredníctvom platobnej brány Comgate (platobná karta, Google Pay alebo Apple Pay).
          </p>
          <p>
            Po úspešnej úhrade používateľ okamžite získa:
          </p>
          <ul>
            <li>Odkaz s možnosťou upravovať svoje CV počas 24 hodín.</li>
            <li>Možnosť stiahnuť vytvorený životopis vo formáte PDF.</li>
            <li>Účtenku vo formáte PDF (bez uvedenia mena, iba s číslom dokladu).</li>
          </ul>

          <h2>4. Doprava a platba</h2>
          <p>
            Keďže ide o digitálny obsah, neposkytuje sa žiadna fyzická doprava. Vytvorený životopis si používateľ stiahne priamo z webovej stránky po zaplatení.
          </p>
          <p>
            Poskytovateľ používa na spracovanie platieb zabezpečenú platobnú bránu <strong>Comgate, a.s.</strong>. Viac informácií o poskytovateľovi je dostupných na adrese: <Link href="https://www.comgate.cz/cz/platebni-brana" target="_blank" rel="noopener noreferrer">https://www.comgate.cz/cz/platebni-brana</Link>.
          </p>
          <p>
            Podporované platobné metódy:
          </p>
          <ul>
            <li><strong>Platba kartou</strong> – platba prebieha online cez zabezpečené rozhranie, po zadaní údajov z karty je suma okamžite strhnutá a platba potvrdená (<Link href="https://help.comgate.cz/v1/docs/cs/platby-kartou" target="_blank" rel="noopener noreferrer">viac informácií</Link>).</li>
            <li><strong>Google Pay</strong> – rýchla platba prostredníctvom účtu Google, bez nutnosti zadávať údaje z karty.</li>
            <li><strong>Apple Pay</strong> – rýchla platba prostredníctvom účtu Apple, bez nutnosti zadávať údaje z karty.</li>
          </ul>
          <p>
            Kontaktné údaje na poskytovateľa platobnej brány pre prípad reklamácií alebo otázok k platbám:
          </p>
          <address>
            Comgate, a.s.<br />
            Gočárova třída 1754/48b, Hradec Králové<br />
            E-mail: <Link href="mailto:platby-podpora@comgate.cz">platby-podpora@comgate.cz</Link><br />
            Tel: +420 228 224 267
          </address>

          <h2>5. Cena služby a platba</h2>
          <p>
            Cena za vytvorenie a stiahnutie životopisu je <strong>{PRICE_CV_SK} €</strong>. Poskytovateľ nie je platiteľom DPH. Uvedená cena je konečná, bez ďalších poplatkov.
          </p>
          <p>
            Platba prebieha výhradne prostredníctvom zabezpečenej platobnej brány Comgate.
          </p>

          <h2>6. Dodanie služby</h2>
          <p>
            Digitálny obsah (PDF životopis a účtenka) je používateľovi sprístupnený okamžite po úhrade prostredníctvom webového rozhrania. Ak dôjde k technickému problému s dodaním obsahu, používateľ kontaktuje poskytovateľa na e-mail <Link href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</Link>. Poskytovateľ problém vyrieši najneskôr do 48 hodín.
          </p>

          <h2>7. Reklamácie</h2>
          <p>
            Reklamácia služby je možná len v prípade, ak dôjde k technickej chybe alebo k chybne vygenerovanému PDF súboru. Reklamáciu je potrebné zaslať e-mailom na adresu <Link href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</Link>. Poskytovateľ reklamáciu posúdi a vybaví najneskôr do 48 hodín od prijatia.
          </p>

          <h2>8. Odstúpenie od zmluvy (14-dňová lehota)</h2>
          <p>
            Keďže ide o digitálny obsah poskytovaný okamžite po zaplatení, používateľ výslovne súhlasí s tým, že okamihom dodania digitálneho obsahu stráca právo odstúpiť od zmluvy v lehote 14 dní od jej uzavretia, v súlade s § 7 ods. 6 písm. l) zákona č. 102/2014 Z. z. o ochrane spotrebiteľa pri predaji tovaru alebo poskytovaní služieb na diaľku.
          </p>
          <p>
            Tento súhlas je používateľ povinný výslovne potvrdiť zaškrtnutím príslušného poľa (checkboxu) pred vykonaním platby.
          </p>

          <h2>9. Autorské práva</h2>
          <p>
            Používateľ má právo voľne používať vytvorený životopis. Poskytovateľ si neuplatňuje autorské práva k obsahu, ktorý používateľ do životopisu vloží, a nezodpovedá za správnosť alebo pravdivosť údajov uvedených používateľom.
          </p>

          <h2>10. Zodpovednosť poskytovateľa</h2>
          <p>
            Poskytovateľ nezodpovedá za obsah vložený používateľom, jeho správnosť ani pravdivosť. Používateľ zodpovedá za to, že vložený obsah neporušuje práva tretích osôb a právne predpisy.
          </p>

          <h2>11. Technické požiadavky</h2>
          <p>
            Na používanie služby potrebuje používateľ pripojenie na internet a aktuálny webový prehliadač podporujúci technológie JavaScript (React, Next.js), moderné CSS (napr. CSS Grid, SCSS) a ďalšie moderné webové štandardy. Služba je optimalizovaná pre:
          </p>
          <ul>
            <li>Prehliadače: Chrome, Firefox, Safari, Edge (najnovšie 2 hlavné verzie)</li>
            <li>Operačné systémy: Android (verzia 10 a vyššia), iOS (verzia 13 a vyššia), Windows 10 a vyššia, macOS 10.15 a vyššia</li>
          </ul>
          <p>
            Poskytovateľ negarantuje bezproblémový chod na starších alebo nepodporovaných verziách systémov a prehliadačov.
          </p>

          <h2>12. Záverečné ustanovenia</h2>
          <p>
            Tieto obchodné podmienky sa riadia právnym poriadkom Slovenskej republiky. Všetky prípadné spory budú prednostne riešené zmierom. Ak nedôjde k dohode, spor bude riešený v súlade s platnými zákonmi SR.
          </p>
          <p>
            Poskytovateľ si vyhradzuje právo kedykoľvek tieto podmienky zmeniť. Nové podmienky sú účinné okamihom zverejnenia na webových stránkach <Link href='/sk'>{SITE_URL_SK}</Link>.
          </p>
          <p><strong>Dátum poslednej aktualizácie: 26. 7. 2025</strong></p>
        </div>
      </section>
    </>
  );
}
