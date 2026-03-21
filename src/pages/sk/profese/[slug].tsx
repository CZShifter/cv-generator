import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { RiTelegram2Line, RiFacebookCircleLine, RiDoubleQuotesR } from "react-icons/ri";
import { LiaLinkedinIn } from "react-icons/lia";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import styles from "@/scss/Profession.module.scss";
import { buildProfessionContent, fromProfessionUrlSlug, getProfessionSlugs, ProfessionContent, toProfessionUrlSlug } from "@/data/professions";
import { SITE_URL, SITE_URL_SK, SITE_NAME_SK, OG_IMAGE_SK, PRICE_CV_SK, LOGO_SCHEMA_URL_SK } from "@/config/site";
import ProfessionPreviewFrame from "@/components/ProfessionPreviewFrame";
import { buildProfessionPreviewData, pickPreviewTemplateId } from "@/data/professionPreviewData";

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
  const currentYear = new Date().getFullYear();
  const metaTitle = `Ako napísať životopis ${content.name} - vzor ${currentYear} | ${SITE_NAME_SK}`;
  const canonical = `${SITE_URL_SK}/sk/profese/${content.urlSlug}/`;
  const alternate = `${SITE_URL}/cs/profese/${content.urlSlug}/`;
  const shareUrlEncoded = encodeURIComponent(canonical);
  const shareTextEncoded = encodeURIComponent(content.title);
  const shareWhatsappEncoded = encodeURIComponent(`${content.title} ${canonical}`);
  const previewTemplateId = pickPreviewTemplateId(content.slug);
  const previewData = buildProfessionPreviewData("sk", content.slug, previewTemplateId);
  const summaryAnchors = ["how-to", "skills-tasks", "cv-preview", "highlight", "mistakes"];
  const highlightText = (text: string) => {
    if (!text) return text;
    const escapedName = content.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const splitPattern = new RegExp(`(${escapedName}|životopis\\w*|vzor\\w*|20\\d{2})`, "gi");
    const testPattern = new RegExp(`^(${escapedName}|životopis\\w*|vzor\\w*|20\\d{2})$`, "i");
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
          aplikácii na tvorbu životopisov online
        </Link>
        {highlightText(parts[1] ?? "")}
      </>
    );
  };
  const renderParagraph = (text: string) => {
    if (!text.includes("[blog]") && !text.includes("[preview]")) return highlightText(text);
    const parts = text.split(/(\[blog\][\s\S]*?\[\/blog\]|\[preview\][\s\S]*?\[\/preview\])/g);
    return (
      <>
        {parts.filter(Boolean).map((part, index) => {
          if (part.startsWith("[blog]")) {
            const label = part.replace(/^\[blog\]|\[\/blog\]$/g, "");
            return (
              <Link key={`blog-${index}`} className={styles.generatorLink} href="/sk/blog/ako-napisat-zivotopis">
                {label}
              </Link>
            );
          }
          if (part.startsWith("[preview]")) {
            const label = part.replace(/^\[preview\]|\[\/preview\]$/g, "");
            return (
              <Link key={`preview-${index}`} className={styles.generatorLink} href="/sk/preview">
                {label}
              </Link>
            );
          }
          return <span key={`text-${index}`}>{highlightText(part)}</span>;
        })}
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
    "name": metaTitle,
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
    "name": "Aplikácia na tvorbu životopisu online",
    "description": "Webová aplikácia na rýchlu tvorbu štruktúrovaného životopisu online. Bez registrácie, PDF ihneď.",
    "image": OG_IMAGE_SK,
    "brand": { "@type": "Brand", "name": SITE_NAME_SK, "logo": LOGO_SCHEMA_URL_SK },
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
        <title>{metaTitle}</title>
        <meta name="description" content={content.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" href={alternate} hrefLang="cs-CZ" />
        <link rel="alternate" href={canonical} hrefLang="sk-SK" />
        <link rel="alternate" href={canonical} hrefLang="x-default" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={content.description} />
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
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

      <main className={styles.wrapper}>
        <div className={styles.container}>
          <header className={styles.hero}>
            <h1>{content.h1}</h1>
            {content.intro.map((p, index) => (
              <p key={p} className={index === 0 ? styles.heroPerex : undefined}>{renderIntro(p)}</p>
            ))}
            {content.uniqueLead?.trim() && <p>{highlightText(content.uniqueLead)}</p>}
          </header>

          <section className={styles.summaryBox}>
            <h2 className={styles.summaryTitle}>Rýchle zhrnutie (navigácia)</h2>
            <nav aria-label="Rýchle zhrnutie">
              <ul className={styles.summaryList}>
                {content.summaryBullets.map((item, index) => (
                  <li key={item}>
                    <a href={`#${summaryAnchors[index] ?? "summary"}`}>{highlightText(item)}</a>
                  </li>
                ))}
                <li>
                  <a href="#motivacny-list">Motivačný list</a>
                </li>
              </ul>
            </nav>
          </section>

          {topSections.map((section) => (
            <section
              key={section.heading}
              id={section.heading === content.bodySections[0]?.heading ? "how-to" : undefined}
              className={styles.bodySection}
            >
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
                      {renderParagraph(paragraph)}
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

          <section className={styles.splitSection}>
            <div className={styles.splitLeft}>
              <div className={styles.adBox}>
                <span className={styles.adQuoteIcon} aria-hidden="true">
                  <RiDoubleQuotesR />
                </span>
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
              <div className={`${styles.shareBox} ${styles.shareBoxDesktop}`}>
                <h4 className={styles.shareTitle}>Sdílejte rady & tipy s ostatními</h4>
                <div className={styles.shareLinks}>
                  <a
                    className={styles.shareLink}
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Zdieľať na Facebooku"
                  >
                    <RiFacebookCircleLine />
                  </a>
                  <a
                    className={styles.shareLink}
                    href={`https://twitter.com/intent/tweet?url=${shareUrlEncoded}&text=${shareTextEncoded}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Zdieľať na X"
                  >
                    <FaXTwitter className={styles.shareXIcon} />
                  </a>
                  <a
                    className={styles.shareLink}
                    href={`https://wa.me/?text=${shareWhatsappEncoded}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Zdieľať na WhatsApp"
                  >
                    <FaWhatsapp className={styles.shareSmallIcon} />
                  </a>
                  <a
                    className={styles.shareLink}
                    href={`https://t.me/share/url?url=${shareUrlEncoded}&text=${shareTextEncoded}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Zdieľať na Telegrame"
                  >
                    <RiTelegram2Line />
                  </a>
                  <a
                    className={styles.shareLink}
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEncoded}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Zdieľať na LinkedIne"
                  >
                    <LiaLinkedinIn />
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.splitRight} id="skills-tasks">
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
          </section>

          <div className={`${styles.shareBox} ${styles.shareBoxMobile}`}>
            <h4 className={styles.shareTitle}>Sdílejte rady & tipy s ostatními</h4>
            <div className={styles.shareLinks}>
              <a
                className={styles.shareLink}
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zdieľať na Facebooku"
              >
                <RiFacebookCircleLine />
              </a>
              <a
                className={styles.shareLink}
                href={`https://twitter.com/intent/tweet?url=${shareUrlEncoded}&text=${shareTextEncoded}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zdieľať na X"
              >
                <FaXTwitter className={styles.shareXIcon} />
              </a>
              <a
                className={styles.shareLink}
                href={`https://wa.me/?text=${shareWhatsappEncoded}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zdieľať na WhatsApp"
              >
                <FaWhatsapp className={styles.shareSmallIcon} />
              </a>
              <a
                className={styles.shareLink}
                href={`https://t.me/share/url?url=${shareUrlEncoded}&text=${shareTextEncoded}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zdieľať na Telegrame"
              >
                <RiTelegram2Line />
              </a>
              <a
                className={styles.shareLink}
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEncoded}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zdieľať na LinkedIne"
              >
                  <LiaLinkedinIn />
              </a>
            </div>
          </div>

          <section className={styles.previewCta}>
            <div className={styles.previewWrap} id="cv-preview">
            <h2>Vzor životopisu pro pozici {content.name}</h2>
              <ProfessionPreviewFrame locale="sk" data={previewData} templateId={previewTemplateId} />
            </div>
            <section className={styles.cta}>
              <div className={styles.ctaBlock}>
                <h2 className={styles.ctaTitle}>Pripravení vytvoriť si svoj životopis?</h2>
                <p className={styles.ctaText}>
                  Začnite teraz a vytvorte štruktúrovaný životopis počas 5 minút bez registrácie.
                </p>
                <Link className={styles.ctaButton} href="/sk/preview">
                  Vytvoriť životopis
                </Link>
              </div>
            </section>
          </section>

          {bottomSections.map((section) => (
            <section
              key={section.heading}
              id={
                section.heading.toLowerCase().includes("ocenia")
                  ? "highlight"
                  : section.heading.toLowerCase().includes("chyby")
                    ? "mistakes"
                    : undefined
              }
              className={styles.bodySection}
            >
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
                      {renderParagraph(paragraph)}
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

          <section className={styles.bodySection} id="motivacny-list">
            <h2>Motivačný list</h2>
            <p>
              Nezabudnite na motivačný list, môže to byť detail, ktorý rozhodne o tom, či vás zamestnávateľ pozve na pohovor.
              Dopĺňa životopis, dáva vašej žiadosti o prácu kontext a ukazuje, prečo chcete práve túto pozíciu.
              V tomto článku nájdete návod, {" "}
              <Link className={styles.generatorLink} href="/sk/blog/ako-napisat-motivacny-list">
                ako napísať motivačný list
              </Link>
              , alebo si ho rovno vytvorte v <Link className={styles.generatorLink} href="/sk/motivacni-dopis">našej aplikácii zadarmo</Link>.
            </p>
          </section>

          <section className={styles.faq}>
            <h2>Časté otázky (FAQ)</h2>
            <div className={styles.faqList}>
              {content.faqs.map((faq) => (
                <details key={faq.question} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>{faq.question}</span>
                    <span className={styles.faqIcon} aria-hidden="true" />
                  </summary>
                  <div className={styles.faqAnswer}>
                    {faq.answer.includes("/sk/profese/zivotopis-absolvent-bez-praxe") ? (() => {
                      const [before, after] = faq.answer.split("/sk/profese/zivotopis-absolvent-bez-praxe");
                      return (
                        <p>
                          {highlightText(before)}
                          <Link className={styles.faqLink} href="/sk/profese/zivotopis-absolvent-bez-praxe">
                            vzor životopisu bez praxe
                          </Link>
                          {highlightText(after ?? "")}
                        </p>
                      );
                    })() : (
                      <p>{highlightText(faq.answer)}</p>
                    )}
                  </div>
                </details>
              ))}
            </div>
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
      </main>
    </>
  );
}



