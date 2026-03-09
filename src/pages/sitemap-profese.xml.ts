import type { GetServerSideProps } from "next";
import type { IncomingMessage } from "http";
import { getProfessionSlugs } from "@/data/professions";

type Lang = "cs" | "sk";

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

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlNode(loc: string, alternates: { lang: Lang; href: string }[]) {
  const alts =
    alternates.map(a =>
      `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${xmlEscape(a.href)}" />`
    ).join("\n");

  return `
  <url>
    <loc>${xmlEscape(loc)}</loc>
${alts ? alts + "\n" : ""}    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(loc)}" />
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { primaryBase, alternateBase, isCz } = resolveBases(req as IncomingMessage);
  const baseCz = isCz ? primaryBase : alternateBase;
  const baseSk = isCz ? alternateBase : primaryBase;

  const slugs = getProfessionSlugs();
  const rows: string[] = [];

  for (const slug of slugs) {
    const csHref = `${baseCz}/cs/profese/${slug}`;
    const skHref = `${baseSk}/sk/profese/${slug}`;
    const loc = isCz ? csHref : skHref;
    rows.push(urlNode(loc, [{ lang: "cs", href: csHref }, { lang: "sk", href: skHref }]));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${rows.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SiteMapProfese() {
  return null;
}
