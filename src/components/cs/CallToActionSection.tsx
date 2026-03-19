import Link from 'next/link';
import styles from '@/scss/CallToActionSection.module.scss';

export default function CallToActionSection() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <h2>Připraveni vytvořit si svůj životopis?</h2>
        <p>Začněte nyní a vytvořte si moderní strukturovaný životopis online během několika minut</p>
        <Link href="/cs/preview" className={styles.button}>
          Začít ihned
        </Link>
      </div>
    </section>
  );
}
