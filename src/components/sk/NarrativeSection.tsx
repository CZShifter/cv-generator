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
          <h2>Naše CV naplní očakávania <span>každého personalistu</span></h2>
          <p>Naša aplikácia ponúka riešenie, ktoré je premyslené do posledného detailu – od výberu typografie až po štruktúru jednotlivých sekcií. Všetko vychádza z reálnej praxe v oblasti HR nadnárodných korporácií a je navrhnuté tak, aby personalista v priebehu niekoľkých sekúnd získal jasnú predstavu o vašich schopnostiach, skúsenostiach a potenciáli. Váš životopis tak bude spĺňať nároky profesionálov z oblasti HR.</p>
          <p>Aplikácia zjednodušuje celý proces, bez toho, aby pritom znižovala kvalitu. Váš čas je cenný a správne štruktúrovaný životopis môže byť presne to, čo ho premení na skutočnú príležitosť.</p>
          <p>A ak potrebujete aj  <Link href='/sk/motivacni-dopis'>motivačný list</Link>, aplikácia ponúka jeho generovanie úplne zadarmo. Jednoducho a bez záväzkov.</p>
        </div>
      </div>
    </main>
  );
}
