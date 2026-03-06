import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";
import Head from "next/head";
import styles from "@/scss/BlogPost.module.scss";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import {
  SITE_URL, SITE_URL_SK, SITE_NAME, OG_IMAGE, SITE_VERSION,
  FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL
} from "@/config/site";

// --- povolíme class/style a užitečné atributy na elementech, které používáš v MD ---
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div || []), ["className"], ["style"]],
    section: [...(defaultSchema.attributes?.section || []), ["className"], ["style"]],
    img: [
      ...(defaultSchema.attributes?.img || []),
      ["className"], ["style"], ["loading"], ["decoding"], ["sizes"], ["srcSet"], ["alt"]
    ],
    p: [...(defaultSchema.attributes?.p || []), ["className"], ["style"]],
    span: [...(defaultSchema.attributes?.span || []), ["className"], ["style"]],
    ul: [...(defaultSchema.attributes?.ul || []), ["className"], ["style"]],
    ol: [...(defaultSchema.attributes?.ol || []), ["className"], ["style"]],
    li: [...(defaultSchema.attributes?.li || []), ["className"], ["style"]],
    a: [...(defaultSchema.attributes?.a || []), ["className"], ["style"], ["target"], ["rel"]],
    h1: [...(defaultSchema.attributes?.h1 || []), ["className"], ["style"]],
    h2: [...(defaultSchema.attributes?.h2 || []), ["className"], ["style"]],
    h3: [...(defaultSchema.attributes?.h3 || []), ["className"], ["style"]],
    h4: [...(defaultSchema.attributes?.h4 || []), ["className"], ["style"]],
    h5: [...(defaultSchema.attributes?.h5 || []), ["className"], ["style"]],
    h6: [...(defaultSchema.attributes?.h6 || []), ["className"], ["style"]],
  },
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "src/content/cs/blog");
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames
    .filter(name => name.endsWith(".md"))
    .map(filename => ({ params: { slug: filename.replace(/\.md$/, "") } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), "src/content/cs/blog", `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  // Najdi spárovaný SK článek podle pairId (pokud existuje)
  const pairId = typeof data.pairId === "string" ? data.pairId.trim() : "";
  let altSlugSk: string | null = null;
  if (pairId) {
    const skDir = path.join(process.cwd(), "src/content/sk/blog");
    const skFiles = fs.readdirSync(skDir).filter((f) => f.endsWith(".md"));
    for (const f of skFiles) {
      const full = path.join(skDir, f);
      const raw = fs.readFileSync(full, "utf8");
      const fm = matter(raw).data as { pairId?: string };
      if (typeof fm.pairId === "string" && fm.pairId.trim() === pairId) {
        altSlugSk = f.replace(/\.md$/, "");
        break;
      }
    }
  }

  return { props: { data, content, slug, altSlugSk } };
};

type BlogPostProps = {
  data: {
    title: string;
    description: string;
    date: string;
    coverImage?: string;
    coverImageWebp?: string;
    author?: string;
    pairId?: string;
  };
  content: string;
  slug: string;
  altSlugSk?: string | null;
};

export default function BlogPost({ data, content, slug, altSlugSk }: BlogPostProps) {
  return (
    <>
      <Head>
        <title>{`${data.title} | Blog | ${SITE_NAME}`}</title>
        <meta name="description" content={data.description} />
        <meta name="robots" content="index, follow" />
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Canonical + hreflang */}
        <link rel="canonical" href={`${SITE_URL}/cs/blog/${slug}/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/blog/${slug}/`} hrefLang="cs-CZ" />
        {altSlugSk && (
          <link rel="alternate" href={`${SITE_URL_SK}/sk/blog/${altSlugSk}/`} hrefLang="sk-SK" />
        )}
        <link rel="alternate" href={`${SITE_URL}/cs/blog/${slug}/`} hrefLang="x-default" />
        {/* OG (article) */}
        <meta property="og:title" content={`${data.title} | Blog | ${SITE_NAME}`} />
        <meta property="og:description" content={data.description} />
        <meta
          property="og:image"
          content={data.coverImage ? `${SITE_URL}${data.coverImage}?v=${SITE_VERSION}` : OG_IMAGE}/>
        <meta property="og:image:alt" content={data.title} />
        <meta property="og:url" content={`${SITE_URL}/cs/blog/${slug}/`} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        <meta property="article:published_time" content={data.date} />
        {data.author && <meta property="article:author" content={data.author} />}
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.title} | Blog | ${SITE_NAME}`} />
        <meta name="twitter:description" content={data.description} />
        <meta
          name="twitter:image"
          content={data.coverImage ? `${SITE_URL}${data.coverImage}?v=${SITE_VERSION}` : OG_IMAGE}/>
        <meta name="twitter:image:alt" content={data.title} />
        {/* Structured data – BlogPosting */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "mainEntityOfPage": `${SITE_URL}/cs/blog/${slug}/`,
              "headline": data.title,
              "description": data.description,
              "image": data.coverImage ? `${SITE_URL}${data.coverImage}?v=${SITE_VERSION}` : undefined,
              "author": data.author ? { "@type": "Person", "name": data.author } : undefined,
              "publisher": {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL,
                "logo": { "@type": "ImageObject", "url": `${SITE_URL}/img/logo.png` }
              },
              "datePublished": data.date,
              "dateModified": data.date,
              "inLanguage": "cs-CZ"
            })
          }}
        />
      </Head>

      <div className={styles.blogPostWrapper}>
        <article className={styles.blogPost}>
          {data.coverImage && (
            <picture>
              {data.coverImageWebp && (
                <source
                  srcSet={`${data.coverImageWebp}?v=${SITE_VERSION}`}
                  type="image/webp"/>
              )}
              <img
                src={`${data.coverImage}?v=${SITE_VERSION}`}
                alt={data.title}
                className={styles.coverImage}   // ponechte svůj styl
                loading="eager"                 // nebo "lazy" dle potřeby
                decoding="async"
              />
            </picture>
          )}
          <h1>{data.title}</h1>

          {/* OBAL pro styly a zapnutí HTML v Markdownu */}
          <div className={styles.prose}>
            <ReactMarkdown
              // GitHub-flavored Markdown (tabulky, task-listy apod.)
              remarkPlugins={[remarkGfm]}
              // Povolit vložené HTML + bezpečná sanitizace se schématem výše
              rehypePlugins={[[rehypeRaw], [rehypeSanitize, schema]]}
            >
              {content}
            </ReactMarkdown>
          </div>

          <div style={{ marginTop: "2.4rem", color: "#7b849c", fontSize: "0.98rem" }}>
            {data.author && <span>Autor: {data.author} | </span>}
            {data.date && <span>{data.date}</span>}
          </div>
        </article>
      </div>
    </>
  );
}
