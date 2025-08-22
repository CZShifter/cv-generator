import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "@/scss//LoadingModal.module.scss";

type Props = {
  open: boolean;
  label?: string;
  sublabel?: string;
  blockEscape?: boolean;
};

export default function LoadingModal({
  open,
  label = "Ukladám…",
  sublabel = "Prosím počkajte, za okamih budete presmerovaní.",
  blockEscape = true,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open || !blockEscape) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); } };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true } as any);
  }, [open, blockEscape]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className={styles.backdrop} aria-live="assertive" aria-busy="true" aria-modal="true" role="dialog">
      <div className={styles.modal} role="document">
        <div className={styles.spinner} aria-hidden="true" />
        <div className={styles.texts}>
          <div className={styles.label}>{label}</div>
          {sublabel && <div className={styles.sublabel}>{sublabel}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
}
