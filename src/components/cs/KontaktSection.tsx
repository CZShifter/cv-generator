import React, { useState } from "react";
import Head from "next/head";
import { trackGAEvent } from "@/utils/analytics";
import { SITE_MAIL, SELLER_COMPANY, SELLER_IC, SELLER_ADDRESS, SELLER_ADDRESS_CITY, /* SITE_VERSION */ } from "@/config/site";
import styles from "@/scss/KontaktSection.module.scss";

const FAQ_ITEMS = [
  {
    question: "Jak rychle získám hotový životopis?",
    answer: "Životopis si můžete stáhnout ihned po vyplnění formuláře a jeho zaplacení.",
  },
  {
    question: "Mohu svůj životopis později upravit?",
    answer: "Ano, po zaplacení máte 24 hodin na úpravu CV.",
  },
  {
    question: "Jak probíhá platba?",
    answer: "Platba probíhá online přes zabezpečenou platební bránu a to bez registrace.",
  },
  {
    question: "Co když mám problém se stažením PDF?",
    answer: "Stačí nám napsat e-mail a vše obratem vyřešíme.",
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
    question: "Jak dlouho aplikace uchovává moje data?",
    answer: "24 hodin od zaplacení je musí uchovat kvůli možnosti editace. Poté je maže.",
  },
  {
    question: "Jaké údaje musím vyplnit?",
    answer: "Vyplňujete jen relevantní údaje pro HR. Vše je přehledně rozděleno ve formuláři.",
  },
  {
    question: "Dostanu doklad o zaplacení?",
    answer: "Ano, po úhradě se vám spolu s životopisem vygeneruje i doklad o zaplacení.",
  },
  {
    question: "Jak vám mohu poslat zpětnou vazbu nebo návrh?",
    answer: "Zpětnou vazbu rádi přijmeme e-mailem. Každý podnět nám pomůže aplikaci zlepšit.",
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
      <div className={styles.SectionWrapper}>
        <h1 className={styles.heading}>Kontaktujte nás</h1>
        <p>Potřebujete poradit? Nebo nám chcete napsat zpětnou vazbu? Ozvěte se!</p>
        <div className={styles.contact_wrapper}>
          {/* Vrchní sekce */}
          <div className={styles.left_wrapper}>
            {/* Sekce O nás */}
            <div className={styles.oNas}>
              <h2>Naše motivace</h2>
              <p>Věříme, že vytvořit strukturovaný životopis by mělo být jednoduché, rychlé a dostupné pro každého</p>
              <p>Zaměřujeme se na kvalitu, bezpečnost dat a maximální uživatelský komfort. Tato aplikace vznikla proto, abychom odstranili zbytečnou komplikovanost a pomohli vám získat práci, po které toužíte.</p>
              <p>Každou šablonu jsme navrhli tak, aby obsahovala všechny klíčové informace a zároveň byla graficky poutavá a přehledná.</p>
            </div>
            <div className={styles.kontaktbox}>
              <h2>Kontakt</h2>
              <p>{SELLER_COMPANY}</p>
              <p>IČO: {SELLER_IC}</p>
              <p>Ulice: {SELLER_ADDRESS}</p>
              <p>Město: {SELLER_ADDRESS_CITY}</p>
              <p>E-mail: <a href={`mailto:${SITE_MAIL}`} className={styles.email} onClick={() => trackGAEvent('click', 'contact', 'email_click')}>{SITE_MAIL}</a></p>
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
      </div>
    </section>
  );
}
