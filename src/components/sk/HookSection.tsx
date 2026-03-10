import styles from '@/scss/HookSection.module.scss'
import { SITE_VERSION } from "@/config/site";

export default function HookSection() {
  return (
    <section className={styles.Hook} id="zivotopis">
      <div className={styles.HookWrapper}>
        <div className={styles.HookTitleWrapper}>
          <h2>Štruktúrovaný životopis online za pár minút!</h2>
          <p>Vytvoriť <a href="/sk/profese">profesionálny životopis</a> nemusí byť zložité. Mnoho uchádzačov denne zápasí s nepraktickými editormi, neprehľadnými šablónami a nutnosťou registrácie do služieb, ktoré sľubujú viac, než dodajú. Naša aplikácia vznikla ako odpoveď na tieto problémy.</p>
          <p>Formulár je intuitívny a doplnený živým náhľadom. Vďaka tomu na vás nečaká prekvapenie vo forme zlého rozloženia stránky po stiahnutí životopisu. Výsledkom je elegantné PDF pripravené na odoslanie.</p>
          <p>S našou aplikáciou ušetríte svoj čas aj trpezlivosť. Nevyžadujeme žiadnu registráciu, neukladáme vaše osobné údaje a neprekvapíme vás žiadnym predplatným ani skrytými poplatkami. Moderný životopis si vygenerujete rýchlo a jednoducho len za 4 €.</p>
        </div>       
        <div className={styles.HookLeft}>
          <picture>
            <source srcSet={`/img/cover5.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover5.jpg?v=${SITE_VERSION}`} type="image/jpg" />
              <img
                src={`/img/cover5.jpg?v=${SITE_VERSION}`}
                alt="Muž a žena si podávajú ruky"
                width={544}      // nastav šířku dle reálného obrázku nebo layoutu
                height={360}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>
        </div>   
      </div>
    </section>
  )
}



