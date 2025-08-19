import React, { useState } from "react";
import Head from "next/head";
import { trackGAEvent } from "@/utils/analytics";
import { SITE_MAIL, SELLER_COMPANY, SELLER_IC, SELLER_ADDRESS, SELLER_ADDRESS_CITY, SITE_VERSION } from "@/config/site";
import styles from "@/scss/KontaktSection.module.scss";

const FAQ_ITEMS = [
  {
  question: "Ako rýchlo získam hotový životopis?",
  answer: "Životopis si môžete stiahnuť ihneď po vyplnení formulára a jeho zaplatení.",
  },
  {
    question: "Môžem svoj životopis neskôr upraviť?",
    answer: "Áno, po zaplatení máte 24 hodín na úpravu CV.",
  },
  {
    question: "Ako prebieha platba?",
    answer: "Platba prebieha online cez zabezpečenú platobnú bránu a to bez registrácie.",
  },
  {
    question: "Čo ak mám problém so stiahnutím PDF?",
    answer: "Stačí nám napísať e-mail a všetko obratom vyriešime.",
  },
  {
    question: "Čo ak má môj životopis viac strán?",
    answer: "Ničomu to nevadí, aplikácia vie vytvárať aj viacstránkové PDF.",
  },
  {
    question: "Môžem zmeniť šablónu po zaplatení?",
    answer: "Nie, platba sa vzťahuje iba na jednu šablónu.",
  },
  {
    question: "Ako dlho aplikácia uchováva moje dáta?",
    answer: "24 hodín od zaplatenia ich musí uchovať kvôli možnosti editácie. Potom ich maže.",
  },
  {
    question: "Aké údaje musím vyplniť?",
    answer: "Vypĺňate len relevantné údaje pre HR. Všetko je prehľadne rozdelené vo formulári.",
  },
  {
    question: "Dostanem doklad o zaplatení?",
    answer: "Áno, po úhrade sa vám spolu so životopisom vygeneruje aj doklad o zaplatení.",
  },
  {
    question: "Ako vám môžem poslať spätnú väzbu alebo návrh?",
    answer: "Spätnú väzbu radi prijmeme e-mailom. Každý podnet nám pomôže aplikáciu zlepšiť.",
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
        <link rel="preload" as="image" href={`/img/cartoon_cv7.webp?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/cartoon_cv7.png?v=${SITE_VERSION}`}/>
      </Head>
      <div className={styles.SectionWrapper}>
        <h1 className={styles.heading}>Kontaktujte nás</h1>
        <p>Potrebujete poradiť? Alebo nám chcete napísať spätnú väzbu? Ozvite sa!</p>
        <div className={styles.contact_wrapper}>
          {/* Vrchní sekce */}
          <div className={styles.left_wrapper}>
            {/* Sekce O nás */}
            <div className={styles.oNas}>
              <h2>Naša motivácia</h2>
              <p>Veríme, že vytvoriť profesionálny životopis by malo byť jednoduché, rýchle a dostupné pre každého.</p>
              <p>Zameriavame sa na kvalitu, bezpečnosť dát a maximálny užívateľský komfort. Táto aplikácia vznikla preto, aby sme odstránili zbytočnú komplikovanosť a pomohli vám získať prácu, po ktorej túžite.</p>
              <p>Každú šablónu sme navrhli tak, aby obsahovala všetky kľúčové informácie a zároveň bola graficky pútavá a prehľadná.</p>
            </div>
            <div className={styles.kontaktbox}>
              <h2>Kontakt</h2>
              <p>{SELLER_COMPANY}</p>
              <p>IČO: {SELLER_IC}</p>
              <p>Ulica: {SELLER_ADDRESS}</p>
              <p>Mesto: {SELLER_ADDRESS_CITY}</p>
              <p>E-mail: <a href={`mailto:${SITE_MAIL}`} className={styles.email} onClick={() => trackGAEvent('click', 'contact', 'email_click_sk')}>{SITE_MAIL}</a></p>
              {/* <picture>
                  <source srcSet={`/img/cartoon_cv7.webp?v=${SITE_VERSION}`} type="image/webp" />
                  <source srcSet={`/img/cartoon_cv7.png?v=${SITE_VERSION}`} type="image/png" />
                  <img
                    src={`/img/cartoon_cv7.png?v=${SITE_VERSION}`}
                    alt="Spokojený muž držící životopis"
                    width={200}      // nastav šířku dle reálného obrázku nebo layoutu
                    height={400}     // nastav výšku dle reálného obrázku nebo layoutu
                    className={styles.kontakt_img}  // pokud chceš stylovat ještě obrázek samotný
                  />
              </picture> */}
            </div>
          </div>
          {/* FAQ akordeon */}
          <div className={styles.right_wrapper}>
            <div className={styles.faq}>
              <h2 className={styles.faqHeading}>Najčastejšie otázky</h2>
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
