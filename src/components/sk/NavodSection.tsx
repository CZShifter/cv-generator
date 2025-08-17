import { FaTrash, FaEdit } from "react-icons/fa";
import Head from "next/head";
import styles from "@/scss/NavodSection.module.scss";
import { SITE_VERSION } from "@/config/site";

export default function NavodSection() {
  return (
    <section className={styles.guideSection}>
      <Head>
        <link rel="preload" as="image" href={`/img/navod/krok1.webp?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/navod/krok1.png?v=${SITE_VERSION}`}/>
      </Head>
        <div className={styles.guideWrapper}>
            <h1 className={styles.heading}>Ako vyplniť životopis krok za krokom</h1>
            <p className={styles.intro}>Neviete si rady, ako správne vyplniť svoj životopis? Pozrite si jednoduchý a prehľadný návod krok za krokom.</p>
            {/* KROK 1 */}
            <div className={styles.guideStep}>
              <picture>
                <source srcSet={`/img/navod/krok1.webp?v=${SITE_VERSION}`} type="image/webp"/>
                <source srcSet={`/img/navod/krok1.png?v=${SITE_VERSION}`} type="image/png" />
                <img
                  src={`/img/navod/krok1.png?v=${SITE_VERSION}`}
                  alt="Krok 1 – Kontaktné údaje"
                  width={1084}
                  height={569}
                  className={styles.guideImage}
                  loading="eager"
                  decoding="async"
                />
              </picture>
              <div className={styles.guideTextWrapper}>
                <div className={styles.guideText}>
                  <h2>Krok 1: Kontaktné údaje</h2>
                  <p>
                    V prvom kroku formulára zadávate svoje základné kontaktné údaje. Povinné sú: <strong>meno</strong>, <strong>priezvisko</strong>, <strong>adresa</strong>, <strong>telefón</strong> a <strong>e-mail</strong>. Bez týchto údajov nie je možné životopis dokončiť.
                  </p>
                  <p>
                    Môžete tiež doplniť <strong>odkaz na Váš LinkedIn</strong>, <strong>rok narodenia</strong>, <strong>pracovné zameranie</strong>, <strong>sekciu o mne</strong> a <strong>fotku</strong>. Tieto položky nie sú povinné, ale môžu Vám zvýšiť šancu tým, že pomôžu personalistovi rýchlejšie sa zorientovať vo Vašom profile.
                  </p>
                  <p>
                    V sekcii <strong>O mne</strong> napíšte niekoľko viet, ktoré vystihujú Vašu osobnosť, hodnoty alebo pracovný prístup. Tento odstavec nie je povinný, ale je skvelou príležitosťou ukázať svoj prístup, motiváciu a dôvody, prečo ste vhodným kandidátom. Píšte stručne, jasne a osobne.
                  </p>
                  <p>
                    Fotografia nie je povinná, ale jej pridanie môže výrazne zvýšiť dôveryhodnosť Vášho životopisu. Ak ju chcete pripojiť, použite prepínač „Pridať fotku“ a nahrajte obrázok v dobrej kvalite.
                  </p>
                </div>
                <blockquote>
                  <p>Všimnite si <strong>zelených prepínačov</strong> pri jednotlivých poliach – slúžia na zapnutie alebo vypnutie konkrétnej položky v životopise.</p>
                  <p>Ak je prepínač aktívny <strong>(zelený)</strong>, táto informácia bude zahrnutá vo výslednom CV.</p>
                  <p>Ak ho vypnete <strong>(červený)</strong>, údaj sa do životopisu nedostane.</p>
                  <p>Môžete si tak jednoducho zvoliť, ktoré informácie chcete alebo nechcete prezentovať.</p>
                  <p><strong>Východiskové nastavenie je &quot;vypnuté&quot;, takže ak chcete danú sekciu použiť, musíte ju najprv zapnúť prepínačom.</strong></p>
                </blockquote>
              </div>
            </div>
            {/* KROK 2 */}
            <div className={styles.guideStep}>
              <picture>
                <source srcSet={`/img/navod/krok2.webp?v=${SITE_VERSION}`} type="image/webp"/>
                <source srcSet={`/img/navod/krok2.png?v=${SITE_VERSION}`} type="image/png" />
                <img
                  src={`/img/navod/krok2.png?v=${SITE_VERSION}`}
                  alt="Krok 2 – Vzdelanie"
                  width={1084}
                  height={288}
                  className={styles.guideImage}
                  loading="lazy"
                />
              </picture>
              <div className={styles.guideTextWrapper}>
                <div className={styles.guideText}>
                  <h2>Krok 2: Vzdelanie</h2>
                  <p>
                    V tejto časti vypĺňate svoje dosiahnuté vzdelanie. Každý záznam by mal obsahovať <strong>stupeň vzdelania</strong>, <strong>názov školy</strong>, <strong>odbor</strong> a <strong>rok ukončenia štúdia</strong>. Tieto údaje sú zásadné pre celkovú dôveryhodnosť životopisu.
                  </p>
                  <p>
                    Odporúčame zadávať jednotlivé školy od <strong>najnovšej po najstaršiu</strong>. Prvé (najvyššie) dosiahnuté vzdelanie by malo byť uvedené ako prvé – personalista tak hneď vidí Váš aktuálny stav vzdelania.
                  </p>
                  <p>
                    Ak máte viac škôl, pridajte každý záznam zvlášť pomocou tlačidla <strong>Pridať vzdelanie</strong>.
                  </p>
                  <p>
                    Rok ukončenia je povinný údaj – pomáha personalistovi orientovať sa v časovej osi Vášho vzdelania.
                  </p>
                </div>
                <blockquote>
                  <p>Každý záznam môžete kedykoľvek upraviť pomocou ikony <FaEdit style={{ color: "#11539e", verticalAlign: "middle" }} /> („Upraviť“)</p> 
                  <p>Alebo úplne odstrániť kliknutím na ikonu <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> („Vymazať“).</p>
                </blockquote>
              </div>
            </div>
            {/* KROK 3 */}
            <div className={styles.guideStep}>
              <picture>
                <source srcSet={`/img/navod/krok3.webp?v=${SITE_VERSION}`} type="image/webp"/>
                <source srcSet={`/img/navod/krok3.png?v=${SITE_VERSION}`} type="image/png" />
                <img
                  src={`/img/navod/krok3.png?v=${SITE_VERSION}`}
                  alt="Krok 3 – Kurzy a certifikáty"
                  width={1084}
                  height={340}
                  className={styles.guideImage}
                  loading="lazy"
                />
              </picture>
              <div className={styles.guideTextWrapper}>
                <div className={styles.guideText}>
                  <h2>Krok 3: Kurzy & Certifikáty</h2>
                  <p>
                    Sekcia <strong>Kurzy a certifikáty</strong> slúži na doplnenie ďalších zručností, ktoré ste získali mimo klasického školského vzdelávania.
                  </p>
                  <p>
                    Celá táto sekcia je <strong>nepovinná</strong>. Ak nemáte žiadne kurzy alebo certifikáty, pokojne ju preskočte – životopis zostane plne platný.
                  </p>
                  <p>
                    Ak ale kurzy uvádzate, vždy vyplňte <strong>názov kurzu</strong>, <strong>organizátora</strong> a <strong>rok absolvovania</strong>.
                  </p>
                  <p>
                    Zoraďujte kurzy od <strong>najnovších po najstaršie</strong>.
                  </p>
                </div>
                <blockquote>
                  <p>Každý záznam môžete upraviť alebo vymazať podobne ako v predchádzajúcom kroku.</p>
                  <p><strong style={{ color: "red" }}>Celá táto sekcia je nepovinná. Jej základný stav je &quot;vypnutý&quot;.</strong></p>
                </blockquote>
              </div>
            </div>
            {/* KROK 4 */}
            <div className={styles.guideStep}>
              <picture>
                <source srcSet={`/img/navod/krok4.webp?v=${SITE_VERSION}`} type="image/webp"/>
                <source srcSet={`/img/navod/krok4.png?v=${SITE_VERSION}`} type="image/png" />
                <img
                  src={`/img/navod/krok4.png?v=${SITE_VERSION}`}
                  alt="Krok 4 – Jazykové znalosti"
                  width={1084}
                  height={413}
                  className={styles.guideImage}
                  loading="lazy"
                />
              </picture>
              <div className={styles.guideTextWrapper}>
                <div className={styles.guideText}>
                  <h2>Krok 4: Jazykové znalosti</h2>
                  <p>
                    V časti <strong>Jazykové znalosti</strong> uvádzate všetky jazyky, ktoré ovládate (vrátane rodného). Ku každému jazyku vyberte aj úroveň ovládania.
                  </p>
                </div>
                <blockquote>
                  <p><strong style={{ color: "#444" }}>Vysvetlenie úrovní podľa CEFR:</strong></p>
                  <p>A1 – začiatočník</p>
                  <p>A2 – mierne pokročilý</p>
                  <p>B1 – stredne pokročilý</p>
                  <p>B2 – pokročilý</p>
                  <p>C1 – veľmi pokročilý</p>
                  <p>C2 – takmer ako rodený hovorca</p>
                  <p>Rodený hovorca – jazyk používate bez obmedzení</p>
                </blockquote>
              </div>
            </div>

            {/* KROK 5 */}
            <div className={styles.guideStep}>
              <picture>
                <source srcSet={`/img/navod/krok5.webp?v=${SITE_VERSION}`} type="image/webp"/>
                <source srcSet={`/img/navod/krok5.png?v=${SITE_VERSION}`} type="image/png" />
                <img
                  src={`/img/navod/krok5.png?v=${SITE_VERSION}`}
                  alt="Krok 5 – Zručnosti"
                  width={1084}
                  height={568}
                  className={styles.guideImage}
                  loading="lazy"
                />
              </picture>
              <div className={styles.guideTextWrapper}>
                <div className={styles.guideText}>
                  <h2>Krok 5: Zručnosti</h2>
                  <p>
                    V sekcii <strong>Zručnosti</strong> môžete uviesť všetky svoje kľúčové schopnosti a znalosti, ktoré sú relevantné pre pozíciu, o ktorú sa uchádzate.
                  </p>
                  <p>
                    Zručnosti môžete zadať dvoma spôsobmi: Buď ich <strong>manuálne napíšete do textového poľa</strong> a potom pridáte stlačením tlačidla <strong>„Pridať“</strong>, alebo jednoducho <strong>vyberiete zo zoznamu najčastejších zručností</strong> – stačí kliknúť na políčko s názvom zručnosti a automaticky sa pridá do zoznamu.
                  </p>
                  <p>
                    Tento systém Vám umožňuje rýchlo doplniť napríklad „komunikatívnosť“, „tímová spolupráca“, „MS Excel“, „riadenie projektov“ alebo iné dôležité znalosti bez zbytočného vypisovania. Ak medzi predvolenými zručnosťami nenájdete tú svoju, pridajte ju ručne.
                  </p>
                  <p>
                    Odporúčame uvádzať <strong>maximálne 8–10 najdôležitejších zručností</strong>, aby zostal životopis prehľadný a pre personalistu zrozumiteľný.
                  </p>
                </div>
                <blockquote>
                  <p>Každý záznam môžete kedykoľvek upraviť pomocou ikony <FaEdit style={{ color: "#11539e", verticalAlign: "middle" }} /> („Upraviť“)</p> 
                  <p>Alebo úplne odstrániť kliknutím na ikonu <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> („Odstrániť“).</p> 
                  <p>Úprava umožňuje rýchlo opravovať preklepy alebo dopĺňať informácie, mazanie zase slúži na odstránenie starých či nepotrebných údajov.</p>
                </blockquote>
              </div>
            </div>

            {/* KROK 6 */}
            <div className={styles.guideStep}>
              <picture>
                <source srcSet={`/img/navod/krok6.webp?v=${SITE_VERSION}`} type="image/webp"/>
                <source srcSet={`/img/navod/krok6.png?v=${SITE_VERSION}`} type="image/png" />
                <img
                  src={`/img/navod/krok6.png?v=${SITE_VERSION}`}
                  alt="Krok 6 – Pracovné skúsenosti"
                  width={1084}
                  height={764}
                  className={styles.guideImage}
                  loading="lazy"
                />
              </picture>
              <div className={styles.guideTextWrapper}>
                <div className={styles.guideText}>
                  <h2>Krok 6: Pracovné skúsenosti</h2>
                  <p>
                    V sekcii <strong>Pracovné skúsenosti</strong> vyplňujete svoje doterajšie zamestnania a pozície, ktoré ste v minulosti vykonávali. Pri každej pozícii je dôležité uviesť <strong>názov pracovnej pozície</strong>, <strong>názov zamestnávateľa</strong> a <strong>obdobie, od kedy do kedy ste tam pracovali</strong>.
                  </p>
                  <p className="doporuceni">
                    Všetky pracovné pozície zadávajte vždy od <strong>najnovšej (aktuálnej)</strong> po <strong>najstaršiu</strong>. Prvá pozícia v zozname by mala byť tá, ktorú aktuálne vykonávate alebo ste ju vykonávali naposledy.
                  </p>
                  <p>
                    Ku každej pracovnej skúsenosti môžete pridať <strong>konkrétne body</strong>, ktoré opisujú vaše hlavné úlohy, zodpovednosti, dosiahnuté úspechy alebo projekty. Každý bod zadávate ručne a odporúčame pri každej pozícii uviesť <strong>ideálne 3–8 stručných bodov</strong>.  
                    Personalisti tak lepšie pochopia, v čom ste v práci naozaj vynikali a aký bol váš konkrétny prínos.
                  </p>
                  <p>
                    Pozíciu pridáte pomocou tlačidla <strong>Pridať skúsenosť</strong>. Ak ste menili zamestnanie viackrát, pridajte všetky relevantné pozície.
                  </p>
                </div>
                <blockquote>
                  <p>Každú pracovnú pozíciu môžete kedykoľvek upraviť kliknutím na ikonu <FaEdit style={{ color: "#3d61d3", verticalAlign: "middle" }} /> („Upraviť“)</p> 
                  <p>Alebo úplne odstrániť kliknutím na ikonu <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> („Odstrániť“).</p>  
                  <p>Správne zoradenie a konkrétny popis každej skúsenosti vám výrazne zvýši šancu zaujať personalistu už pri prvom pohľade na životopis.</p>
                </blockquote>
              </div>
            </div>
        </div>
    </section>
  );
}
