import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/HookSection2.module.scss'
import Link from 'next/link'
import { SITE_VERSION } from "../config/site";
import { trackGAEvent } from "@/utils/analytics";

export default function HookSection2() {
  return (
    <section className={styles.Hook}>
      <div className={styles.HookWrapper}>
        <div className={styles.HookLeft}>
          <picture>
            <source srcSet={`/img/cover1.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover1.png?v=${SITE_VERSION}`} type="image/png" />
              <img
                src={`/img/cover1.png?v=${SITE_VERSION}`}
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
              <source srcSet={`/img/cover7.png?v=${SITE_VERSION}`} type="image/png" />
              <img
              src={`/img/cover7.png?v=${SITE_VERSION}`}
              alt="Fotka recepční v hotelu"
              width={600}      // nastav šířku dle reálného obrázku nebo layoutu
              height={400}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HookleftImg2}  // pokud chceš stylovat ještě obrázek samotný
              loading='eager'
            />
            </picture>
            <picture>
            <source srcSet={`/img/cover8.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover8.png?v=${SITE_VERSION}`} type="image/png" />
            <img
              src={`/img/cover8.png?v=${SITE_VERSION}`}
              alt="Automechanik opravuje auto"
              width={600}      // nastav šířku dle reálného obrázku nebo layoutu
              height={400}     // nastav výšku dle reálného obrázku nebo layoutu
              className={styles.HookleftImg3}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>        
            </div>
        </div>
        <div className={styles.HookTitleWrapper}>
          <h2>Vytvořte <span>jedinečný</span><br></br><span>životopis</span> s naprostou lehkostí</h2>
          <p>S touto aplikací snadno vytvoříte životopis který zaujme na první pohled. Profesionální, přehledný a přesně vystihující Vaše schopnosti i ambice.</p>
          <p>Vyberte si <a href='/preview'>moderní šablonu</a>, upravte vše podle sebe a stáhněte hotové CV během pár minut. Bez složitostí a bez ztráty času. Cesta k nové práci nebyla nikdy jednodušší.</p>
          <div>
            <Link
              href="/preview"
              className={styles.cta}
              onClick={() => trackGAEvent('click', 'cta', 'tvorba_zivotopisu_z_motivaku')}>
              Vybrat šablonu
            </Link>
          </div>
        </div>          
      </div>
    </section>
  )
}
