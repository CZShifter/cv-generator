import { useState } from "react";
import Link from "next/link";
import Image from "next/image"

import styles from "@/scss/Header.module.scss";
import { FaBars, FaTimes } from "react-icons/fa";

const MENU_ITEMS = [
  { label: "Domů", href: "/" },
  { label: "Motivační dopis", href: "/motivacni-dopis" },
  { label: "Cena", href: "/cena" },
  { label: "Blog", href: "/blog" },
  { label: "Návod", href: "/navod" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/">
          <Image className={styles.logo} src="/img/logo.png" alt="Rychlý Životopis logo" width={201} height={60}/>
        </Link>
        <nav className={styles.nav}>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
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
              <Link href="/preview" className={styles.cta} onClick={closeMenu}>
                Životopis
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
