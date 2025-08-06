import styles from '@/scss/NarrativeSection.module.scss';
import SwiperSection from '@/components/SwiperSection';

export default function NarrativeSection() {
  return (
    <main className={styles.narrative}>
      <div className={styles.container}>
        <div className={styles.NarrativeLeftWrapper}>
          <h2>Strukturovaný <span><strong>životopis online </strong></span> za pár minut!</h2>
          <p>Vytvořit <strong>profesionální životopis</strong> by nemělo být složité ani časově náročné. Přesto se mnoho uchazečů denně potýká s nečitelnými editory, nepřehlednými šablonami a nutností registrace do služeb, které slibují víc, než dodají. Tato aplikace vznikla jako přímá odpověď na tyto problémy.</p>
          <p>Aplikace je navržena tak, aby šetřila Váš čas i trpělivost. <strong>Nevyžaduje žádnou registraci</strong>, neukládá Vaše osobní údaje a neobsahuje žádné předplatné ani skryté poplatky. Platíte jednou, používáte naplno. <strong>Vše probíhá bezpečně</strong> ve Vašem prohlížeči.</p>
          <p>Formulář je intuitivní a <strong>doplněný živým náhledem</strong>. Díky tomu přesně vidíte, co vytváříte. Výsledkem je elegantní PDF připravené k odeslání.</p>
          <p>A pokud potřebujete i <a href='/cs/motivacni-dopis'>motivační dopis</a>, aplikace nabízí jeho generování <strong>zcela zdarma</strong>. Jednoduše a bez závazků.</p>
        </div>
        <div className={styles.NarrativeRightWrapper}>
          <SwiperSection />
        </div>
      </div>
    </main>
  );
}
