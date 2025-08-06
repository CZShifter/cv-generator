import React, { useState, useRef, useEffect } from "react";
import styles from "@/scss/LanguageSelector.module.scss";
import { FaChevronDown } from "react-icons/fa";

const FLAGS = [
  { code: "cs", label: "Čeština", svg: "img/flags/cz.svg" },    // česká vlajka
  { code: "sk", label: "Slovenčina", svg: "img/flags/sk.svg" }, // slovenská vlajka
  /* { code: "en", label: "English", svg: "img/flags/gb.svg" },    // anglická vlajka (UK) */
];

export default function LanguageSelector({ current = "cs", onSelect }: { current?: string; onSelect?: (lang: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Zavření při kliknutí mimo komponentu
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = FLAGS.find(f => f.code === current) || FLAGS[0];
  const options = FLAGS.filter(f => f.code !== current);

  return (
    <div className={styles.languageSelector} ref={containerRef}>
      <button className={styles.selected} onClick={() => setOpen(v => !v)} type="button" aria-haspopup="listbox" aria-expanded={open}>
        <img src={selected.svg} alt={selected.label} width={24} height={16} />
        <span className={styles.arrow}><FaChevronDown /></span>
      </button>
      {open && (
        <ul className={styles.dropdown} role="listbox">
          {options.map(opt => (
            <li key={opt.code}>
              <button
                className={styles.option}
                onClick={() => { setOpen(false); onSelect?.(opt.code); }}
                type="button"
                role="option"
                aria-selected={opt.code === current}
              >
                <img src={opt.svg} alt={opt.label} width={24} height={16} />
                <span>{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
