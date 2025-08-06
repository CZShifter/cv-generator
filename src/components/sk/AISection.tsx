import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/AISection.module.scss'
import { SITE_VERSION } from "@/config/site";

export default function AISection() {
  return (
    <section className={styles.AI}>
      <div className={styles.AIWrapper}>
        <div className={styles.AILeft}>
          <picture>
            <source srcSet={`/img/cartoon_cv1.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cartoon_cv1.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/cartoon_cv1.png?v=${SITE_VERSION}`}
              alt="AI maskot mavá do kamery"
              width={368}
              height={530}
              className={styles.AIleftImg}
              loading="lazy"
            />
          </picture>
        </div>
        <div className={styles.AITitleWrapper}>
          <h2>Poháňané pomocou AI technológie</h2>
          <p>Vďaka integrovanej AI technológii môžete svoj životopis jednoducho vylepšovať priamo vo formulári. Umelá inteligencia za Vás vytvorí správne formulácie textov a pomôže vytvoriť profesionálne CV rýchlo a bez zdĺhavého premýšľania.</p>
        </div>          
      </div>
    </section>
  )
}
