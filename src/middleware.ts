import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Povolené domény pro bezpečný přístup
const allowedHostnames = [
  "rychlyzivotopis.cz",
  "rychlyzivotopis.sk",
  "127.0.0.1",
  "cz.localhost:3000",
  "sk.localhost:3000",
  ".vercel.app",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Nech projít už lokalizované cesty
  if (pathname.startsWith("/cs") || pathname.startsWith("/sk")) {
    return NextResponse.next();
  }

  // Nepřesměrovávej statické nebo technické cesty
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/photo_img") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/pdftemplates")
  ) {
    return NextResponse.next();
  }

  // Zabezpečení – jen povolené domény
  const isAllowed = allowedHostnames.some(allowed =>
    hostname === allowed || hostname.endsWith(allowed)
  );

  if (!isAllowed) {
    return new Response("Nepovolený přístup!", { status: 404 });
  }

  // Výchozí jazyk
  let langPrefix = "/cs";
  if (hostname.includes(".sk") || hostname.endsWith(".sk")) {
    langPrefix = "/sk";
  }

  // Přesměrování
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `${langPrefix}${pathname}`;
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|cs|sk|img|fonts).*)",
  ],
};
