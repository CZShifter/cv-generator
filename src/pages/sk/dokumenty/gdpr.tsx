import Head from "next/head";
import Link from "next/link";
import React from "react";
import styles from "@/scss/Dokumenty.module.scss";
import {
  SITE_URL,
  SITE_URL_SK,
  SITE_NAME,
  SITE_MAIL_SK,
  FAVICON_URL_32,
  FAVICON_URL_192,
  APPLE_TOUCH_ICON_URL,
  OG_IMAGE,
  SELLER_COMPANY,
  SELLER_ADDRESS,
  SELLER_ADDRESS_CITY,
  SELLER_IC,
} from "@/config/site";

export default function Gdpr() {
  return (
    <>
      <Head>
        <title>{`Zásady ochrany osobných údajov (GDPR) | ${SITE_NAME}`}</title>
        <meta name="description" content="Zásady spracúvania osobných údajov a informácie o ochrane súkromia." />
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        <link rel="canonical" href={`${SITE_URL_SK}/sk/dokumenty/gdpr/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/dokumenty/gdpr/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/gdpr/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/gdpr/`} hrefLang="x-default" />
        <meta property="og:title" content={`Zásady ochrany osobných údajov (GDPR) | ${SITE_NAME}`} />
        <meta property="og:description" content="Zásady spracúvania osobných údajov a informácie o ochrane súkromia." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Informácie o ochrane osobných údajov" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/dokumenty/gdpr/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Zásady ochrany osobných údajov (GDPR) | ${SITE_NAME}`} />
        <meta name="twitter:description" content="Zásady spracúvania osobných údajov a informácie o ochrane súkromia." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Zásady ochrany osobných údajov (GDPR)",
              url: `${SITE_URL_SK}/sk/dokumenty/gdpr/`,
              inLanguage: "sk-SK",
              description: "Zásady spracúvania osobných údajov a informácie o ochrane súkromia.",
            }),
          }}
        />
      </Head>
      <section className={styles.dokument_section}>
        <div className={styles.dokument_wrapper}>
          <h1>Zásady ochrany osobných údajov</h1>
          <p>
            Tento dokument opisuje, akým spôsobom spracúvam osobné údaje v súlade s
            nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR).
          </p>

          <h2>1. Prevádzkovateľ údajov</h2>
          <div>
            <p><strong>Meno:</strong> {SELLER_COMPANY}</p>
            <p><strong>Adresa:</strong> {SELLER_ADDRESS}, {SELLER_ADDRESS_CITY}</p>
            <p><strong>IČO:</strong> {SELLER_IC}</p>
            <p><strong>E-mail:</strong> <Link href={`mailto:${SITE_MAIL_SK}`}>{SITE_MAIL_SK}</Link></p>
          </div>

          <h2>2. Aké údaje spracúvam</h2>
          <p>
            Spracúvam výhradne údaje, ktoré používateľ dobrovoľne vyplní do formulára
            za účelom vytvorenia, úpravy a stiahnutia životopisu. Ide najmä o:
          </p>
          <ul>
            <li>meno a priezvisko</li>
            <li>kontaktné údaje (e-mail, telefón, LinkedIn profil)</li>
            <li>pracovné skúsenosti, vzdelanie, zručnosti, jazykové znalosti, ukončené kurzy a ďalšie údaje uvedené v životopise</li>
            <li>vloženú fotografiu (voliteľne)</li>
            <li>technické údaje, najmä IP adresu, základné prevádzkové logy a údaje o použitom zariadení alebo prehliadači, ak sú nevyhnutné na bezpečnú prevádzku webu</li>
            <li>údaje súvisiace s platbou a stavom objednávky v rozsahu nevyhnutnom na overenie úhrady a sprístupnenie služby</li>
          </ul>
          <p>
            Osobné údaje získavam priamo od používateľa pri vyplnení formulára, pri používaní webu,
            pri vykonaní platby alebo pri komunikácii s prevádzkovateľom.
          </p>

          <h2>3. Účel spracúvania</h2>
          <p>Osobné údaje spracúvam za účelom:</p>
          <ul>
            <li>vytvorenia a stiahnutia životopisu (CV)</li>
            <li>dočasného sprístupnenia životopisu na spätnú úpravu po zaplatení</li>
            <li>automatického odstránenia obsahu životopisu po 24 hodinách</li>
            <li>overenia a spracovania platby</li>
            <li>vybavenia otázok, reklamácií a technických problémov</li>
            <li>zabezpečenia bezpečnosti webu, prevencie zneužitia a vedenia nevyhnutných technických záznamov</li>
            <li>merania návštevnosti a zlepšovania webu v rozsahu, v akom na to používateľ udelí súhlas</li>
            <li>generovania textových návrhov a úprav CV prostredníctvom AI nástrojov, ak používateľ túto funkciu využije</li>
          </ul>

          <h3>Právny základ spracúvania</h3>
          <p>
            Osobné údaje spracúvam na základe týchto právnych titulov:
          </p>
          <ul>
            <li><strong>plnenie zmluvy</strong> – na vytvorenie, sprístupnenie, úpravu a stiahnutie životopisu, overenie platby a poskytnutie objednanej služby</li>
            <li><strong>splnenie právnej povinnosti</strong> – najmä v prípadoch, keď je potrebné uchovávať údaje podľa všeobecne záväzných právnych predpisov</li>
            <li><strong>oprávnený záujem</strong> – na zabezpečenie bezpečnosti webu, ochranu pred zneužitím, riešenie technických incidentov a obhajobu právnych nárokov</li>
            <li><strong>súhlas</strong> – pri analytických a marketingových cookies a súvisiacich technológiách, ak sa používajú</li>
          </ul>
          <p>
            Poskytnutie údajov potrebných na vytvorenie životopisu je dobrovoľné, ale bez ich
            zadania nie je možné službu riadne poskytnúť, životopis vygenerovať ani sprístupniť
            jeho úpravy po zaplatení.
          </p>

          <h2>4. Kto má prístup k údajom</h2>
          <p>
            K osobným údajom má prístup prevádzkovateľ a ďalej iba nevyhnutní zmluvní partneri,
            ktorí pre prevádzkovateľa zabezpečujú technickú prevádzku služby alebo čiastkové
            súvisiace služby. Títo príjemcovia spracúvajú údaje iba v rozsahu nevyhnutnom
            na splnenie daného účelu.
          </p>
          <ul>
            <li>Supabase – databáza a úložisko dát</li>
            <li>Vercel – hosting a spracovanie požiadaviek webovej aplikácie</li>
            <li>Comgate, a.s. – spracovanie platieb a súvisiacich transakčných údajov v rozsahu nevyhnutnom na vykonanie platby</li>
            <li>PDFendpoint – technické spracovanie dokumentu a generovanie PDF</li>
            <li>OpenAI – generovanie textových návrhov a úprav, ak používateľ využije AI funkcie</li>
            <li>Google – analytické a prípadne marketingové nástroje, ak na ich použitie používateľ udelí súhlas</li>
          </ul>
          <p>
            Platobné údaje zadané používateľom v platobnej bráne nespracúvam priamo ja,
            ale poskytovateľ platobnej brány podľa svojich vlastných podmienok a zásad ochrany osobných údajov.
          </p>

          <h3>Prenos údajov mimo EÚ / EHP</h3>
          <p>
            V rámci niektorých používaných služieb môže dochádzať k prenosu osobných údajov
            mimo Európsku úniu alebo Európsky hospodársky priestor, najmä ak sú využité služby
            spoločností Google alebo OpenAI. V takých prípadoch dochádza k prenosu iba pri existencii
            primeraných záruk ochrany osobných údajov v súlade s GDPR, napríklad na základe
            štandardných zmluvných doložiek alebo iného právne uznaného mechanizmu.
          </p>

          <h2>5. Doba uchovávania údajov</h2>
          <p>
            Obsah životopisu, vložená fotografia, uložené údaje formulára a vygenerované PDF
            sa uchovávajú najdlhšie po dobu 24 hodín od vytvorenia alebo poslednej úpravy,
            aby bolo možné životopis stiahnuť a prípadne upraviť prostredníctvom jedinečného odkazu.
          </p>
          <p>
            Údaje, ktoré je potrebné uchovávať z dôvodu splnenia právnych povinností, riešenia reklamácií,
            ochrany právnych nárokov alebo vedenia nevyhnutných technických záznamov, môžu byť uchovávané
            po dobu vyžadovanú príslušnými právnymi predpismi alebo po dobu nevyhnutnú na ochranu práv prevádzkovateľa.
          </p>
          <p>
            Po uplynutí príslušnej doby uchovávania sú údaje vymazané, anonymizované alebo sú ďalej
            uchovávané iba v rozsahu, ktorý vyžadujú právne predpisy alebo technické zálohovacie procesy.
          </p>

          <h2>6. Vaše práva</h2>
          <p>Máte právo:</p>
          <ul>
            <li>požiadať o prístup k osobným údajom</li>
            <li>požiadať o opravu nepresných alebo neaktuálnych údajov</li>
            <li>požiadať o výmaz osobných údajov, ak už nie sú potrebné alebo ak odpadol právny dôvod ich spracúvania</li>
            <li>požiadať o obmedzenie spracúvania osobných údajov</li>
            <li>namietať proti spracúvaniu, ktoré prebieha na základe oprávneného záujmu</li>
            <li>získať svoje osobné údaje v štruktúrovanom, bežne používanom a strojovo čitateľnom formáte, ak sa spracúvanie vykonáva automatizovane na základe zmluvy alebo súhlasu</li>
            <li>kedykoľvek odvolať udelený súhlas, ak je spracúvanie založené na súhlase; odvolanie súhlasu nemá vplyv na zákonnosť predchádzajúceho spracúvania</li>
            <li>podať sťažnosť dozornému orgánu, ktorým je Úrad na ochranu osobných údajov Slovenskej republiky, na adrese <Link href="https://dataprotection.gov.sk">dataprotection.gov.sk</Link></li>
          </ul>
          <p>
            Svoje požiadavky týkajúce sa ochrany osobných údajov môžete uplatniť prostredníctvom
            e-mailu <Link href={`mailto:${SITE_MAIL_SK}`}>{SITE_MAIL_SK}</Link>.
          </p>
          <p>
            Úprava životopisu je možná počas 24 hodín od vytvorenia cez jedinečný odkaz.
            Po uplynutí tejto lehoty už obsah životopisu nemusí byť dostupný, pretože dochádza
            k jeho automatickému odstráneniu v súlade s nastavenou dobou uchovávania.
          </p>

          <h2>7. Cookies a analytika</h2>
          <p>
            Tento web používa cookies a obdobné technológie na zabezpečenie základnej funkčnosti,
            meranie návštevnosti a prípadne aj marketingové aktivity, ak na to používateľ udelí súhlas.
          </p>
          <h3>Typy cookies, ktoré používame:</h3>
          <ul>
            <li><strong>Nevyhnutné cookies</strong> – slúžia na zabezpečenie správneho fungovania webu, napr. na uloženie voľby jazyka, nastavenia súhlasu s cookies alebo technickej prevádzky aplikácie. Tieto cookies nevyžadujú súhlas.</li>
            <li><strong>Analytické cookies</strong> – pomáhajú porozumieť tomu, ako návštevníci používajú web, a umožňujú zlepšovať jeho obsah a funkčnosť. Tieto cookies sa používajú iba na základe súhlasu používateľa.</li>
            <li><strong>Marketingové cookies</strong> – môžu byť použité na meranie účinnosti reklamných kampaní alebo personalizáciu reklamy. Tieto cookies sa používajú iba na základe súhlasu používateľa.</li>
          </ul>
          <h3>Ako spravovať cookies:</h3>
          <p>
            Pri prvej návšteve webu si používateľ môže vybrať, či prijme iba nevyhnutné cookies,
            alebo udelí súhlas aj s analytickými a prípadne marketingovými cookies.
            Tento výber je možné kedykoľvek zmeniť pomocou tlačidla „Nastavenia cookies“ nižšie.
          </p>
          <button
            type="button"
            className={styles.cookieSettingsButton}
            onClick={() => window.dispatchEvent(new Event("cookie:open"))}
          >
            Nastavenia cookies
          </button>
          <p>
            Používateľ môže tiež spravovať alebo blokovať cookies vo svojom prehliadači.
            V takom prípade však môže dôjsť k obmedzeniu funkčnosti niektorých častí webu.
          </p>
          <h3>Ďalšie informácie:</h3>
          <p>
            Ak používateľ udelí súhlas s analytickými alebo marketingovými cookies, údaje získané
            prostredníctvom týchto technológií môžu byť spracúvané aj tretími stranami, najmä
            spoločnosťou Google. V súvislosti s používaním týchto nástrojov môže dochádzať aj
            k prenosu údajov mimo EÚ / EHP, a to pri použití primeraných záruk podľa GDPR.
          </p>

          <h2>8. Automatizované rozhodovanie a profilovanie</h2>
          <p>
            Na základe poskytnutých údajov sa nevykonávajú žiadne automatizované rozhodnutia
            s právnymi účinkami ani profilovanie v zmysle čl. 22 GDPR. Web slúži iba
            na generovanie, úpravu a stiahnutie CV.
          </p>

          <h2>9. Zmeny zásad</h2>
          <p>
            Tieto zásady môžu byť priebežne aktualizované.<br /> Dátum poslednej aktualizácie: <strong>17. 3. 2026</strong>.
          </p>
        </div>
      </section>
    </>
  );
}
