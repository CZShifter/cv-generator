import styles from '@/scss/HookSection.module.scss'
import Link from 'next/link'
import { SITE_VERSION } from "@/config/site";

export default function HookSection2() {
  return (
    <section className={styles.Hook} id="zivotopis">
      <div className={styles.HookWrapper}>
        <div className={styles.HookTitleWrapper}>
          <h2>Ukažte se zaměstnavateli v tom nejlepším světle</h2>
          <p><strong>Motivační dopis</strong> je ideálním doplňkem strukturovaného životopisu. Pomáhá lépe vysvětlit, proč se o pozici ucházíte, a dává příležitost ukázat vaši motivaci i přínos pro firmu. S naší aplikací vytvoříte <strong>kvalitní motivační dopis během několika minut</strong>, bez stresu a s jistotou, že výsledek odpovídá současným náborovým standardům.</p>
          <p>Než si ale vytvoříte váš perfektní motivační dopis, doporučujeme začít u <Link href='/cs/preview'>vytvoření životopisu online</Link>, který bude tvořit pevný základ celé žádosti. Spolu s motivačním dopisem pak získáte kompletní a přesvědčivou prezentaci vašich zkušeností i motivace.</p>
        </div>       
        <div className={styles.HookLeft}>
          <picture>
            <source srcSet={`/img/cover4.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover4.jpg?v=${SITE_VERSION}`} type="image/jpg" />
              <img
                src={`/img/cover4.jpg?v=${SITE_VERSION}`}
                alt="Muž sedí u notebooku a přemýšl"
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
