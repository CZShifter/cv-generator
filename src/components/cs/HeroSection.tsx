import styles from '@/scss/HeroSection.module.scss'
import Link from 'next/link'
import Head from "next/head";
import { SITE_VERSION } from "@/config/site";

export default function HeroSection() {
  return (
    <section className={styles.Hero}>
      <Head>
        <link rel="preload" as="image" href={`/img/laptop.webp?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/laptop.png?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/cartoon_cv8.webp?v=${SITE_VERSION}`}/>
        <link rel="preload" as="image" href={`/img/cartoon_cv8.png?v=${SITE_VERSION}`}/>
      </Head>
      <div className={styles.HeroWrapper}>
        <div className={styles.HeroLeft}>
          <picture className={styles.HeroleftImg}>
            <source srcSet={`/img/laptop.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/laptop.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/laptop.png?v=${SITE_VERSION}`}
              alt="šťastná žena ukazuje prstem"
              width={600}      // nastav šířku dle reálného obrázku nebo layoutu
              height={665}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HeroleftImg}  // pokud chceš stylovat ještě obrázek samotný
              sizes="100%"
              loading="eager"
            />
          </picture>
          <picture className={styles.HeroleftImg2}>
            <source srcSet={`/img/cartoon_cv8.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cartoon_cv8.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/cartoon_cv8.png?v=${SITE_VERSION}`}
              alt="šťastná žena ukazuje prstem"
              width={600}      // nastav šířku dle reálného obrázku nebo layoutu
              height={665}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HeroleftImg2}  // pokud chceš stylovat ještě obrázek samotný
              sizes="100%"
              loading="eager"
            />
          </picture>
        </div>
        <div className={styles.HeroTitleWrapper}>
          <p>Nejrychlejší cesta k pohovoru</p>
          <h1>Vytvořte si <span>životopis</span><br></br><span>online</span> snadno<br/> a rychle</h1>
          <p>Zaujměte personalistu moderním strukturovaným životopisem a vynikněte mezi všedními CV, kterých denně vidí stovky. Díky naší aplikaci vytvoříte profesionální životopis bez stresu už za pár minut!</p>
          <div className={styles.LinkWrapper}>
            <div>
              <Link href="/cs/preview" className={styles.cta}>Vybrat šablonu</Link>
            </div>
          </div>
        </div>          
      </div>
    </section>
  )
}
