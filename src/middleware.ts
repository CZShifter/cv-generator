// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Povolené hostname (bez portu). Pro preview Vercelu používáme suffix match.
const allowedHostnames = [
  "rychlyzivotopis.cz",
  "rychlyzivotopis.sk",
  "localhost",
  "127.0.0.1",
  "cz.localhost",
  "sk.localhost",
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

  // --- hostname normalizace ---
   const hostname = getRawHost(req);

  // 1) Canonical host: odstraň www. (SEO best practice)
  if (hostname.startsWith("www.")) {
    const apex = hostname.slice(4); // bez "www."
    // povolíme redirect na apex i když "www." varianta není explicitně v allowed (pošleme 301)
    const redirectUrl = new URL(url.toString());
    redirectUrl.hostname = apex;
    // 301 = trvalé přesměrování hostu (kanonizace)
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 2) Bezpečnost: povolit jen známé hosty (po www odstranění)
  if (!isAllowed(hostname)) {
    return new Response("Nepovolený přístup!", { status: 404 });
  }

  // --- výjimky: neřešit už lokalizované a technické cesty ---
  if (
    pathname.startsWith("/cs") ||
    pathname.startsWith("/sk") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/photo_img") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/pdftemplates")
  ) {
    return NextResponse.next();
  }

  // --- jazyk podle hostu ---
  const isSkHost =
    hostname.endsWith(".sk") ||
    hostname.startsWith("sk.") ||
    hostname === "sk.localhost";
  // čistý localhost a cz.localhost bereme jako CZ (změňte podle potřeby)
  const langPrefix = isSkHost ? "/sk" : "/cs";

  // --- redirect na lokalizovanou cestu (zachovat path, query i hash) ---
  const newUrl = url.clone();
  newUrl.pathname = `${langPrefix}${pathname}`.replace(/\/{2,}/g, "/");
  newUrl.search = search; // query beze změny
  // hash přidáme přes string, NextURL typ ho nepředepisuje
  const finalHref = newUrl.toString() + (url.hash ?? "");

  // 308 = trvalé přesměrování cesty (stabilní pro SEO i POST/GET)
  return NextResponse.redirect(finalHref, 308);
}

// Matcher: vše kromě vyjmenovaných cest (rychlejší než filtrovat uvnitř)
export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|img|photo_img|fonts|pdftemplates|cs|sk).*)",
  ],
};
