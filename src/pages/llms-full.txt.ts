import { siteTextResponse } from "@/server/siteTextResponse";

export const getServerSideProps = siteTextResponse("llms-full.txt");

export default function SiteText() {
  return null;
}
