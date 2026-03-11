import Head from "next/head";
import Link from "next/link";
import styles from "@/scss/Profession.module.scss";
import { getProfessionSeeds, toProfessionUrlSlug } from "@/data/professions";
import { SITE_URL, SITE_URL_SK, SITE_NAME_SK, OG_IMAGE_SK } from "@/config/site";

export default function ProfeseIndexPage() {
  const list = getProfessionSeeds("sk").sort((a, b) => a.name.localeCompare(b.name, "sk"));
  const canonical = `${SITE_URL_SK}/sk/profese/`;
  const alternate = `${SITE_URL}/cs/profese/`;
  const year = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>{`Vzor životopisu podľa profesie v roku ${year} | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content={`Prehľad profesií a vzorov životopisov v roku ${year}. Vyberte si profesiu, získate tipy, zručnosti a ukážku CV.`}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" href={alternate} hrefLang="cs-CZ" />
        <link rel="alternate" href={canonical} hrefLang="sk-SK" />
        <link rel="alternate" href={canonical} hrefLang="x-default" />
        <meta property="og:title" content={`Vzor životopisu podľa profesie v roku ${year} | ${SITE_NAME_SK}`} />
        <meta
          property="og:description"
          content={`Prehľad profesií a vzorov životopisov v roku ${year}. Vyberte si profesiu a začnite tvoriť CV.`}
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
            <h1>{`Vzor životopisu podľa profesie v roku ${year}`}</h1>
            <p className={styles.hubIntro}>
              Vyberte si profesiu, ku ktorej chcete vytvoriť životopis. Každá stránka obsahuje tipy,
              odporúčané zručnosti, ukážku CV a vzor životopisu.
            </p>
          </header>

          <section className={styles.hubGroup}>
            <ul>
              {list.map((item) => (
                <li key={item.slug}>
                  <Link href={`/sk/profese/${toProfessionUrlSlug(item.slug, "sk")}`}>Životopis {item.name}</Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
