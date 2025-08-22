import styles from '@/scss/NarrativeSection.module.scss';
import { SITE_VERSION } from "@/config/site";
import Link from 'next/link';

export default function NarrativeSection() {
  return (
    <main className={styles.narrative}>
      <div className={styles.container}>
        <div className={styles.NarrativeRightWrapper}>
            <picture className={styles.NarrativeleftImg}>
              <source srcSet={`/img/cover3.webp?v=${SITE_VERSION}`} type="image/webp" />
              <source srcSet={`/img/cover3.jpg?v=${SITE_VERSION}`} type="image/jpg" />
              <img
                src={`/img/cover3.jpg?v=${SITE_VERSION}`}
                alt="Skupina lidí se kouká do notebooku"
                width={600}      // nastav šířku dle reálného obrázku nebo layoutu
                height={665}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.NarrativeleftImg}  // pokud chceš stylovat ještě obrázek samotný
                sizes="100%"
                loading="eager"
              />
            </picture>
        </div>
        <div className={styles.NarrativeLeftWrapper}>
          <h2>Naše CV naplní očekávání <span>každého personalisty</span></h2>
          <p>Naše aplikace nabízí řešení, které je promyšlené do posledního detailu – od výběru typografie až po strukturu jednotlivých sekcí. Vše vychází z reálné praxe v oblasti HR nadnárodních korporací a je navrženo tak, aby personalista během několika vteřin získal jasnou představu o vašich dovednostech, zkušenostech i potenciálu. Váš životopis tak bude splňovat nároky profesionálů z oblasti HR.</p>
          <p>Aplikace zjednodušuje celý proces, aniž by přitom snižovala kvalitu. Váš čas je cenný a správně strukturovaný životopis může být přesně to, co ho promění ve skutečnou příležitost.</p>
          <p>A pokud potřebujete i <Link href='/cs/motivacni-dopis'>motivační dopis</Link> aplikace nabízí jeho generování zcela zdarma. Jednoduše a bez závazků.</p>
        </div>
      </div>
    </main>
  );
}
