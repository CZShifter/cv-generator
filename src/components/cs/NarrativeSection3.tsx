import styles from '@/scss/NarrativeSection2.module.scss';
import { SITE_VERSION } from "@/config/site";

export default function NarrativeSection() {
  return (
    <main className={styles.narrative}>
      <div className={styles.container}>
        <div className={styles.NarrativeRightWrapper}>
            <picture className={styles.NarrativeleftImg}>
              <source srcSet={`/img/blog/motivacni1.webp?v=${SITE_VERSION}`} type="image/webp" />
              <source srcSet={`/img/blog/motivacni1.jpg?v=${SITE_VERSION}`} type="image/jpg" />
              <img
                src={`/img/blog/motivacni1.jpg?v=${SITE_VERSION}`}
                alt="šťastná žena ukazuje prstem"
                width={600}      // nastav šířku dle reálného obrázku nebo layoutu
                height={665}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.NarrativeleftImg}  // pokud chceš stylovat ještě obrázek samotný
                sizes="100%"
                loading="eager"
              />
            </picture>
        </div>
        <div className={styles.NarrativeLeftWrapper}>
          <h1>Motivační dopis online <span>úplně zdarma</span></h1>
          <p>S naší aplikací si motivační dopis vytvoříte jednoduše, bez nutnosti hledání návodů, vzorů nebo složitého formulování vět. Stačí vyplnit několik základních údajů a během pár vteřin získáte profesionálně strukturovaný text, který bude připraven zaujmout každého personalistu.</p>
          <p>Vytvoření je úplně zdarma, nevyžaduje registraci, neobsahuje žádné reklamy a neukládá vaše data. Motivační dopis si stáhnete ve formátu DOCX, ihned připravený k odeslání nebo úpravám podle potřeby. Díky přehlednému rozhraní je celý proces intuitivní a výrazně rychlejší než tvorba od základu.</p>
        </div>
      </div>
    </main>
  );
}
