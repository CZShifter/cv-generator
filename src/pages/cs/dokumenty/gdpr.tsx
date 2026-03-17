import Head from "next/head";
import Link from "next/link";
import React from "react";
import styles from "@/scss/Dokumenty.module.scss";
import {
  SITE_MAIL,
  SITE_URL,
  SITE_URL_SK,
  SITE_NAME,
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
        <title>{`Zásady ochrany osobních údajů (GDPR) | ${SITE_NAME}`}</title>
        <meta name="description" content="Zásady zpracování osobních údajů a informace o ochraně soukromí." />
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        <link rel="canonical" href={`${SITE_URL}/cs/dokumenty/gdpr/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/dokumenty/gdpr/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/dokumenty/gdpr/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/cs/dokumenty/gdpr/`} hrefLang="x-default" />
        <meta property="og:title" content={`Zásady ochrany osobních údajů (GDPR) | ${SITE_NAME}`} />
        <meta property="og:description" content="Zásady zpracování osobních údajů a informace o ochraně soukromí." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Informace o ochraně osobních údajů" />
        <meta property="og:url" content={`${SITE_URL}/cs/dokumenty/gdpr/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Zásady ochrany osobních údajů (GDPR) | ${SITE_NAME}`} />
        <meta name="twitter:description" content="Zásady zpracování osobních údajů a informace o ochraně soukromí." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Zásady ochrany osobních údajů (GDPR)",
              url: `${SITE_URL}/cs/dokumenty/gdpr/`,
              inLanguage: "cs-CZ",
              description: "Zásady zpracování osobních údajů a informace o ochraně soukromí.",
            }),
          }}
        />
      </Head>
      <section className={styles.dokument_section}>
        <div className={styles.dokument_wrapper}>
          <h1>Zásady ochrany osobních údajů</h1>
          <p>
            Tento dokument popisuje, jakým způsobem zpracovávám osobní údaje v souladu s
            nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR).
          </p>

          <h2>1. Správce údajů</h2>
          <div>
            <p><strong>Jméno:</strong> {SELLER_COMPANY}</p>
            <p><strong>Adresa:</strong> {SELLER_ADDRESS}, {SELLER_ADDRESS_CITY}</p>
            <p><strong>IČO:</strong> {SELLER_IC}</p>
            <p><strong>E-mail:</strong> <Link href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</Link></p>
          </div>

          <h2>2. Jaké údaje zpracovávám</h2>
          <p>
            Zpracovávám výhradně údaje, které uživatel dobrovolně vyplní do formuláře
            za účelem vytvoření, úpravy a stažení životopisu. Jedná se zejména o:
          </p>
          <ul>
            <li>jméno a příjmení</li>
            <li>kontaktní údaje (e-mail, telefon, LinkedIn profil)</li>
            <li>pracovní zkušenosti, vzdělání, dovednosti, jazykové znalosti, ukončené kurzy a další údaje uvedené v životopisu</li>
            <li>vloženou fotografii (volitelně)</li>
            <li>technické údaje, zejména IP adresu, základní provozní logy a údaje o použitém zařízení nebo prohlížeči, pokud jsou nezbytné pro bezpečný provoz webu</li>
            <li>údaje související s platbou a stavem objednávky v rozsahu nezbytném pro ověření úhrady a zpřístupnění služby</li>
          </ul>
          <p>
            Osobní údaje získávám přímo od uživatele při vyplnění formuláře, při použití webu,
            při provedení platby nebo při komunikaci se správcem.
          </p>

          <h2>3. Účel zpracování</h2>
          <p>Osobní údaje zpracovávám za účelem:</p>
          <ul>
            <li>vytvoření a stažení životopisu (CV)</li>
            <li>dočasného zpřístupnění životopisu ke zpětné úpravě po zaplacení</li>
            <li>automatického odstranění obsahu životopisu po 24 hodinách</li>
            <li>ověření a zpracování platby</li>
            <li>vyřízení dotazů, reklamací a technických problémů</li>
            <li>zajištění bezpečnosti webu, prevence zneužití a vedení nezbytných technických záznamů</li>
            <li>měření návštěvnosti a zlepšování webu v rozsahu, v jakém k tomu uživatel udělí souhlas</li>
            <li>generování textových návrhů a úprav CV prostřednictvím AI nástrojů, pokud uživatel tuto funkci využije</li>
          </ul>

          <h3>Právní základ zpracování</h3>
          <p>
            Osobní údaje zpracovávám na základě těchto právních titulů:
          </p>
          <ul>
            <li><strong>plnění smlouvy</strong> – pro vytvoření, zpřístupnění, úpravu a stažení životopisu, ověření platby a poskytnutí objednané služby</li>
            <li><strong>splnění právní povinnosti</strong> – zejména v případech, kdy je nutné uchovat údaje podle obecně závazných právních předpisů</li>
            <li><strong>oprávněný zájem</strong> – pro zajištění bezpečnosti webu, ochranu proti zneužití, řešení technických incidentů a obhajobu právních nároků</li>
            <li><strong>souhlas</strong> – u analytických a marketingových cookies a souvisejících technologií, pokud jsou používány</li>
          </ul>
          <p>
            Poskytnutí údajů potřebných pro vytvoření životopisu je dobrovolné, ale bez jejich
            zadání není možné službu řádně poskytnout, životopis vygenerovat ani zpřístupnit
            jeho úpravy po zaplacení.
          </p>

          <h2>4. Kdo má přístup k údajům</h2>
          <p>
            K osobním údajům má přístup správce a dále pouze nezbytní smluvní partneři,
            kteří pro správce zajišťují technický provoz služby nebo dílčí související služby.
            Tito příjemci zpracovávají údaje pouze v rozsahu nezbytném pro splnění daného účelu.
          </p>
          <ul>
            <li>Supabase – databáze a úložiště dat</li>
            <li>Vercel – hosting a zpracování požadavků webové aplikace</li>
            <li>Comgate, a.s. – zpracování plateb a souvisejících transakčních údajů v rozsahu nezbytném k provedení platby</li>
            <li>PDFendpoint – technické zpracování dokumentu a generování PDF</li>
            <li>OpenAI – generování textových návrhů a úprav, pokud uživatel využije AI funkce</li>
            <li>Google – analytické a případně marketingové nástroje, pokud k jejich použití uživatel udělí souhlas</li>
          </ul>
          <p>
            Platební údaje zadané uživatelem v platební bráně nezpracovávám přímo já,
            ale poskytovatel platební brány podle svých vlastních podmínek a zásad ochrany osobních údajů.
          </p>

          <h3>Předání údajů mimo EU / EHP</h3>
          <p>
            V rámci některých používaných služeb může docházet k předání osobních údajů
            mimo Evropskou unii nebo Evropský hospodářský prostor, zejména pokud jsou využity
            služby společností Google nebo OpenAI. V takových případech dochází k předání pouze
            při existenci odpovídajících záruk ochrany osobních údajů v souladu s GDPR,
            například na základě standardních smluvních doložek nebo jiného právně uznávaného mechanismu.
          </p>

          <h2>5. Doba uchování údajů</h2>
          <p>
            Obsah životopisu, vložená fotografie, uložená data formuláře a vygenerované PDF
            jsou uchovávány nejdéle po dobu 24 hodin od vytvoření nebo poslední úpravy,
            aby bylo možné životopis stáhnout a případně upravit prostřednictvím jedinečného odkazu.
          </p>
          <p>
            Údaje, které je nutné uchovávat z důvodu splnění právních povinností, řešení reklamací,
            ochrany právních nároků nebo vedení nezbytných technických záznamů, mohou být uchovávány
            po dobu vyžadovanou příslušnými právními předpisy nebo po dobu nezbytnou k ochraně práv správce.
          </p>
          <p>
            Po uplynutí příslušné doby uchování jsou údaje vymazány, anonymizovány nebo jsou dále
            uchovávány pouze v rozsahu, který vyžadují právní předpisy nebo technické zálohovací procesy.
          </p>

          <h2>6. Vaše práva</h2>
          <p>Máte právo:</p>
          <ul>
            <li>požádat o přístup k osobním údajům</li>
            <li>požádat o opravu nepřesných nebo neaktuálních údajů</li>
            <li>požádat o výmaz osobních údajů, pokud již nejsou potřebné nebo pokud odpadl právní důvod jejich zpracování</li>
            <li>požádat o omezení zpracování osobních údajů</li>
            <li>vznést námitku proti zpracování, které probíhá na základě oprávněného zájmu</li>
            <li>získat své osobní údaje ve strukturovaném, běžně používaném a strojově čitelném formátu, pokud se zpracování provádí automatizovaně na základě smlouvy nebo souhlasu</li>
            <li>kdykoli odvolat udělený souhlas, pokud je zpracování založeno na souhlasu; odvolání souhlasu nemá vliv na zákonnost předchozího zpracování</li>
            <li>podat stížnost u dozorového úřadu, kterým je Úřad pro ochranu osobních údajů, na adrese <Link href="https://www.uoou.cz">www.uoou.cz</Link></li>
          </ul>
          <p>
            Své požadavky týkající se ochrany osobních údajů můžete uplatnit prostřednictvím
            e-mailu <Link href={`mailto:${SITE_MAIL}`}>{SITE_MAIL}</Link>.
          </p>
          <p>
            Úprava životopisu je možná po dobu 24 hodin od vytvoření přes jedinečný odkaz.
            Po uplynutí této lhůty již obsah životopisu nemusí být dostupný, protože dochází
            k jeho automatickému odstranění v souladu s nastavenou dobou uchování.
          </p>

          <h2>7. Cookies a analytika</h2>
          <p>
            Tento web používá cookies a obdobné technologie za účelem zajištění základní funkčnosti,
            měření návštěvnosti a případně i marketingových aktivit, pokud k tomu uživatel udělí souhlas.
          </p>
          <h3>Typy cookies, které používáme:</h3>
          <ul>
            <li><strong>Nezbytné cookies</strong> – slouží k zajištění správného fungování webu, např. pro uložení volby jazyka, nastavení souhlasu s cookies nebo technického chodu aplikace. Tyto cookies nevyžadují souhlas.</li>
            <li><strong>Analytické cookies</strong> – pomáhají porozumět, jak návštěvníci používají web, a umožňují zlepšovat jeho obsah a funkčnost. Tyto cookies jsou používány pouze na základě souhlasu uživatele.</li>
            <li><strong>Marketingové cookies</strong> – mohou být použity pro měření účinnosti reklamních kampaní nebo personalizaci reklamy. Tyto cookies jsou používány pouze na základě souhlasu uživatele.</li>
          </ul>
          <h3>Jak cookies spravovat:</h3>
          <p>
            Při první návštěvě webu si uživatel může vybrat, zda přijme pouze nezbytné cookies,
            nebo udělí souhlas také s analytickými a případně marketingovými cookies.
            Tento výběr lze kdykoli změnit pomocí tlačítka „Nastavení cookies“ níže.
          </p>
          <button
            type="button"
            className={styles.cookieSettingsButton}
            onClick={() => window.dispatchEvent(new Event("cookie:open"))}
          >
            Nastavení cookies
          </button>
          <p>
            Uživatel může také spravovat nebo blokovat cookies ve svém prohlížeči.
            V takovém případě však může dojít k omezení funkčnosti některých částí webu.
          </p>
          <h3>Další informace:</h3>
          <p>
            Pokud uživatel udělí souhlas s analytickými nebo marketingovými cookies, mohou být
            údaje získané prostřednictvím těchto technologií zpracovávány také třetími stranami,
            zejména společností Google. V souvislosti s používáním těchto nástrojů může docházet
            i k předání údajů mimo EU / EHP, a to při použití odpovídajících záruk podle GDPR.
          </p>

          <h2>8. Automatické rozhodování a profilování</h2>
          <p>
            Na základě poskytnutých údajů nejsou prováděna žádná automatizovaná rozhodnutí
            s právními účinky ani profilování ve smyslu čl. 22 GDPR. Web slouží pouze
            ke generování, úpravě a stažení CV.
          </p>

          <h2>9. Změny zásad</h2>
          <p>
            Tyto zásady mohou být průběžně aktualizovány.<br /> Datum poslední aktualizace: <strong>17. 3. 2026</strong>.
          </p>
        </div>
      </section>
    </>
  );
}
