import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Head from "next/head";
import FeaturesSection from '@/components/sk/FeaturesSection';
import CallToActionSection from '@/components/sk/CallToActionSection';
import { SITE_URL, SITE_URL_SK, SITE_NAME_SK, SITE_VERSION, FAVICON_URL_32, FAVICON_URL_192, APPLE_TOUCH_ICON_URL, OG_IMAGE_SK } from "@/config/site";
import styles from "@/scss/Blog.module.scss";

type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage?: string;
  author?: string;
};

type BlogIndexProps = {
  posts: BlogPostMeta[];
};

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "src/content/sk/blog/");
  const filenames = fs.readdirSync(postsDirectory);

  const posts: BlogPostMeta[] = filenames.map(filename => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ""),
      title: data.title,
      description: data.description,
      date: data.date,
      coverImage: data.coverImage,
      author: data.author,
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    props: { posts },
  };
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <>
      <Head>
        <title>{`Blog o životopisoch a kariére | ${SITE_NAME_SK}`}</title>
        <meta
          name="description"
          content="Tipy a návody o písaní životopisov, pracovných pohovoroch a kariérnom raste. Inšpirácia pre úspech na trhu práce."/>
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Canonical + hreflang */}
        <link rel="canonical" href={`${SITE_URL_SK}/sk/blog/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/blog/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/blog/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL_SK}/`} hrefLang="x-default" />
        {/* Open Graph */}
        <meta property="og:title" content={`Blog o životopisoch a kariére | ${SITE_NAME_SK}`} />
        <meta
          property="og:description"
          content="Tipy a návody o písaní životopisov, pracovných pohovoroch a kariérnom raste. Inšpirácia pre úspech na trhu práce."/>
        <meta property="og:image" content={OG_IMAGE_SK} />
        <meta property="og:image:alt" content="Ilustrácia – blog o životopisoch a kariére" />
        <meta property="og:url" content={`${SITE_URL_SK}/sk/blog/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="sk_SK" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Blog o životopisoch a kariére | ${SITE_NAME_SK}`} />
        <meta
          name="twitter:description"
          content="Tipy a návody o písaní životopisov, pracovných pohovoroch a kariérnom raste. Inšpirácia pre úspech na trhu práce."/>
        <meta name="twitter:image" content={OG_IMAGE_SK} />
        <meta name="twitter:image:alt" content="Ilustrácia – blog o životopisoch a kariére" />  
        {/* Structured data – Blog + ItemList z prvých 10 príspevkov */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "mainEntityOfPage": `${SITE_URL_SK}/sk/blog/`,
              "headline": `Blog o životopisoch a kariére | ${SITE_NAME_SK}`,
              "description":
                "Tipy a návody o písaní životopisov, pracovných pohovoroch a kariérnom raste.",
              "publisher": {
                "@type": "Organization",
                "name": SITE_NAME_SK,
                "url": SITE_URL_SK,
                "logo": { "@type": "ImageObject", "url": `${SITE_URL_SK}/img/logo.png` }
              },
              "inLanguage": "sk-SK",
              "blogPost": posts.slice(0, 10).map((p) => ({
                "@type": "BlogPosting",
                "headline": p.title,
                "description": p.description,
                "url": `${SITE_URL_SK}/sk/blog/${p.slug}/`,
                "datePublished": p.date,
                "image": p.coverImage ? `${SITE_URL_SK}${p.coverImage}?v=${SITE_VERSION}` : undefined
              })),
              "about": [
                { "@type": "Thing", "name": "Životopis" },
                { "@type": "Thing", "name": "Pracovný pohovor" },
                { "@type": "Thing", "name": "Motivačný list" }
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": posts.slice(0, 10).map((p, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "url": `${SITE_URL_SK}/sk/blog/${p.slug}/`,
                "name": p.title
              }))
            })
          }}
        />
      </Head>
      <section className={styles.blogSection}>
        <div className={styles.blogWrapper}>
          <div className={styles.blogcard}>
            <h1 className={styles.heading}>Blog</h1>
            <p className={styles.intro}>Blog slúži ako rozcestník všetkých článkov a návodov na tému životopisov</p>
            <div className={styles.grid}>
              {posts.map(post => (
                <article key={post.slug} className={styles.card}>
                    <img
                      src={`${post.coverImage}?v=${SITE_VERSION}`}
                      alt={post.title}
                      className={styles.img}
                    />
                    <small>{post.date}</small>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <div className={styles.blogbutton}>
                      <Link href={`/sk/blog/${post.slug}`}><p>Čítajte viac</p></Link>
                    </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FeaturesSection />
      <CallToActionSection />
    </>
  );
}
