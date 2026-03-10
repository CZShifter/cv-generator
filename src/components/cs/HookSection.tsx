import styles from '@/scss/HookSection.module.scss'
import { SITE_VERSION } from "@/config/site";

export default function HookSection() {
  return (
    <section className={styles.Hook} id="zivotopis">
      <div className={styles.HookWrapper}>
        <div className={styles.HookTitleWrapper}>
          <h2>Strukturovaný životopis online za pár minut!</h2>
          <p>Vytvořit <a href="/cs/profese">profesionální životopis</a> nemusí být složité. Mnoho uchazečů se denně potýká s nepraktickými editory, nepřehlednými šablonami a nutností registrace do služeb, které slibují víc, než dodají. Naše aplikace vznikla jako odpověď na tyto problémy.</p>
          <p>Formulář je intuitivní a doplněný živým náhledem. Díky tomu na vás nečeká překvapení ve formě špatného rozložení stránky po stažení životopisu. Výsledkem je elegantní PDF připravené k odeslání.</p>
          <p>S naší aplikací ušetříte svůj čas i trpělivost. Nevyžadujeme žádnou registraci, neukládáme vaše osobní údaje a nepřekvapíme vás žádným předplatným ani skrytými poplatky. Moderní životopis si vygenerujete rychle a jednoduše jen za 89 Kč.</p>
        </div>       
        <div className={styles.HookLeft}>
          <picture>
            <source srcSet={`/img/cover5.webp?v=${SITE_VERSION}`} type="image/webp" />
            <source srcSet={`/img/cover5.jpg?v=${SITE_VERSION}`} type="image/jpg" />
              <img
                src={`/img/cover5.jpg?v=${SITE_VERSION}`}
                alt="Muž a žena si podávají ruce"
                width={544}      // nastav šířku dle reálného obrázku nebo layoutu
                height={360}     // nastav výšku dle reálného obrázku nebo layoutu
                className={styles.HookleftImg}  // pokud chceš stylovat ještě obrázek samotný
              />
            </picture>
        </div>   
      </div>
    </section>
  )
}



