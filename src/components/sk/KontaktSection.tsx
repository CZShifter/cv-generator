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
    question: "Môžem si svoj životopis neskôr upraviť?",
    answer: "Áno, po zaplatení máte 24 hodín na úpravu svojho CV.",
  },
  {
    question: "Ako prebieha platba?",
    answer: "Platba prebieha online cez zabezpečenú platobnú bránu a to bez registrácie.",
  },
  {
    question: "Čo ak mám problém so stiahnutím PDF?",
    answer: "Stačí mi napísať e-mail a všetko obratom vyriešime.",
  },
  {
    question: "Čo ak má môj životopis viac strán?",
    answer: "To vôbec nevadí, aplikácia podporuje aj viacstranové PDF.",
  },
  {
    question: "Môžem zmeniť šablónu po zaplatení?",
    answer: "Nie, platba sa vzťahuje len na jednu šablónu.",
  },
  {
    question: "Ako dlho aplikácia uchováva Vaše údaje?",
    answer: "24 hodín od zaplatenia – počas tejto doby môžete CV upravovať, potom sú údaje zmazané.",
  },
  {
    question: "Aké údaje musím vyplniť?",
    answer: "Vyplňujete len relevantné údaje pre HR. Všetko je prehľadne rozdelené vo formulári.",
  },
  {
    question: "Dostanem doklad o zaplatení?",
    answer: "Áno, po úhrade sa spolu so životopisom vygeneruje aj doklad o zaplatení.",
  },
  {
    question: "Ako Vám môžem poslať spätnú väzbu alebo návrh?",
    answer: "Spätnú väzbu rád prijmem e-mailom. Každý podnet mi pomáha aplikáciu vylepšiť.",
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
      <h1 className={styles.heading}>Kontaktujte ma</h1>
      <p>Potrebujete poradiť? Alebo mi chcete napísať spätnú väzbu? Ozvite sa!</p>
      <div className={styles.contact_wrapper}>
        {/* Vrchní sekce */}
        <div className={styles.left_wrapper}>
          {/* Sekce O nás */}
          <div className={styles.oNas}>
            <h2>Moja motivácia</h2>
            <p>Som nezávislý vývojár, ktorý verí, že vytvoriť profesionálny životopis by malo byť jednoduché, rýchle a dostupné pre každého.</p>
            <p>Zameriavam sa na kvalitu, bezpečnosť dát a maximálny používateľský komfort. Táto aplikácia vznikla preto, aby som odstránil zbytočnú zložitosť a pomohol Vám získať prácu, po ktorej túžite.</p>
            <p>Každú šablónu som navrhol tak, aby obsahovala všetky kľúčové informácie a zároveň bola graficky pútavá a prehľadná.</p>
          </div>
          <div className={styles.kontaktbox}>
            <h2>Kontakt</h2>
            <p>{SELLER_COMPANY}</p>
            <p>IČO: {SELLER_IC}</p>
            <p>Ulica: {SELLER_ADDRESS}</p>
            <p>Mesto: {SELLER_ADDRESS_CITY}</p>
            <p>E-mail: <a href={`mailto:${SITE_MAIL}`} className={styles.email} onClick={() => trackGAEvent('click', 'contact', 'email_click_sk')}>{SITE_MAIL}</a></p>
            <picture>
                <source srcSet={`/img/cartoon_cv7.webp?v=${SITE_VERSION}`} type="image/webp" />
                <source srcSet={`/img/cartoon_cv7.png?v=${SITE_VERSION}`} type="image/png" />
                <img
                  src={`/img/cartoon_cv7.png?v=${SITE_VERSION}`}
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
    </section>
  );
}
