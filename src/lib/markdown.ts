// src/lib/markdown.ts
import 'server-only';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { Schema } from 'hast-util-sanitize';

type Frontmatter = {
  title?: string;
  description?: string;
  date?: string;
  coverImage?: string;
  author?: string;
  [key: string]: unknown; // další volitelná pole bez použití `any`
};

const schema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div || []), ['className'], ['style']],
    section: [...(defaultSchema.attributes?.section || []), ['className'], ['style']],
    img: [
      ...(defaultSchema.attributes?.img || []),
      ['className'], ['style'], ['loading'], ['decoding'], ['sizes'], ['srcSet'], ['alt'],
    ],
    p: [...(defaultSchema.attributes?.p || []), ['className'], ['style']],
    span: [...(defaultSchema.attributes?.span || []), ['className'], ['style']],
    ul: [...(defaultSchema.attributes?.ul || []), ['className'], ['style']],
    ol: [...(defaultSchema.attributes?.ol || []), ['className'], ['style']],
    li: [...(defaultSchema.attributes?.li || []), ['className'], ['style']],
    a: [...(defaultSchema.attributes?.a || []), ['className'], ['style'], ['target'], ['rel']],
    h1: [...(defaultSchema.attributes?.h1 || []), ['className'], ['style']],
    h2: [...(defaultSchema.attributes?.h2 || []), ['className'], ['style']],
    h3: [...(defaultSchema.attributes?.h3 || []), ['className'], ['style']],
    h4: [...(defaultSchema.attributes?.h4 || []), ['className'], ['style']],
    h5: [...(defaultSchema.attributes?.h5 || []), ['className'], ['style']],
    h6: [...(defaultSchema.attributes?.h6 || []), ['className'], ['style']],
  },
};

// Jednoduchá cache: klíč = absolutní cesta k souboru
const fileCache = new Map<
  string,
  { mtimeMs: number; html: string; frontmatter: Frontmatter }
>();

async function mdToHtml(md: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    // dovolíme raw HTML v Markdownu
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    // bezpečně propustíme class/style atd.
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(md);

  return String(file);
}

/** Renderuje Markdown string (bez cache) */
export async function renderMarkdown(mdSource: string) {
  const { content, data } = matter(mdSource);
  const html = await mdToHtml(content);
  return { html, frontmatter: data as Frontmatter };
}

/** Renderuje soubor s cache podle mtime */
export async function renderMarkdownFile(absPath: string) {
  const stat = fs.statSync(absPath);
  const mtimeMs = stat.mtimeMs;

  const cached = fileCache.get(absPath);
  if (cached && cached.mtimeMs === mtimeMs) return cached;

  const raw = fs.readFileSync(absPath, 'utf8');
  const { content, data } = matter(raw);
  const html = await mdToHtml(content);
  const result = { mtimeMs, html, frontmatter: data as Frontmatter };

  fileCache.set(absPath, result);
  return result;
}

/** Kořenový adresář obsahu — sjednoceno s pages/cs/blog/[slug].tsx */
export function getContentDir(lang: 'cs' | 'sk' = 'cs') {
  // tvůj [slug].tsx čte z "src/content/cs/blog"
  return path.join(process.cwd(), 'src', 'content', lang, 'blog');
}

/** Vrátí slugs (bez .md) pro daný jazyk */
export function getAllBlogSlugs(lang: 'cs' | 'sk' = 'cs') {
  const dir = getContentDir(lang);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

/** Bezpečné parsování data (vrací timestamp nebo 0) */
function parseDateSafe(d?: string): number {
  if (!d) return 0;
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
}

/** Načte frontmatter všech článků (pro listing) a seřadí podle data desc */
export function getAllPostsMeta(lang: 'cs' | 'sk' = 'cs') {
  const dir = getContentDir(lang);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const posts: Array<{ slug: string } & Frontmatter> = files.map((filename) => {
    const abs = path.join(dir, filename);
    const raw = fs.readFileSync(abs, 'utf8');
    const { data } = matter(raw);
    const slug = filename.replace(/\.md$/, '');
    return { slug, ...(data as Frontmatter) };
  });

  // Seřadit podle date desc – bez použití `any`
  return posts.sort((a, b) => parseDateSafe(b.date) - parseDateSafe(a.date));
}