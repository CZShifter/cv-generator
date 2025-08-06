import React from "react";
import Link from 'next/link';
import styles from "@/scss/PriceSection.module.scss";
import { SITE_VERSION } from "@/config/site";

export default function PriceSection() {

  return (
    <section className={styles.container}>
        <h1>Cena životopisu</h1>
        <p>Verím, že kvalitný životopis Vás posunie o krok bližšie k vysnívanej práci</p>
        <div className={styles.price_wrapper}>
            <div className={styles.price_card}>
                <div className={styles.price_sectionSK}>
                    <h2>4</h2>
                    <p><em>*Cena za vytvorenie jedného životopisu</em></p>
                </div>
                <div className={styles.price_bar}></div>
                <div className={styles.price_list}>
                    <p>100% bez reklám</p>
                    <p>Úplne bez registrácie</p>
                    <p>Spĺňa všetky požiadavky HR</p>
                    <p>Životopis je dostupný 24h na úpravu</p>
                    <p>PDF pripravené ihneď na tlač</p>
                    <p>Jednoduché a rýchle vyplnenie</p>
                    <p>Žiadne členstvo</p>
                    <Link href="/sk/preview" className={styles.button}>
                        Vytvoriť životopis
                    </Link>
                </div>
            </div>
            <div className={styles.price_description_card}>
                <div className={styles.price_description_card_img}>
                  <picture>
                    <source srcSet={`/img/cartoon_cv8.webp?v=${SITE_VERSION}`} type="image/webp" />
                    <source srcSet={`/img/cartoon_cv8.png?v=${SITE_VERSION}`} type="image/png" />
                      <img
                          src={`/img/cartoon_cv8.png?v=${SITE_VERSION}`}
                          alt="Spokojený muž držící životopis"
                          width={360}      // nastav šířku dle reálného obrázku nebo layoutu
                          height={530}     // nastav výšku dle reálného obrázku nebo layoutu
                          className={styles.price_description_img}  // pokud chceš stylovat ještě obrázek samotný
                        />
                  </picture>
                </div>
                <div className={styles.price_description_list}>
                    <ul>
                        <li>
                          Profesionálny  životopis
                        </li>
                        <li>
                          Prehľadný a jasný obsah
                        </li>
                        <li>
                          Hotový za pár minút
                        </li>
                        <li>
                          Jednoduchá úprava údajov
                        </li>
                        <li>
                          Okamžitý export do PDF
                        </li>
                        <li>
                          Bez nutnosti znalosti grafiky
                        </li>
                        <li>
                          Podporované umelou inteligenciou
                        </li>
                        <li>
                          Kompletné v slovenčine
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
  );
}
