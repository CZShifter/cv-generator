// next.config.ts
import type { NextConfig } from "next";

// vezmi commit SHA z Vercelu nebo fallback
const commitSha =
  process.env.VERCEL_GIT_COMMIT_SHA || // Vercel Production/Preview
  process.env.GITHUB_SHA ||            // GitHub Actions fallback
  process.env.COMMIT_SHA ||            // jiné CI
  "dev";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,

  env: {
    NEXT_PUBLIC_APP_VERSION: commitSha, // ← bude dostupné na klientovi
  },

  async headers() {
    return [
      // 🚫 Výjimka – pro složku /pdftemplates nepoužívat cache
      {
        source: "/pdftemplates/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      // ✅ Všechno ostatní dlouhodobě cachovat
      {
        source: "/:all*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
