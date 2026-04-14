import {
  CvProfessionSections,
  getCvProfessionData,
  getCvProfessionResponsibilities,
} from "./cvProfessionData";

export type Locale = "cs" | "sk";

export type ProfessionCategory =
  | "logistics"
  | "manual"
  | "service"
  | "retail"
  | "office"
  | "tech"
  | "education"
  | "healthcare"
  | "student";

type ProfessionSeedBase = {
  slug: string;
  category: ProfessionCategory;
};

export type ProfessionSeed = ProfessionSeedBase & {
  name: string;
};

export type ProfessionContent = {
  slug: string;
  urlSlug: string;
  name: string;
  category: ProfessionCategory;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  summaryBullets: string[];
  uniqueLead: string;
  bodySections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  adExample: {
    title: string;
    introText: string;
    intro: string[];
    responsibilitiesTitle: string;
    responsibilities: string[];
    requirementsTitle: string;
    requirements: string[];
    note: string;
  };
  sections: {
    heading: string;
    bullets: string[];
  }[];
  skills: string[];
  responsibilities: string[];
  sample: {
    summary: string;
    experience: string[];
    education: string[];
    skills: string[];
  };
  related: { slug: string; urlSlug: string; name: string }[];
  faqs: { question: string; answer: string }[];
  faqHeading: string;
};

const BASE_PROFESSIONS: ProfessionSeedBase[] = [
  { slug: "skladnik", category: "logistics" },
  { slug: "ridic", category: "logistics" },
  { slug: "ridic-kamionu", category: "logistics" },
  { slug: "kuryr", category: "logistics" },
  { slug: "dispecer-logistiky", category: "logistics" },
  { slug: "skladovy-koordinator", category: "logistics" },
  { slug: "obsluha-vzv", category: "logistics" },

  { slug: "montazni-pracovnik", category: "manual" },
  { slug: "operator-vyroby", category: "manual" },
  { slug: "delnik", category: "manual" },
  { slug: "svarec", category: "manual" },
  { slug: "elektrikar", category: "manual" },
  { slug: "zednik", category: "manual" },
  { slug: "instalater", category: "manual" },
  { slug: "mechanik", category: "manual" },
  { slug: "lakyrnik", category: "manual" },
  { slug: "tesar", category: "manual" },

  { slug: "kuchar", category: "service" },
  { slug: "cisnik", category: "service" },
  { slug: "servirka", category: "service" },
  { slug: "barman", category: "service" },
  { slug: "barista", category: "service" },
  { slug: "recepcni", category: "service" },
  { slug: "uklizecka", category: "service" },
  { slug: "bezpecnostni-pracovnik", category: "service" },

  { slug: "prodavac", category: "retail" },
  { slug: "prodavacka", category: "retail" },
  { slug: "pokladni", category: "retail" },

  { slug: "asistentka", category: "office" },
  { slug: "administrativni-pracovnik", category: "office" },
  { slug: "ucetni", category: "office" },
  { slug: "personalista", category: "office" },
  { slug: "obchodni-zastupce", category: "office" },
  { slug: "projektovy-manazer", category: "office" },
  { slug: "marketingovy-specialista", category: "office" },
  { slug: "mistr-vyroby", category: "office" },

  { slug: "grafik", category: "tech" },
  { slug: "programator", category: "tech" },
  { slug: "it-podpora", category: "tech" },
  { slug: "datovy-analytik", category: "tech" },
  { slug: "tester-softwaru", category: "tech" },

  { slug: "ucitel", category: "education" },
  { slug: "ucitel-materske-skoly", category: "education" },
  { slug: "lektor-jazyku", category: "education" },

  { slug: "zdravotni-sestra", category: "healthcare" },
  { slug: "pecovatelka", category: "healthcare" },
  { slug: "fyzioterapeut", category: "healthcare" },
  { slug: "farmaceuticky-asistent", category: "healthcare" },

  { slug: "student-brigadnik", category: "student" },
  { slug: "absolvent-bez-praxe", category: "student" },
];

const NAMES: Record<Locale, Record<string, string>> = {
  cs: {
    "skladnik": "skladník",
    "ridic": "řidič",
    "ridic-kamionu": "řidič kamionu",
    "kuryr": "kurýr",
    "dispecer-logistiky": "dispečer logistiky",
    "skladovy-koordinator": "skladový koordinátor",
    "obsluha-vzv": "obsluha VZV",
    "montazni-pracovnik": "montážní pracovník",
    "operator-vyroby": "operátor výroby",
    "delnik": "dělník",
    "svarec": "svářeč",
    "elektrikar": "elektrikář",
    "zednik": "zedník",
    "instalater": "instalatér",
    "mechanik": "mechanik",
    "lakyrnik": "lakýrník",
    "tesar": "tesař",
    "kuchar": "kuchař",
    "cisnik": "číšník",
    "servirka": "servírka",
    "barman": "barman",
    "barista": "barista",
    "recepcni": "recepční",
    "uklizecka": "uklízečka",
    "bezpecnostni-pracovnik": "bezpečnostní pracovník",
    "prodavac": "prodavač",
    "prodavacka": "prodavačka",
    "pokladni": "pokladní",
    "asistentka": "asistentka",
    "administrativni-pracovnik": "administrativní pracovník",
    "ucetni": "účetní",
    "personalista": "personalista",
    "obchodni-zastupce": "obchodní zástupce",
    "projektovy-manazer": "projektový manažer",
    "marketingovy-specialista": "marketingový specialista",
    "mistr-vyroby": "mistr výroby",
    "grafik": "grafik",
    "programator": "programátor",
    "it-podpora": "IT podpora",
    "datovy-analytik": "datový analytik",
    "tester-softwaru": "tester softwaru",
    "ucitel": "učitel",
    "ucitel-materske-skoly": "učitel mateřské školy",
    "lektor-jazyku": "lektor jazyků",
    "zdravotni-sestra": "zdravotní sestra",
    "pecovatelka": "pečovatelka",
    "fyzioterapeut": "fyzioterapeut",
    "farmaceuticky-asistent": "farmaceutický asistent",
    "student-brigadnik": "student brigádník",
    "absolvent-bez-praxe": "absolvent bez praxe",
  },
  sk: {
    "skladnik": "skladník",
    "ridic": "vodič",
    "ridic-kamionu": "vodič kamiónu",
    "kuryr": "kuriér",
    "dispecer-logistiky": "dispečer logistiky",
    "skladovy-koordinator": "skladový koordinátor",
    "obsluha-vzv": "obsluha VZV",
    "montazni-pracovnik": "montážny pracovník",
    "operator-vyroby": "operátor výroby",
    "delnik": "robotník",
    "svarec": "zvárač",
    "elektrikar": "elektrikár",
    "zednik": "murár",
    "instalater": "inštalatér",
    "mechanik": "mechanik",
    "lakyrnik": "lakýrnik",
    "tesar": "tesár",
    "kuchar": "kuchár",
    "cisnik": "čašník",
    "servirka": "servírka",
    "barman": "barman",
    "barista": "barista",
    "recepcni": "recepčný",
    "uklizecka": "upratovačka",
    "bezpecnostni-pracovnik": "bezpečnostný pracovník",
    "prodavac": "predavač",
    "prodavacka": "predavačka",
    "pokladni": "pokladník",
    "asistentka": "asistentka",
    "administrativni-pracovnik": "administratívny pracovník",
    "ucetni": "účtovník",
    "personalista": "personalista",
    "obchodni-zastupce": "obchodný zástupca",
    "projektovy-manazer": "projektový manažér",
    "marketingovy-specialista": "marketingový špecialista",
    "mistr-vyroby": "majster výroby",
    "grafik": "grafik",
    "programator": "programátor",
    "it-podpora": "IT podpora",
    "datovy-analytik": "dátový analytik",
    "tester-softwaru": "tester softvéru",
    "ucitel": "učiteľ",
    "ucitel-materske-skoly": "učiteľ materskej školy",
    "lektor-jazyku": "lektor jazykov",
    "zdravotni-sestra": "zdravotná sestra",
    "pecovatelka": "opatrovateľka",
    "fyzioterapeut": "fyzioterapeut",
    "farmaceuticky-asistent": "farmaceutický asistent",
    "student-brigadnik": "študent brigádnik",
    "absolvent-bez-praxe": "absolvent bez praxe",
  },
};

const CATEGORY_LABELS: Record<Locale, Record<ProfessionCategory, string>> = {
  cs: {
    logistics: "Logistika",
    manual: "Výroba a řemesla",
    service: "Služby a gastronomie",
    retail: "Maloobchod",
    office: "Administrativa a management",
    tech: "IT a kreativní profese",
    education: "Školství",
    healthcare: "Zdravotnictví a péče",
    student: "Studenti a absolventi",
  },
  sk: {
    logistics: "Logistika",
    manual: "Výroba a remeslá",
    service: "Služby a gastronómia",
    retail: "Maloobchod",
    office: "Administratíva a manažment",
    tech: "IT a kreatívne profesie",
    education: "Školstvo",
    healthcare: "Zdravotníctvo a starostlivosť",
    student: "Študenti a absolventi",
  },
};

type AdExample = ProfessionContent["adExample"];

const AD_EXAMPLE_OVERRIDES: Record<Locale, Record<string, AdExample>> = {
  cs: {},
  sk: {},
};

const AD_EXAMPLE_BASE: Record<Locale, AdExample> = {
  cs: {
    title: "Příklad inzerátu:",
    introText: "",
    intro: [],
    responsibilitiesTitle: "Náplň práce",
    responsibilities: [],
    requirementsTitle: "Požadujeme",
    requirements: [],
    note: "",
  },
   sk: {
    title: "Príklad inzerátu:",
    introText: "",
    intro: [],
    responsibilitiesTitle: "Náplň práce",
    responsibilities: [],
    requirementsTitle: "Požadujeme",
    requirements: [],
    note: "",
  },
};

const UI_TEXT: Record<Locale, {
  introLead: (name: string) => string;
  introSecond: (name: string) => string;
  h1: (name: string) => string;
  title: (name: string) => string;
  description: (name: string) => string;
  sections: {
    mustHave: string;
    skills: string;
    responsibilities: string;
    sample: string;
    related: string;
    howTo: string;
    highlight: string;
    ats: string;
    mistakes: string;
  };
  sectionBullets: {
    mustHave: string[];
  };
  sample: {
    summary: (name: string, keywords: string[]) => string;
    experienceHeading: string;
    educationHeading: string;
    skillsHeading: string;
  };
}> = {
  cs: {
    introLead: (name) =>
      `Hledáte vzor životopisu pro pozici ${name} v roce ${new Date().getFullYear()}? Připravili jsme konkrétní doporučení, která vám pomohou vyniknout.`,
    introSecond: (name) =>
      `Najdete tu strukturu, dovednosti i ukázku CV. Pokud chcete, můžete si vzor pro pozici ${name} rovnou upravit v naší [generator] a mít hotovo během pár minut.`,
    h1: (name) => `Vzor životopisu pro pozici ${name} v roce ${new Date().getFullYear()}`,
    title: (name) => `Životopis ${name} – vzor, tipy a příklad CV v roce ${new Date().getFullYear()}`,
    description: (name) =>
      `Vzor životopisu pro pozici ${name} v roce ${new Date().getFullYear()}. Praktické tipy, co uvést do CV, doporučené dovednosti a ukázka zkušeností.`,
    sections: {
      mustHave: "Co má obsahovat životopis",
      skills: "Doporučené dovednosti",
      responsibilities: "Typické úkoly a náplň práce",
      sample: "Ukázka životopisu",
      related: "Další profese v oboru",
      howTo: "Jak napsat životopis pro tuto profesi",
      highlight: "Co u této profese personalisté ocení",
      ats: "Tipy pro ATS a výběrová řízení",
      mistakes: "Nejčastější chyby v životopise",
    },
    sectionBullets: {
      mustHave: [
        "kontaktní údaje a krátké shrnutí profilu",
        "pracovní zkušenosti se zaměřením na výsledky",
        "vzdělání, kurzy a certifikace",
        "dovednosti a nástroje relevantní pro pozici",
      ],
    },
    sample: {
      summary: (name, keywords) =>
        `Spolehlivý ${name} se zaměřením na ${keywords[0] ?? "kvalitní výkon"}, ${keywords[1] ?? "preciznost"} a ${keywords[2] ?? "týmovou spolupráci"}.`,
      experienceHeading: "Pracovní zkušenosti (příklad)",
      educationHeading: "Vzdělání a kurzy (příklad)",
      skillsHeading: "Klíčové dovednosti (příklad)",
    },
  },
  sk: {
    introLead: (name) =>
      `Hľadáte vzor životopisu pre pozíciu ${name} v roku ${new Date().getFullYear()}? Pripravili sme konkrétne odporúčania, ktoré vám pomôžu vyniknúť.`,
    introSecond: (name) =>
      `Nájdete tu štruktúru, zručnosti aj ukážku CV. Ak chcete, môžete si vzor pre pozíciu ${name} hneď upraviť v našej [generator] a mať hotovo za pár minút.`,
    h1: (name) => `Vzor životopisu pre pozíciu ${name} v roku ${new Date().getFullYear()}`,
    title: (name) => `Životopis ${name} – vzor, tipy a príklad CV v roku ${new Date().getFullYear()}`,
    description: (name) =>
      `Vzor životopisu pre pozíciu ${name} v roku ${new Date().getFullYear()}. Praktické tipy, čo uviesť do CV, odporúčané zručnosti a ukážka skúseností.`,
    sections: {
      mustHave: "Čo má obsahovať životopis",
      skills: "Odporúčané zručnosti",
      responsibilities: "Typické úlohy a náplň práce",
      sample: "Ukážka životopisu",
      related: "Ďalšie profesie v odbore",
      howTo: "Ako napísať životopis pre túto profesiu",
      highlight: "Čo personalisti pri tejto profesii ocenia",
      ats: "Tipy pre ATS a výberové konania",
      mistakes: "Najčastejšie chyby v životopise",
    },
    sectionBullets: {
      mustHave: [
        "kontaktné údaje a krátke zhrnutie profilu",
        "pracovné skúsenosti so zameraním na výsledky",
        "vzdelanie, kurzy a certifikácie",
        "zručnosti a nástroje relevantné pre pozíciu",
      ],
    },
    sample: {
      summary: (name, keywords) =>
        `Spoľahlivý ${name} so zameraním na ${keywords[0] ?? "kvalitný výkon"}, ${keywords[1] ?? "precíznosť"} a ${keywords[2] ?? "tímovú spoluprácu"}.`,
      experienceHeading: "Pracovné skúsenosti (príklad)",
      educationHeading: "Vzdelanie a kurzy (príklad)",
      skillsHeading: "Kľúčové zručnosti (príklad)",
    },
  },
};

function pickVariant(slug: string, variants: string[]) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % variants.length;
  return variants[idx];
}

function pickDeterministic<T>(items: T[], count: number, seed: string) {
  if (!items.length) return [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  const start = Math.abs(hash) % items.length;
  const result: T[] = [];
  for (let i = 0; i < Math.min(count, items.length); i++) {
    result.push(items[(start + i) % items.length]);
  }
  return result;
}

const SK_SLUGS: Record<string, string> = {
  ridic: "vodic",
  "ridic-kamionu": "vodic-kamionu",
  kuryr: "kurier",
  "montazni-pracovnik": "montazny-pracovnik",
  delnik: "robotnik",
  svarec: "zvarac",
  zednik: "murar",
  cisnik: "casnik",
  recepcni: "recepcny",
  uklizecka: "upratovacka",
  "bezpecnostni-pracovnik": "bezpecnostny-pracovnik",
  prodavac: "predavac",
  prodavacka: "predavacka",
  pokladni: "pokladnik",
  "administrativni-pracovnik": "administrativny-pracovnik",
  ucetni: "uctovnik",
  "obchodni-zastupce": "obchodny-zastupca",
  "mistr-vyroby": "majster-vyroby",
  "tester-softwaru": "tester-softveru",
  "ucitel-materske-skoly": "ucitel-materskej-skoly",
  "lektor-jazyku": "lektor-jazykov",
  "zdravotni-sestra": "zdravotna-sestra",
  pecovatelka: "opatrovatelka",
};

const SK_SLUGS_REVERSE = Object.fromEntries(
  Object.entries(SK_SLUGS).map(([base, sk]) => [sk, base])
);

export function toProfessionUrlSlug(baseSlug: string, locale: Locale) {
  if (locale === "sk") {
    const mapped = SK_SLUGS[baseSlug] ?? baseSlug;
    return `zivotopis-${mapped}`;
  }
  return `zivotopis-${baseSlug}`;
}

export function fromProfessionUrlSlug(urlSlug: string, locale: Locale) {
  const raw = urlSlug.replace(/^zivotopis-/, "");
  if (locale === "sk") {
    return SK_SLUGS_REVERSE[raw] ?? raw;
  }
  return raw;
}

export function getProfessionSeeds(locale: Locale): ProfessionSeed[] {
  return BASE_PROFESSIONS.map((base) => ({
    ...base,
    name: NAMES[locale][base.slug] ?? base.slug,
  }));
}

export function getProfessionBaseSlugs(): string[] {
  return BASE_PROFESSIONS.map((p) => p.slug);
}

export function getProfessionSlugs(locale: Locale): string[] {
  return BASE_PROFESSIONS.map((p) => toProfessionUrlSlug(p.slug, locale));
}

export function getProfessionBySlug(locale: Locale, slug: string): ProfessionSeed | null {
  const base = BASE_PROFESSIONS.find((p) => p.slug === slug);
  if (!base) return null;
  return { ...base, name: NAMES[locale][base.slug] ?? base.slug };
}

export function buildProfessionContent(locale: Locale, slug: string): ProfessionContent | null {
  const normalized = fromProfessionUrlSlug(slug, locale);
  const seed = getProfessionBySlug(locale, normalized);
  if (!seed) return null;

  const ui = UI_TEXT[locale];
  const cvData = getCvProfessionData(locale, seed.slug);
  if (!cvData) {
    throw new Error(`Missing cv profession data for slug: ${seed.slug} (${locale})`);
  }
  const skills = cvData.skills;
  const responsibilities = getCvProfessionResponsibilities(cvData, 8);

  const related = getRelatedProfessions(locale, seed.slug, seed.category, 8);

  const formatSampleLine = (years: string, position: string, company: string, bullets: string[]) => {
    const lead = bullets.slice(0, 2).join(", ");
    return `${years} | ${position} | ${company}${lead ? ` – ${lead}.` : "."}`;
  };
  const sampleExperience = cvData.workExperience?.length
    ? [
        formatSampleLine(
          "2019–2024",
          cvData.workExperience[0]?.position ?? seed.name,
          "ABC s.r.o.",
          cvData.workExperience[0]?.bullets ?? []
        ),
        formatSampleLine(
          "2016–2019",
          cvData.workExperience[1]?.position ?? seed.name,
          "XYZ s.r.o.",
          cvData.workExperience[1]?.bullets ?? []
        ),
      ]
    : [
        `2019–2024 | ${seed.name} | ABC s.r.o. – ${responsibilities.slice(0, 2).join(", ")}.`,
        `2016–2019 | ${seed.name} | XYZ s.r.o. – ${responsibilities.slice(2, 4).join(", ")}.`,
      ];

  const sampleEducation = locale === "cs"
    ? ["2014–2016 | Odborné učiliště | Relevantní obor", "2013 | Kurzy a certifikace dle profese"]
    : ["2014–2016 | Odborné učilište | Relevantný odbor", "2013 | Kurzy a certifikácie podľa profesie"];

  const skillsString = skills.slice(0, 4).join(", ");
  const responsibilitiesString = responsibilities.slice(0, 3).join(", ");

  const uniqueLead = pickVariant(seed.slug, [
    locale === "cs"
      ? `V praxi se nejvíc cení kombinace ${skillsString} a schopnosti rychle reagovat na změny provozu.`
      : `V praxi sa najviac cení kombinácia ${skillsString} a schopnosť rýchlo reagovať na zmeny prevádzky.`,
    locale === "cs"
      ? `Pokud chcete v této roli vyniknout, ukažte konkrétní výsledky a zmiňte nástroje, které ovládáte.`
      : `Ak chcete v tejto roli vyniknúť, ukážte konkrétne výsledky a spomeňte nástroje, ktoré ovládate.`,
    locale === "cs"
      ? `Krátký, dobře strukturovaný životopis s jasnými výsledky funguje v tomto oboru nejlépe.`
      : `Krátky, dobre štruktúrovaný životopis s jasnými výsledkami funguje v tomto odbore najlepšie.`,
  ]);

  const buildSection = (
    heading: string,
    paragraphs: string[],
    bullets?: string[]
  ): { heading: string; paragraphs: string[]; bullets?: string[] } => {
    const section: { heading: string; paragraphs: string[]; bullets?: string[] } = {
      heading,
      paragraphs,
    };
    if (bullets && bullets.length > 0) section.bullets = bullets;
    return section;
  };

  const mergeParagraphs = (paragraphs?: string[]) => {
    return (paragraphs ?? []).map((p) => p.trim()).filter(Boolean).join(" ");
  };

  const appendHowToBlogLink = (text: string) => {
    if (!text) return text;
    if (text.includes("[blog]")) return text;
    const sentence =
      locale === "cs"
        ? "Podrobný návod, [blog]jak napsat životopis[/blog], najdete v našem blogu."
        : "Podrobný návod, [blog]ako napísať životopis[/blog], nájdete v našom blogovom článku.";
    const spacer = text.endsWith(".") ? " " : ". ";
    return `${text}${spacer}${sentence}`;
  };

  const buildCzSectionsFromJson = (sections: CvProfessionSections) => {
    const howToParagraph = appendHowToBlogLink(
      mergeParagraphs(sections.howToWriteCv.paragraphs)
    );
    const atsParagraph = mergeParagraphs(sections.atsTips.paragraphs);

    return [
      buildSection(
        sections.howToWriteCv.heading || ui.sections.howTo,
        howToParagraph ? [howToParagraph] : [],
        sections.howToWriteCv.bullets
      ),
      buildSection(
        sections.atsTips.heading || ui.sections.ats,
        atsParagraph ? [atsParagraph] : [],
        sections.atsTips.bullets
      ),
      buildSection(
        sections.whatRecruitersAppreciate.heading || ui.sections.highlight,
        sections.whatRecruitersAppreciate.paragraphs ?? [],
        sections.whatRecruitersAppreciate.bullets
      ),
      buildSection(
        sections.commonCvMistakes.heading || ui.sections.mistakes,
        sections.commonCvMistakes.paragraphs ?? [],
        sections.commonCvMistakes.bullets
      ),
    ];
  };

  const bodySections = cvData.sections
    ? buildCzSectionsFromJson(cvData.sections)
    : [];

  const adExampleBase = AD_EXAMPLE_OVERRIDES[locale][seed.slug] ?? AD_EXAMPLE_BASE[locale];
  const adResponsibilities = responsibilities.slice(0, 4);
  const adRequirements = pickDeterministic(skills, 6, `${seed.slug}-requirements`);
  const jobAdIntroText = cvData.sections?.jobAdExample?.text?.trim();
  const adIntroText =
    jobAdIntroText && jobAdIntroText.length > 0
      ? jobAdIntroText
      : adExampleBase.introText ?? "";
  const adTitle =
    cvData.sections?.jobAdExample?.heading
      ? cvData.sections.jobAdExample.heading
      : adExampleBase.title;

  const combinedIntro = `${ui.introLead(seed.name)} ${ui.introSecond(seed.name)} ${uniqueLead}`.trim();

  return {
    slug: seed.slug,
    urlSlug: toProfessionUrlSlug(seed.slug, locale),
    name: seed.name,
    category: seed.category,
    title: ui.title(seed.name),
    description: ui.description(seed.name),
    h1: ui.h1(seed.name),
    intro: [combinedIntro],
    summaryBullets:
      locale === "cs"
        ? [
            "Stručný návod, jak napsat životopis pro danou profesi",
            "Dovednosti a úkoly, které personalisté očekávají",
            "Vzor životopisu s předvyplněnými daty",
            "Co u této profese personalisté ocení",
            "Nejčastější chyby v životopise",
          ]
        : [
            "Stručný návod, ako napísať životopis pre danú profesiu",
            "Zručnosti a úlohy, ktoré personalisti očakávajú",
            "Vzor životopisu s predvyplnenými údajmi",
            "Čo personalisti pri tejto profesii ocenia",
            "Najčastejšie chyby v životopise",
          ],
    uniqueLead: "",
    bodySections,
    adExample: {
      ...adExampleBase,
      title: adTitle,
      responsibilities: adResponsibilities,
      requirements: adRequirements,
      introText: adIntroText,
    },
    sections: [
      { heading: ui.sections.mustHave, bullets: ui.sectionBullets.mustHave },
      { heading: ui.sections.responsibilities, bullets: responsibilities },
      { heading: ui.sections.skills, bullets: skills },
    ],
    skills,
    responsibilities,
    sample: {
      summary: ui.sample.summary(seed.name, skills),
      experience: sampleExperience,
      education: sampleEducation,
      skills: skills.slice(0, 6),
    },
    related,
    faqs: cvData.faq?.items ?? [],
    faqHeading:
      cvData.faq?.heading
        ? cvData.faq.heading
        : locale === "cs"
          ? "Časté otázky (FAQ)"
          : "Časté otázky (FAQ)",
  };
}

export function getCategoryLabels(locale: Locale) {
  return CATEGORY_LABELS[locale];
}

export function getGroupedProfessions(locale: Locale) {
  const list = getProfessionSeeds(locale);
  const groups: Record<ProfessionCategory, ProfessionSeed[]> = {
    logistics: [],
    manual: [],
    service: [],
    retail: [],
    office: [],
    tech: [],
    education: [],
    healthcare: [],
    student: [],
  };
  for (const p of list) groups[p.category].push(p);
  return groups;
}

export function getRelatedProfessions(
  locale: Locale,
  slug: string,
  category: ProfessionCategory,
  limit = 6
) {
  const list = getProfessionSeeds(locale)
    .filter((p) => p.category === category && p.slug !== slug)
    .slice(0, limit);
  return list.map((p) => ({
    slug: p.slug,
    urlSlug: toProfessionUrlSlug(p.slug, locale),
    name: p.name,
  }));
}
