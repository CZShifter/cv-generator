import type { GetServerSideProps } from "next";
import { SITE_URL_SK } from "@/config/site";
import texts from "./siteTexts.json";

export function siteTextResponse(name: keyof typeof texts): GetServerSideProps {
  return async ({ res }) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.end(texts[name].split("{{SITE_URL_SK}}").join(SITE_URL_SK));
    return { props: {} };
  };
}
