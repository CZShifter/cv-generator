import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/HookSection.module.scss'
import Link from 'next/link'

export default function HookSection() {
  return (
    <section className={styles.Hook} id="zivotopis">
      <div className={styles.HookWrapper}>
        <div className={styles.HookLeft}>
          <picture>
            <source srcSet="/img/cover6.webp" type="image/webp" />
            <source srcSet="/img/cover6.png" type="image/png" />
              <img
                src="/img/cover6.jpg"
                alt="Muž vytváří životopis"
                width={250}      // nastav šířku dle reálného obrázku nebo layoutu
                height={400}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>
            <div className={styles.HookLeftColumn}>
            <picture>
              <source srcSet="/img/cover3.webp" type="image/webp" />
              <source srcSet="/img/cover3.png" type="image/png" />
              <img
              src="/img/cover3.jpg"
              alt="Zaměstnanic psuzují životopis"
              width={400}      // nastav šířku dle reálného obrázku nebo layoutu
              height={400}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HookleftImg2}  // pokud chceš stylovat ještě obrázek samotný
            />
            </picture>
            <picture>
            <source srcSet="/img/cover5.webp" type="image/webp" />
            <source srcSet="/img/cover5.png" type="image/png" />
            <img
              src="/img/cover5.jpg"
              alt="Muž si potřásá rukou se ženou"
              width={400}      // nastav šířku dle reálného obrázku nebo layoutu
              height={400}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HookleftImg3}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>        
            </div>
        </div>
        <div className={styles.HookTitleWrapper}>
          <h2>AI pomůže <span>zaujmout&nbsp;a</span> <br></br><span>získat práci</span> Vašich snů</h2>
          <p>Díky integrované umělé inteligenci (ChatGPT) Vám aplikace pomůže automaticky navrhnout silné body, profesní zkušenosti i motivační texty rychleji a lépe, než kdy dřív.</p>
          <p>Váš nový životopis bude nejen moderní, ale také promyšlený a vystihne přesně to, co personalisté chtějí vidět. Začněte teď a nechte umělou inteligenci pracovat za Vás!</p>
          <div>
            <Link href="/preview" className={styles.cta}>Vybrat šablonu</Link>
          </div>
        </div>          
      </div>
    </section>
  )
}
