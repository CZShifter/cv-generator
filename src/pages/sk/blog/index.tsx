import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Head from "next/head";
import FeaturesSection from '@/components/sk/FeaturesSection';
import CallToActionSection from '@/components/sk/CallToActionSection';
import { SITE_URL, SITE_NAME, SITE_VERSION } from "@/config/site";
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
        <title>{`Blog o životopisech a kariéře | ${SITE_NAME}`}</title>
        <meta name="description" content="Tipy a návody o psaní životopisů, pracovních pohovorech a kariérním růstu. Inspirace pro úspěch na trhu práce." />
        <meta property="og:title" content={`Blog o životopisech a kariéře | ${SITE_NAME}`} />
        <meta property="og:description" content="Tipy a návody o psaní životopisů, pracovních pohovorech a kariérním růstu." />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
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
