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
  keywords: string[];
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
};

const BASE_PROFESSIONS: ProfessionSeedBase[] = [
  { slug: "skladnik", category: "logistics", keywords: ["práce se skenerem", "příjem a výdej zboží", "inventury"] },
  { slug: "ridic", category: "logistics", keywords: ["bezpečná jízda", "dodržování tras", "péče o vozidlo"] },
  { slug: "ridic-kamionu", category: "logistics", keywords: ["mezinárodní doprava", "tachograf", "nakládka a vykládka"] },
  { slug: "kuryr", category: "logistics", keywords: ["rozvoz zásilek", "práce s navigací", "komunikace se zákazníky"] },
  { slug: "dispecer-logistiky", category: "logistics", keywords: ["plánování tras", "koordinace řidičů", "práce v TMS"] },
  { slug: "skladovy-koordinator", category: "logistics", keywords: ["organizace skladu", "vedení směny", "optimalizace procesů"] },
  { slug: "obsluha-vzv", category: "logistics", keywords: ["řízení VZV", "manipulace s paletami", "kontrola zboží"] },

  { slug: "montazni-pracovnik", category: "manual", keywords: ["montáž komponentů", "práce podle výkresů", "kontrola kvality"] },
  { slug: "operator-vyroby", category: "manual", keywords: ["obsluha strojů", "seřízení linky", "evidence výroby"] },
  { slug: "delnik", category: "manual", keywords: ["manuální práce", "třídění materiálu", "dodržování BOZP"] },
  { slug: "svarec", category: "manual", keywords: ["MIG/MAG svařování", "čtení výkresů", "kontrola svarů"] },
  { slug: "elektrikar", category: "manual", keywords: ["instalace rozvodů", "měření a revize", "práce s dokumentací"] },
  { slug: "zednik", category: "manual", keywords: ["zdění", "omítky", "práce s betonem"] },
  { slug: "instalater", category: "manual", keywords: ["montáž rozvodů vody", "topení", "servis"] },
  { slug: "mechanik", category: "manual", keywords: ["diagnostika závad", "opravy strojů", "preventivní údržba"] },
  { slug: "lakyrnik", category: "manual", keywords: ["příprava povrchu", "lakování", "kontrola kvality"] },
  { slug: "tesar", category: "manual", keywords: ["výroba konstrukcí", "práce se dřevem", "montáž na stavbě"] },

  { slug: "kuchar", category: "service", keywords: ["příprava jídel", "dodržování hygieny", "práce v kuchyni"] },
  { slug: "cisnik", category: "service", keywords: ["obsluha hostů", "práce s pokladnou", "doporučení menu"] },
  { slug: "servirka", category: "service", keywords: ["servis", "příprava stolů", "komunikace se zákazníky"] },
  { slug: "barman", category: "service", keywords: ["příprava nápojů", "péče o bar", "inventura"] },
  { slug: "barista", category: "service", keywords: ["příprava kávy", "obsluha kávovaru", "latte art"] },
  { slug: "recepcni", category: "service", keywords: ["uvítání návštěv", "správa telefonů", "administrativa"] },
  { slug: "uklizecka", category: "service", keywords: ["úklid prostor", "práce s úklidovou technikou", "doplnění hygieny"] },
  { slug: "bezpecnostni-pracovnik", category: "service", keywords: ["ostraha objektu", "kontrola vstupů", "evidence incidentů"] },

  { slug: "prodavac", category: "retail", keywords: ["prodej zboží", "doplňování regálů", "komunikace se zákazníky"] },
  { slug: "prodavacka", category: "retail", keywords: ["obsluha zákazníků", "pokladna", "merchandising"] },
  { slug: "pokladni", category: "retail", keywords: ["obsluha pokladny", "finanční uzávěrky", "zákaznický servis"] },

  { slug: "asistentka", category: "office", keywords: ["organizace kalendáře", "příprava podkladů", "komunikace s klienty"] },
  { slug: "administrativni-pracovnik", category: "office", keywords: ["zpracování dokumentů", "evidence", "práce s kancelářskými nástroji"] },
  { slug: "ucetni", category: "office", keywords: ["účtování dokladů", "DPH", "uzávěrky"] },
  { slug: "personalista", category: "office", keywords: ["nábor", "onboarding", "personální agenda"] },
  { slug: "obchodni-zastupce", category: "office", keywords: ["akvizice klientů", "péče o zákazníky", "plnění KPI"] },
  { slug: "projektovy-manazer", category: "office", keywords: ["plánování projektu", "řízení týmu", "reporting"] },
  { slug: "marketingovy-specialista", category: "office", keywords: ["kampaně", "správa obsahu", "analytika"] },
  { slug: "mistr-vyroby", category: "office", keywords: ["řízení směny", "plán výroby", "zlepšování procesů"] },

  { slug: "grafik", category: "tech", keywords: ["tvorba vizuálů", "Adobe nástroje", "práce s brandem"] },
  { slug: "programator", category: "tech", keywords: ["vývoj aplikací", "správa kódu", "testování"] },
  { slug: "it-podpora", category: "tech", keywords: ["řešení incidentů", "správa HW/SW", "podpora uživatelů"] },
  { slug: "datovy-analytik", category: "tech", keywords: ["analýza dat", "dashboardy", "SQL"] },
  { slug: "tester-softwaru", category: "tech", keywords: ["testovací scénáře", "reporting bugů", "automatizace testů"] },

  { slug: "ucitel", category: "education", keywords: ["příprava výuky", "hodnocení", "komunikace s rodiči"] },
  { slug: "ucitel-materske-skoly", category: "education", keywords: ["péče o děti", "výchovné aktivity", "bezpečnost"] },
  { slug: "lektor-jazyku", category: "education", keywords: ["výuka jazyků", "příprava materiálů", "hodnocení pokroku"] },

  { slug: "zdravotni-sestra", category: "healthcare", keywords: ["péče o pacienty", "aplikace léčby", "dokumentace"] },
  { slug: "pecovatelka", category: "healthcare", keywords: ["pomoc klientům", "hygiena", "doprovod"] },
  { slug: "fyzioterapeut", category: "healthcare", keywords: ["rehabilitace", "cvičení", "práce s pacientem"] },
  { slug: "farmaceuticky-asistent", category: "healthcare", keywords: ["výdej léčiv", "kontrola zásob", "práce v lékárně"] },

  { slug: "student-brigadnik", category: "student", keywords: ["flexibilita", "rychlé zaučení", "výpomoc týmu"] },
  { slug: "absolvent-bez-praxe", category: "student", keywords: ["ochota učit se", "základní praxe", "týmová spolupráce"] },
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

const CATEGORY_DEFAULTS: Record<Locale, Record<ProfessionCategory, { skills: string[]; responsibilities: string[] }>> = {
  cs: {
    logistics: {
      skills: ["orientace ve skladu", "spolehlivost", "pečlivost", "fyzická zdatnost"],
      responsibilities: ["příjem a výdej zboží", "evidence zásob", "příprava objednávek"],
    },
    manual: {
      skills: ["manuální zručnost", "technické myšlení", "samostatnost", "dodržování BOZP"],
      responsibilities: ["práce podle výkresů", "kontrola kvality", "dodržování pracovních postupů"],
    },
    service: {
      skills: ["komunikace se zákazníky", "příjemné vystupování", "rychlost a spolehlivost"],
      responsibilities: ["obsluha zákazníků", "udržování čistoty", "řešení požadavků hostů"],
    },
    retail: {
      skills: ["zákaznický servis", "práce s pokladnou", "pečlivost"],
      responsibilities: ["prodej zboží", "doplňování regálů", "řešení reklamací"],
    },
    office: {
      skills: ["práce s MS Office", "organizace práce", "komunikace", "spolehlivost"],
      responsibilities: ["správa dokumentace", "administrativa", "koordinace úkolů"],
    },
    tech: {
      skills: ["analytické myšlení", "práce s daty", "systematičnost", "komunikace v týmu"],
      responsibilities: ["tvorba řešení", "testování", "dokumentace"],
    },
    education: {
      skills: ["trpělivost", "komunikace", "příprava materiálů"],
      responsibilities: ["příprava výuky", "hodnocení studentů", "spolupráce s rodiči"],
    },
    healthcare: {
      skills: ["empatie", "pečlivost", "odolnost vůči stresu"],
      responsibilities: ["péče o klienty", "vedení dokumentace", "spolupráce s týmem"],
    },
    student: {
      skills: ["ochota učit se", "spolehlivost", "flexibilita"],
      responsibilities: ["výpomoc týmu", "plnění zadaných úkolů", "rychlá adaptace"],
    },
  },
  sk: {
    logistics: {
      skills: ["orientácia v sklade", "spoľahlivosť", "precíznosť", "fyzická zdatnosť"],
      responsibilities: ["príjem a výdaj tovaru", "evidencia zásob", "príprava objednávok"],
    },
    manual: {
      skills: ["manuálna zručnosť", "technické myslenie", "samostatnosť", "dodržiavanie BOZP"],
      responsibilities: ["práca podľa výkresov", "kontrola kvality", "dodržiavanie pracovných postupov"],
    },
    service: {
      skills: ["komunikácia so zákazníkmi", "príjemné vystupovanie", "rýchlosť a spoľahlivosť"],
      responsibilities: ["obsluha zákazníkov", "udržiavanie čistoty", "riešenie požiadaviek hostí"],
    },
    retail: {
      skills: ["zákaznícky servis", "práca s pokladňou", "precíznosť"],
      responsibilities: ["predaj tovaru", "dopĺňanie regálov", "riešenie reklamácií"],
    },
    office: {
      skills: ["práca s MS Office", "organizácia práce", "komunikácia", "spoľahlivosť"],
      responsibilities: ["správa dokumentácie", "administratíva", "koordinačné úlohy"],
    },
    tech: {
      skills: ["analytické myslenie", "práca s dátami", "systematickosť", "tímová komunikácia"],
      responsibilities: ["tvorba riešení", "testovanie", "dokumentácia"],
    },
    education: {
      skills: ["trpezlivosť", "komunikácia", "príprava materiálov"],
      responsibilities: ["príprava výučby", "hodnotenie študentov", "spolupráca s rodičmi"],
    },
    healthcare: {
      skills: ["empatia", "precíznosť", "odolnosť voči stresu"],
      responsibilities: ["starostlivosť o klientov", "vedenie dokumentácie", "spolupráca s tímom"],
    },
    student: {
      skills: ["ochota učiť sa", "spoľahlivosť", "flexibilita"],
      responsibilities: ["výpomoc tímu", "plnenie zadaných úloh", "rýchla adaptácia"],
    },
  },
};

const UI_TEXT: Record<Locale, {
  introLead: (name: string, categoryLabel: string) => string;
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
  faqs: (name: string) => { question: string; answer: string }[];
}> = {
  cs: {
    introLead: (name, categoryLabel) =>
      `Hledáte vzor životopisu pro pozici ${name}? Připravili jsme konkrétní doporučení, která vám pomohou vyniknout u personalisty a vyhnout se typickým chybám. Kategorie: ${categoryLabel}.`,
    introSecond: (name) =>
      `Najdete tu strukturu, dovednosti i ukázku CV. Pokud chcete, můžete si vzor pro ${name} rovnou upravit v našem generátoru a mít hotovo během pár minut.`,
    h1: (name) => `Životopis pro pozici ${name}`,
    title: (name) => `Životopis ${name} – vzor, tipy a příklad CV`,
    description: (name) =>
      `Vzor životopisu pro pozici ${name}. Praktické tipy, co uvést do CV, doporučené dovednosti a ukázka zkušeností.`,
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
    faqs: (name) => [
      {
        question: `Jak dlouhý má být životopis pro ${name}?`,
        answer:
          "Ideální je 1 strana, maximálně 2 u zkušených kandidátů. Důležitější než délka je relevance a přehlednost.",
      },
      {
        question: `Mám uvádět všechny pracovní zkušenosti?`,
        answer:
          "Vyberte hlavně zkušenosti, které souvisí s pozicí. Starší a méně relevantní můžete zkrátit.",
      },
      {
        question: `Je lepší strukturovaný nebo kreativní životopis?`,
        answer:
          "U většiny profesí funguje přehledná a strukturovaná forma. Kreativní prvky použijte jen, pokud je očekává obor.",
      },
    ],
  },
  sk: {
    introLead: (name, categoryLabel) =>
      `Hľadáte vzor životopisu pre pozíciu ${name}? Pripravili sme konkrétne odporúčania, ktoré vám pomôžu vyniknúť u personalistu a vyhnúť sa častým chybám. Kategória: ${categoryLabel}.`,
    introSecond: (name) =>
      `Nájdete tu štruktúru, zručnosti aj ukážku CV. Ak chcete, môžete si vzor pre ${name} hneď upraviť v našom generátore a mať hotovo za pár minút.`,
    h1: (name) => `Životopis pre pozíciu ${name}`,
    title: (name) => `Životopis ${name} – vzor, tipy a príklad CV`,
    description: (name) =>
      `Vzor životopisu pre pozíciu ${name}. Praktické tipy, čo uviesť do CV, odporúčané zručnosti a ukážka skúseností.`,
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
    faqs: (name) => [
      {
        question: `Ako dlhý má byť životopis pre ${name}?`,
        answer:
          "Ideálne 1 strana, maximálne 2 pri skúsených kandidátoch. Dôležitá je relevancia a prehľadnosť.",
      },
      {
        question: `Mám uvádzať všetky pracovné skúsenosti?`,
        answer:
          "Vyberte najmä skúsenosti súvisiace s pozíciou. Staršie a menej relevantné môžete skrátiť.",
      },
      {
        question: `Je lepší štruktúrovaný alebo kreatívny životopis?`,
        answer:
          "Vo väčšine profesií funguje prehľadná a štruktúrovaná forma. Kreatívne prvky použite len, ak to očakáva odbor.",
      },
    ],
  },
};

function uniq(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function pickVariant(slug: string, variants: string[]) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % variants.length;
  return variants[idx];
}

export function toProfessionUrlSlug(baseSlug: string) {
  return `zivotopis-${baseSlug}`;
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
  const defaults = CATEGORY_DEFAULTS[locale][seed.category];
  const categoryLabel = CATEGORY_LABELS[locale][seed.category];

  const keywordPool = locale === "cs" ? seed.keywords : [];
  const skills = uniq([...keywordPool, ...defaults.skills]).slice(0, 8);
  const responsibilities = uniq([...keywordPool, ...defaults.responsibilities]).slice(0, 6);

  const related = getRelatedProfessions(locale, seed.slug, seed.category, 8);

  const sampleExperience = [
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

  const bodySections = [
    {
      heading: ui.sections.howTo,
      paragraphs:
        locale === "cs"
          ? [
              `Životopis pro pozici ${seed.name} by měl být jasný a věcný. Personalista chce rychle pochopit, co umíte a jaké výsledky můžete přinést.`,
              `Zaměřte se na konkrétní zkušenosti, které souvisí s náplní práce. Uveďte měřitelné výsledky, nástroje a procesy, se kterými pracujete.`,
              `Pokud s profesí začínáte, zdůrazněte praxi, brigády, kurzy nebo projekty. Důležitá je motivace a rychlá adaptace.`,
            ]
          : [
              `Životopis pre pozíciu ${seed.name} má byť jasný a vecný. Personalista chce rýchlo pochopiť, čo viete a aké výsledky prinesiete.`,
              `Zamerajte sa na skúsenosti, ktoré súvisia s náplňou práce. Uveďte merateľné výsledky, nástroje a procesy, s ktorými pracujete.`,
              `Ak s profesiou začínate, zvýraznite prax, brigády, kurzy alebo projekty. Dôležitá je motivácia a rýchla adaptácia.`,
            ],
    },
    {
      heading: ui.sections.highlight,
      paragraphs:
        locale === "cs"
          ? [
              `U této profese funguje přehledná struktura a jasné priority. Důraz dejte na zkušenosti z praxe a na dovednosti jako ${skillsString}.`,
              `Zmiňte typické úkoly, se kterými máte zkušenosti, například: ${responsibilitiesString}.`,
            ]
          : [
              `Pri tejto profesii funguje prehľadná štruktúra a jasné priority. Dôraz dajte na prax a zručnosti ako ${skillsString}.`,
              `Spomeňte typické úlohy, s ktorými máte skúsenosti, napríklad: ${responsibilitiesString}.`,
            ],
      bullets:
        locale === "cs"
          ? [
              "konkrétní výsledky a úspory času/peněz",
              "stabilita a spolehlivost v provozu",
              "nástroje a systémy, které ovládáte",
              "spolupráce v týmu a komunikace",
            ]
          : [
              "konkrétne výsledky a úspory času/peňazí",
              "stabilita a spoľahlivosť v prevádzke",
              "nástroje a systémy, ktoré ovládate",
              "spolupráca v tíme a komunikácia",
            ],
    },
    {
      heading: ui.sections.ats,
      paragraphs:
        locale === "cs"
          ? [
              "Personalisté často používají ATS (automatické systémy). Používejte proto stejné výrazy jako v inzerátu a nezakrývejte důležité informace do grafiky.",
              "Ideální je jednoduchá struktura, dobře čitelné nadpisy a standardní názvy sekcí (Zkušenosti, Vzdělání, Dovednosti).",
            ]
          : [
              "Personalisti často používajú ATS (automatické systémy). Používajte preto rovnaké výrazy ako v inzeráte a neschovávajte dôležité informácie do grafiky.",
              "Ideálna je jednoduchá štruktúra, dobre čitateľné nadpisy a štandardné názvy sekcií (Skúsenosti, Vzdelanie, Zručnosti).",
            ],
    },
    {
      heading: ui.sections.mistakes,
      paragraphs:
        locale === "cs"
          ? [
              "Nejčastější problém je příliš obecný nebo nepřehledný životopis. Vytvořte jednoduchý, ale konkrétní dokument.",
            ]
          : [
              "Najčastejším problémom je príliš všeobecný alebo neprehľadný životopis. Vytvorte jednoduchý, ale konkrétny dokument.",
            ],
      bullets:
        locale === "cs"
          ? [
              "chybějící výsledky a konkrétní čísla",
              "neaktuální nebo chaotické zkušenosti",
              "příliš dlouhý text bez struktury",
            ]
          : [
              "chýbajúce výsledky a konkrétne čísla",
              "neaktuálne alebo chaotické skúsenosti",
              "príliš dlhý text bez štruktúry",
            ],
    },
  ];

  return {
    slug: seed.slug,
    urlSlug: toProfessionUrlSlug(seed.slug, locale),
    name: seed.name,
    category: seed.category,
    title: ui.title(seed.name),
    description: ui.description(seed.name),
    h1: ui.h1(seed.name),
    intro: [ui.introLead(seed.name, categoryLabel), ui.introSecond(seed.name)],
    summaryBullets:
      locale === "cs"
        ? [
            "Stručný návod, jak napsat životopis pro danou profesi",
            "Dovednosti a úkoly, které personalisté očekávají",
            "Ukázka životopisu s předvyplněnými daty",
          ]
        : [
            "Stručný návod, ako napísať životopis pre danú profesiu",
            "Zručnosti a úlohy, ktoré personalisti očakávajú",
            "Ukážka životopisu s predvyplnenými údajmi",
          ],
    uniqueLead,
    bodySections,
    sections: [
      { heading: ui.sections.mustHave, bullets: ui.sectionBullets.mustHave },
      { heading: ui.sections.responsibilities, bullets: responsibilities },
      { heading: ui.sections.skills, bullets: skills },
    ],
    skills,
    responsibilities,
    sample: {
      summary: ui.sample.summary(seed.name, keywordPool.length ? keywordPool : defaults.skills),
      experience: sampleExperience,
      education: sampleEducation,
      skills: skills.slice(0, 6),
    },
    related,
    faqs: ui.faqs(seed.name),
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
