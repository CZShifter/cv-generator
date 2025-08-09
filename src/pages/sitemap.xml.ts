import type { GetServerSideProps } from "next";
import type { IncomingMessage } from "http";
import fs from "fs";
import path from "path";

// ---------------- Statické stránky ----------------
// Bez jazykového prefixu; /cs a /sk se doplní níže
const STATIC_PATHS = [
  "/",
  "/preview",
  "/cena",
  "/blog",
  "/navod",
  "/kontakt",
  "/motivacni-dopis",
  "/dokumenty/gdpr",
  "/dokumenty/obchodni-podminky",
];

type Lang = "cs" | "sk";

// Přepis slugů pro SK, pokud se liší
const STATIC_OVERRIDES: Record<Lang, Record<string, string>> = {
  cs: {},
  sk: {
    // klíč musí odpovídat přesně položce ve STATIC_PATHS
    /* "/dokumenty/obchodni-podminky": "/dokumenty/obchodne-podmienky", */
  },
};

// ---------------- Cesty k obsahu ----------------
const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const BLOG_CS_DIR = path.join(CONTENT_DIR, "cs", "blog");
const BLOG_SK_DIR = path.join(CONTENT_DIR, "sk", "blog");

// ---------------- Pomocné funkce ----------------
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

// ✅ Lokální režim: alternate zůstane na stejném hostu
function resolveBases(req: IncomingMessage) {
  const origin = getOrigin(req);
  const host = getHost(req);

  const isPreview = host.endsWith(".vercel.app");
  const isCzTld = host.endsWith(".cz") || host.startsWith("cz.");

  const isCz = isPreview ? true : isCzTld; // preview → CZ default

  const primaryBase = origin.replace(/\/+$/, "");
  let alternateBase: string;

  const isLocal = host.includes("localhost");
  if (isLocal || isPreview) {
    alternateBase = primaryBase;            // stejnej host na preview/local
  } else if (isCz) {
    alternateBase = primaryBase.replace(/\.cz(?::\d+)?$/, ".sk");
  } else if (host.endsWith(".sk") || host.startsWith("sk.")) {
    alternateBase = primaryBase.replace(/\.sk(?::\d+)?$/, ".cz");
  } else {
    alternateBase = primaryBase;
  }

  return { primaryBase, alternateBase, isCz };
}

// ---------------- Frontmatter parser ----------------
function parseFrontmatter(raw: string): Record<string, string> {
  const m = raw.match(/^---\s*([\s\S]*?)\s*---/);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.+?)\s*$/);
    if (kv) {
      out[kv[1].trim()] = kv[2].trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    }
  }
  return out;
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
      if (!ent.name.endsWith(".md")) continue;

      const raw = fs.readFileSync(full, "utf8");
      const fm = parseFrontmatter(raw);
      const pairId = fm["pairId"]?.trim();

      const rel = path.relative(root, full).replace(/\\/g, "/").replace(/\.md$/, "");
      const slug = "/blog/" + rel;

      let lastmodISO: string | undefined;
      const d = fm["updated"] || fm["date"];
      if (d) {
        const dt = new Date(d);
        if (!isNaN(dt.getTime())) lastmodISO = dt.toISOString();
      }
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

  // Statické stránky
  for (const p of staticPaths) {
    const pCs = STATIC_OVERRIDES.cs[p] ?? p;
    const pSk = STATIC_OVERRIDES.sk[p] ?? p;
    const csHref = `${baseCz}/cs${pCs}`;
    const skHref = `${baseSk}/sk${pSk}`;
    const loc = isCz ? csHref : skHref;
    rows.push(urlNode(loc, [{ lang: "cs", href: csHref }, { lang: "sk", href: skHref }]));
  }

  // Blog články
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

// ---------------- Hlavní handler ----------------
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

  const xml = buildXml(req, STATIC_PATHS, Array.from(map.values()));

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SiteMap() {
  return null;
}