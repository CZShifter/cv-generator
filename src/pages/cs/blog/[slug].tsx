import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import styles from "@/scss/BlogPost.module.scss";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { SITE_URL, SITE_URL_SK, SITE_NAME, OG_IMAGE, SITE_VERSION, FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL } from "@/config/site";

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "src/content/cs/blog");
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames.map(filename => ({
    params: { slug: filename.replace(/\.md$/, "") },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), "src/content/cs/blog", `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return { props: { data, content, slug } };
};

type BlogPostProps = {
  data: {
    title: string;
    description: string;
    date: string;
    coverImage?: string;
    author?: string;
  };
  content: string;
  slug: string;
};

export default function BlogPost({ data, content, slug }: BlogPostProps) {
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
        <link rel="alternate" href={`${SITE_URL_SK}/sk/blog/${slug}/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/`} hrefLang="x-default" />
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
            <img src={`${data.coverImage}?v=${SITE_VERSION}`} alt={data.title} />
          )}
          <h1>{data.title}</h1>
          <ReactMarkdown>{content}</ReactMarkdown>
          <div style={{marginTop: "2.4rem", color: "#7b849c", fontSize: "0.98rem"}}>
            {data.author && <span>Autor: {data.author} | </span>}
            {data.date && <span>{data.date}</span>}
          </div>
        </article>
      </div>
    </>
  );
}
