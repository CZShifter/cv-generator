import Head from "next/head";
import { SITE_URL, SITE_MAIL, SITE_NAME } from "@/config/site";
import React from "react";
import styles from "@/scss/Dokumenty.module.scss";
import Link from 'next/link'
export default function ObchodniPodminky() {
  return (
    <>
      <Head>
        <title>{`Obchodní podmínky | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
      <section className={styles.dokument_section}>
        <div className={styles.dokument_wrapper}>
          <h1>Obchodní podmínky služby {SITE_NAME}</h1>
          <h2>1. Úvodní ustanovení</h2>
          <p>
            Tyto obchodní podmínky upravují vztahy mezi poskytovatelem služby a uživatelem vznikající při nákupu digitálního obsahu prostřednictvím webových stránek <Link href='/cs'>{SITE_URL}</Link>.
          </p>
          <h2>2. Identifikace poskytovatele služby</h2>
          <div>
            <p><strong>Tomáš Tippl</strong></p>
            <p><strong>Adresa:</strong> Strnady 137, Jíloviště 252 02</p>
            <p><strong>IČO:</strong> 88520510</p>
            <p><strong>Kontaktní e-mail:</strong> <a href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</a></p>
          </div>
          <h2>3. Popis služby</h2>
          <p>
            Poskytovatel nabízí uživatelům vytvoření digitálního životopisu (CV) ve formátu PDF. Uživatel vyplní online formulář, potvrdí souhlas s těmito podmínkami a zaplatí částku za službu. Platba probíhá přes platební bránu Comgate (platební karta, Google Pay nebo Apple Pay).
          </p>
          <p>
            Po úspěšné platbě uživatel ihned získává:
          </p>
          <ul>
            <li>Odkaz s možností editovat své CV po dobu 24 hodin.</li>
            <li>Možnost stáhnout vytvořený životopis ve formátu PDF.</li>
            <li>Účtenku ve formátu PDF (bez uvedení jména, pouze s číslem dokladu).</li>
          </ul>
          <h2>4. Cena služby a platba</h2>
          <p>
            Cena za vytvoření a stažení životopisu je <strong>89 Kč</strong>. Poskytovatel není plátce DPH. Uvedená cena je konečná, bez dalších poplatků.
          </p>
          <p>
            Platba probíhá výhradně přes zabezpečenou platební bránu Comgate.
          </p>
          <h2>5. Dodání služby</h2>
          <p>
            Digitální obsah (PDF životopis a účtenka) je dodán uživateli ihned po zaplacení prostřednictvím webového rozhraní. Pokud dojde k technickému problému s dodáním obsahu, uživatel kontaktuje poskytovatele na e-mail <a href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</a>, poskytovatel vyřeší problém nejpozději do 48 hodin.
          </p>
          <h2>6. Reklamace</h2>
          <p>
            Reklamace služby je možná pouze v případě, že dojde k technické chybě nebo špatně vygenerovanému PDF souboru. Reklamaci je třeba zaslat e-mailem na adresu <a href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</a>. Poskytovatel reklamaci posoudí a vyřídí nejpozději do 48 hodin od přijetí.
          </p>
          <h2>7. Odstoupení od smlouvy (14denní lhůta)</h2>
          <p>
            Jelikož se jedná o digitální obsah poskytovaný okamžitě po zaplacení, uživatel výslovně souhlasí s tím, že okamžikem dodání digitálního obsahu ztrácí právo odstoupit od smlouvy do 14 dnů od uzavření smlouvy, v souladu s ( § 1837 písm. l) občanského zákoníku.
          </p>
          <p>
            Tento souhlas je uživatel povinen výslovně potvrdit zaškrtnutím příslušného pole (checkboxu) před provedením platby.
          </p>
          <h2>8. Autorská práva</h2>
          <p>
            Uživatel má právo volně používat vytvořený životopis. Poskytovatel si nečiní nárok na autorská práva k obsahu, který do životopisu vloží uživatel, a nenese odpovědnost za správnost nebo pravdivost údajů uvedených uživatelem.
          </p>
          <h2>9. Odpovědnost poskytovatele</h2>
          <p>
            Poskytovatel nenese odpovědnost za obsah vložený uživatelem, jeho správnost ani pravdivost. Uživatel odpovídá za to, že vložený obsah neporušuje práva třetích osob a právní předpisy.
          </p>
          <h2>10. Technické požadavky</h2>
          <p>
            Pro použití služby potřebuje uživatel připojení k internetu a aktuální webový prohlížeč podporující technologie JavaScript (React, Next.js), moderní CSS (např. CSS Grid, SCSS), a další moderní webové standardy. Služba je optimalizována pro:
          </p>
          <ul>
            <li>Prohlížeče: Chrome, Firefox, Safari, Edge (nejnovější 2 hlavní verze)</li>
            <li>Operační systémy: Android (verze 10 a vyšší), iOS (verze 13 a vyšší), Windows 10 a vyšší, macOS 10.15 a vyšší</li>
          </ul>
          <p>
            Poskytovatel negarantuje bezproblémový chod na starších nebo nepodporovaných verzích systémů a prohlížečů.
          </p>
          <h2>11. Závěrečná ustanovení</h2>
          <p>
            Tyto obchodní podmínky se řídí právním řádem České republiky. Veškeré případné spory budou přednostně řešeny smírnou cestou. Pokud nedojde k dohodě, spor bude řešen v souladu s platnými zákony ČR.
          </p>
          <p>
            Poskytovatel si vyhrazuje právo kdykoliv tyto podmínky změnit. Nové podmínky jsou účinné okamžikem zveřejnění na webových stránkách <Link href='/cs'>{SITE_URL}</Link>.
          </p>
          <p><strong>Datum poslední aktualizace: 26. 7. 2025</strong></p>
        </div>
      </section>
    </>
  );
}
