import React from "react";
import type { JSX } from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs";
import path from "path";
import type { CvData } from "@/data/CvData";
import { ALL_CV_TEMPLATES } from "@/utils/cvTemplatesConfig";
import { SITE_NAME } from "@/config/site";

// Mapuj templateId → PDF komponenta (flat verze)
const pdfComponents: Record<string, (props: { data: CvData }) => JSX.Element> = {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  cvtemplate: require("@/pdftemplates/cs/pdfTemplate").default,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  cvtemplate2: require("@/pdftemplates/cs/pdfTemplate2").default,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  cvtemplate3: require("@/pdftemplates/cs/pdfTemplate3").default,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  cvtemplate4: require("@/pdftemplates/cs/pdfTemplate4").default,
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
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${htmlContent}
        <div class="inline-footer" style="position:absolute;left:0;right:0;bottom:0;font-size:9px;color:#505050;text-align:center;padding:10px 0;">
            Vytvořeno pomocí ${/* eslint-disable-line */ ""}${SITE_NAME}
        </div>
      </body>
    </html>
  `;
}