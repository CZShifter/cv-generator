import Head from "next/head";
import Link from "next/link";
import styles from "@/scss/Profession.module.scss";
import { getCategoryLabels, getGroupedProfessions, toProfessionUrlSlug } from "@/data/professions";
import { SITE_URL, SITE_URL_SK, SITE_NAME_SK, OG_IMAGE_SK } from "@/config/site";

export default function ProfeseIndexPage() {
  const groups = getGroupedProfessions("sk");
  const labels = getCategoryLabels("sk");
  const canonical = `${SITE_URL_SK}/sk/profese/`;
  const alternate = `${SITE_URL}/cs/profese/`;

  return (
    <>
      <Head>
        <title>{`Životopis podľa profesie | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content="Prehľad profesií a vzorov životopisov. Vyberte si profesiu, získate tipy, zručnosti a ukážku CV."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" href={alternate} hrefLang="cs-CZ" />
        <link rel="alternate" href={canonical} hrefLang="sk-SK" />
        <link rel="alternate" href={canonical} hrefLang="x-default" />
        <meta property="og:title" content={`Životopis podľa profesie | ${SITE_NAME_SK}`} />
        <meta
          property="og:description"
          content="Prehľad profesií a vzorov životopisov. Vyberte si profesiu a začnite tvoriť CV."
        />
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.container}>
          <header className={styles.hero}>
            <h1>Životopis podľa profesie</h1>
            <p className={styles.hubIntro}>
              Vyberte si profesiu, ku ktorej chcete vytvoriť životopis. Každá stránka obsahuje tipy,
              odporúčané zručnosti a ukážku CV.
            </p>
          </header>

          {Object.entries(groups).map(([category, list]) => (
            <section key={category} className={styles.hubGroup}>
              <h2>{labels[category as keyof typeof labels]}</h2>
              <ul>
                {list.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/sk/profese/${toProfessionUrlSlug(item.slug, "sk")}`}>Životopis {item.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
