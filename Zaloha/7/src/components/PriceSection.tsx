import React from "react";
import Link from 'next/link';
import styles from "@/scss/PriceSection.module.scss";
import { SITE_VERSION } from "../config/site";

export default function PriceSection() {

  return (
    <section className={styles.container}>
        <h1>Cena životopisu</h1>
        <p>Věřím, že kvalitní životopis Vás posune o krok blíže k vysněné práci</p>
        <div className={styles.price_wrapper}>
            <div className={styles.price_card}>
                <div className={styles.price_section}>
                    <h2>89</h2>
                    <p><em>*Cena za vytvoření jednoho životopisu</em></p>
                </div>
                <div className={styles.price_bar}></div>
                <div className={styles.price_list}>
                    <p>100% bez reklam</p>
                    <p>Kompletně bez registrace</p>
                    <p>Splňuje veškeré požadavky HR</p>
                    <p>Životopis je dostupný 24h k editaci</p>
                    <p>PDF připraveno ihned k tisku</p>
                    <p>Snadné a rychlé vyplnění</p>
                    <p>Žádné členství</p>
                    <Link href="/preview" className={styles.button}>
                        Vytvořit životopis
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
                          Profesionální strukturovaný životopis
                        </li>
                        <li>
                          Přehledný a jasný obsah
                        </li>
                        <li>
                          Hotové během pár minut
                        </li>
                        <li>
                          Snadná úprava údajů
                        </li>
                        <li>
                          Okamžitý export do PDF
                        </li>
                        <li>
                          Bez nutnosti znalosti grafiky
                        </li>
                        <li>
                          Podporváno umělou inteligencí
                        </li>
                        <li>
                           Kompletně v češtině
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
  );
}
