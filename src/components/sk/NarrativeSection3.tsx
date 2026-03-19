import styles from '@/scss/NarrativeSection2.module.scss';
import { SITE_VERSION } from "@/config/site";
import Link from "next/link";

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
                alt="Žena sedí na stoličke a číta motivačný list"
                width={600}      // nastav šířku dle reálného obrázku nebo layoutu
                height={665}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.NarrativeleftImg}  // pokud chceš stylovat ještě obrázek samotný
                sizes="100%"
                loading="eager"
              />
            </picture>
        </div>
        <div className={styles.NarrativeLeftWrapper}>
          <h1>Motivačný list online <span>úplne zadarmo</span></h1>
          <p>S našou aplikáciou si <strong>motivačný list vytvoríte jednoducho</strong>, bez nutnosti hľadania návodov, vzorov alebo zložitého formulovania viet. Stačí vyplniť niekoľko základných údajov a behom pár sekúnd získate profesionálne štruktúrovaný text, ktorý bude pripravený zaujať každého personalistu.</p>
          <p><strong>Vytvorenie je úplne zadarmo</strong>, nevyžaduje registráciu, neobsahuje žiadne reklamy a neukladá vaše dáta. <strong>Motivačný list si stiahnete vo formáte DOCX</strong>, ihneď pripravený na odoslanie alebo úpravy podľa potreby. Vďaka prehľadnému rozhraniu je celý proces intuitívny a výrazne rýchlejší ako tvorba od základu.</p>
          <p>Ak si chcete motivačný list napísať sami, na blogu nájdete <Link href="/sk/blog/ako-napisat-motivacny-list">podrobný návod</Link>, ako ho správne štruktúrovať, čo doň uviesť a čomu sa vyhnúť.</p>
        </div>
      </div>
    </main>
  );
}
