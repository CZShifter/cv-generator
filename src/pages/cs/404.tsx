import Head from "next/head";
import { SITE_NAME, SITE_URL } from "@/config/site";
import React from "react";
import styles from "@/scss/NotFound.module.scss";
export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>{`404 – Stránka nenalezena | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="language" content="cs" />
        <link rel="alternate" href={`${SITE_URL}/cs`} hrefLang="cs" />
        <link rel="alternate" href={`${SITE_URL}/sk`} hrefLang="sk" />
        <link rel="alternate" href={`${SITE_URL}/`} hrefLang="x-default" />
      </Head>
      <section className={styles.container}>
        <div className={styles.columnLeft}>
          <span className={styles.big}>404</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.columnRight}>
          <span className={styles.text}>
            Omlouváme se, ale stránka nebyla nalezena.
          </span>
        </div>
      </section>
    </>
  );
}
