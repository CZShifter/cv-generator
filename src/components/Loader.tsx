import React from "react";
import styles from "@/scss/Loader.module.scss";

const Loader: React.FC = () => (
  <div className={styles.loaderGlobal}>
    <div className={styles.loaderBox}>
      {/* Animace – otáčející se stránky */}
      <div className={styles.pagesAnim}>
        <div className={styles.page} />
        <div className={styles.page} />
        <div className={styles.page} />
      </div>
      <div className={styles.loaderText}>Načítám…</div>
    </div>
  </div>
);

export default Loader;
