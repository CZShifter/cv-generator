import Link from 'next/link';
import styles from '@/scss/CallToActionSection.module.scss';

export default function CallToActionSection() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <h2>Připraveni vytvořit svůj životopis?</h2>
        <p>Začněte nyní a vytvořte si moderní a profesionální životopis během několika minut.</p>
        <Link href="/cs/preview" className={styles.button}>
          Vytvořit životopis
        </Link>
      </div>
    </section>
  );
}
