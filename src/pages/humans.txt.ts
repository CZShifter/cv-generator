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

function buildHumansTxt(origin: string) {
  return `/* TEAM */
Owner: RychlyZivotopis
Site: ${origin}

/* THANKS */
Thanks to all contributors and users.
`;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const origin = getOrigin(req as IncomingMessage).replace(/\/+$/, "");
  const body = buildHumansTxt(origin);

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(body);
  res.end();

  return { props: {} };
};

export default function HumansTxt() {
  return null;
}
