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
              alt="Vektorový obrázek zámku"
              width={394}
              height={559}
              className={styles.SecureleftImg}
              loading="lazy"
            />
          </picture>
        </div>
        <div className={styles.SecureTitleWrapper}>
          <h2><span>Ochrana vašeho soukromí</span> je naší prioritou!</h2>
          <p>Na rozdíl od jiných aplikací si v naší <strong>nevytváříte žádný účet</strong>. Bezpečnost je u nás na prvním místě a vaše osobní údaje nikdy neprodáváme žádné třetí straně. <strong>Vaše data držíme pouze 24 hodin</strong>, abyste mohli pohodlně upravovat váš životopis.</p>
        </div>          
      </div>
    </section>
  )
}
