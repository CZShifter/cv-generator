// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Povolené hostname (bez portu). Pro preview Vercelu používáme suffix match.
const allowedHostnames = [
  "rychlyzivotopis.cz",
  "rychlyzivotopis.sk",
  "localhost",
  "127.0.0.1",
  ".vercel.app", // wildcard suffix (cokoliv.vercel.app)
];

function getRawHost(req: NextRequest) {
  const raw = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  return raw.split(":")[0]; // bez portu
}

function isAllowed(hostname: string) {
  return allowedHostnames.some((allowed) => {
    if (allowed.startsWith(".")) return hostname.endsWith(allowed); // wildcard suffix
    return hostname === allowed;
  });
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname, search } = url;
  const method = req.method || "GET";
  const hostname = getRawHost(req);

  // 0) DEV lokálně: nepoužívat middleware (kvůli HMR)
  // Lokálně používáš jen http://localhost:3000
  if (process.env.NODE_ENV === "development" && hostname === "localhost") {
    return NextResponse.next();
  }

  // 1) POUZE GET redirectujeme (bezpečnější pro formuláře/prefetch)
  if (method !== "GET") {
    return NextResponse.next();
  }

  // 2) Canonical host: odstraň www. (SEO) – jen mimo dev
  if (hostname.startsWith("www.")) {
    const apex = hostname.slice(4); // bez "www."
    const redirectUrl = new URL(url.toString());
    redirectUrl.hostname = apex;
    // 301 = trvalé přesměrování hostu (kanonizace)
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 3) Bezpečnost: povolit jen známé hosty (po www odstranění)
  //    (v preview na Vercelu je *.vercel.app povolené suffixem)
  if (!isAllowed(hostname)) {
    return new Response("Nepovolený přístup!", { status: 404 });
  }

  // 4) Výjimky: neřešit už lokalizované a technické cesty
  if (
    pathname.startsWith("/cs") ||
    pathname.startsWith("/sk") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/sitemap-main.xml" ||
    pathname === "/sitemap-profese.xml" ||
    pathname === "/llms.txt" ||
    pathname === "/humans.txt" ||
    pathname === "/.well-known/llms.txt" ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/photo_img") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/pdftemplates")
  ) {
    return NextResponse.next();
  }

  // 5) Jazyk podle hostu (produkce + preview)
  //    .sk → /sk, vše ostatní → /cs (vč. *.vercel.app)
  const isSkHost =
    hostname.endsWith(".sk") ||
    hostname.startsWith("sk.");

  const langPrefix = isSkHost ? "/sk" : "/cs";

  // 6) Redirect na lokalizovanou cestu (zachovat path, query i hash)
  const newUrl = url.clone();
  newUrl.pathname = `${langPrefix}${pathname}`.replace(/\/{2,}/g, "/");
  newUrl.search = search; // query beze změny
  const finalHref = newUrl.toString() + (url.hash ?? "");

  // V produkci/preview OK i 308; nechávám 308, protože zachová metodu u GET
  return NextResponse.redirect(finalHref, 308);
}

// Matcher: vše kromě vyjmenovaných cest (rychlejší než filtrovat uvnitř)
export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|sitemap-main.xml|sitemap-profese.xml|llms.txt|humans.txt|.well-known/llms.txt|img|photo_img|fonts|pdftemplates|cs|sk).*)",
  ],
};
