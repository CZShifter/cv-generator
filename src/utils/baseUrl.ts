import type { NextApiRequest } from "next";

export function getBaseUrl(req?: NextApiRequest): string {
  // 1) Přednost mají proměnné prostředí (nastavíte jen v Production)
  if (process.env.SITE_URL_CZ && req?.headers.host?.includes("cz")) {
    return stripTrailingSlash(process.env.SITE_URL_CZ);
  }
  if (process.env.SITE_URL_SK && req?.headers.host?.includes("sk")) {
    return stripTrailingSlash(process.env.SITE_URL_SK);
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.SITE_URL) {
    return stripTrailingSlash(process.env.SITE_URL);
  }

  // 2) Fallback – preview prostředí na Vercelu
  if (process.env.VERCEL_URL) {
    return `https://${stripTrailingSlash(process.env.VERCEL_URL)}`;
  }

  // 3) Lokální vývoj
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
