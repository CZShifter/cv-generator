// src/components/Footer.tsx
import { SITE_URL, OG_IMAGE, SITE_NAME } from "../config/site";
import styles from '@/scss/Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© {new Date().getFullYear()} {SITE_NAME}. Všechna práva vyhrazena.</p>
        <div className={styles.odkazy_wrapper}>
        <p><a href="/dokumenty/obchodni-podminky" target="_blank" rel="noopener noreferrer">Obchodní podmínky</a></p>
        <p>|</p>
        <p><a href="/dokumenty/gdpr" target="_blank" rel="noopener noreferrer">Ochrana osobních údajů</a></p>
        </div>
      </div>
    </footer>
  );
}
