import { CvData } from "./CvData";
import { SAMPLE_CV_DATA as SAMPLE_CV_DATA_CZ } from "./sampleCvData";
import { SAMPLE_CV_DATA as SAMPLE_CV_DATA_SK } from "./sampleCvDataSK";
import { getCvProfessionData } from "./cvProfessionData";
import { buildProfessionContent, Locale } from "./professions";

type TemplateId = "cvtemplate" | "cvtemplate2" | "cvtemplate3" | "cvtemplate4";

const COMPANY_BY_CATEGORY: Record<Locale, Record<string, string[]>> = {
  cs: {
    logistics: ["LogiTrans s.r.o.", "Warehouse Pro s.r.o.", "SpeedLogistics a.s."],
    manual: ["Kovotech s.r.o.", "Stavimex a.s.", "Precizna Vyroba s.r.o."],
    service: ["Gastroline s.r.o.", "Hotel Orion a.s.", "Cafe Milano s.r.o."],
    retail: ["Retail Plus s.r.o.", "Market Hub a.s.", "ShopPoint s.r.o."],
    office: ["Business Point s.r.o.", "AdminPro a.s.", "Central Office s.r.o."],
    tech: ["TechSpark s.r.o.", "DataVision a.s.", "Softline s.r.o."],
    education: ["Zakladni skola Slunce", "Gymnazium Jana Nerudy", "Jazykova skola Lektor"],
    healthcare: ["Mestska nemocnice", "Centrum pece Vital", "Klinika Harmonie"],
    student: ["StartUp Hub s.r.o.", "Event Office s.r.o.", "Campus Support"],
  },
  sk: {
    logistics: ["LogiTrans s.r.o.", "Warehouse Pro s.r.o.", "SpeedLogistics a.s."],
    manual: ["Kovotech s.r.o.", "Stavimex a.s.", "Precizna Vyroba s.r.o."],
    service: ["Gastroline s.r.o.", "Hotel Orion a.s.", "Cafe Milano s.r.o."],
    retail: ["Retail Plus s.r.o.", "Market Hub a.s.", "ShopPoint s.r.o."],
    office: ["Business Point s.r.o.", "AdminPro a.s.", "Central Office s.r.o."],
    tech: ["TechSpark s.r.o.", "DataVision a.s.", "Softline s.r.o."],
    education: ["Zakladna skola Slnko", "Gymnazium Jana Nerudu", "Jazykova skola Lektor"],
    healthcare: ["Mestska nemocnica", "Centrum starostlivosti Vital", "Klinika Harmonia"],
    student: ["StartUp Hub s.r.o.", "Event Office s.r.o.", "Campus Support"],
  },
};

const EDUCATION_BY_CATEGORY: Record<Locale, Record<string, { level: string; field: string; school: string; year: string }[]>> = {
  cs: {
    logistics: [
      { level: "Středoškolské vzdělání", field: "Logistika / skladové hospodářství", school: "Střední odborné učiliště", year: "2014" },
    ],
    manual: [
      { level: "Výuční list", field: "Strojní nebo stavební obor", school: "Odborné učiliště", year: "2012" },
    ],
    service: [
      { level: "Středoškolské vzdělání", field: "Gastronomie / služby", school: "SOŠ", year: "2013" },
    ],
    retail: [
      { level: "Středoškolské vzdělání", field: "Obchod a služby", school: "SOŠ", year: "2012" },
    ],
    office: [
      { level: "Středoškolské vzdělání s maturitou", field: "Ekonomika / administrativa", school: "Obchodní akademie", year: "2015" },
    ],
    tech: [
      { level: "Bakalářské studium", field: "Informatika", school: "Univerzita", year: "2018" },
    ],
    education: [
      { level: "Magisterské studium", field: "Pedagogika", school: "Univerzita", year: "2016" },
    ],
    healthcare: [
      { level: "Vyšší odborné vzdělání", field: "Zdravotnický asistent", school: "VOŠ zdravotnická", year: "2014" },
    ],
    student: [
      { level: "Středoškolské vzdělání", field: "Obecné", school: "Gymnázium", year: "2020" },
    ],
  },
  sk: {
    logistics: [
      { level: "Stredoškolské vzdelanie", field: "Logistika / skladové hospodárstvo", school: "Stredné odborné učilište", year: "2014" },
    ],
    manual: [
      { level: "Výučný list", field: "Strojársky alebo stavebný odbor", school: "Odborné učilište", year: "2012" },
    ],
    service: [
      { level: "Stredoškolské vzdelanie", field: "Gastronómia / služby", school: "SOŠ", year: "2013" },
    ],
    retail: [
      { level: "Stredoškolské vzdelanie", field: "Obchod a služby", school: "SOŠ", year: "2012" },
    ],
    office: [
      { level: "Stredoškolské vzdelanie s maturitou", field: "Ekonomika / administratíva", school: "Obchodná akadémia", year: "2015" },
    ],
    tech: [
      { level: "Bakalárske štúdium", field: "Informatika", school: "Univerzita", year: "2018" },
    ],
    education: [
      { level: "Magisterské štúdium", field: "Pedagogika", school: "Univerzita", year: "2016" },
    ],
    healthcare: [
      { level: "Vyššie odborné vzdelanie", field: "Zdravotnícky asistent", school: "VOŠ zdravotnícka", year: "2014" },
    ],
    student: [
      { level: "Stredoškolské vzdelanie", field: "Všeobecné", school: "Gymnázium", year: "2020" },
    ],
  },
};

const CERTS_BY_CATEGORY: Record<Locale, Record<string, { name: string; place: string; year: string }[]>> = {
  cs: {
    logistics: [{ name: "Obsluha VZV (průkaz)", place: "Akreditované školení", year: "2019" }],
    manual: [{ name: "BOZP a práce ve výškách", place: "Akreditované školení", year: "2018" }],
    service: [{ name: "Hygienické minimum", place: "Akreditované školení", year: "2020" }],
    retail: [{ name: "Pokladní systém – školení", place: "Interní školení", year: "2021" }],
    office: [{ name: "Pokročilá práce s MS Office", place: "NICOM", year: "2020" }],
    tech: [{ name: "Základy webového vývoje", place: "ITnetwork.cz", year: "2019" }],
    education: [{ name: "Pedagogické minimum", place: "Akreditovaný kurz", year: "2017" }],
    healthcare: [{ name: "První pomoc", place: "ČČK", year: "2021" }],
    student: [],
  },
  sk: {
    logistics: [{ name: "Obsluha VZV (preukaz)", place: "Akreditované školenie", year: "2019" }],
    manual: [{ name: "BOZP a práca vo výškach", place: "Akreditované školenie", year: "2018" }],
    service: [{ name: "Hygienické minimum", place: "Akreditované školenie", year: "2020" }],
    retail: [{ name: "Pokladničný systém – školenie", place: "Interné školenie", year: "2021" }],
    office: [{ name: "Pokročilá práca s MS Office", place: "NICOM", year: "2020" }],
    tech: [{ name: "Základy webového vývoja", place: "ITnetwork.sk", year: "2019" }],
    education: [{ name: "Pedagogické minimum", place: "Akreditovaný kurz", year: "2017" }],
    healthcare: [{ name: "Prvá pomoc", place: "ČČK", year: "2021" }],
    student: [],
  },
};

const NAMES: Record<Locale, { maleFirst: string[]; femaleFirst: string[]; maleLast: string[]; femaleLast: string[] }> = {
  cs: {
    maleFirst: ["Jan", "Martin", "Tomáš", "Pavel", "Jiří", "David"],
    femaleFirst: ["Petra", "Eva", "Lenka", "Jana", "Kateřina", "Lucie"],
    maleLast: ["Novák", "Dvořák", "Svoboda", "Král", "Procházka", "Malík"],
    femaleLast: ["Nováková", "Dvořáková", "Svobodová", "Králová", "Procházková", "Malíková"],
  },
  sk: {
    maleFirst: ["Peter", "Martin", "Tomáš", "Ján", "Michal", "Daniel"],
    femaleFirst: ["Jana", "Eva", "Lucia", "Katarína", "Mária", "Petra"],
    maleLast: ["Novák", "Kováč", "Svoboda", "Král", "Mravec", "Malík"],
    femaleLast: ["Nováková", "Kováčová", "Svobodová", "Králová", "Mravcová", "Malíková"],
  },
};

const OFFICE_CATEGORY = new Set(["office"]);

const FEMININE_SLUG_OVERRIDES = new Set([
  "pecovatelka",
  "servirka",
  "uklizecka",
  "zdravotni-sestra",
]);

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function capitalize(value: string) {
  if (!value) return value;
  return value[0].toUpperCase() + value.slice(1);
}

function hashOf(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function isFeminineSlug(slug: string) {
  if (FEMININE_SLUG_OVERRIDES.has(slug)) return true;
  return /(ka|čka|čka|čka|ice|yňa|yne|yně|arka|arka|orka)$/.test(slug);
}

export function pickPreviewTemplateId(slug: string): TemplateId {
  return hashOf(slug) % 2 === 0 ? "cvtemplate" : "cvtemplate2";
}

function pickName(locale: Locale, slug: string, category: string) {
  const names = NAMES[locale];
  const pickFemale = isFeminineSlug(slug)
    ? true
    : OFFICE_CATEGORY.has(category)
      ? hashOf(slug) % 2 === 0
      : false;

  const firstList = pickFemale ? names.femaleFirst : names.maleFirst;
  const lastList = pickFemale ? names.femaleLast : names.maleLast;
  const idx = hashOf(slug) % Math.min(firstList.length, lastList.length);

  return {
    first: firstList[idx],
    last: lastList[idx],
    isFemale: pickFemale,
  };
}

export function buildProfessionPreviewData(
  locale: Locale,
  slug: string,
  templateId: TemplateId = "cvtemplate"
): CvData {
  const base =
    locale === "cs"
      ? SAMPLE_CV_DATA_CZ[templateId] || SAMPLE_CV_DATA_CZ.cvtemplate
      : SAMPLE_CV_DATA_SK[templateId] || SAMPLE_CV_DATA_SK.cvtemplate;

  const data = clone(base);
  const content = buildProfessionContent(locale, slug);
  if (!content) return data;

  const picked = pickName(locale, content.slug, content.category);
  const first = picked.first;
  const last = picked.last;
  const isFemale = picked.isFemale;

  const role = capitalize(content.name);
  const companies = COMPANY_BY_CATEGORY[locale][content.category] || COMPANY_BY_CATEGORY[locale].office;
  const cvData = getCvProfessionData(locale, content.slug);
  if (!cvData) {
    throw new Error(`Missing cv profession data for slug: ${content.slug} (${locale})`);
  }
  const skills = cvData.skills.slice(0, 5);

  data.name = first;
  data.surname = last;
  data.photo = isFemale ? "/photo_img/photo.jpg" : "/photo_img/photo2.jpg";
  data.title = role;
  data.skills = skills;
  data.education = EDUCATION_BY_CATEGORY[locale][content.category] || data.education;
  const certs = CERTS_BY_CATEGORY[locale][content.category] || [];
  data.certifications = certs;
  data.showCertifications = certs.length > 0;

  const emailLocal = `${first}.${last}`.toLowerCase().replace(/[^a-z0-9.]/g, "");
  data.email = locale === "cs" ? `${emailLocal}@email.cz` : `${emailLocal}@email.sk`;
  data.phone = locale === "cs" ? "+420 777 123 456" : "+421 905 123 456";
  data.location = locale === "cs" ? "Praha, Česká republika" : "Bratislava, Slovenská republika";
  data.linkedin = `${first}.${last}`.toLowerCase().replace(/[^a-z0-9.]/g, "");
  data.web = locale === "cs" ? "www.mujweb.cz" : "www.mojweb.sk";
  data.summary = isFemale ? cvData.aboutMe.female : cvData.aboutMe.male;

  const fallbackDate = ["2021", "2018", "2016"];
  const fallbackTo = [locale === "cs" ? "současnost" : "súčasnosť", "2021", "2018"];
  data.experience = cvData.workExperience.slice(0, 3).map((item, index) => ({
    position: item.position,
    company: companies[index] ?? companies[companies.length - 1],
    date_od: fallbackDate[index] ?? "2016",
    date_do: fallbackTo[index] ?? "2018",
    points: item.bullets,
  }));

  return data;
}
