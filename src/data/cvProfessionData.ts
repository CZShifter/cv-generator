type Locale = "cs" | "sk";

type CvProfessionWorkExperience = {
  position: string;
  bullets: string[];
};

export type CvProfessionLocaleData = {
  aboutMe: { male: string; female: string };
  skills: string[];
  workExperience: CvProfessionWorkExperience[];
  sections?: CvProfessionSections;
};

export type CvProfessionSectionBlock = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  text?: string;
};

export type CvProfessionSections = {
  howToWriteCv: CvProfessionSectionBlock;
  atsTips: CvProfessionSectionBlock;
  whatRecruitersAppreciate: CvProfessionSectionBlock;
  commonCvMistakes: CvProfessionSectionBlock;
  jobAdExample: { heading: string; text: string };
};

type CvProfessionRawEntry = {
  slug?: string;
  profession: string;
  aboutMe: { male: string; female: string };
  skills: string[];
  workExperience: CvProfessionWorkExperience[];
  sections?: CvProfessionSections;
};

import rawData from "./cv-profese-data-cz.json";
import rawSkData from "./cv-profese-data-sk.json";

const SOURCE = rawData as CvProfessionRawEntry[];
const SOURCE_SK = rawSkData as CvProfessionRawEntry[];

function slugifyProfession(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildLocaleMaps() {
  const mapBySlug = (entries: CvProfessionRawEntry[]) => {
    const map: Record<string, CvProfessionLocaleData> = {};
    for (const entry of entries) {
      const slug = entry.slug ?? slugifyProfession(entry.profession);
      map[slug] = {
        aboutMe: entry.aboutMe,
        skills: entry.skills,
        workExperience: entry.workExperience,
        sections: entry.sections,
      };
    }
    return map;
  };

  return {
    cs: mapBySlug(SOURCE),
    sk: mapBySlug(SOURCE_SK),
  };
}

const LOCALE_MAPS = buildLocaleMaps();
if (process.env.NODE_ENV !== "production") {
  const czSlugs = new Set(Object.keys(LOCALE_MAPS.cs));
  const skSlugs = new Set(Object.keys(LOCALE_MAPS.sk));
  const missingInSk = [...czSlugs].filter((slug) => !skSlugs.has(slug));
  const extraInSk = [...skSlugs].filter((slug) => !czSlugs.has(slug));
  if (missingInSk.length || extraInSk.length) {
    throw new Error(
      `cv profession data mismatch: missingInSk=${missingInSk.join(", ")} extraInSk=${extraInSk.join(", ")}`
    );
  }
}

export function getCvProfessionData(locale: Locale, slug: string): CvProfessionLocaleData | null {
  const localeMap = LOCALE_MAPS[locale];
  if (localeMap && localeMap[slug]) return localeMap[slug];
  return null;
}

export function getCvProfessionResponsibilities(data: CvProfessionLocaleData, limit = 8) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const experience of data.workExperience) {
    for (const bullet of experience.bullets) {
      const value = bullet.trim();
      if (!value || seen.has(value)) continue;
      seen.add(value);
      result.push(value);
      if (result.length >= limit) return result;
    }
  }
  return result;
}
