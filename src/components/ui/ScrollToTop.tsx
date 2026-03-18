import React, { useEffect, useMemo, useState } from "react";
import styles from "@/scss/ScrollToTop.module.scss";

export default function ScrollToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const { radius, circumference } = useMemo(() => {
    const size = 48;
    const stroke = 3;
    const r = (size - stroke) / 2;
    return { radius: r, circumference: 2 * Math.PI * r };
  }, []);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      setProgress(p);
      setVisible(scrollTop > 200);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dashOffset = circumference * (1 - progress);

  return (
    <button
      type="button"
      className={`${styles.scrollToTop} ${visible ? styles.visible : ""}`}
      onClick={handleClick}
      aria-label="Posunúť na začiatok stránky"
    >
      <svg className={styles.progress} width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <circle className={styles.track} cx="24" cy="24" r={radius} />
        <circle
          className={styles.indicator}
          cx="24"
          cy="24"
          r={radius}
          style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}
        />
      </svg>
      <span className={styles.arrow} aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.6" />
        </svg>
      </span>
    </button>
  );
}
