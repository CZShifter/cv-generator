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
        <h2>Cena služeb</h2>
        <p>Kvalitní životopis vás posune o krok blíže k vysněné práci</p>
        <div className={styles.price_wrapper}>
          <div className={styles.price_card}>
            <div className={styles.price_section}>
              <h2>Motivační dopis</h2>
              <h3>Zdarma</h3>
            </div>
            <div className={styles.price_bar}></div>
            <div className={styles.price_list}>
              <p>Formát DocX</p>
              <p>Bez registrace</p>
              <p>Žádné členství</p>
              <p>Neomezené úpravy</p>
              <Link href="/cs/motivacni-dopis" className={styles.button}>
                  Vytvořit motivační dopis
              </Link>
            </div>
          </div>
          <div className={styles.price_card2}>
            <div className={styles.price_section2}>
              <h2>Životopis</h2>
              <h3>89</h3>
            </div>
            <div className={styles.price_bar}></div>
            <div className={styles.price_list2}>
              <p>Bez registrace</p>
              <p>Splňuje požadavky HR</p>
              <p>24h možnost editace</p>
              <p>Snadné a rychlé vyplnění</p>
              <p>PDF připraveno ihned k tisku</p>
              <p>Žádné členství</p>
              <Link href="/cs/preview" className={styles.button}>
                  Vytvořit životopis
              </Link>
            </div>
          </div>   
          <div className={styles.price_card}>
            <div className={styles.price_section}>
              <h2>Motivační dopis</h2>
              <h3>Zdarma</h3>
            </div>
            <div className={styles.price_bar}></div>
            <div className={styles.price_list}>
              <p>Formát DocX</p>
              <p>Bez registrace</p>
              <p>Žádné členství</p>
              <p>Neomezené úpravy</p>
              <Link href="/cs/motivacni-dopis" className={styles.button}>
                  Vytvořit motivační dopis
              </Link>
            </div>
          </div>         
        </div>
      </div>
    </section>
  );
}
