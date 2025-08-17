import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"
import { SITE_VERSION } from "@/config/site";
import styles from "@/scss/Header.module.scss";
import { FaBars, FaTimes } from "react-icons/fa";
import LanguageSelector from "@/components/LanguageSelector";

const MENU_ITEMS = [
  { label: "Domov", href: "/sk" },
  { label: "Motivačný list", href: "/sk/motivacni-dopis" },
  { label: "Cena", href: "/sk/#cena" },
  { label: "Blog", href: "/sk/blog" },
  { label: "Návod", href: "/sk/navod" },
  { label: "Kontakt", href: "/sk/kontakt" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
  if (menuOpen) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }

  // pro jistotu odstranění při unmount
  return () => {
    document.body.classList.remove("no-scroll");
  };
}, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/sk">
          <Image className={styles.logo} src={`/img/logo_SK_nove_barevny.png?v=${SITE_VERSION}`} alt="Rychlý Životopis logo" width={201} height={60} priority/>
        </Link>
        <nav className={styles.nav}>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Zavrieť menu" : "Otvoriť menu"}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <ul className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
            {MENU_ITEMS.map(({ label, href }) => (
              <li key={href} className={styles.menuItem}>
                <Link
                  href={href}
                  className={styles.menuLink}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className={styles.menuItem}>
              <Link href="/sk/preview" className={styles.cta} onClick={closeMenu}>
                Životopis
              </Link>
            </li>
            <LanguageSelector
              current="sk"
              onSelect={lang => {
                // Custom logika...
                const segments = window.location.pathname.split("/").filter(Boolean);
                if (["cs", "sk"].includes(segments[0])) {
                  segments[0] = lang;
                } else {
                  segments.unshift(lang);
                }
                const newPath = "/" + segments.join("/");
                window.location.pathname = newPath;
              }}
            />
          </ul>
        </nav>
      </div>
    </header>
  );
}
