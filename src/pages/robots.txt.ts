// pages/robots.txt.ts
import type { GetServerSideProps } from "next";
import type { IncomingMessage } from "http";

function header(req: IncomingMessage, name: string): string {
  const v = req.headers[name.toLowerCase()];
  if (Array.isArray(v)) return v[0] ?? "";
  return (v ?? "") as string;
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

// 🚫 Seznam zakázaných cest – platí pro všechny boty
const DISALLOW_PATHS = [
  "/cs/edit/",
  "/sk/edit/",
  "/cs/zaplaceno/",
  "/sk/zaplaceno/",
  "/cs/po-platbe",
  "/sk/po-platbe",
  "/cs/preview",
  "/sk/preview",
  "/404",
];

// 📝 Funkce pro sestavení robots.txt
function buildRobots(origin: string) {
  const disallows = DISALLOW_PATHS.map((p) => `Disallow: ${p}`).join("\n");
  return `User-agent: *
${disallows}

Sitemap: ${origin}/sitemap.xml
`;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const origin = getOrigin(req as IncomingMessage).replace(/\/+$/, "");
  const robotsTxt = buildRobots(origin);

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(robotsTxt);
  res.end();

  return { props: {} };
};

export default function RobotsTxt() {
  return null;
}
