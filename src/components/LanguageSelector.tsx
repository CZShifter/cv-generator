import React, { useState, useRef, useEffect } from "react";
import styles from "@/scss/LanguageSelector.module.scss";
import { FaChevronDown } from "react-icons/fa";
import Head from "next/head";
import { SITE_VERSION } from "@/config/site";

type Lang = "cs" | "sk";

const FLAGS = [
  { code: "cs" as Lang, label: "Čeština", svg: "/img/flags/cz.svg" },
  { code: "sk" as Lang, label: "Slovenčina", svg: "/img/flags/sk.svg" },
];

type LanguageSelectorProps = {
  current?: Lang;
  onSelect?: (lang: Lang) => void;
};

// Přepíše/vloží jako 1. segment /cs nebo /sk a zachová zbytek cesty
function withLangPrefix(pathname: string, lang: Lang): string {
  const seg = pathname.split("/").filter(Boolean);
  if (seg[0] === "cs" || seg[0] === "sk") seg[0] = lang;
  else seg.unshift(lang);
  return "/" + seg.join("/");
}

const PROD_HOST_CZ = "rychlyzivotopis.cz";
const PROD_HOST_SK = "rychlyzivotopis.sk";

function isProdCZ(host: string) {
  return host === PROD_HOST_CZ;
}
function isProdSK(host: string) {
  return host === PROD_HOST_SK;
}
function isVercel(host: string) {
  return /\.vercel\.app$/i.test(host);
}
function isLocalHost(host: string) {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    /\.localhost$/i.test(host) // cz.localhost / sk.localhost
  );
}

export default function LanguageSelector({ current = "cs", onSelect }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = FLAGS.find(f => f.code === current) || FLAGS[0];
  const options = FLAGS.filter(f => f.code !== current);

  function switchLanguage(lang: Lang) {
    if (typeof window === "undefined") return;

    const protocol = window.location.protocol;             // http: / https:
    const hostname = window.location.hostname;             // bez portu
    const port = window.location.port ? `:${window.location.port}` : "";
    const search = window.location.search || "";
    const hash = window.location.hash || "";
    const newPath = withLangPrefix(window.location.pathname, lang);

    // 1) PRODUKCE → přepnout TLD + nastavit prefix, zachovat cestu (bez portu)
    if (isProdCZ(hostname) || isProdSK(hostname)) {
      const targetHost = lang === "cs" ? PROD_HOST_CZ : PROD_HOST_SK;
      const targetUrl = `${protocol}//${targetHost}${newPath}${search}${hash}`;
      window.location.assign(targetUrl);
      return;
    }

    // 2) VERCEL PREVIEW → neměnit doménu, jen prefix (zachovat port)
    if (isVercel(hostname)) {
      const targetUrl = `${protocol}//${hostname}${port}${newPath}${search}${hash}`;
      window.location.assign(targetUrl);
      return;
    }

    // 3) LOKÁL (localhost / cz.localhost / sk.localhost) → neměnit doménu, jen prefix
    if (isLocalHost(hostname)) {
      const targetUrl = `${protocol}//${hostname}${port}${newPath}${search}${hash}`;
      window.location.assign(targetUrl);
      return;
    }

    // 4) Fallback (cizí prostředí) → jen prefix
    const targetUrl = `${protocol}//${hostname}${port}${newPath}${search}${hash}`;
    window.location.assign(targetUrl);
  }

  function handleSelect(lang: Lang) {
    setOpen(false);
    if (onSelect) onSelect(lang);
    else switchLanguage(lang);
  }

  return (
    <div className={styles.languageSelector} ref={containerRef}>
      <Head>
        {FLAGS.map(f => (
          <link key={f.code} rel="preload" as="image" href={`${f.svg}?v=${SITE_VERSION}`} />
        ))}
      </Head>
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
                onClick={() => handleSelect(opt.code)}
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
