import styles from '@/scss/NarrativeSection2.module.scss';
import Link from 'next/link';

export default function NarrativeSection3() {
  return (
    <section className={styles.narrative}>
      <div className={styles.container}>
        <p>
          <strong>Tato aplikace nabízí jednoduchý a efektivní způsob, jak vytvořit kvalitní motivační dopis</strong> bez nutnosti hledání návodů, vzorů nebo složitého formulování vět. Stačí vyplnit několik základních údajů a během několika vteřin získáte profesionálně strukturovaný text, který bude připraven zaujmout personalisty i náborové systémy.
        </p>

        <p>
          Generátor je <strong>zcela zdarma</strong>, nevyžaduje registraci, neobsahuje žádné reklamy a neukládá žádná data. <strong>Motivační dopis si stáhnete ve formátu .docx</strong>, ihned připravený k odeslání nebo úpravám podle potřeby. Díky přehlednému rozhraní je celý proces intuitivní a výrazně rychlejší než tvorba od nuly.
        </p>

        <p>
          <strong>Motivační dopis je ideálním doplňkem k profesionálnímu životopisu</strong>. Pomáhá lépe vysvětlit, proč se o pozici ucházíte, a dává příležitost ukázat Vaši motivaci i přínos pro firmu. S touto aplikací vytvoříte kvalitní motivační dopis během několika minut – bez stresu a s jistotou, že výsledek odpovídá současným náborovým standardům.
        </p>

        <p>
          <strong>Doporučujeme začít u životopisu</strong> – <Link href='/cs/preview'><strong>vytvořte si nejprve profesionální životopis</strong></Link>, který bude tvořit pevný základ celé žádosti. Spolu s motivačním dopisem pak získáte kompletní a přesvědčivou prezentaci Vašich zkušeností i motivace.
        </p>
      </div>
    </section>
  );
}
