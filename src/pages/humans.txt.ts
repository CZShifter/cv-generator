import { siteTextResponse } from "@/server/siteTextResponse";

export const getServerSideProps = siteTextResponse("humans.txt");

export default function SiteText() {
  return null;
}
