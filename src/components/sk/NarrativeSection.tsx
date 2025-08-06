import styles from '@/scss/NarrativeSection.module.scss';
import SwiperSection from '@/components/SwiperSection';

export default function NarrativeSection() {
  return (
    <main className={styles.narrative}>
      <div className={styles.container}>
        <div className={styles.NarrativeLeftWrapper}>
          <h2>Štruktúrovaný <span><strong>životopis online </strong></span> za pár minút!</h2>
          <p>Vytvoriť <strong>profesionálny životopis</strong> by nemalo byť zložité ani časovo náročné. Napriek tomu sa mnohí uchádzači denne stretávajú s neprehľadnými editormi, chaotickými šablónami a nutnosťou registrácie do služieb, ktoré sľubujú viac, než dodajú. Táto aplikácia vznikla ako priamy odpoveď na tieto problémy.</p>
          <p>Aplikácia je navrhnutá tak, aby šetrila Váš čas aj trpezlivosť. <strong>Nevyžaduje žiadnu registráciu</strong>, neukladá Vaše osobné údaje a neobsahuje žiadne predplatné ani skryté poplatky. Platíte raz, používate naplno. <strong>Všetko prebieha bezpečne</strong> vo Vašom prehliadači.</p>
          <p>Formulár je intuitívny a <strong>doplnený živým náhľadom</strong>. Vďaka tomu presne vidíte, čo vytvárate. Výsledkom je elegantné PDF pripravené na odoslanie.</p>
          <p>A ak potrebujete aj <a href='/sk/motivacni-dopis'>motivačný list</a>, aplikácia ponúka jeho generovanie <strong>úplne zadarmo</strong>. Jednoducho a bez záväzkov.</p>
        </div>
        <div className={styles.NarrativeRightWrapper}>
          <SwiperSection />
        </div>
      </div>
    </main>
  );
}
