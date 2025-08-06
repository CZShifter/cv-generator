import React, { useState, useRef, useEffect } from "react";
import styles from "@/scss/LanguageSelector.module.scss";
import { FaChevronDown } from "react-icons/fa";

const FLAGS = [
  { code: "cs", label: "Čeština", svg: "/img/flags/cz.svg" },
  { code: "sk", label: "Slovenčina", svg: "/img/flags/sk.svg" },
  // { code: "en", label: "English", svg: "img/flags/gb.svg" },
];

type LanguageSelectorProps = {
  current?: string;
  onSelect?: (lang: string) => void;
};

export default function LanguageSelector({ current = "cs", onSelect }: LanguageSelectorProps) {
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

  // Výchozí logika přepnutí jazyka (přepíše prefix v URL a reloadne)
  function switchLanguage(lang: "cs" | "sk") {
    const segments = window.location.pathname.split("/").filter(Boolean);
    if (["cs", "sk"].includes(segments[0])) {
      segments[0] = lang;
    } else {
      segments.unshift(lang);
    }
    const newPath = "/" + segments.join("/");
    window.location.pathname = newPath;
  }

  // Univerzální handler
  function handleSelect(lang: "cs" | "sk") {
    setOpen(false);
    if (onSelect) onSelect(lang);
    else switchLanguage(lang);
  }

  return (
    <div className={styles.languageSelector} ref={containerRef}>
      <button
        className={styles.selected}
        onClick={() => setOpen(v => !v)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <img src={selected.svg} alt={selected.label} width={24} height={16} />
        <span className={styles.arrow}><FaChevronDown /></span>
      </button>
      {open && (
        <ul className={styles.dropdown} role="listbox">
          {options.map(opt => (
            <li key={opt.code}>
              <button
                className={styles.option}
                onClick={() => handleSelect(opt.code as "cs" | "sk")}
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
