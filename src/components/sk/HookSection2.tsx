import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/HookSection2.module.scss'
import Link from 'next/link'
import { SITE_VERSION } from "@/config/site";
import { trackGAEvent } from "@/utils/analytics";

export default function HookSection2() {
  return (
    <section className={styles.Hook}>
      <div className={styles.HookWrapper}>
        <div className={styles.HookLeft}>
          <picture>
            <source srcSet={`/img/cover1.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover1.jpg?v=${SITE_VERSION}`} type="image/jpg" />
              <img
                src={`/img/cover1.jpg?v=${SITE_VERSION}`}
                alt="Muž čte plány na stavbě"
                width={500}      // nastav šířku dle reálného obrázku nebo layoutu
                height={750}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg}  // pokud chceš stylovat ještě obrázek samotný
                loading='eager'
              />
            </picture>
            <div className={styles.HookLeftColumn}>
            <picture>
              <source srcSet={`/img/cover7.webp?v=${SITE_VERSION}`} type="image/webp" />
              <source srcSet={`/img/cover7.jpg?v=${SITE_VERSION}`} type="image/jpg" />
              <img
              src={`/img/cover7.jpg?v=${SITE_VERSION}`}
              alt="Fotka recepční v hotelu"
              width={600}      // nastav šířku dle reálného obrázku nebo layoutu
              height={400}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HookleftImg2}  // pokud chceš stylovat ještě obrázek samotný
              loading='eager'
            />
            </picture>
            <picture>
            <source srcSet={`/img/cover8.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover8.jpg?v=${SITE_VERSION}`} type="image/jpg" />
            <img
              src={`/img/cover8.jpg?v=${SITE_VERSION}`}
              alt="Automechanik opravuje auto"
              width={600}      // nastav šířku dle reálného obrázku nebo layoutu
              height={400}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HookleftImg3}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>        
            </div>
        </div>
        <div className={styles.HookTitleWrapper}>
          <h2>Vytvorte <span>štruktúrovaný</span><br></br><span>životopis</span> s absolútnou ľahkosťou</h2>
          <p>S touto aplikáciou jednoducho vytvoríte životopis, ktorý zaujme na prvý pohľad. Profesionálny, prehľadný a presne vystihujúci Vaše schopnosti aj ambície.</p>
          <p>Vyberte si <Link href='/sk/preview'>moderní šablonu</Link>, upravte všetko podľa seba a stiahnite hotové CV behom pár minút. Bez komplikácií a bez straty času. Cesta k novej práci ešte nikdy nebola jednoduchšia.</p>
          <p>Dobre navrhnutý životopis pomôže personalistovi rýchlo pochopiť, kto ste, čo viete a kam smerujete. V konkurencii desiatok až stoviek uchádzačov môžete získať značnú výhodu.</p>
          <div>
            <Link
              href="/sk/preview"
              className={styles.cta}
              onClick={() => trackGAEvent('click', 'cta', 'tvorba_zivotopisu_z_motivaku_sk')}>
              Vybrat šablónu
            </Link>
          </div>
        </div>          
      </div>
    </section>
  )
}
