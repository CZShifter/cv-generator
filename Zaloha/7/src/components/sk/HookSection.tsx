import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/HookSection.module.scss'
import Link from 'next/link'
import { SITE_VERSION } from "../config/site";

export default function HookSection() {
  return (
    <section className={styles.Hook} id="zivotopis">
      <div className={styles.HookWrapper}>
        <div className={styles.HookLeft}>
          <picture>
            <source srcSet={`/img/cover6.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover6.png?v=${SITE_VERSION}`} type="image/png" />
              <img
                src={`/img/cover6.png?v=${SITE_VERSION}`}
                alt="Muž vytváří životopis"
                width={250}      // nastav šířku dle reálného obrázku nebo layoutu
                height={400}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>
            <div className={styles.HookLeftColumn}>
            <picture>
              <source srcSet={`/img/cover3.webp?v=${SITE_VERSION}`} type="image/webp" />
              <source srcSet={`/img/cover3.png?v=${SITE_VERSION}`} type="image/png" />
              <img
              src={`/img/cover3.png?v=${SITE_VERSION}`}
              alt="Zaměstnanic psuzují životopis"
              width={400}      // nastav šířku dle reálného obrázku nebo layoutu
              height={400}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HookleftImg2}  // pokud chceš stylovat ještě obrázek samotný
            />
            </picture>
            <picture>
            <source srcSet={`/img/cover5.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover5.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/cover5.png?v=${SITE_VERSION}`}
              alt="Muž si potřásá rukou se ženou"
              width={400}      // nastav šířku dle reálného obrázku nebo layoutu
              height={400}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HookleftImg3}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>        
            </div>
        </div>
        <div className={styles.HookTitleWrapper}>
          <h2>Rychlejší vyplňování<br></br>díky <span>umělé inteligenci</span></h2>
          <p>Tato aplikace využívá umělou inteligenci k tomu, aby Vám co nejvíce usnadnila práci.
              Pomocí integrovaného nástroje pro generování nabídne návrh textu podle toho, co zadáte. Ať už jde o pracovní zkušenosti, dovednosti nebo osobní profil.</p>
          <p>Návrhy nejsou finální, můžete je libovolně upravit, nebo použít jako inspiraci. Vše probíhá automaticky, bez nutnosti přihlášení, nebo registrace.</p>
          <div>
            <Link href="/preview" className={styles.cta}>Vybrat šablonu</Link>
          </div>
        </div>          
      </div>
    </section>
  )
}
