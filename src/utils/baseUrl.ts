import type { NextApiRequest } from "next";

export function getBaseUrl(req?: NextApiRequest): string {
  const override = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "").trim();
  if (override) return stripTrailingSlash(override);

  if (process.env.VERCEL_URL) {
    return `https://${stripTrailingSlash(process.env.VERCEL_URL)}`;
  }

  const host =
    (req?.headers["x-forwarded-host"] as string | undefined)?.split(",")[0]?.trim() ||
    (req?.headers.host as string | undefined) ||
    "localhost:3000";

  const proto =
    (req?.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0]?.trim() ||
    (host.includes("localhost") || host.endsWith(".local") ? "http" : "https");

  return `${proto}://${host}`;
}

export function absoluteUrl(req: NextApiRequest | undefined, path: string): string {
  const base = getBaseUrl(req);
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function stripTrailingSlash(u: string) {
  return u.replace(/\/+$/, "");
}
