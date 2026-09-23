import { siteTextResponse } from "@/server/siteTextResponse";

export const getServerSideProps = siteTextResponse("llms.txt");

export default function SiteText() {
  return null;
}
