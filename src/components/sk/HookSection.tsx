import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/HookSection.module.scss'
import Link from 'next/link'
import { SITE_VERSION } from "@/config/site";

export default function HookSection() {
  return (
    <section className={styles.Hook} id="zivotopis">
      <div className={styles.HookWrapper}>
        <div className={styles.HookLeft}>
          <picture>
            <source srcSet={`/img/cover6.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover6.jpg?v=${SITE_VERSION}`} type="image/jpg" />
              <img
                src={`/img/cover6.jpg?v=${SITE_VERSION}`}
                alt="Muž vytváří životopis"
                width={250}      // nastav šířku dle reálného obrázku nebo layoutu
                height={400}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>
            <div className={styles.HookLeftColumn}>
            <picture>
              <source srcSet={`/img/cover3.webp?v=${SITE_VERSION}`} type="image/webp" />
              <source srcSet={`/img/cover3.jpg?v=${SITE_VERSION}`} type="image/jpg" />
              <img
              src={`/img/cover3.jpg?v=${SITE_VERSION}`}
              alt="Zaměstnanic psuzují životopis"
              width={400}      // nastav šířku dle reálného obrázku nebo layoutu
              height={400}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HookleftImg2}  // pokud chceš stylovat ještě obrázek samotný
            />
            </picture>
            <picture>
            <source srcSet={`/img/cover5.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover5.jpg?v=${SITE_VERSION}`} type="image/jpg" />
            <img
              src={`/img/cover5.jpg?v=${SITE_VERSION}`}
              alt="Muž si potřásá rukou se ženou"
              width={400}      // nastav šířku dle reálného obrázku nebo layoutu
              height={400}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HookleftImg3}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>        
            </div>
        </div>
        <div className={styles.HookTitleWrapper}>
          <h2>Rýchlejšie vyplňovanie<br></br>vďaka <span>umelej inteligencii</span></h2>
          <p>Táto aplikácia využíva umelú inteligenciu na to, aby Vám čo najviac uľahčila prácu.
              Pomocou integrovaného nástroja na generovanie ponúkne návrh textu podľa toho, čo zadáte. Či už ide o pracovné skúsenosti, zručnosti alebo osobný profil.</p>
          <p>Návrhy nie sú konečné – môžete ich ľubovoľne upravovať alebo použiť ako inšpiráciu. Všetko prebieha automaticky, bez potreby prihlásenia alebo registrácie.</p>
          <div>
            <Link href="/sk/preview" className={styles.cta}>Vybrať šablónu</Link>
          </div>
        </div>          
      </div>
    </section>
  )
}
