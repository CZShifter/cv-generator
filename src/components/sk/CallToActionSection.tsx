import Link from 'next/link';
import styles from '@/scss/CallToActionSection.module.scss';

export default function CallToActionSection() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <h2>Pripravení vytvoriť si svoj životopis?</h2>
        <p>Začnite už teraz a vytvorte si moderný a profesionálny životopis v priebehu niekoľkých minút.</p>
        <Link href="/sk/preview" className={styles.button}>
          Začať hneď
        </Link>
      </div>
    </section>
  );
}
