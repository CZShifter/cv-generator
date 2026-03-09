import React from "react";
import { CvData } from "@/data/CvData";
import styles from "@/templates/CvTemplate.module.scss";
import { getCvTemplate1Sections as getSectionsCs } from "@/components/cs/CvTemplate.sections";
import { getCvTemplate1Sections as getSectionsSk } from "@/components/sk/CvTemplate.sections";

type Props = {
  locale: "cs" | "sk";
  data: CvData;
};

export default function ProfessionCvPreview({ locale, data }: Props) {
  const { left, right } = (locale === "sk" ? getSectionsSk : getSectionsCs)(data);

  return (
    <div className={styles.resume}>
      <div className={styles.left}>
        {left.map((node, index) => (
          <div key={`left-${index}`}>{node}</div>
        ))}
      </div>
      <div className={styles.right}>
        {right.map((node, index) => (
          <div key={`right-${index}`}>{node}</div>
        ))}
      </div>
    </div>
  );
}
