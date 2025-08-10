import 'swiper/css'
import 'swiper/css/effect-coverflow'
import styles from '@/scss/PlatMetody.module.scss'
import { SITE_VERSION } from "@/config/site";

export default function PlatMetody() {
  return (
    <section className={styles.MetodyWrapper}>
        <div className={styles.Wrapper}>
            <picture>
                <img
                  src={`/img/google-pay.svg?v=${SITE_VERSION}`}
                  alt="Logo Google Pay"
                  width={120}      // nastav šířku dle reálného obrázku nebo layoutu
                  height={60}     // nastav výšku dle reálného obrázku nebo layoutu
                  className={styles.LogoImg1}  // pokud chceš stylovat ještě obrázek samotný
                />
            </picture>
            <picture>
                <img
                src={`/img/apple-pay.svg?v=${SITE_VERSION}`}
                alt="Logo Apple Pay"
                width={120}      // nastav šířku dle reálného obrázku nebo layoutu
                height={60}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.LogoImg2}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>
            <picture>
              <img
                src={`/img/mc_symbol.svg?v=${SITE_VERSION}`}
                alt="Logo MasterCard"
                height={60}
                width={84}      // nastav šířku dle reálného obrázku nebo layoutu
                className={styles.LogoImg3}  // pokud chceš stylovat ještě obrázek samotný
                />
            </picture>
            <picture>
              <img
                src={`/img/Visa.svg?v=${SITE_VERSION}`}
                alt="Logo Visa"
                width={186}      // nastav šířku dle reálného obrázku nebo layoutu
                height={60}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.LogoImg4}  // pokud chceš stylovat ještě obrázek samotný
                />
            </picture>
            <picture>
              <img
                src={`/img/cg-tsq.svg?v=${SITE_VERSION}`}
                alt="Logo Comgate"
                width={60}      // nastav šířku dle reálného obrázku nebo layoutu
                height={60}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.LogoImg5}  // pokud chceš stylovat ještě obrázek samotný
                />
            </picture>                              
        </div>
    </section>
  )
}
