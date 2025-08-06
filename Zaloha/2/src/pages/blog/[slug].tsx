import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import styles from "@/scss/BlogPost.module.scss";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { SITE_URL, SITE_NAME } from "@/config/site";

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "src/content/blog");
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames.map(filename => ({
    params: { slug: filename.replace(/\.md$/, "") },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.md`);
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
        <meta property="og:title" content={`${data.title} | Blog | ${SITE_NAME}`} />
        <meta property="og:description" content={data.description} />
        <meta property="og:image" content={data.coverImage ? `${SITE_URL}${data.coverImage}` : ""} />
        <meta property="og:url" content={`${SITE_URL}/blog/${slug}`} />
      </Head>
      <div className={styles.blogPostWrapper}>
        <article className={styles.blogPost}>
          {data.coverImage && (
            <img src={data.coverImage} alt={data.title} />
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
