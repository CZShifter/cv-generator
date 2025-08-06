import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { SITE_MAIL, SELLER_COMPANY, SELLER_IC, SELLER_ADDRESS, SELLER_ADDRESS_CITY, } from "../config/site";
import styles from "@/scss/KontaktSection.module.scss";

const FAQ_ITEMS = [
  {
    question: "Jak rychle získám hotový životopis?",
    answer: "Životopis si můžete stáhnout ihned po vyplnění formuláře a jeho zaplacení",
  },
  {
    question: "Mohu svůj životopis později upravit?",
    answer: "Ano, po zaplacení Vám poběží 24h. doba, po kterou můžete CV editovat",
  },
  {
    question: "Jak probíhá platba?",
    answer: "Platba probíhá online přes zabezpečenou platební bránu a to bez registrace.",
  },
  {
    question: "Co když mám problém se stažením PDF?",
    answer: "Stačí mi napsat e-mail a vše obratem vyřešíme.",
  },
  {
    question: "Co když mám životopis na více stránek?",
    answer: "Ničemu to nevadí, aplikace umí vytvářet i vícestránkové PDF.",
  },
  {
    question: "Mohu změnit šablonu po zaplacení?",
    answer: "Ne, platba se vztahuje jen na jednu šablonu.",
  },
  {
    question: "Jak dlouho aplikace uchovává Vaše data?",
    answer: "24h od zaplacení je musí uchovat kvůli možnosti editace. Poté je maže.",
  },
  {
    question: "Jaké údaje musím vyplnit?",
    answer: "Vyplňujete jen relevatní údaje pro HR. Vše je přehledně rozděleno ve formuláři.",
  },
  {
    question: "Dostanu doklad o zaplacení?",
    answer: "Ano, po úhradě se Vám spolu s životopisem vygeneruje i doklad o zaplacení.",
  },
  {
    question: "Jak vám mohu poslat zpětnou vazbu nebo návrh?",
    answer: "Zpětnou vazbu rád přijmu na e-mail. Každý podnět mi pomůže aplikaci zlepšit.",
  },
];

// JSON-LD pro Google FAQ rich snippet
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ_ITEMS.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};

export default function ContactSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className={styles.contact}>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
        />
      </Head>
      <h1 className={styles.heading}>Kontaktujte nás</h1>
      <p>Potřebujete poradit? Nebo mi chcete napsat zpětnou vazbu? Ozvěte se!</p>
      <div className={styles.contact_wrapper}>
        {/* Vrchní sekce */}
        <div className={styles.left_wrapper}>
          {/* Sekce O nás */}
          <div className={styles.oNas}>
            <h2>Moje motivace</h2>
            <p>Jsem nezávislý vývojář který věří, že vytvořit profesionální životopis by mělo být jednoduché, rychlé a dostupné pro každého.</p>
            <p>Zaměřuji se na kvalitu, bezpečnost dat a maximální uživatelský komfort. Tato platforma vznikla proto, abych odstranil zbytečnou komplikovanost a pomohl lidem získat práci po které touží.</p>
            <p>Každou šablonu jsem navrhnul tak, aby obsahovala všechny klíčové informace a zároveň byla graficky poutavá a přehledná.</p>
          </div>
          <div className={styles.kontaktbox}>
            <h2>Kontakt</h2>
            <p>{SELLER_COMPANY}</p>
            <p>IČO: {SELLER_IC}</p>
            <p>Ulice: {SELLER_ADDRESS}</p>
            <p>Město: {SELLER_ADDRESS_CITY}</p>
            <p>E-mail: <a href={`mailto:${SITE_MAIL}`} className={styles.email}>{SITE_MAIL}</a></p>
            <picture>
                <source srcSet="/img/cartoon_cv7.webp" type="image/webp" />
                <source srcSet="/img/cartoon_cv7.png" type="image/png" />
                <img
                  src="/img/cartoon_cv7.png"
                  alt="Spokojený muž držící životopis"
                  width={200}      // nastav šířku dle reálného obrázku nebo layoutu
                  height={400}     // nastav výšku dle reálného obrázku nebo layoutu
                  className={styles.kontakt_img}  // pokud chceš stylovat ještě obrázek samotný
                />
            </picture>
          </div>
        </div>
        {/* FAQ akordeon */}
        <div className={styles.right_wrapper}>
          <div className={styles.faq}>
            <h2 className={styles.faqHeading}>Nejčastější dotazy</h2>
            <div className={styles.faqList}>
              {FAQ_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className={`${styles.faqItem} ${openIndex === idx ? styles.open : ""}`}
                >
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    onClick={() => handleClick(idx)}
                    aria-expanded={openIndex === idx}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    {item.question}
                  </button>
                  <div
                    className={`${styles.faqAnswer} ${openIndex === idx ? styles.visible : styles.hidden}`}
                    id={`faq-answer-${idx}`}
                    tabIndex={-1}
                  >
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
