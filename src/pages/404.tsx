import Head from "next/head";
import { SITE_NAME, FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL } from "@/config/site";
import React from "react";
import styles from "@/scss/NotFound.module.scss";
export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>{`404 – Stránka nenalezena | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content="Je nám líto, ale stránka, kterou hledáte, neexistuje nebo byla přesunuta."/>
        <meta name="robots" content="noindex, follow" />
        <meta name="googlebot" content="noindex, follow" />
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
      </Head>
      <section className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.columnLeft}>
            <span className={styles.big}>404</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.columnRight}>
            <span className={styles.text}>
              Omlouváme se, ale stránka nebyla nalezena.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
