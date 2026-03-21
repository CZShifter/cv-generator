import React, { useEffect, useMemo, useState } from "react";
import { RiDoubleQuotesR } from "react-icons/ri";
import styles from "@/scss/BlogPost.module.scss";
import { SITE_VERSION } from "@/config/site";

type TwoThirdsProps = {
  position?: "left" | "right";
  imageJpg: string;
  imageWebp?: string;
  alt: string;
  children: React.ReactNode;
};

export function TwoThirds({
  position = "left",
  imageJpg,
  imageWebp,
  alt,
  children,
}: TwoThirdsProps) {
  const positionClass = position === "right" ? styles.imageRight : styles.imageLeft;
  const imageJpgSrc = imageJpg ? `${imageJpg}?v=${SITE_VERSION}` : imageJpg;
  const imageWebpSrc = imageWebp ? `${imageWebp}?v=${SITE_VERSION}` : imageWebp;
  return (
    <div className={`${styles.twoThirds} ${positionClass}`}>
      <div className={styles.twoThirdsText}>{children}</div>
      <div className={styles.twoThirdsMedia}>
        <picture>
          {imageWebpSrc && <source srcSet={imageWebpSrc} type="image/webp" />}
          <source srcSet={imageJpgSrc} type="image/jpeg" />
          <img src={imageJpgSrc} alt={alt} loading="lazy" decoding="async" />
        </picture>
      </div>
    </div>
  );
}

type PerexProps = {
  children: React.ReactNode;
};

export function Perex({ children }: PerexProps) {
  return <p className={styles.perex}>{children}</p>;
}

type DressRow = { label: string; desc: string };

type DressBoxProps = {
  title: string;
  rows?: DressRow[];
  headings?: { left: string; right: string };
};

export function DressBox({ title, rows, headings }: DressBoxProps) {
  const leftHead = headings?.left ?? "Oblečení";
  const rightHead = headings?.right ?? "Kdy zvolit";
  const safeRows = rows ?? [];
  return (
    <div className={styles.dressBox}>
      <h3 className={styles.dressTitle}>{title}</h3>
      <div className={styles.dressGrid}>
        <div className={styles.dressHead}>{leftHead}</div>
        <div className={styles.dressHead}>{rightHead}</div>
        {safeRows.map((row, index) => (
          <React.Fragment key={`${row.label}-${index}`}>
            <div className={styles.dressCell}>{row.label}</div>
            <div className={styles.dressCell}>{row.desc}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

type FaqItem = { question: string; answer: React.ReactNode };

type FaqProps = {
  title: string;
  items?: FaqItem[];
};

export function Faq({ title, items }: FaqProps) {
  const safeItems = items ?? [];
  return (
    <>
      <h3 className={styles.blogSectionTitle}>{title}</h3>
      <div className={styles.blogFaq}>
        {safeItems.map((item, index) => (
          <details className={styles.blogFaqItem} key={`${item.question}-${index}`}>
            <summary className={styles.blogFaqQuestion}>
              <span>{`${index + 1}. ${item.question}`}</span>
              <span className={styles.blogFaqIcon} aria-hidden="true"></span>
            </summary>
            <div className={styles.blogFaqAnswer}>{item.answer}</div>
          </details>
        ))}
      </div>
    </>
  );
}

type AfterGridProps = {
  children: React.ReactNode;
  variant?: "70-30";
};

export function AfterGrid({ children, variant }: AfterGridProps) {
  const gridClass =
    variant === "70-30"
      ? `${styles.blogAfterGrid} ${styles.blogAfterGrid7030}`
      : styles.blogAfterGrid;
  return (
    <div className={styles.blogAfterSection}>
      <div className={gridClass}>{children}</div>
    </div>
  );
}

type AfterColProps = {
  children: React.ReactNode;
};

export function AfterCol({ children }: AfterColProps) {
  return <div className={styles.blogAfterCol}>{children}</div>;
}

type RelatedItem = {
  href: string;
  title: string;
  description: string;
  imageJpg: string;
  imageWebp?: string;
  alt: string;
};

type RelatedListProps = {
  title: string;
  items?: RelatedItem[];
};

export function RelatedList({ title, items }: RelatedListProps) {
  const safeItems = items ?? [];
  return (
    <>
      <h3 className={styles.blogSectionTitle}>{title}</h3>
      <div className={styles.blogRelatedList}>
        {safeItems.map((item) => (
          <a className={styles.blogRelatedItem} href={item.href} key={item.href}>
            <div className={styles.blogRelatedMedia}>
              <picture>
                {item.imageWebp && (
                  <source srcSet={`${item.imageWebp}?v=${SITE_VERSION}`} type="image/webp" />
                )}
                <source srcSet={`${item.imageJpg}?v=${SITE_VERSION}`} type="image/jpeg" />
                <img
                  src={`${item.imageJpg}?v=${SITE_VERSION}`}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <div className={styles.blogRelatedBody}>
              <span className={styles.blogRelatedTitle}>{item.title}</span>
              <p className={styles.blogRelatedDesc}>{item.description}</p>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

type BlogCtaProps = {
  title: string;
  text?: string;
  buttonLabel: string;
  href: string;
  rotatingPhrases?: string[];
};

export function BlogCta({ title, text, buttonLabel, href, rotatingPhrases }: BlogCtaProps) {
  const phrases = useMemo(
    () => (rotatingPhrases ?? []).map((p) => p.trim()).filter(Boolean),
    [rotatingPhrases]
  );
  const fallbackTitle = phrases[0] ?? title;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;
    const current = phrases[phraseIndex] ?? "";
    const typingSpeed = 140;
    const deletingSpeed = 60;
    const pauseAfterTyped = 4000;
    const pauseAfterDeleted = 300;

    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), pauseAfterTyped);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex((c) => c - 1), deletingSpeed);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex === 0) {
      const t = setTimeout(() => {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
      }, pauseAfterDeleted);
      return () => clearTimeout(t);
    }
  }, [phrases, phraseIndex, charIndex, deleting]);

  const showTypewriter = phrases.length > 0;
  const currentText = phrases[phraseIndex] ?? "";
  const typedText = currentText.slice(0, charIndex);

  return (
    <div className={styles.blogCta}>
      <div className={styles.blogCtaBlock}>
        <h2 className={styles.blogCtaTitle} aria-live="polite" aria-atomic="true">
          {showTypewriter ? (
            <>
              <span className={styles.blogCtaType}>
                {typedText || "\u00A0"}
                <span className={styles.blogCtaCursor} aria-hidden="true" />
              </span>
            </>
          ) : (
            fallbackTitle
          )}
        </h2>
        {text && <p className={styles.blogCtaText}>{text}</p>}
        <a className={styles.blogCtaButton} href={href}>{buttonLabel}</a>
      </div>
    </div>
  );
}

type TextBlockProps = {
  children: React.ReactNode;
};

export function TextBlock({ children }: TextBlockProps) {
  return <div className={styles.textBlock}>{children}</div>;
}

type QuoteBoxProps = {
  label?: string;
  children: React.ReactNode;
};

export function QuoteBox({ label = "Příklad", children }: QuoteBoxProps) {
  return (
    <div className={styles.quoteBox}>
      <div className={styles.quoteLabel}>{label}</div>
      <span className={styles.quoteIcon} aria-hidden="true">
        <RiDoubleQuotesR />
      </span>
      <blockquote className={styles.quoteText}>{children}</blockquote>
    </div>
  );
}

type SummaryItem = {
  href: string;
  label: string;
};

type SummaryNavProps = {
  title?: string;
  items: SummaryItem[];
};

export function SummaryNav({ title = "Rychlé shrnutí (navigace)", items }: SummaryNavProps) {
  return (
    <section className={styles.summaryBox}>
      <h2 className={styles.summaryTitle}>{title}</h2>
      <nav aria-label={title}>
        <ul className={styles.summaryList}>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

type TextLinkProps = {
  href: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
};

export function TextLink({ href, children, target, rel }: TextLinkProps) {
  return (
    <a className={styles.textLink} href={href} target={target} rel={rel}>
      {children}
    </a>
  );
}

export const blogMdxComponents = {
  TwoThirds,
  Perex,
  DressBox,
  Faq,
  AfterGrid,
  AfterCol,
  RelatedList,
  BlogCta,
  TextBlock,
  QuoteBox,
  SummaryNav,
  TextLink,
};
