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
            <h1 className={styles.heading}>Jak používat aplikaci krok za krokem</h1>
            <p className={styles.intro}>Nejste si jistí jak správně vyplnit váš životopis? Projděte si jednoduchý a přehledný návod</p>
            {/* KROK 1 */}
            <div className={styles.guideStep}>
              <picture>
                <source srcSet={`/img/navod/krok1.webp?v=${SITE_VERSION}`} type="image/webp"/>
                <source srcSet={`/img/navod/krok1.png?v=${SITE_VERSION}`} type="image/png" />
                <img
                  src={`/img/navod/krok1.png?v=${SITE_VERSION}`}
                  alt="Krok 1 – Kontaktní údaje"
                  width={1084}
                  height={569}
                  className={styles.guideImage}
                  loading="eager"
                  decoding="async"
                />
              </picture>
              <div className={styles.guideTextWrapper}>
                <div className={styles.guideText}>
                  <h2>Krok 1: Kontaktní údaje</h2>
                  <p>
                    V prvním kroku formuláře zadáváte své základní kontaktní údaje. Povinné jsou: <strong>jméno</strong>, <strong>příjmení</strong>, <strong>adresa</strong>, <strong>telefon</strong> a <strong>e-mail</strong>. Bez těchto údajů nelze životopis dokončit.
                  </p>
                  <p>
                    Můžete také doplnit <strong>odkaz na Váš LinkedIn</strong>, <strong>rok narození</strong>, <strong>pracovní zaměření</strong>, <strong>sekci o mně</strong> a <strong>fotku</strong>. Tyto položky nejsou povinné, ale mohou vám zvýšit šanci tím, že pomůžou personalistovi rychleji se zorientovat ve vašem profilu.
                  </p>
                  <p>
                    V sekci <strong>O mně</strong> napište několik vět, které vystihují vaši osobnost, hodnoty nebo pracovní přístup. Tento odstavec není povinný, ale je skvělou příležitostí ukázat svůj přístup, motivaci a důvody, proč jste vhodným kandidátem. Pište stručně, jasně a osobně.
                  </p>
                  <p>
                    Fotografie není povinná, ale její přidání může výrazně zvýšit důvěryhodnost vašeho životopisu. Pokud ji chcete připojit, použijte přepínač &quot;Přidat fotku&quot; a nahrajte obrázek ve vhodné kvalitě.
                  </p>
                </div>
                <blockquote>
                  <p><strong>Zelené přepínače</strong> u jednotlivých polí slouží k zapnutí nebo vypnutí konkrétní položky v životopise.</p>
                  <p>Pokud je přepínač aktivní <strong>(zelený)</strong>, tato informace bude zahrnuta ve výsledném CV.</p>
                  <p>Pokud je vypnutý  <strong>(červený)</strong>, údaj se do životopisu nedostane.</p>
                  <p>Můžete si tak snadno zvolit, které informace chcete nebo nechcete prezentovat.</p>
                  <p><strong>Základní nastavení je &quot;vypnuto&quot;, takže pokud chcete danou sekci použít, musíte jí nejdříve zapnou přepínačem.</strong></p>
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
                  alt="Krok 2 – Vzdělání"
                  width={1084}
                  height={288}
                  className={styles.guideImage}
                  loading="lazy"
                />
              </picture>
              <div className={styles.guideTextWrapper}>
                <div className={styles.guideText}>
                  <h2>Krok 2: Vzdělání</h2>
                  <p>
                    V této části vyplňujete vaše vzdělání. Každý záznam by měl obsahovat <strong>dosažené vzdělání</strong>, <strong>název školy</strong>, <strong>obor</strong> a <strong>rok ukončení studia</strong>. Tyto údaje jsou zásadní pro celkovou důvěryhodnost životopisu.
                  </p>
                  <p>
                    Doporučujeme zadávat jednotlivé školy od <strong>nejnovější po nejstarší</strong>. Nejvyšší dosažené vzdělání by mělo být uvedeno jako první v seznamu. Personalista tak hned uvidí váš aktuální stav vzdělání.
                  </p>

                  <p>
                    Pokud máte více škol, přidejte každý záznam zvlášť pomocí tlačítka <strong>Přidat vzdělání</strong>. Vyplnění více škol je vhodné zejména pokud jste absolvovali například bakalářské a navazující magisterské studium, nebo pokud uvádíte střední i vysokou školu.
                  </p>

                  <p>
                    Rok ukončení je povinný údaj – pomáhá personalistovi orientovat se v časové ose vašeho vzdělání.
                  </p>
                </div>
                <blockquote>
                  <p>Každý záznam můžete kdykoliv upravit pomocí ikony <FaEdit style={{ color: "#11539e", verticalAlign: "middle" }} /> (&quot;Upravit&quot;)</p>
                  <p>Nebo zcela odstranit kliknutím na ikonu  <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> (&quot;Smazat&quot;)</p>
                  <p>Editace umožňuje rychle opravovat překlepy nebo doplňovat informace, mazání zase slouží k odstranění starých či nepotřebných údajů.</p> 
                  <p>Díky tomu udržíte vzdělání přehledné a aktuální.</p>
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
                    Sekce <strong>Kurzy a certifikáty</strong> slouží k doplnění dalších dovedností, které jste získali mimo klasické školní vzdělávání. Patří sem například jazykové zkoušky, odborné certifikace, profesní kurzy, online školení nebo školení od zaměstnavatele.
                  </p>

                  <p>
                    Celá tato sekce je <strong>nepovinná</strong>. Pokud nemáte žádné kurzy nebo certifikáty k uvedení, klidně ji přeskočte – životopis zůstane plně platný.
                  </p>

                  <p>
                    Pokud ale nějaké kurzy, certifikace nebo školení uvádíte, vždy vyplňte <strong>název kurzu</strong>, <strong>pořádající instituci</strong> a <strong>rok absolvování</strong>. . Díky tomu bude vaše vzdělání působit důvěryhodně a personalista snadno pozná vaše snahy o rozvoj.
                  </p>

                  <p>
                    Zadávejte kurzy od <strong>nejnovějších po nejstarší</strong>, podobně jako u sekce vzdělání. Nejaktuálnější znalosti a dovednosti by měly být na prvním místě.
                  </p>
                </div>
                <blockquote>
                  <p>Každý záznam můžete kdykoliv upravit pomocí ikony  <FaEdit style={{ color: "#11539e", verticalAlign: "middle" }} /> (&quot;Upravit&quot;)</p>
                  <p>Nebo zcela odstranit kliknutím na ikonu  <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> (&quot;Smazat&quot;)</p>
                  <p>Editace umožňuje rychle opravovat překlepy nebo doplňovat informace, mazání zase slouží k odstranění starých či nepotřebných údajů.</p> 
                  <p><strong style={{ color: "red"}}>Celá tato sekce je nepovinná. Pokud nemáte žádné kurzy nebo certifikáty k uvedení, klidně ji přeskočte – její základní stav je &quot;vypnuto&quot;.</strong></p>
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
                  alt="Krok 4 – Jazyky"
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
                    V části <strong>Jazykové znalosti</strong> uveďte všechny jazyky, které ovládáte (včetně rodného). Pro každý jazyk vyberte také úroveň své znalosti.
                  </p>
                  <p>
                    U každého jazyka vždy vyplňte jeho název (například &quot;Anglický jazyk&quot;, &quot;Německý jazyk&quot; apod.) a poté klikněte na odpovídající úroveň vašich znalostí.
                  </p>

                  <p>
                    Jazykové znalosti uvádějte v pořadí podle vaší úrovně – od nejvyšší po nejnižší.
                  </p>
                </div>
                <blockquote>
                  <p><strong style={{ color: "#444"}}>Vysvětlení úrovní znalosti jazyka podle CEFR:</strong></p>
                  <p><strong style={{ color: "#444"}}>A1</strong> – začátečník</p>
                  <p><strong style={{ color: "#444"}}>A2</strong> – mírně pokročilý</p>
                  <p><strong style={{ color: "#444"}}>B1</strong> – středně pokročilý</p>
                  <p><strong style={{ color: "#444"}}>B2</strong> – pokročilý</p>
                  <p><strong style={{ color: "#444"}}>C1</strong> – velmi pokročilý</p>
                  <p><strong style={{ color: "#444"}}>C2</strong> – téměř rodilý mluvčí</p>
                  <p><strong style={{ color: "#444"}}>Rodilý mluvčí</strong> – jazyk používáte jako svůj hlavní a bez omezení</p>
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
                  alt="Krok 5 – Dovednosti"
                  width={1084}
                  height={568}
                  className={styles.guideImage}
                  loading="lazy"
                />
              </picture>
              <div className={styles.guideTextWrapper}>
                <div className={styles.guideText}>
                  <h2>Krok 5: Dovednosti</h2>
                  <p>
                    V sekci <strong>Dovednosti</strong> můžete uvést všechny své klíčové schopnosti a znalosti, které jsou relevantní pro pozici, o kterou se ucházíte.
                  </p>
                  <p>
                    Zadat dovednosti lze dvěma způsoby:<br/> A) <strong>Manuálně je napíšete do textového pole </strong> a poté je přidáte stisknutím tlačítka <strong>„Přidat“</strong><br/> B) <strong>Vyberete z nabídky nejčastějších dovedností</strong> – stačí kliknout na políčko s vybraným názvem dovednosti a automaticky se vám přidá do seznamu.
                  </p>
                  <p>
                    Tento systém vám umožňuje rychle doplnit například &quot;komunikativnost&quot;, &quot;týmová spolupráce&quot;, &quot;MS Excel&quot;, &quot;řízení projektů&quot; nebo jiné důležité znalosti bez zbytečného vypisování. Pokud mezi předvolenými dovednostmi nenajdete tu svou, přidejte ji ručně.
                  </p>
                  <p>
                    Doporučujeme uvádět <strong>maximálně 8–10 nejdůležitějších dovedností</strong>, abyste zachovali životopis přehledný a pro personalistu srozumitelný.
                  </p>  
                </div>
                <blockquote>
                    <p>Každý záznam můžete kdykoliv upravit pomocí ikony <FaEdit style={{ color: "#11539e", verticalAlign: "middle" }} /> (&quot;Upravit&quot;)</p>
                    <p>Nebo zcela odstranit kliknutím na ikonu  <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> (&quot;Smazat&quot;)</p>
                    <p>Editace umožňuje rychle opravovat překlepy nebo doplňovat informace, mazání zase slouží k odstranění starých či nepotřebných údajů.</p> 
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
                  alt="Krok 6 – Pracovní zkušenosti"
                  width={1084}
                  height={764}
                  className={styles.guideImage}
                  loading="lazy"
                />
              </picture>
              <div className={styles.guideTextWrapper}>
                <div className={styles.guideText}>
                  <h2>Krok 6: Pracovní zkušenosti</h2>
                  <p>
                    V sekci <strong>Pracovní zkušenosti</strong> vyplňujete své dosavadní zaměstnání a pozice, které jste v minulosti vykonávali. U každé pozice je důležité uvést <strong>název pracovní pozice</strong>, <strong>název zaměstnavatele</strong> a <strong>období, od kdy do kdy jste zde pracovali</strong>.
                  </p>
                  <p className="doporuceni">
                    Všechny pracovní pozice zadávejte vždy od <strong>nejnovější (aktuální)</strong> po <strong>nejstarší</strong>. První pozice v seznamu by měla být ta, kterou aktuálně vykonáváte nebo jste ji opustili jako poslední.
                  </p>
                  <p>Ke každé pracovní zkušenosti můžete přidat <strong>konkrétní body</strong>, které popisují vaše hlavní úkoly, odpovědnosti, dosažené úspěchy nebo projekty.</p>
                  <p>Doporučujeme u každé pozice uvést <strong>ideálně 3–8 stručných bodů</strong>.</p>  
                  <p>Personalisté tak lépe pochopí, v čem jste v práci opravdu vynikali a jaký byl váš konkrétní přínos.</p>
                  <p>
                    Pozici přidáte pomocí tlačítka <strong>Přidat zkušenost</strong>. Pokud jste změnili zaměstnání vícekrát, přidejte všechny relevantní pozice.
                  </p>   
                </div>
                <blockquote>
                    <p>Každý záznam můžete kdykoliv upravit pomocí ikony <FaEdit style={{ color: "#11539e", verticalAlign: "middle" }} /> (&quot;Upravit&quot;)</p>
                    <p>Nebo zcela odstranit kliknutím na ikonu  <FaTrash style={{ color: "#d7263d", verticalAlign: "middle" }} /> (&quot;Smazat&quot;)</p>
                    <p>Editace umožňuje rychle opravovat překlepy nebo doplňovat informace, mazání zase slouží k odstranění starých či nepotřebných údajů.</p> 
                </blockquote>
              </div>
            </div>
        </div>
    </section>
  );
}
