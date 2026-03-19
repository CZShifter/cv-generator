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
              alt="vektorový obrázok čipu s nápisom AI"
              width={368}
              height={530}
              className={styles.AIleftImg}
              loading="lazy"
            />
          </picture>
        </div>
         <div className={styles.AITitleWrapper}>
          <h2>Vyplňujte rýchlejšie vďaka <span>umelej inteligencii</span></h2>
          <p>Naša aplikácia <strong>používa umelú inteligenciu</strong> na to, aby vám čo najviac uľahčila tvorbu životopisu. Nástroj vám ponúkne návrh textu podľa vášho stručného popisu. Pomôže s pracovnými skúsenosťami, zručnosťami aj osobným profilom.</p>
          <p>Návrhy môžete potom ľubovoľne upraviť, alebo použiť ako inšpiráciu. Všetko prebieha automaticky, <strong>bez nutnosti prihlásenia, alebo registrácie</strong>.</p>
        </div>          
      </div>
    </section>
  )
}
