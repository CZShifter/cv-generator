import type { GetServerSideProps } from "next";
import type { IncomingMessage } from "http";

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

// ---------------- Hlavní handler ----------------
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { primaryBase } = resolveBases(req as IncomingMessage);
  const base = primaryBase;
  const lastmod = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${base}/sitemap-main.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
  <sitemap><loc>${base}/sitemap-profese.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
</sitemapindex>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SiteMap() {
  return null;
}
