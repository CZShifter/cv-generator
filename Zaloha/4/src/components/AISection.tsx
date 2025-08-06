import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/AISection.module.scss'
import Link from 'next/link'
import Image from "next/image";

export default function AISection() {
  return (
    <section className={styles.AI}>
      <div className={styles.AIWrapper}>
        <div className={styles.AILeft}>
          <picture>
            <source srcSet="/img/cartoon_cv1.webp" type="image/webp" />
            <source srcSet="/img/cartoon_cv1.png" type="image/png" />
            <img
              src="/img/cartoon_cv1.png"
              alt="AI maskot mavá do kamery"
              width={368}
              height={530}
              className={styles.AIleftImg}
              loading="lazy"
            />
          </picture>
        </div>
        <div className={styles.AITitleWrapper}>
          <h2>Poháněno pomocí AI technologie</h2>
          <p>Díky integrované AI technologii můžete svůj životopis snadno vylepšovat přímo ve formuláři. Umělá inteligence za Vás vytvoří správnou formulaci textů a pomůže vytvořit profesionální CV rychle a bez zdlouhavého přemýšlení.</p>
        </div>          
      </div>
    </section>
  )
}
