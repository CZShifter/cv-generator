import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import styles from "@/scss/Profession.module.scss";
import { buildProfessionContent, fromProfessionUrlSlug, getProfessionSlugs, ProfessionContent, toProfessionUrlSlug } from "@/data/professions";
import { SITE_URL, SITE_URL_SK, SITE_NAME_SK, OG_IMAGE_SK, PRICE_CV_SK } from "@/config/site";
import ProfessionPreviewFrame from "@/components/ProfessionPreviewFrame";
import { buildProfessionPreviewData } from "@/data/professionPreviewData";

type PageProps = {
  content: ProfessionContent;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getProfessionSlugs("sk");
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
    const base = fromProfessionUrlSlug(`zivotopis-${slug}`, "sk");
    return {
      redirect: {
        destination: `/sk/profese/${toProfessionUrlSlug(base, "sk")}`,
        permanent: true,
      },
    };
  }
  const content = buildProfessionContent("sk", slug);
  if (!content) return { notFound: true };
  return { props: { content } };
};

export default function ProfessionPage({ content }: PageProps) {
  const canonical = `${SITE_URL_SK}/sk/profese/${content.urlSlug}/`;
  const alternate = `${SITE_URL}/cs/profese/${content.urlSlug}/`;
  const previewData = buildProfessionPreviewData("sk", content.slug, "cvtemplate");
  const highlightText = (text: string) => {
    if (!text) return text;
    const escapedName = content.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const splitPattern = new RegExp(`(${escapedName}|životopis\\w*)`, "gi");
    const testPattern = new RegExp(`^(${escapedName}|životopis\\w*)$`, "i");
    return text.split(splitPattern).map((part, index) =>
      testPattern.test(part)
        ? <strong key={`${part}-${index}`}>{part}</strong>
        : <span key={`${part}-${index}`}>{part}</span>
    );
  };
  const renderIntro = (text: string) => {
    if (!text.includes("[generator]")) return highlightText(text);
    const parts = text.split("[generator]");
    return (
      <>
        {highlightText(parts[0])}
        <Link className={styles.generatorLink} href="/sk/preview">
          generátore
        </Link>
        {highlightText(parts[1] ?? "")}
      </>
    );
  };
  const topSections = content.bodySections.filter(
    (section) =>
      section.heading === content.bodySections[0]?.heading ||
      section.heading.toLowerCase().includes("ats")
  );
  const bottomSections = content.bodySections.filter(
    (section) => !topSections.includes(section)
  );

  const schemaWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": content.title,
    "description": content.description,
    "url": canonical,
    "inLanguage": "sk-SK",
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME_SK,
      "url": SITE_URL_SK,
    },
  };

  const schemaBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Domov",
        "item": `${SITE_URL_SK}/sk/`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Profese",
        "item": `${SITE_URL_SK}/sk/profese/`,
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
    "name": "Online generátor životopisov",
    "description": "Vytvorte si profesionálny životopis online a exportujte ho do PDF.",
    "image": OG_IMAGE_SK,
    "brand": { "@type": "Brand", "name": SITE_NAME_SK, "logo": `${SITE_URL_SK}/img/logo.png` },
    "offers": {
      "@type": "Offer",
      "price": PRICE_CV_SK,
      "priceCurrency": "EUR",
      "url": `${SITE_URL_SK}/sk/preview`,
      "availability": "https://schema.org/InStock",
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
        "applicableCountry": "SK",
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": 0,
          "currency": "EUR",
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "SK",
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY",
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY",
          },
        },
      },
    },
  };

  return (
    <>
      <Head>
        <title>{`${content.title} | ${SITE_NAME_SK}`}</title>
        <meta name="description" content={content.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" href={alternate} hrefLang="cs-CZ" />
        <link rel="alternate" href={canonical} hrefLang="sk-SK" />
        <link rel="alternate" href={canonical} hrefLang="x-default" />
        <meta property="og:title" content={`${content.title} | ${SITE_NAME_SK}`} />
        <meta property="og:description" content={content.description} />
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${content.title} | ${SITE_NAME_SK}`} />
        <meta name="twitter:description" content={content.description} />
        <meta name="twitter:image" content={OG_IMAGE_SK} />
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
              <p key={p}>{renderIntro(p)}</p>
            ))}
            <p>{highlightText(content.uniqueLead)}</p>
          </header>

          <section className={styles.summaryBox}>
            <h2 className={styles.summaryTitle}>Rýchle zhrnutie</h2>
            <ul className={styles.summaryList}>
              {content.summaryBullets.map((item) => (
                <li key={item}>{highlightText(item)}</li>
              ))}
            </ul>
          </section>

          {topSections.map((section) => (
            <section key={section.heading} className={styles.bodySection}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                paragraph.startsWith("Príklad inzerátu:")
                  ? (
                    <blockquote key={paragraph} className={styles.quote}>
                      {paragraph.replace(/^Príklad inzerátu:\s*/i, "")}
                    </blockquote>
                  )
                  : (
                    <p
                      key={paragraph}
                      className={
                        (section.heading === content.bodySections[0]?.heading ||
                          section.heading.toLowerCase().includes("ats")) && index < 2
                          ? styles.atsTight
                          : undefined
                      }
                    >
                      {highlightText(paragraph)}
                    </p>
                  )
              ))}
              {section.heading.toLowerCase().includes("ats") && (
                <div className={styles.adBox}>
                  <h3 className={styles.adTitle}>{content.adExample.title}</h3>
                  <p className={styles.adIntro}>{content.adExample.introText}</p>
                  <div className={styles.adSection}>
                    <h4 className={styles.adSectionTitle}>{content.adExample.responsibilitiesTitle}:</h4>
                    <ul className={styles.adList}>
                      {content.adExample.responsibilities.map((item) => (
                        <li key={item}>
                          <span className={styles.adKeyword}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.adSection}>
                    <h4 className={styles.adSectionTitle}>{content.adExample.requirementsTitle}:</h4>
                    <ul className={styles.adList}>
                      {content.adExample.requirements.map((item) => (
                        <li key={item}>
                          <span className={styles.adKeyword}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item}>{highlightText(item)}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className={styles.splitSection}>
            <div className={styles.splitLeft}>
              {content.sections.map((section) => (
                <section key={section.heading} className={styles.section}>
                  <h2>{section.heading}</h2>
                  <ul>
                    {section.bullets.map((item) => (
                      <li key={item}>{highlightText(item)}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <aside className={styles.splitRight}>
              <ProfessionPreviewFrame locale="sk" data={previewData} />
            </aside>
          </section>

          <section className={styles.cta}>
            <div className={styles.ctaBlock}>
              <h2 className={styles.ctaTitle}>Pripravení vytvoriť si svoj životopis?</h2>
              <p className={styles.ctaText}>
                Začnite teraz a vytvorte si moderný a profesionálny životopis počas 5 minút.
              </p>
              <Link className={styles.ctaButton} href="/sk/preview">
                Vytvoriť životopis
              </Link>
            </div>
          </section>

          {bottomSections.map((section) => (
            <section key={section.heading} className={styles.bodySection}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                paragraph.startsWith("Príklad inzerátu:")
                  ? (
                    <blockquote key={paragraph} className={styles.quote}>
                      {paragraph.replace(/^Príklad inzerátu:\s*/i, "")}
                    </blockquote>
                  )
                  : (
                    <p
                      key={paragraph}
                      className={
                        (section.heading === content.bodySections[0]?.heading ||
                          section.heading.toLowerCase().includes("ats")) && index < 2
                          ? styles.atsTight
                          : undefined
                      }
                    >
                      {highlightText(paragraph)}
                    </p>
                  )
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item}>{highlightText(item)}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className={styles.faq}>
            <h2>Časté otázky</h2>
            {content.faqs.map((faq) => (
              <div key={faq.question} className={styles.faqItem}>
                <h3>{faq.question}</h3>
                <p>{highlightText(faq.answer)}</p>
              </div>
            ))}
          </section>

          {content.related.length > 0 && (
            <section className={styles.related}>
              <h2>Ďalšie profesie v odbore</h2>
              <ul>
                {content.related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/sk/profese/${item.urlSlug}`}>{highlightText(item.name)}</Link>
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
