import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/HeroSection.module.scss'
import Link from 'next/link'
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className={styles.Hero}>
      <div className={styles.HeroWrapper}>
        <div className={styles.HeroLeft}>
          <picture className={styles.HeroleftImg}>
            <source srcSet="/img/cartoon_cv3.webp" type="image/webp" />
            <source srcSet="/img/cartoon_cv3.png" type="image/png" />
            <img
              src="/img/cartoon_cv3.png"
              alt="šťastná žena ukazuje prstem"
              width={500}      // nastav šířku dle reálného obrázku nebo layoutu
              height={565}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HeroleftImg}  // pokud chceš stylovat ještě obrázek samotný
              sizes="100%"
              loading="eager"
            />
          </picture>
          <picture className={styles.HeroleftImg2}>
            <source srcSet="/img/cartoon_cv4.webp" type="image/webp" />
            <source srcSet="/img/cartoon_cv4.png" type="image/png" />
            <img
              src="/img/cartoon_cv4.png"
              alt="šťastná žena ukazuje prstem"
              width={300}      // nastav šířku dle reálného obrázku nebo layoutu
              height={500}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HeroleftImg2}  // pokud chceš stylovat ještě obrázek samotný
              sizes="100%"
              loading="eager"
            />
          </picture>
        </div>
        <div className={styles.HeroTitleWrapper}>
          <h1><strong>Tvorba <span>životopisu</span></strong> <br></br><span>snadno</span>&nbsp;a rychle&nbsp;</h1>
          <p>Vytvořte si moderní strukturovaný životopis ještě dnes. Díky asistenci umělé inteligence Vám celý proces zabere jen pár minut!</p>
          <div className={styles.LinkWrapper}>
            <div>
              <Link href="/preview" className={styles.cta}>Začít&nbsp;ihned</Link>
            </div>
            <div className={styles.IconWrapper}>
              <div>
                <Image
                  src="/img/openai-icon.svg"
                  alt="Ikona OpenAI"
                  width={24}      // nastav šířku dle reálného obrázku nebo layoutu
                  height={24}     // nastav výšku dle reálného obrázku nebo layoutu
                  priority         // pouze pokud je obrázek nad foldem nebo je klíčový
                />         
              </div>
              <div>
                <Image
                  src="/img/pdf-icon.svg"
                  alt="Ikona PDF"
                  width={24}      // nastav šířku dle reálného obrázku nebo layoutu
                  height={24}     // nastav výšku dle reálného obrázku nebo layoutu
                  priority         // pouze pokud je obrázek nad foldem nebo je klíčový
                />         
              </div>
            </div>
          </div>
        </div>          
      </div>
    </section>
  )
}
