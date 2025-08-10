import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/HeroSection.module.scss'
import Link from 'next/link'
import Head from "next/head";
import Image from "next/image";
import { SITE_VERSION } from "@/config/site";

export default function HeroSection() {
  return (
    <section className={styles.Hero}>
      <Head>
        <link rel="preload" as="image" href={`/img/cartoon_cv3.webp?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/cartoon_cv3.png?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/cartoon_cv4.webp?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/cartoon_cv4.png?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/cartoon_cv11.webp?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/cartoon_cv11.png?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/openai-icon.svg?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/pdf-icon.svg?v=${SITE_VERSION}`}/>
      </Head>
      <div className={styles.HeroWrapper}>
        <div className={styles.HeroLeft}>
          <picture className={styles.HeroleftImg}>
            <source srcSet={`/img/cartoon_cv3.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cartoon_cv3.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/cartoon_cv3.png?v=${SITE_VERSION}`}
              alt="šťastná žena ukazuje prstem"
              width={600}      // nastav šířku dle reálného obrázku nebo layoutu
              height={665}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HeroleftImg}  // pokud chceš stylovat ještě obrázek samotný
              sizes="100%"
              loading="eager"
            />
          </picture>
          <picture className={styles.HeroleftImg2}>
            <source srcSet={`/img/cartoon_cv4.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cartoon_cv4.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/cartoon_cv4.png?v=${SITE_VERSION}`}
              alt="šťastná žena ukazuje prstem"
              width={400}      // nastav šířku dle reálného obrázku nebo layoutu
              height={600}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HeroleftImg2}  // pokud chceš stylovat ještě obrázek samotný
              sizes="100%"
              loading="eager"
            />
          </picture>
          <picture className={styles.HeroleftImg3}>
            <source srcSet={`/img/cartoon_cv11.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cartoon_cv11.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/cartoon_cv11.png?v=${SITE_VERSION}`}
              alt="šťastná žena ukazuje prstem"
              width={600}      // nastav šířku dle reálného obrázku nebo layoutu
              height={934}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HeroleftImg3}  // pokud chceš stylovat ještě obrázek samotný
              sizes="100%"
              loading="eager"
            />
          </picture>
        </div>
        <div className={styles.HeroTitleWrapper}>
          <p>Nejrychlejší cesta k pohovoru</p>
          <h1><strong>Tvorba <span>životopisu</span></strong> <br></br><span>snadno</span>&nbsp;a rychle&nbsp;</h1>
          <p>Zaujměte personalistu moderním strukturovaným životopisem ještě než dočte první větu. Díky umělé inteligenci vytvoříte profesionální životopis bez stresu už za pár minut!</p>
          <div className={styles.LinkWrapper}>
            <div>
              <Link href="/cs/preview" className={styles.cta}>Začít&nbsp;ihned</Link>
            </div>
            <div className={styles.IconWrapper}>
              <div>
                <Image
                  src={`/img/openai-icon.svg?v=${SITE_VERSION}`}
                  alt="Ikona OpenAI"
                  width={24}      // nastav šířku dle reálného obrázku nebo layoutu
                  height={24}     // nastav výšku dle reálného obrázku nebo layoutu
                  priority         // pouze pokud je obrázek nad foldem nebo je klíčový
                />         
              </div>
              <div>
                <Image
                  src={`/img/pdf-icon.svg?v=${SITE_VERSION}`}
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
