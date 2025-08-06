import React from "react";
import type { JSX } from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs";
import path from "path";
import type { CvData } from "@/data/CvData";
import { ALL_CV_TEMPLATES } from "@/utils/cvTemplatesConfig";

// Mapuj templateId → PDF komponenta (flat verze)
const pdfComponents: Record<string, (props: { data: CvData }) => JSX.Element> = {
  cvtemplate: require("@/pdftemplates/pdfTemplate").default,
  cvtemplate2: require("@/pdftemplates/pdfTemplate2").default,
  cvtemplate3: require("@/pdftemplates/pdfTemplate3").default,
  cvtemplate4: require("@/pdftemplates/pdfTemplate4").default,
};

export function renderCvHtml(cvData: CvData, templateId: string): string {
  const templateMeta = ALL_CV_TEMPLATES.find(t => t.id === templateId);
  const pdfComponent = pdfComponents[templateId];

  if (!templateMeta || !pdfComponent) {
    throw new Error(`Šablona "${templateId}" nebyla nalezena.`);
  }

  const cssPath = path.join(process.cwd(), "public", "pdftemplates", templateMeta.cssFileName);
  const css = fs.existsSync(cssPath)
    ? fs.readFileSync(cssPath, "utf8")
    : "/* CSS nenalezeno */";

  const htmlContent = ReactDOMServer.renderToStaticMarkup(
    React.createElement(pdfComponent, { data: cvData })
  );

  return `
    <!DOCTYPE html>
    <html lang="cs">
      <head>
        <meta charset="UTF-8" />
        <title>Životopis</title>
        <style>${css}</style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;
}
