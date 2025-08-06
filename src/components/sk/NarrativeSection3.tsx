import styles from '@/scss/NarrativeSection2.module.scss';
import Link from 'next/link';

export default function NarrativeSection3() {
  return (
    <section className={styles.narrative}>
      <div className={styles.container}>
        <p>
          <strong>Táto aplikácia ponúka jednoduchý a efektívny spôsob, ako vytvoriť kvalitný motivačný list</strong> bez nutnosti hľadať návody, vzory alebo zložito formulovať vety. Stačí vyplniť niekoľko základných údajov a behom pár sekúnd získate profesionálne štruktúrovaný text, ktorý zaujme personalistov aj náborové systémy.
        </p>

        <p>
          Generátor je <strong>úplne zadarmo</strong>, nevyžaduje registráciu, neobsahuje žiadne reklamy a neukladá žiadne údaje. <strong>Motivačný list si stiahnete vo formáte .docx</strong>, okamžite pripravený na odoslanie alebo úpravy podľa potreby. Vďaka prehľadnému rozhraniu je celý proces intuitívny a výrazne rýchlejší než tvorba od nuly.
        </p>

        <p>
          <strong>Motivačný list je ideálnym doplnkom k profesionálnemu životopisu</strong>. Pomáha lepšie vysvetliť, prečo sa o pozíciu uchádzate, a dáva príležitosť ukázať Vašu motiváciu aj prínos pre firmu. S touto aplikáciou vytvoríte kvalitný motivačný list behom pár minút – bez stresu a s istotou, že výsledok zodpovedá súčasným náborovým štandardom.
        </p>

        <p>
          <strong>Odporúčame začať životopisom</strong> – <Link href='/sk/preview'><strong>vytvorte si najskôr profesionálny životopis</strong></Link>, ktorý bude tvoriť pevný základ celej žiadosti. Spolu s motivačným listom potom získate kompletnú a presvedčivú prezentáciu Vašich skúseností aj motivácie.
        </p>
      </div>
    </section>
  );
}
