import Head from "next/head";
import Link from "next/link";
import styles from "@/scss/Profession.module.scss";
import { getProfessionSeeds, toProfessionUrlSlug } from "@/data/professions";
import { SITE_URL, SITE_URL_SK, SITE_NAME, OG_IMAGE } from "@/config/site";

export default function ProfeseIndexPage() {
  const list = getProfessionSeeds("cs").sort((a, b) => a.name.localeCompare(b.name, "cs"));
  const canonical = `${SITE_URL}/cs/profese/`;
  const alternate = `${SITE_URL_SK}/sk/profese/`;

  return (
    <>
      <Head>
        <title>{`Životopis podle profese | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content="Přehled profesí a vzorů životopisů. Vyberte si profesi, získáte tipy, dovednosti a ukázku CV."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" href={canonical} hrefLang="cs-CZ" />
        <link rel="alternate" href={alternate} hrefLang="sk-SK" />
        <link rel="alternate" href={canonical} hrefLang="x-default" />
        <meta property="og:title" content={`Životopis podle profese | ${SITE_NAME}`} />
        <meta
          property="og:description"
          content="Přehled profesí a vzorů životopisů. Vyberte si profesi a začněte tvořit CV."
        />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.container}>
          <header className={styles.hero}>
            <h1>Životopis podle profese</h1>
            <p className={styles.hubIntro}>
              Vyberte si profesi, ke které chcete vytvořit životopis. Každá stránka obsahuje tipy,
              doporučené dovednosti a ukázku CV.
            </p>
          </header>

          <section className={styles.hubGroup}>
            <ul>
              {list.map((item) => (
                <li key={item.slug}>
                  <Link href={`/cs/profese/${toProfessionUrlSlug(item.slug, "cs")}`}>Životopis {item.name}</Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
