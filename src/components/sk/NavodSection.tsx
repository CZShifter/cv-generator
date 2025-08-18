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
            <p className={styles.intro}>Nie ste si istí ako správne vyplniť váš životopis? Pozrite si jednoduchý návod</p>
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
                    V prvom kroku formulára zadávate svoje základné kontaktné údaje. Povinné sú: <strong>meno</strong>, <strong>priezvisko</strong>, <strong>adresa</strong>, <strong>telefón</strong> a <strong>e-mail</strong>. Bez týchto údajov nemožno životopis dokončiť.
                  </p>
                  <p>
                    Môžete tiež doplniť <strong>odkaz na Váš LinkedIn</strong>, <strong>rok narodenia</strong>, <strong>pracovné zameranie</strong>, <strong>sekciu o mne</strong> a <strong>fotku</strong>. Tieto položky nie sú povinné, ale môžu vám zvýšiť šancu tým, že pomôžu personalistovi rýchlejšie sa zorientovať vo vašom profile.
                  </p>
                  <p>
                    V sekcii <strong>O mne</strong> napíšte niekoľko viet, ktoré vystihujú vašu osobnosť, hodnoty alebo pracovný prístup. Tento odsek nie je povinný, ale je skvelou príležitosťou ukázať svoj prístup, motiváciu a dôvody, prečo ste vhodným kandidátom. Píšte stručne, jasne a osobne.
                  </p>
                  <p>
                    Fotografia nie je povinná, ale jej pridanie môže výrazne zvýšiť dôveryhodnosť vášho životopisu. Ak ju chcete pripojiť, použite prepínač &quot;Pridať fotku&quot; a nahrajte obrázok vo vhodnej kvalite.
                  </p>
                </div>
                <blockquote>
                  <p><strong>Zelené prepínače </strong> pri jednotlivých poliach slúžia na zapnutie alebo vypnutie konkrétnej položky v životopise.</p>
                  <p>Ak je prepínač aktívny <strong>(zelený)</strong>, táto informácia bude zahrnutá vo výslednom CV.</p>
                  <p>Ak je vypnutý <strong>(červený)</strong>, údaj sa do životopisu nedostane.</p>
                  <p>Môžete si tak ľahko zvoliť, ktoré informácie chcete alebo nechcete prezentovať.</p>
                  <p><strong>Základné nastavenie je &quot;vypnuté&quot;, takže pokiaľ chcete danú sekciu použiť, musíte ju najskôr zapnúť prepínačom.</strong></p>
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
                    V tejto časti vyplňujete vaše vzdelanie. Každý záznam by mal obsahovať <strong>dosiahnuté vzdelanie</strong>, <strong>názov školy</strong>, <strong>odbor</strong> a <strong>rok ukončenia štúdia</strong>. Tieto údaje sú zásadné pre celkovú dôveryhodnosť životopisu.
                  </p>
                  <p>
                    Odporúčame zadávať jednotlivé školy od <strong>najnovšej po najstaršiu</strong>. Najvyššie dosiahnuté vzdelanie by malo byť uvedené ako prvé v zozname. Personalista tak hneď uvidí váš aktuálny stav vzdelania.
                  </p>
                  <p>
                    Pokiaľ máte viac škôl, pridajte každý záznam zvlášť pomocou tlačidla <strong>Pridať vzdelanie</strong>.
                  </p>
                  <p>
                    Vyplnenie viacerých škôl je vhodné najmä vtedy, ak ste absolvovali napríklad bakalárske a nadväzujúce magisterské štúdium, alebo ak uvádzate strednú aj vysokú školu.
                  </p>
                  <p>
                    Rok ukončenia je povinný údaj – pomáha personalistovi orientovať sa v časovej osi vášho vzdelania.
                  </p>
                </div>
                <blockquote>
                  <p>Každý záznam môžete kedykoľvek upraviť pomocou ikony <FaEdit style={{ color: "#11539e", verticalAlign: "middle" }} /> (&quot;Upraviť&quot;)</p> 
                  <p>úplne odstrániť kliknutím na ikonu <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> (&quot;Zmazať&quot;).</p>
                  <p>Editácia umožňuje rýchlo opravovať preklepy alebo dopĺňať informácie, mazanie zase slúži na odstránenie starých či nepotrebných údajov.</p>
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
                    Sekcia <strong>Kurzy a certifikáty</strong> slúži na doplnenie ďalších zručností, ktoré ste získali mimo klasického školského vzdelávania. Patria sem napríklad jazykové skúšky, odborné certifikáty, profesijné kurzy, online školenia alebo školenia od zamestnávateľa.
                  </p>
                  <p>
                    Celá táto sekcia je <strong>nepovinná</strong>. Pokiaľ nemáte žiadne kurzy alebo certifikáty, pokojne ju preskočte – životopis zostane plne platný.
                  </p>
                  <p>
                    Pokiaľ ale nejaké kurzy, certifikáty alebo školenia uvádzate, vždy vyplňte <strong>názov kurzu</strong>, <strong>usporiadateľskú inštitúciu</strong> a <strong>rok absolvovania</strong>.
                  </p>
                  <p>
                    Zadávajte kurzy od <strong>najnovších po najstaršie</strong> podobne ako u sekcie vzdelanie. Najaktuálnejšie znalosti a zručnosti by mali byť na prvom mieste.
                  </p>
                </div>
                <blockquote>
                  <p>Každý záznam môžete kedykoľvek upraviť pomocou ikony <FaEdit style={{ color: "#11539e", verticalAlign: "middle" }} /> (&quot;Upraviť&quot;)</p> 
                  <p>úplne odstrániť kliknutím na ikonu <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> (&quot;Zmazať&quot;).</p>
                  <p>Editácia umožňuje rýchlo opravovať preklepy alebo dopĺňať informácie, mazanie zase slúži na odstránenie starých či nepotrebných údajov.</p>
                  <p><strong style={{ color: "red" }}>Celá táto sekcia je nepovinná. Pokiaľ nemáte žiadne kurzy alebo certifikáty, pokojne ju preskočte – jej základný stav je &quot;vypnutý&quot;.</strong></p>
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
                    V časti <strong>Jazykové znalosti</strong> uveďte všetky jazyky, ktoré ovládate (vrátane rodného). Pre každý jazyk vyberte tiež úroveň svojej znalosti.
                  </p>
                </div>
                <blockquote>
                  <p><strong style={{ color: "#444" }}>Vysvetlenie úrovní podľa CEFR:</strong></p>
                  <p>A1 – začiatočník</p>
                  <p>A2 – mierne pokročilý</p>
                  <p>B1 – stredne pokročilý</p>
                  <p>B2 – pokročilý</p>
                  <p>C1 – veľmi pokročilý</p>
                  <p>C2 – takmer rodený hovoriaci</p>
                  <p>Rodený hovoriaci – jazyk používate ako svoj hlavný a bez obmedzení</p>
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
                    Zadať zručnosti možno dvoma spôsobmi:<br/>A) <strong>Manuálne ich napíšete do textového poľa </strong> a potom ich pridáte stlačením tlačidla <strong>&quot;Pridať&quot;</strong>.<br/>B) <strong>Vyberiete z ponuky najčastejších zručností </strong> – stačí kliknúť na políčko s vybraným názvom zručnosti a automaticky sa vám pridá do zoznamu.
                  </p>
                  <p>
                    Tento systém vám umožňuje rýchlo doplniť napríklad &quot;komunikatívnosť&quot;, &quot;tímovú spoluprácu&quot;, &quot;MS Excel&quot;, &quot;riadenie projektov&quot; alebo iné dôležité znalosti bez zbytočného vypisovania. Pokiaľ medzi predvolenými zručnosťami nenájdete tú svoju, pridajte ju ručne.
                  </p>
                  <p>
                    Odporúčame uvádzať <strong>maximálne 8–10 najdôležitejších zručností</strong>, aby ste zachovali životopis prehľadný a a zrozumiteľný pre personalistu.
                  </p>
                </div>
                <blockquote>
                  <p>Každý záznam môžete kedykoľvek upraviť pomocou ikony <FaEdit style={{ color: "#11539e", verticalAlign: "middle" }} /> (&quot;Upraviť&quot;)</p> 
                  <p>úplne odstrániť kliknutím na ikonu <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> (&quot;Zmazať&quot;).</p>
                  <p>Editácia umožňuje rýchlo opravovať preklepy alebo dopĺňať informácie, mazanie zase slúži na odstránenie starých či nepotrebných údajov.</p>
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
                    V sekcii <strong>Pracovné skúsenosti</strong> vyplňujete svoje doterajšie zamestnania a pozície, ktoré ste v minulosti vykonávali. Pri každej pozícii je dôležité uviesť <strong>názov pracovnej pozície</strong>, <strong>názov zamestnávateľa</strong> a <strong>obdobie, od kedy do kedy ste na nej pracovali.</strong>.
                  </p>
                  <p className="doporuceni">
                    Všetky pracovné pozície zadávajte vždy od <strong>najnovšej (aktuálnej)</strong> po <strong>najstaršiu</strong>. Prvá pozícia v zozname by mala byť tá, ktorú aktuálne vykonávate alebo ste ju opustili ako poslednú.
                  </p>
                  <p>
                    Ku každej pracovnej skúsenosti môžete pridať <strong>konkrétne body</strong>, ktoré opisujú vaše hlavné úlohy, zodpovednosti, dosiahnuté úspechy alebo projekty. Odporúčame pri každej pozícii uviesť <strong>ideálne 3–8 stručných bodov</strong>.  
                    Personalisti tak lepšie pochopia, v čom ste v práci naozaj vynikali a aký bol váš konkrétny prínos.
                  </p>
                  <p>
                    Pozíciu pridáte pomocou tlačidla <strong>Pridať skúsenosť</strong>. Ak ste zmenili zamestnanie viackrát, pridajte všetky relevantné pozície.
                  </p>
                </div>
                <blockquote>
                  <p>Každý záznam môžete kedykoľvek upraviť pomocou ikony <FaEdit style={{ color: "#11539e", verticalAlign: "middle" }} /> (&quot;Upraviť&quot;)</p> 
                  <p>úplne odstrániť kliknutím na ikonu <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> (&quot;Zmazať&quot;).</p>
                  <p>Editácia umožňuje rýchlo opravovať preklepy alebo dopĺňať informácie, mazanie zase slúži na odstránenie starých či nepotrebných údajov.</p>
                  <p>Správne radenie a konkrétny popis každej skúsenosti vám výrazne zvýši šancu zaujať personalistu už pri prvom pohľade na životopis.</p>
                </blockquote>
              </div>
            </div>
        </div>
    </section>
  );
}
