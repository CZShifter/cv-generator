import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import styles from "@/scss/BlogPost.module.scss";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { blogMdxComponents } from "@/components/blog/BlogMdxComponents";
import {
  SITE_URL,
  SITE_URL_SK,
  SITE_NAME_SK,
  OG_IMAGE_SK,
  SITE_VERSION,
  FAVICON_URL_32,
  FAVICON_URL_192,
  APPLE_TOUCH_ICON_URL,
  LOGO_SCHEMA_URL_SK
} from "@/config/site";

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "src/content/sk/blog");
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames
    .filter(name => name.endsWith(".mdx"))
    .map(filename => ({
      params: { slug: filename.replace(/\.mdx$/, "") },
    }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), "src/content/sk/blog", `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const mdxSource = await serialize(content, {
    blockJS: false,
    blockDangerousJS: true,
  });

  // Najdi spárovaný CZ článek podle pairId (pokud existuje)
  const pairId = typeof data.pairId === "string" ? data.pairId.trim() : "";
  let altSlugCs: string | null = null;
  if (pairId) {
    const csDir = path.join(process.cwd(), "src/content/cs/blog");
    const csFiles = fs.readdirSync(csDir).filter((f) => f.endsWith(".mdx"));
    for (const f of csFiles) {
      const full = path.join(csDir, f);
      const raw = fs.readFileSync(full, "utf8");
      const fm = matter(raw).data as { pairId?: string };
      if (typeof fm.pairId === "string" && fm.pairId.trim() === pairId) {
        altSlugCs = f.replace(/\.mdx$/, "");
        break;
      }
    }
  }

  return { props: { data, slug, altSlugCs, mdxSource } };
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
  slug: string;
  altSlugCs?: string | null;
  mdxSource: MDXRemoteSerializeResult;
};

export default function BlogPost({ data, slug, altSlugCs, mdxSource }: BlogPostProps) {
  return (
    <>
      <Head>
        <title>{`${data.title} | Blog | ${SITE_NAME_SK}`}</title>
        <meta name="description" content={data.description} />
        <meta name="robots" content="index, follow" />
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Canonical + hreflang */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk/blog/${slug}/`} />
        {altSlugCs && (
          <link rel="alternate" href={`${SITE_URL}/cs/blog/${altSlugCs}/`} hrefLang="cs-CZ" />
        )}
        <link rel="alternate" href={`${SITE_URL_SK}/sk/blog/${slug}/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/blog/${slug}/`} hrefLang="x-default" />
        {/* OG */}
        <meta property="og:title" content={`${data.title} | Blog | ${SITE_NAME_SK}`} />
        <meta property="og:description" content={data.description} />
        <meta
          property="og:image"
          content={data.coverImage ? `${SITE_URL_SK}${data.coverImage}?v=${SITE_VERSION}` : OG_IMAGE_SK}/>
        <meta property="og:image:alt" content={data.title} />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/blog/${slug}/`} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        <meta property="article:published_time" content={data.date} />
        {data.author && <meta property="article:author" content={data.author} />}
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.title} | Blog | ${SITE_NAME_SK}`} />
        <meta name="twitter:description" content={data.description} />
        <meta
          name="twitter:image"
          content={data.coverImage ? `${SITE_URL_SK}${data.coverImage}?v=${SITE_VERSION}` : OG_IMAGE_SK}/>
        <meta name="twitter:image:alt" content={data.title} />
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "mainEntityOfPage": `${SITE_URL_SK}/sk/blog/${slug}/`,
              "headline": data.title,
              "description": data.description,
              "image": data.coverImage ? `${SITE_URL_SK}${data.coverImage}?v=${SITE_VERSION}` : undefined,
              "author": data.author ? { "@type": "Person", "name": data.author } : undefined,
              "publisher": {
                "@type": "Organization",
                "name": SITE_NAME_SK,
                "url": SITE_URL_SK,
                "logo": { "@type": "ImageObject", "url": LOGO_SCHEMA_URL_SK }
              },
              "datePublished": data.date,
              "dateModified": data.date,
              "inLanguage": "sk-SK",
              "articleSection": "Blog"
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
          <div className={styles.postMetaTop}>
            {data.author && <span>Autor: {data.author} | </span>}
            {data.date && <span>{data.date}</span>}
          </div>
          <h1>{data.title}</h1>
          {/* Povolit HTML bloky + bezpečná sanitizace */}
          <div className={styles.prose}>
            <MDXRemote {...mdxSource} components={blogMdxComponents} />
          </div>
        </article>
      </div>
    </>
  );
}
