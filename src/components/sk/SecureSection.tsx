import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/AISection.module.scss'
import { SITE_VERSION } from "@/config/site";

export default function SecureSection() {
  return (
    <section className={styles.AI}>
      <div className={styles.SecureWrapper}>
        <div className={styles.AILeft}>
          <picture>
            <source srcSet={`/img/secure2.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/secure2.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/secure2.png?v=${SITE_VERSION}`}
              alt="Vektorový obrázok zámku"
              width={394}
              height={559}
              className={styles.SecureleftImg}
              loading="lazy"
            />
          </picture>
        </div>
        <div className={styles.SecureTitleWrapper}>
          <h2><span>Ochrana vášho súkromia</span> je našou prioritou!</h2>
          <p>Na rozdiel od iných aplikácií si v našej nevytvárate žiadny účet. Bezpečnosť je u nás na prvom mieste a vaše osobné údaje nikdy nepredávame žiadnej tretej strane. Vaše dáta držíme iba 24 hodín, aby ste mohli pohodlne upravovať váš životopis. Potom je všetko nenávratne zmazané.</p>
        </div>          
      </div>
    </section>
  )
}
