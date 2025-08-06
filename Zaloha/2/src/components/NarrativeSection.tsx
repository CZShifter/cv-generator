import styles from '@/scss/NarrativeSection.module.scss';
import SwiperSection from '@/components/SwiperSection';

export default function NarrativeSection() {
  return (
    <main className={styles.narrative}>
      <div className={styles.container}>
        <div className={styles.NarrativeLeftWrapper}>
          <h2>Strukturovaný <span><strong>životopis online </strong></span> za pár minut!</h2>
          <p>
            V dnešním uspěchaném světě má každý méně času, ale zároveň vyšší nároky. Právě proto jsem vytvořil tento nástroj, aby Vám ušetřil hodiny hledání správné šablony, formátování v textových editorech a stresu z neprofesionální prezentace. Tento <strong>online generátor životopisů</strong> umožňuje vytvořit elegantní a přehledné CV během několika minut.<strong> Bez registrace a bez nutnosti cokoliv instalovat.</strong>
          </p>
          <p>
            Vše, co potřebujete, je základní připojení k internetu a pár minut času. Vyberete si jednu z moderních šablon, které jsem navrhl s ohledem na aktuální náborové trendy. Poté <strong>jednoduše vyplníte své údaje do přehledného formuláře</strong> a během několika vteřin <strong>systém automaticky vytvoří Váš životopis.</strong> Následně Vám vygenerje profesionálně vypadající PDF soubor ke stažení. V případě potřeby můžete také vygenerovat <a href='/motivacni-dopis'>motivační dopis</a> a to úplně zdarma.
          </p>
        </div>
        <div className={styles.NarrativeRightWrapper}>
          <SwiperSection />
        </div>
      </div>
    </main>
  );
}
