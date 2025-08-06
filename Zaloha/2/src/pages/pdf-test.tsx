//TESTOVÁNÍ ŠABLON - NENÍ VEŘEJNÉ
import Head from "next/head";
import { SITE_NAME } from "../config/site";
import React from "react";
import PdfTemplate4 from "@/pdftemplates/cs/pdfTemplate4"; // Uprav podle struktury projektu
import { SAMPLE_CV_DATA } from "@/data/sampleCvData2"; // Uprav podle struktury projektu

const PdfPreviewPage = () => {
  // Získáš testovací data pro PDF
  const data = SAMPLE_CV_DATA["cvtemplate4"];
  return <PdfTemplate4 data={data} />;
   <>
      <Head>
        <title>{`Test PDF | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
      </>
};
// Toto je důležité! Díky tomu pozná _app.tsx, že zde nechceš layout
(PdfPreviewPage as any).noLayout = true;

export default PdfPreviewPage;
