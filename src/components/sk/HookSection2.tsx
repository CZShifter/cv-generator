import styles from '@/scss/HookSection.module.scss'
import Link from 'next/link'
import { SITE_VERSION } from "@/config/site";

export default function HookSection2() {
  return (
    <section className={styles.Hook} id="zivotopis">
      <div className={styles.HookWrapper}>
        <div className={styles.HookTitleWrapper}>
          <h2>Ukážte sa zamestnávateľovi v tom najlepšom svetle</h2>
          <p>Motivačný list je ideálnym doplnkom k profesionálnemu životopisu. Pomáha lepšie vysvetliť, prečo sa o pozíciu uchádzate, a dáva príležitosť ukázať vašu motiváciu aj prínos pre firmu. S našou aplikáciou vytvoríte kvalitný motivačný list v priebehu niekoľkých minút, bez stresu a s istotou, že výsledok zodpovedá súčasným náborovým štandardom.</p>
          <p>Než si ale vytvoríte váš perfektný motivačný list, odporúčame začať pri  <Link href='/sk/preview'>vytvorenie životopisu online</Link>, ktorý bude tvoriť pevný základ celej žiadosti. Spolu s motivačným listom potom získate kompletnú a presvedčivú prezentáciu vašich skúseností aj motivácie.</p>
        </div>       
        <div className={styles.HookLeft}>
          <picture>
            <source srcSet={`/img/cover4.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover4.jpg?v=${SITE_VERSION}`} type="image/jpg" />
              <img
                src={`/img/cover4.jpg?v=${SITE_VERSION}`}
                alt="Muž sedí pri notebooku a premýšľal"
                width={536}      // nastav šířku dle reálného obrázku nebo layoutu
                height={366}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>
        </div>   
      </div>
    </section>
  )
}
