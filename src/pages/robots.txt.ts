// pages/robots.txt.ts
import type { GetServerSideProps } from "next";

function getProto(req: any) {
  const p = (req?.headers?.["x-forwarded-proto"] || "").toString().split(",")[0].trim();
  return p || "https";
}

function getHost(req: any) {
  const xf = (req?.headers?.["x-forwarded-host"] || "").toString().split(",")[0].trim();
  const host = xf || (req?.headers?.host ?? "");
  return host.toLowerCase();
}

function getOrigin(req: any) {
  return `${getProto(req)}://${getHost(req)}`;
}

// 🚫 Seznam zakázaných cest – platí pro všechny boty
// Používáme jazykové prefixy, aby se blokovala CZ i SK varianta
const DISALLOW_PATHS = [
  "/cs/edit/",
  "/sk/edit/",
  "/cs/zaplaceno/",
  "/sk/zaplaceno/",
  "/cs/po-platbe",
  "/sk/po-platbe",
  "/cs/preview",
  "/sk/preview",
  "/404"
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
  const origin = getOrigin(req).replace(/\/+$/, "");
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
