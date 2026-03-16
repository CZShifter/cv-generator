import type { GetServerSideProps } from "next";
import type { IncomingMessage } from "http";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ---------------- Statické stránky ----------------
const STATIC_PATHS = [
  "/",
  "/blog",
  "/profese",
  "/navod",
  "/kontakt",
  "/motivacni-dopis",
  "/dokumenty/gdpr",
  "/dokumenty/obchodni-podminky",
];

type Lang = "cs" | "sk";

const STATIC_OVERRIDES: Record<Lang, Record<string, string>> = {
  cs: {},
  sk: {
    /* "/dokumenty/obchodni-podminky": "/dokumenty/obchodne-podmienky", */
  },
};

// ---------------- Cesty k obsahu ----------------
const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const BLOG_CS_DIR = path.join(CONTENT_DIR, "cs", "blog");
const BLOG_SK_DIR = path.join(CONTENT_DIR, "sk", "blog");

function header(req: IncomingMessage, name: string): string {
  const v = req.headers[name.toLowerCase()];
  if (Array.isArray(v)) return (v[0] ?? "").toString();
  return (v ?? "").toString();
}

function getProto(req: IncomingMessage) {
  const p = header(req, "x-forwarded-proto").split(",")[0].trim();
  return p || "https";
}

function getHost(req: IncomingMessage) {
  const xf = header(req, "x-forwarded-host").split(",")[0].trim();
  const host = xf || header(req, "host");
  return host.toLowerCase();
}

function getOrigin(req: IncomingMessage) {
  return `${getProto(req)}://${getHost(req)}`;
}

function resolveBases(req: IncomingMessage) {
  const origin = getOrigin(req);
  const host = getHost(req);

  const isPreview = host.endsWith(".vercel.app");
  const isCzTld = host.endsWith(".cz") || host.startsWith("cz.");
  const isCz = isPreview ? true : isCzTld;

  const primaryBase = origin.replace(/\/+$/, "");
  let alternateBase: string;

  const isLocal = host.includes("localhost");
  if (isLocal || isPreview) {
    alternateBase = primaryBase;
  } else if (isCz) {
    alternateBase = primaryBase.replace(/\.cz(?::\d+)?$/, ".sk");
  } else if (host.endsWith(".sk") || host.startsWith("sk.")) {
    alternateBase = primaryBase.replace(/\.sk(?::\d+)?$/, ".cz");
  } else {
    alternateBase = primaryBase;
  }

  return { primaryBase, alternateBase, isCz };
}

// Bezpečný parser pro formáty: "DD.MM.YYYY", "DD.MM.YY", "YYYY-MM-DD", ISO
function parseFrontmatterDate(input: unknown): number {
  if (typeof input !== "string" || !input.trim()) return 0;

  const s = input.trim();

  // DD.MM.YYYY nebo DD.MM.YY
  const dot = /^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/;
  const m1 = s.match(dot);
  if (m1) {
    const [, d, mo, y] = m1;
    const year = y.length === 2 ? Number(y) + 2000 : Number(y);
    const month = Number(mo) - 1;
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

  const t = new Date(s).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function fileMtimeISO(full: string) {
  try {
    return fs.statSync(full).mtime.toISOString();
  } catch {
    return undefined;
  }
}

type PostInfo = { lang: Lang; slug: string; pairId?: string; lastmodISO?: string };

function collectPosts(root: string, lang: Lang): PostInfo[] {
  const posts: PostInfo[] = [];
  if (!fs.existsSync(root)) return posts;

  const walk = (dir: string) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
        continue;
      }
      if (!ent.name.endsWith(".mdx")) continue;

      const raw = fs.readFileSync(full, "utf8");
      const fm = matter(raw).data as Record<string, unknown>;
      const pairId = typeof fm.pairId === "string" ? fm.pairId.trim() : undefined;

      const rel = path.relative(root, full).replace(/\\/g, "/").replace(/\.mdx$/, "");
      const slug = "/blog/" + rel;

      let lastmodISO: string | undefined;
      const d = fm.updated ?? fm.date;
      const ts = parseFrontmatterDate(d);
      if (ts) lastmodISO = new Date(ts).toISOString();
      if (!lastmodISO) lastmodISO = fileMtimeISO(full);

      posts.push({ lang, slug, pairId, lastmodISO });
    }
  };
  walk(root);
  return posts;
}

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlNode(
  loc: string,
  alternates: { lang: "cs" | "sk"; href: string }[],
  lastmod?: string
) {
  const alts =
    alternates.map(a =>
      `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${xmlEscape(a.href)}" />`
    ).join("\n");

  return `
  <url>
    <loc>${xmlEscape(loc)}</loc>
${alts ? alts + "\n" : ""}    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(loc)}" />
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}

function buildXml(
  req: IncomingMessage,
  staticPaths: string[],
  pairs: Array<{ cs?: PostInfo; sk?: PostInfo }>
) {
  const { primaryBase, alternateBase, isCz } = resolveBases(req);
  const baseCz = isCz ? primaryBase : alternateBase;
  const baseSk = isCz ? alternateBase : primaryBase;

  const rows: string[] = [];

  for (const p of staticPaths) {
    const pCs = STATIC_OVERRIDES.cs[p] ?? p;
    const pSk = STATIC_OVERRIDES.sk[p] ?? p;
    const csHref = `${baseCz}/cs${pCs}`;
    const skHref = `${baseSk}/sk${pSk}`;
    const loc = isCz ? csHref : skHref;
    rows.push(urlNode(loc, [{ lang: "cs", href: csHref }, { lang: "sk", href: skHref }]));
  }

  for (const pair of pairs) {
    const alts: { lang: Lang; href: string }[] = [];
    let loc = "";
    let lastmod: string | undefined;

    if (pair.cs) {
      const href = `${baseCz}/cs${pair.cs.slug}`;
      alts.push({ lang: "cs", href });
      if (isCz) { loc = href; lastmod = pair.cs.lastmodISO ?? lastmod; }
    }
    if (pair.sk) {
      const href = `${baseSk}/sk${pair.sk.slug}`;
      alts.push({ lang: "sk", href });
      if (!isCz) { loc = href; lastmod = pair.sk.lastmodISO ?? lastmod; }
    }
    if (!loc && pair.cs) { loc = `${baseCz}/cs${pair.cs.slug}`; lastmod = pair.cs.lastmodISO ?? lastmod; }
    if (!loc && !pair.cs && pair.sk) { loc = `${baseSk}/sk${pair.sk.slug}`; lastmod = pair.sk.lastmodISO ?? lastmod; }

    rows.push(urlNode(loc, alts, lastmod));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${rows.join("\n")}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const csPosts = collectPosts(BLOG_CS_DIR, "cs");
  const skPosts = collectPosts(BLOG_SK_DIR, "sk");

  const map = new Map<string, { cs?: PostInfo; sk?: PostInfo }>();
  for (const p of csPosts) {
    const key = p.pairId ?? `__single_cs__${p.slug}`;
    map.set(key, { ...(map.get(key) || {}), cs: p });
  }
  for (const p of skPosts) {
    const key = p.pairId ?? `__single_sk__${p.slug}`;
    map.set(key, { ...(map.get(key) || {}), sk: p });
  }

  const xml = buildXml(req as IncomingMessage, STATIC_PATHS, Array.from(map.values()));

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SiteMapMain() {
  return null;
}
