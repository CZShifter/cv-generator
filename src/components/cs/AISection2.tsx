import styles from '@/scss/AISection.module.scss'
import { SITE_VERSION } from "@/config/site";

export default function AISection() {
  return (
    <section className={styles.AI}>
      <div className={styles.AIWrapper}>
        <div className={styles.AILeft}>
          <picture>
            <source srcSet={`/img/Ai.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/Ai.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/Ai.png?v=${SITE_VERSION}`}
              alt="vektorový obrázek čipu s nápisem AI"
              width={368}
              height={530}
              className={styles.AIleftImg}
              loading="lazy"
            />
          </picture>
        </div>
         <div className={styles.AITitleWrapper}>
          <h2>Vyplňujte rychleji díky <span>umělé inteligenci</span></h2>
          <p>Naše aplikace využívá umělou inteligenci k tomu, aby vám co nejvíce usnadnila tvorbu životopisu. Nástroj vám nabídne návrh textu podle vašeho stručného popisu. Pomůže s pracovními zkušenostmi, dovednostmi, osobním profilem i motivačním dopisem.</p>
          <p>Návrhy můžete poté libovolně upravit, nebo použít jako inspiraci. Vše probíhá automaticky, bez nutnosti přihlášení, nebo registrace.</p>
        </div>          
      </div>
    </section>
  )
}
