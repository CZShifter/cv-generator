import React from "react";
import Link from 'next/link';
import Head from "next/head";
import styles from "@/scss/PriceSection.module.scss";
import { SITE_VERSION } from "@/config/site";

export default function PriceSection() {

  return (
    <section id="cena" className={styles.container}>
      <div className={styles.MainWrapper}>
        <Head>
          <link rel="preload" as="image" href={`/img/cartoon_cv8.webp?v=${SITE_VERSION}`}/>
          <link rel="preload" as="image" href={`/img/cartoon_cv8.png?v=${SITE_VERSION}`}/>
        </Head>
        <h2>Cena služieb</h2>
        <p>Kvalitný životopis vás posunie o krok bližšie k vysnívanej práci</p>
        <div className={styles.price_wrapper}>
          <div className={styles.price_card}>
            <div className={styles.price_section}>
              <h2>Motivačný list</h2>
              <h3>Zdarma</h3>
            </div>
            <div className={styles.price_bar}></div>
            <div className={styles.price_list}>
              <p>Formát DOCX</p>
              <p>Bez registrácie</p>
              <p>Žiadne členstvo</p>
              <p>Neobmedzené úpravy</p>
              <Link href="/sk/motivacni-dopis" className={styles.button}>
                  Vytvoriť motivačný list
              </Link>
            </div>
          </div>
          <div className={styles.price_card2}>
            <div className={styles.price_sectionSK}>
              <h2>Životopis</h2>
              <h3>4</h3>
            </div>
            <div className={styles.price_bar}></div>
            <div className={styles.price_list2}>
              <p>Bez registrácie</p>
              <p>Spĺňa požiadavky HR</p>
              <p>Editácia až 24 hodin</p>
              <p>Jednoduché vyplnenie</p>
              <p>PDF pripravené ihneď na tlač</p>
              <p>Žiadne členstvo</p>
              <Link href="/sk/preview" className={styles.button}>
                  Vytvoriť životopis
              </Link>
            </div>
          </div>   
          <div className={styles.price_card}>
            <div className={styles.price_section}>
              <h2>Motivačný list</h2>
              <h3>Zdarma</h3>
            </div>
            <div className={styles.price_bar}></div>
            <div className={styles.price_list}>
              <p>Formát DOCX</p>
              <p>Bez registrácie</p>
              <p>Žiadne členstvo</p>
              <p>Neobmedzené úpravy</p>
              <Link href="/sk/motivacni-dopis" className={styles.button}>
                  Vytvoriť motivačný list
              </Link>
            </div>
          </div>         
        </div>
      </div>
    </section>
  );
}
