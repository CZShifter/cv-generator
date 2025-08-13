import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Head from "next/head";
import FeaturesSection from '@/components/cs/FeaturesSection';
import CallToActionSection from '@/components/cs/CallToActionSection';
import { SITE_URL, SITE_URL_SK, SITE_NAME, SITE_VERSION, FAVICON_URL_32, APPLE_TOUCH_ICON_URL, FAVICON_URL_192, OG_IMAGE } from "@/config/site";
import styles from "@/scss/Blog.module.scss";

type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;          // původní text z frontmatteru (pro zobrazení)
  _ts: number;           // číslo pro bezpečné řazení (timestamp)
  coverImage?: string;
  coverImageWebp?: string;
  author?: string;
};

type BlogIndexProps = {
  posts: BlogPostMeta[];
};

// Bezpečný parser pro formáty: "DD.MM.YYYY", "DD.MM.YY", "YYYY-MM-DD", ISO
function parseFrontmatterDate(input: unknown): number {
  if (typeof input !== "string" || !input.trim()) return 0;

  const s = input.trim();

  // DD.MM.YYYY nebo DD.MM.YY
  const dot = /^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/;
  const m1 = s.match(dot);
  if (m1) {
    const [, d, mo, y] = m1; // první prvek pole (celý match) ignorujeme
    const year = y.length === 2 ? Number(y) + 2000 : Number(y);
    const month = Number(mo) - 1; // JS: 0-11
    const day = Number(d);
    const dt = new Date(year, month, day).getTime();
    return Number.isNaN(dt) ? 0 : dt;
  }

  // YYYY-MM-DD
  const hyph = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  const m2 = s.match(hyph);
  if (m2) {
    const year = Number(m2[1]);
    const month = Number(m2[2]) - 1;
    const day = Number(m2[3]);
    const dt = new Date(year, month, day).getTime();
    return Number.isNaN(dt) ? 0 : dt;
  }

  // Fallback – zkusí nativní parser (ISO apod.)
  const t = new Date(s).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "src/content/cs/blog");
  const publicDir = path.join(process.cwd(), "public");
  const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith(".md"));

  const posts: BlogPostMeta[] = filenames.map(filename => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    const dateStr = String(data.date ?? "");
    const ts = parseFrontmatterDate(dateStr);

    // původní obrázek z frontmatteru (např. "/img/blog/cover.jpg")
    const coverImage: string | undefined =
      typeof data.coverImage === "string" ? data.coverImage : undefined;

    // webp z frontmatteru má přednost, jinak po něm zkusíme sáhnout vedle PNG/JPG
    let coverImageWebp: string | undefined =
      typeof data.coverImageWebp === "string" ? data.coverImageWebp : undefined;

    if (!coverImageWebp && coverImage && /\.(png|jpe?g)$/i.test(coverImage)) {
      const rel = coverImage.startsWith("/") ? coverImage.slice(1) : coverImage;
      const abs = path.join(publicDir, rel);
      const absWebp = abs.replace(/\.(png|jpe?g)$/i, ".webp");
      if (fs.existsSync(absWebp)) {
        const relWebp = "/" + path.relative(publicDir, absWebp).replace(/\\/g, "/");
        coverImageWebp = relWebp;
      }
    }

    return {
      slug: filename.replace(/\.md$/, ""),
      title: data.title ?? filename.replace(/\.md$/, ""),
      description: data.description ?? "",
      date: dateStr,
      _ts: ts,
      coverImage,
      coverImageWebp, // ← přidáno
      author: data.author,
    };
  });

  // Řazení: nejnovější vlevo → od nejvyššího timestampu k nejnižšímu
  posts.sort((a, b) => b._ts - a._ts);

  return {
    props: { posts },
    // revalidate: 60 // volitelné ISR
  };
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <>
      <Head>
        <title>{`Blog o životopisech a kariéře | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content="Tipy a návody o psaní životopisů, pracovních pohovorech a kariérním růstu. Inspirace pro úspěch na trhu práce."/>
        {/* Favikony */}
        <link rel="icon" href={FAVICON_URL_32} sizes="32x32" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_URL} sizes="180x180" />
        <link rel="icon" href={FAVICON_URL_192} sizes="192x192" />
        {/* Canonical + hreflang */}
        <link rel="canonical" href={`${SITE_URL}/cs/blog/`} />
        <link rel="alternate" href={`${SITE_URL}/cs/blog/`} hrefLang="cs-CZ" />
        <link rel="alternate" href={`${SITE_URL_SK}/sk/blog/`} hrefLang="sk-SK" />
        <link rel="alternate" href={`${SITE_URL}/cs/blog/`} hrefLang="x-default" />
        {/* OG */}
        <meta property="og:title" content={`Blog o životopisech a kariéře | ${SITE_NAME}`} />
        <meta
          property="og:description"
          content="Tipy a návody o psaní životopisů, pracovních pohovorech a kariérním růstu. Inspirace pro úspěch na trhu práce."/>
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Ilustrace – blog o životopisech a kariéře" />
        <meta property="og:url" content={`${SITE_URL}/cs/blog/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="sk_SK" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Blog o životopisech a kariéře | ${SITE_NAME}`} />
        <meta
          name="twitter:description"
          content="Tipy a návody o psaní životopisů, pracovních pohovorech a kariérním růstu. Inspirace pro úspěch na trhu práce."/>
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Ilustrace – blog o životopisech a kariéře" />
        {/* Structured data – Blog + ItemList z prvních 10 příspěvků */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "mainEntityOfPage": `${SITE_URL}/cs/blog/`,
              "headline": `Blog o životopisech a kariéře | ${SITE_NAME}`,
              "description":
                "Tipy a návody o psaní životopisů, pracovních pohovorech a kariérním růstu.",
              "publisher": {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL,
                "logo": { "@type": "ImageObject", "url": `${SITE_URL}/img/logo_nove_barevny.png` }
              },
              "inLanguage": "cs-CZ",
              "blogPost": posts.slice(0, 10).map((p) => ({
                "@type": "BlogPosting",
                "headline": p.title,
                "description": p.description,
                "url": `${SITE_URL}/cs/blog/${p.slug}/`,
                "datePublished": p.date,
                "image": p.coverImage ? `${SITE_URL}${p.coverImage}?v=${SITE_VERSION}` : undefined
              })),
              "about": [
                { "@type": "Thing", "name": "Životopis" },
                { "@type": "Thing", "name": "Pracovní pohovor" },
                { "@type": "Thing", "name": "Motivační dopis" }
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
                "url": `${SITE_URL}/cs/blog/${p.slug}/`,
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
            <p className={styles.intro}>Blog slouží jako rozcestník všech článků a návodů na téma práce</p>
            <div className={styles.grid}>
              {posts.map(post => (
                <article key={post.slug} className={styles.card}>
                    {post.coverImage && (
                      <picture>
                        {post.coverImageWebp && (
                          <source
                            srcSet={`${post.coverImageWebp}?v=${SITE_VERSION}`}
                            type="image/webp"/>
                        )}
                        <img
                          src={`${post.coverImage}?v=${SITE_VERSION}`}
                          alt={post.title}
                          className={styles.img}
                          loading="eager"
                          decoding="async"
                        />
                      </picture>
                    )}
                    <small>{post.date}</small>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <div className={styles.blogbutton}>
                      <Link href={`/cs/blog/${post.slug}`}><p>Čtěte více</p></Link>
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
