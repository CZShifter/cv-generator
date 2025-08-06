import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/AISection.module.scss'
import { SITE_VERSION } from "@/config/site";

export default function SecureSection() {
  return (
    <section className={styles.AI}>
      <div className={styles.AIWrapper}>
        <div className={styles.AILeft}>
          <picture>
            <source srcSet={`/img/cartoon_cv10.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cartoon_cv10.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/cartoon_cv1.png?v=${SITE_VERSION}`}
              alt="AI maskot mavá do kamery"
              width={394}
              height={559}
              className={styles.SecureleftImg}
              loading="lazy"
            />
          </picture>
        </div>
        <div className={styles.SecureTitleWrapper}>
          <h2>Ochrana Vášho súkromia je prioritou!</h2>
          <p>Na rozdiel od iných aplikácií si v tejto nevytvárate žiadny účet. Nikde sa neregistrujete a Vaše osobné údaje nikdy nepredávame žiadnej tretej strane. Vaše dáta uchovávame iba 24 hodín, aby ste mohli pohodlne upravovať Váš životopis. Potom je všetko nenávratne vymazané.</p>
        </div>          
      </div>
    </section>
  )
}
