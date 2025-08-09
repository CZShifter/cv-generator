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
                  width={140}      // nastav šířku dle reálného obrázku nebo layoutu
                  height={50}     // nastav výšku dle reálného obrázku nebo layoutu
                  className={styles.HookleftImg}  // pokud chceš stylovat ještě obrázek samotný
                />
            </picture>
            <picture>
                <img
                src={`/img/apple-pay.svg?v=${SITE_VERSION}`}
                alt="Logo Apple Pay"
                width={140}      // nastav šířku dle reálného obrázku nebo layoutu
                height={50}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg2}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>
            <picture>
              <img
                src={`/img/mc_symbol.svg?v=${SITE_VERSION}`}
                alt="Logo MasterCard"
                height={77}
                width={100}      // nastav šířku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg3}  // pokud chceš stylovat ještě obrázek samotný
                />
            </picture>
            <picture>
              <img
                src={`/img/visa.svg?v=${SITE_VERSION}`}
                alt="Logo Visa"
                width={165}      // nastav šířku dle reálného obrázku nebo layoutu
                height={50}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg3}  // pokud chceš stylovat ještě obrázek samotný
                />
            </picture>
            <picture>
              <img
                src={`/img/cg-tsq.svg?v=${SITE_VERSION}`}
                alt="Logo Comgate"
                width={60}      // nastav šířku dle reálného obrázku nebo layoutu
                height={60}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg3}  // pokud chceš stylovat ještě obrázek samotný
                />
            </picture>                              
        </div>
    </section>
  )
}
