import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import styles from "@/scss/Profession.module.scss";
import { buildProfessionContent, getProfessionSlugs, ProfessionContent } from "@/data/professions";
import { SITE_URL, SITE_URL_SK, SITE_NAME, OG_IMAGE, PRICE_CV } from "@/config/site";
import ProfessionPreviewFrame from "@/components/ProfessionPreviewFrame";
import { buildProfessionPreviewData } from "@/data/professionPreviewData";

type PageProps = {
  content: ProfessionContent;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getProfessionSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
) => {
  const slug = context.params?.slug as string;
  if (!slug.startsWith("zivotopis-")) {
    return {
      redirect: {
        destination: `/cs/profese/zivotopis-${slug}`,
        permanent: true,
      },
    };
  }
  const content = buildProfessionContent("cs", slug);
  if (!content) return { notFound: true };
  return { props: { content } };
};

export default function ProfessionPage({ content }: PageProps) {
  const canonical = `${SITE_URL}/cs/profese/${content.urlSlug}/`;
  const alternate = `${SITE_URL_SK}/sk/profese/${content.urlSlug}/`;
  const previewData = buildProfessionPreviewData("cs", content.slug, "cvtemplate");

  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": content.title,
    "description": content.description,
    "url": canonical,
    "inLanguage": "cs-CZ",
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
  };

  const schemaBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Domů",
        "item": `${SITE_URL}/cs/`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Profese",
        "item": `${SITE_URL}/cs/profese/`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": content.h1,
        "item": canonical,
      },
    ],
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const schemaOffer = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Online generátor životopisů",
    "description": "Vytvořte si profesionální životopis online a exportujte ho do PDF.",
    "brand": { "@type": "Organization", "name": SITE_NAME },
    "offers": {
      "@type": "Offer",
      "price": PRICE_CV,
      "priceCurrency": "CZK",
      "url": `${SITE_URL}/cs/preview`,
      "availability": "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Head>
        <title>{`${content.title} | ${SITE_NAME}`}</title>
        <meta name="description" content={content.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" href={canonical} hrefLang="cs-CZ" />
        <link rel="alternate" href={alternate} hrefLang="sk-SK" />
        <link rel="alternate" href={canonical} hrefLang="x-default" />
        <meta property="og:title" content={`${content.title} | ${SITE_NAME}`} />
        <meta property="og:description" content={content.description} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${content.title} | ${SITE_NAME}`} />
        <meta name="twitter:description" content={content.description} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebPage) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOffer) }}
        />
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.container}>
          <header className={styles.hero}>
            <h1>{content.h1}</h1>
            {content.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>{content.uniqueLead}</p>
          </header>

          <section className={styles.summaryBox}>
            <h2 className={styles.summaryTitle}>Rychlé shrnutí</h2>
            <ul className={styles.summaryList}>
              {content.summaryBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className={styles.splitSection}>
            <div className={styles.splitLeft}>
              {content.sections.map((section) => (
                <section key={section.heading} className={styles.section}>
                  <h2>{section.heading}</h2>
                  <ul>
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <aside className={styles.splitRight}>
              <ProfessionPreviewFrame locale="cs" data={previewData} />
            </aside>
          </section>

          <section className={styles.cta}>
            <div className={styles.ctaBlock}>
              <h2 className={styles.ctaTitle}>Připraveni vytvořit si svůj životopis?</h2>
              <p className={styles.ctaText}>
                Začněte nyní a vytvořte si moderní a profesionální životopis během 5 minut.
              </p>
              <Link className={styles.ctaButton} href="/cs/preview">
                Vytvořit životopis
              </Link>
            </div>
          </section>

          {content.bodySections.map((section) => (
            <section key={section.heading} className={styles.bodySection}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className={styles.cta}>
            <div className={styles.ctaBlock}>
              <h2 className={styles.ctaTitle}>Připraveni vytvořit si svůj životopis?</h2>
              <p className={styles.ctaText}>
                Začněte nyní a vytvořte si moderní a profesionální životopis během 5 minut.
              </p>
              <Link className={styles.ctaButton} href="/cs/preview">
                Vytvořit životopis
              </Link>
            </div>
          </section>

          <section className={styles.faq}>
            <h2>Časté otázky</h2>
            {content.faqs.map((faq) => (
              <div key={faq.question} className={styles.faqItem}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </section>

          {content.related.length > 0 && (
            <section className={styles.related}>
              <h2>Další profese v oboru</h2>
              <ul>
                {content.related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/cs/profese/zivotopis-${item.slug}`}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
