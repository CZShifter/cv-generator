import Head from "next/head";
import { SITE_NAME } from "@/config/site";
import React from "react";
import styles from "@/scss/NotFound.module.scss";
export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>{`404 – Stránka nenalezena | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
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
