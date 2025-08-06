// src/components/Footer.tsx
import {  SITE_NAME_SK } from "@/config/site";
import styles from '@/scss/Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© {new Date().getFullYear()} {SITE_NAME_SK} Všetky práva vyhradené.</p>
        <div className={styles.odkazy_wrapper}>
        <p><a href="/sk/dokumenty/obchodni-podminky" target="_blank" rel="noopener noreferrer">Obchodné podmienky</a></p>
        <p>|</p>
        <p><a href="/sk/dokumenty/gdpr" target="_blank" rel="noopener noreferrer">Ochrana osobných údajov</a></p>
        </div>
      </div>
    </footer>
  );
}
