import Head from "next/head";
import {
  SITE_URL,
  SITE_URL_SK,
  PRICE_CV_SK,
  SITE_MAIL_SK,
  SITE_NAME_SK,
  FAVICON_URL_32,
  FAVICON_URL_192,
  APPLE_TOUCH_ICON_URL,
  OG_IMAGE_SK,
  SELLER_COMPANY,
  SELLER_ADDRESS,
  SELLER_ADDRESS_CITY,
  SELLER_IC
} from "@/config/site";
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
          content="Obchodné podmienky používania služby a nákupu produktov, vrátane platobných a reklamačných pravidiel."
        />
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        <link rel="canonical" href={`${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/dokumenty/obchodni-podminky/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`} hrefLang="x-default" />
        <meta property="og:title" content={`Obchodné podmienky | ${SITE_NAME_SK}`} />
        <meta
          property="og:description"
          content="Obchodné podmienky používania služby a nákupu produktov, vrátane platobných a reklamačných pravidiel."
        />
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Informácie o obchodných podmienkach" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Obchodné podmienky | ${SITE_NAME_SK}`} />
        <meta
          name="twitter:description"
          content="Obchodné podmienky používania služby a nákupu produktov, vrátane platobných a reklamačných pravidiel."
        />
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Obchodné podmienky",
              url: `${SITE_URL_SK}/sk/dokumenty/obchodni-podminky/`,
              inLanguage: "sk-SK",
              description:
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
            Tieto obchodné podmienky upravujú vzťahy medzi poskytovateľom služby a používateľom
            vznikajúce pri kúpe digitálneho obsahu prostredníctvom webových stránok{" "}
            <Link href={SITE_URL_SK}>{SITE_URL_SK}</Link>.
          </p>
          <p>
            Tieto obchodné podmienky sú určené najmä pre spotrebiteľov. Práva spotrebiteľa
            vyplývajúce zo všeobecne záväzných právnych predpisov nie sú týmito podmienkami dotknuté.
          </p>

          <h2>2. Identifikácia poskytovateľa služby</h2>
          <div>
            <p><strong>Meno:</strong> {SELLER_COMPANY}</p>
            <p><strong>Adresa:</strong> {SELLER_ADDRESS}, {SELLER_ADDRESS_CITY}</p>
            <p><strong>IČO:</strong> {SELLER_IC}</p>
            <p><strong>Kontaktný e-mail:</strong> <Link href={`mailto:${SITE_MAIL_SK}`}>{SITE_MAIL_SK}</Link></p>
          </div>

          <h2>3. Popis služby</h2>
          <p>
            Poskytovateľ ponúka používateľom vytvorenie digitálneho životopisu (CV) vo formáte PDF.
            Služba je poskytovaná na základe údajov, ktoré používateľ vyplní do online formulára.
            Pred odoslaním platby má používateľ možnosť skontrolovať a upraviť zadané údaje.
          </p>
          <p>
            Používateľ vyplní online formulár, potvrdí súhlas s týmito obchodnými podmienkami a
            pri digitálnom obsahu dodávanom bezprostredne po zaplatení aj výslovný súhlas
            so začatím plnenia pred uplynutím lehoty na odstúpenie od zmluvy. Zmluva je uzatváraná
            v slovenskom jazyku prostredníctvom webového rozhrania a je uzavretá okamihom
            úspešného potvrdenia platby.
          </p>
          <p>
            Po úspešnej úhrade používateľ okamžite získa:
          </p>
          <ul>
            <li>odkaz s možnosťou upravovať svoje CV počas 24 hodín,</li>
            <li>možnosť stiahnuť vytvorený životopis vo formáte PDF,</li>
            <li>účtenku vo formáte PDF.</li>
          </ul>
          <p>
            Služba spočíva v jednorazovom sprístupnení digitálneho obsahu. Digitálny obsah je
            určený pre bežné zariadenia a softvér schopné zobraziť súbor PDF a používať moderné
            webové rozhranie.
          </p>

          <h2>4. Doprava a platba</h2>
          <p>
            Keďže ide o digitálny obsah, neposkytuje sa žiadna fyzická doprava.
            Vytvorený životopis si používateľ stiahne priamo z webovej stránky po zaplatení.
          </p>
          <p>
            Poskytovateľ používa na spracovanie platieb zabezpečenú platobnú bránu{" "}
            <strong>Comgate, a.s.</strong>. Viac informácií o poskytovateľovi je dostupných na adrese:{" "}
            <Link href="https://www.comgate.cz/cz/platebni-brana" target="_blank" rel="noopener noreferrer">
              https://www.comgate.cz/cz/platebni-brana
            </Link>.
          </p>
          <p>
            Podporované platobné metódy:
          </p>
          <ul>
            <li>
              <strong>Platba kartou</strong> – platba prebieha online cez zabezpečené rozhranie,
              po zadaní údajov z karty je suma okamžite stiahnutá a platba potvrdená (
              <Link href="https://help.comgate.cz/v1/docs/cs/platby-kartou" target="_blank" rel="noopener noreferrer">
                viac informácií
              </Link>
              ).
            </li>
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
            Cena za vytvorenie a stiahnutie životopisu je <strong>{PRICE_CV_SK} €</strong>.
            Poskytovateľ nie je platiteľom DPH. Uvedená cena je konečná a zahŕňa všetky poplatky
            spojené s poskytnutím služby.
          </p>
          <p>
            Platba prebieha výhradne prostredníctvom zabezpečenej platobnej brány Comgate.
          </p>

          <h2>6. Dodanie služby</h2>
          <p>
            Digitálny obsah (PDF životopis a účtenka) je používateľovi dodaný okamžite po úhrade
            prostredníctvom webového rozhrania. Dodanie je splnené okamihom, keď je používateľovi
            digitálny obsah sprístupnený na stiahnutie alebo ďalšie použitie.
          </p>
          <p>
            Ak dôjde k technickému problému s dodaním obsahu alebo sprístupnením služby,
            používateľ kontaktuje poskytovateľa na e-mail{" "}
            <Link href={`mailto:${SITE_MAIL_SK}`}>{SITE_MAIL_SK}</Link>. Poskytovateľ zabezpečí nápravu
            bez zbytočného odkladu, spravidla najneskôr do 48 hodín, ak tomu nebránia okolnosti
            mimo jeho kontroly.
          </p>

          <h2>7. Reklamácie</h2>
          <p>
            Používateľ má právo uplatniť reklamáciu, ak má poskytnutý digitálny obsah alebo služba
            vadu, najmä ak nie sú sprístupnené riadne, nezodpovedajú opisu, objednávke,
            zvolenej šablóne alebo obvyklým vlastnostiam digitálneho obsahu tohto druhu.
          </p>
          <p>
            Poskytovateľ zodpovedá za to, že digitálny obsah je pri sprístupnení bez vád a že
            zodpovedá dohodnutým aj obvyklým vlastnostiam. Tým nie sú dotknuté zákonné práva
            spotrebiteľa zo zodpovednosti za vady.
          </p>
          <p>
            Reklamáciu je možné uplatniť e-mailom na adrese{" "}
            <Link href={`mailto:${SITE_MAIL_SK}`}>{SITE_MAIL_SK}</Link>. V reklamácii je vhodné uviesť
            identifikáciu objednávky alebo platby, opis vady a kontaktný údaj na vybavenie reklamácie.
          </p>
          <p>
            Poskytovateľ reklamáciu posúdi a vybaví bez zbytočného odkladu, najneskôr v lehote
            primeranej povahe digitálneho obsahu a účelu, na ktorý bol obstaraný. Ak je reklamácia
            oprávnená, poskytovateľ podľa povahy vady zabezpečí nápravu, najmä odstránenie vady,
            nové sprístupnenie digitálneho obsahu, primeranú zľavu alebo vrátenie ceny služby.
          </p>
          <p>
            Poskytovateľ nezodpovedá za vady spôsobené výlučne nesprávnymi, neúplnými alebo
            nepravdivými údajmi vloženými používateľom ani za vady vzniknuté používaním služby
            v rozpore s uvedenými technickými požiadavkami.
          </p>

          <h2>8. Odstúpenie od zmluvy (14-dňová lehota)</h2>
          <p>
            Keďže ide o digitálny obsah, ktorý je dodávaný bezprostredne po zaplatení,
            používateľ pred vykonaním platby výslovne súhlasí so začatím plnenia pred uplynutím
            14-dňovej lehoty na odstúpenie od zmluvy a berie na vedomie, že po úplnom dodaní
            digitálneho obsahu tým stráca právo odstúpiť od zmluvy v lehote 14 dní, v súlade
            s príslušnými právnymi predpismi na ochranu spotrebiteľa vrátane zákona č. 108/2024 Z. z.
            v znení neskorších predpisov, ak sa na spotrebiteľa takéto kogentné ustanovenia vzťahujú.
          </p>
          <p>
            Tento súhlas je používateľ povinný výslovne potvrdiť zaškrtnutím príslušného poľa
            (checkboxu) pred vykonaním platby.
          </p>

          <h2>9. Autorské práva</h2>
          <p>
            Používateľ má právo voľne používať vytvorený životopis pre svoje vlastné potreby.
            Poskytovateľ si neuplatňuje autorské práva k obsahu, ktorý používateľ do životopisu
            vloží. Používateľ zodpovedá za to, že vložený obsah neporušuje práva tretích osôb.
          </p>

          <h2>10. Zodpovednosť poskytovateľa</h2>
          <p>
            Poskytovateľ nezodpovedá za obsah vložený používateľom, jeho správnosť,
            úplnosť ani pravdivosť. Používateľ zodpovedá za to, že vložený obsah neporušuje práva
            tretích osôb ani právne predpisy.
          </p>
          <p>
            Tým nie je dotknutá zodpovednosť poskytovateľa za vady digitálneho obsahu alebo služby
            v rozsahu stanovenom právnymi predpismi.
          </p>

          <h2>11. Technické požiadavky</h2>
          <p>
            Na používanie služby potrebuje používateľ pripojenie na internet a aktuálny webový
            prehliadač podporujúci technológie JavaScript (React, Next.js), moderné CSS
            (napr. CSS Grid, SCSS) a ďalšie moderné webové štandardy. Služba je optimalizovaná pre:
          </p>
          <ul>
            <li>prehliadače: Chrome, Firefox, Safari, Edge (najnovšie 2 hlavné verzie),</li>
            <li>operačné systémy: Android (verzia 10 a vyššia), iOS (verzia 13 a vyššia), Windows 10 a vyššia, macOS 10.15 a vyššia,</li>
            <li>zariadenia a softvér schopné otvoriť alebo zobraziť súbor PDF.</li>
          </ul>
          <p>
            Poskytovateľ negarantuje bezproblémový chod na starších alebo nepodporovaných verziách
            systémov a prehliadačov ani pri zásahu do bežného fungovania webu zo strany používateľa.
          </p>

          <h2>12. Záverečné ustanovenia</h2>
          <p>
            Tieto obchodné podmienky a zmluvný vzťah medzi poskytovateľom a používateľom
            sa riadia právnym poriadkom Českej republiky.
          </p>
          <p>
            Ak je však používateľom spotrebiteľ s obvyklým pobytom v Slovenskej republike,
            nie sú tým dotknuté kogentné ustanovenia právnych predpisov Slovenskej republiky
            na ochranu spotrebiteľa, ktoré by sa uplatnili aj bez tejto voľby práva.
          </p>
          <p>
            Všetky prípadné spory budú prednostne riešené zmierom. Spotrebiteľ má právo obrátiť sa
            na subjekt mimosúdneho riešenia spotrebiteľských sporov. V prípade cezhraničného sporu
            spotrebiteľa s poskytovateľom so sídlom v Českej republike je príslušným subjektom najmä
            Česká obchodní inspekce, Štěpánská 567/15, 120 00 Praha 2, e-mail:{" "}
            <Link href="mailto:adr@coi.cz">adr@coi.cz</Link>, web:{" "}
            <Link href="https://www.adr.coi.cz" target="_blank" rel="noopener noreferrer">
              www.adr.coi.cz
            </Link>.
          </p>
          <p>
            Návrh na mimosúdne riešenie sporu je možné podať aj v slovenskom jazyku.
          </p>
          <p>
            Poskytovateľ si vyhradzuje právo kedykoľvek tieto podmienky zmeniť. Nové podmienky sú
            účinné okamihom zverejnenia na webových stránkach{" "}
            <Link href={SITE_URL_SK}>{SITE_URL_SK}</Link>.
          </p>
          <p><strong>Dátum poslednej aktualizácie: 17. 3. 2026</strong></p>
        </div>
      </section>
    </>
  );
}
