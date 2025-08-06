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
          <h2>Ochrana Vašeho soukromí je priorita!</h2>
          <p>Na rozdíl od jiných aplikací, v této nevytváříte žádný účet. Nikam se neregistrujete a Vaše osobní údaje nikdy neprodáváme do žádné databáze třetích stran. Váše data držíme pouze 24 hodin, abyste mohli pohodlně upravovat Váš životopis. Poté je vše nenávratně smazáno.</p>
        </div>          
      </div>
    </section>
  )
}
