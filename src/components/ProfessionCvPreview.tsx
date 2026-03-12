import React from "react";
import { CvData } from "@/data/CvData";
import template1Styles from "@/templates/CvTemplate.module.scss";
import template2Styles from "@/templates/CvTemplate2.module.scss";
import previewStyles from "@/scss/Profession.module.scss";
import { getCvTemplate1Sections as getSectionsCs } from "@/components/cs/CvTemplate.sections";
import { getCvTemplate1Sections as getSectionsSk } from "@/components/sk/CvTemplate.sections";
import { getCvTemplate2Sections as getSectionsCs2 } from "@/components/cs/CvTemplate2.sections";
import { getCvTemplate2Sections as getSectionsSk2 } from "@/components/sk/CvTemplate2.sections";

type Props = {
  locale: "cs" | "sk";
  data: CvData;
  templateId?: "cvtemplate" | "cvtemplate2";
};

export default function ProfessionCvPreview({ locale, data, templateId }: Props) {
  const selectedTemplateId = templateId === "cvtemplate2" ? "cvtemplate2" : "cvtemplate";
  const templateMap = {
    cvtemplate: {
      styles: template1Styles,
      sections: locale === "sk" ? getSectionsSk : getSectionsCs,
    },
    cvtemplate2: {
      styles: template2Styles,
      sections: locale === "sk" ? getSectionsSk2 : getSectionsCs2,
    },
  } as const;
  const chosen = templateMap[selectedTemplateId];
  const { left, right } = chosen.sections(data);

  return (
    <div
      className={`${chosen.styles.resume} ${previewStyles.resumeFrame} ${
        selectedTemplateId === "cvtemplate2" ? previewStyles.template2Preview : ""
      }`}
    >
      <div className={chosen.styles.left}>
        {left.map((node, index) => (
          <div key={`left-${index}`}>{node}</div>
        ))}
      </div>
      <div
        className={`${chosen.styles.right} ${
          selectedTemplateId === "cvtemplate2" ? previewStyles.template2Right : ""
        }`}
      >
        {right.map((node, index) => (
          <div key={`right-${index}`}>{node}</div>
        ))}
      </div>
    </div>
  );
}
