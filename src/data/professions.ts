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

const CATEGORY_INTRO: Record<Locale, Record<ProfessionCategory, string>> = {
  cs: {
    logistics:
      "Na pozici [position] hledáme spolehlivého a pečlivého zaměstnance s orientací ve skladu a dobrou fyzickou zdatností. Náplní práce bude příjem a výdej zboží, evidence zásob i příprava objednávek. Oceníme zodpovědný přístup, samostatnost a chuť podílet se na plynulém chodu skladu.",
    manual:
      "Na pozici [position] hledáme manuálně zručného a samostatného člověka s technickým myšlením. Důležitá je schopnost práce podle výkresů, kontrola kvality a důsledné dodržování pracovních postupů i BOZP. Oceníme pečlivost, odpovědný přístup a ochotu odvádět kvalitní práci v každodenním provozu.",
    service:
      "Na pozici [position] hledáme člověka s příjemným vystupováním, rychlostí, spolehlivostí a dobrou komunikací se zákazníky. Náplní práce bude obsluha zákazníků, udržování čistoty a řešení požadavků hostů. Oceníme ochotu pracovat s lidmi, profesionální přístup a snahu vytvářet příjemnou atmosféru.",
    retail:
      "Na pozici [position] hledáme pečlivého a vstřícného zaměstnance se zaměřením na zákaznický servis a práci s pokladnou. Vaší náplní bude prodej zboží, doplňování regálů a řešení reklamací. Oceníme spolehlivost, příjemné vystupování a aktivní přístup k zákazníkům i každodenním povinnostem na prodejně.",
    office:
      "Na pozici [position] hledáme spolehlivého a organizovaného člověka, který ovládá práci s MS Office a má dobré komunikační schopnosti. Náplní práce bude správa dokumentace, administrativa a koordinace úkolů. Oceníme samostatnost, pečlivost a schopnost udržet pořádek v každodenní kancelářské agendě.",
    tech:
      "Na pozici [position] hledáme systematického kolegu s analytickým myšlením, schopností práce s daty a komunikací v týmu. Náplní práce bude tvorba řešení, testování a dokumentace. Oceníme pečlivý přístup, schopnost hledat souvislosti a chuť podílet se na kvalitním technickém výstupu.",
    education:
      "Na pozici [position] hledáme trpělivého a komunikativního člověka, který zvládne přípravu materiálů i zodpovědný přístup k práci. Náplní bude příprava výuky, hodnocení studentů a spolupráce s rodiči. Oceníme schopnost předávat informace srozumitelně, empaticky a s důrazem na individuální přístup.",
    healthcare:
      "Na pozici [position] hledáme pečlivého a odolného člověka s empatií a profesionálním přístupem. Náplní práce bude péče o klienty, vedení dokumentace a spolupráce s týmem. Oceníme zodpovědnost, schopnost zvládat stresové situace a opravdový zájem o kvalitní a citlivou péči o druhé.",
    student:
      "Na pozici [position] hledáme spolehlivého a flexibilního člověka s ochotou učit se novým věcem. Náplní práce bude výpomoc týmu, plnění zadaných úkolů a rychlá adaptace na pracovní prostředí. Oceníme aktivní přístup, samostatnost a chuť získat nové zkušenosti v praxi.",
  },
  sk: {
    logistics:
      "Na pozíciu [position] hľadáme spoľahlivého a precízneho zamestnanca so znalosťou skladu a dobrou fyzickou zdatnosťou. Náplňou práce bude príjem a výdaj tovaru, evidencia zásob aj príprava objednávok. Oceníme zodpovedný prístup, samostatnosť a chuť podieľať sa na plynulom chode skladu.",
    manual:
      "Na pozíciu [position] hľadáme manuálne zručného a samostatného človeka s technickým myslením. Dôležitá je schopnosť práce podľa výkresov, kontrola kvality a dôsledné dodržiavanie pracovných postupov aj BOZP. Oceníme precíznosť, zodpovedný prístup a ochotu odvádzať kvalitnú prácu v každodennej prevádzke.",
    service:
      "Na pozíciu [position] hľadáme človeka s príjemným vystupovaním, rýchlosťou, spoľahlivosťou a dobrou komunikáciou so zákazníkmi. Náplňou práce bude obsluha zákazníkov, udržiavanie čistoty a riešenie požiadaviek hostí. Oceníme ochotu pracovať s ľuďmi, profesionálny prístup a snahu vytvárať príjemnú atmosféru.",
    retail:
      "Na pozíciu [position] hľadáme precízneho a ústretového zamestnanca so zameraním na zákaznícky servis a prácu s pokladňou. Vašou náplňou bude predaj tovaru, dopĺňanie regálov a riešenie reklamácií. Oceníme spoľahlivosť, príjemné vystupovanie a aktívny prístup k zákazníkom aj každodenným povinnostiam na predajni.",
    office:
      "Na pozíciu [position] hľadáme spoľahlivého a organizovaného človeka, ktorý ovláda prácu s MS Office a má dobré komunikačné schopnosti. Náplňou práce bude správa dokumentácie, administratíva a koordinácia úloh. Oceníme samostatnosť, precíznosť a schopnosť udržať poriadok v každodennej kancelárskej agende.",
    tech:
      "Na pozíciu [position] hľadáme systematického kolegu s analytickým myslením, schopnosťou práce s dátami a komunikáciou v tíme. Náplňou práce bude tvorba riešení, testovanie a dokumentácia. Oceníme precízny prístup, schopnosť hľadať súvislosti a chuť podieľať sa na kvalitnom technickom výstupe.",
    education:
      "Na pozíciu [position] hľadáme trpezlivého a komunikatívneho človeka, ktorý zvládne prípravu materiálov aj zodpovedný prístup k práci. Náplňou bude príprava výučby, hodnotenie študentov a spolupráca s rodičmi. Oceníme schopnosť odovzdávať informácie zrozumiteľne, empaticky a s dôrazom na individuálny prístup.",
    healthcare:
      "Na pozíciu [position] hľadáme precízneho a odolného človeka s empatiou a profesionálnym prístupom. Náplňou práce bude starostlivosť o klientov, vedenie dokumentácie a spolupráca s tímom. Oceníme zodpovednosť, schopnosť zvládať stresové situácie a úprimný záujem o kvalitnú a citlivú starostlivosť o druhých.",
    student:
      "Na pozíciu [position] hľadáme spoľahlivého a flexibilného človeka s ochotou učiť sa novým veciam. Náplňou práce bude výpomoc tímu, plnenie zadaných úloh a rýchla adaptácia na pracovné prostredie. Oceníme aktívny prístup, samostatnosť a chuť získať nové skúsenosti v praxi.",
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
  faqs: (name: string) => { question: string; answer: string }[];
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
    faqs: (name) => [
      {
        question: `Jak dlouhý má být životopis pro pozici ${name}?`,
        answer:
          `Ideální rozsah pro pozici ${name} je jedna až dvě strany A4. Absolventům stačí jedna strana pro rychlé skenování, zkušení profesionálové využijí dvě. Důležité je prioritizovat zkušenosti za posledních 15 let a starší uvádět jen heslovitě, aby dokument zůstal přehledný pro náboráře i systémy ATS.`,
      },
      {
        question: "Co musí obsahovat správně napsaný životopis?",
        answer:
          "Povinný základ tvoří kontaktní údaje, profesní shrnutí, praxe, vzdělání a dovednosti. Profesní shrnutí v úvodu slouží jako krátký „elevator pitch“ definující váš přínos. V sekci dovedností uvádějte konkrétní nástroje (např. SAP, Google Workspace) s úrovní pokročilosti, aby náborář ihned viděl vaši technickou zdatnost.",
      },
      {
        question: "Má být v životopise fotografie?",
        answer:
          "Fotografie není povinná, v Česku je však běžná pro lepší zapamatovatelnost. Musí být vždy profesionální (pasový formát), nikoliv momentka z dovolené. V zahraničí (USA, UK) se naopak nedoporučuje kvůli prevenci diskriminace. Často je lepší odkázat na profesionální portrét na LinkedInu.",
      },
      {
        question: "Jak napsat životopis bez praxe?",
        answer:
          "Zaměřte se na přenositelné dovednosti, stáže a dobrovolnictví, které náboráři uznávají jako plnohodnotnou praxi. Uveďte školní projekty, kde jste prokázali odpovědnost či vedení týmu. Zdůrazněte digitální gramotnost a certifikáty z kurzů, které dokládají vaši snahu o profesní růst i bez formální historie. Vzor najdete zde: /cs/profese/zivotopis-absolvent-bez-praxe.",
      },
      {
        question: "Jak upravit životopis podle konkrétní pracovní nabídky?",
        answer:
          "Přizpůsobení je klíčové pro průchod přes systémy ATS. Identifikujte klíčová slova v inzerátu a organicky je vložte do svého textu. Příkladem je zrcadlení odborných termínů (např. „Agile“) v profesním shrnutí. Personalizace ukazuje vaši motivaci a jasně propojuje vaše zkušenosti s potřebami konkrétního zaměstnavatele.",
      },
      {
        question: `Jak má vypadat životopis pro pozici ${name} v roce 2026?`,
        answer:
          `Moderní životopis pro pozici ${name} sází na minimalismus, bezpatková písma (Calibri, Aptos) a dostatek bílého místa. Musí být čitelný pro lidi i stroje. Místo frází uvádějte měřitelné výsledky (např. „úspora 15 % nákladů“). Nezapomeňte na funkční odkazy na LinkedIn či online portfolio pro hlubší vhled.`,
      },
    ],
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
    faqs: (name) => [
      {
        question: `Ako dlhý má byť životopis pre pozíciu ${name}?`,
        answer:
          `Ideálny rozsah pre pozíciu ${name} je jedna až dve strany A4. Absolventom stačí jedna strana pre rýchle skenovanie, skúsení profesionáli využijú dve. Dôležité je prioritizovať skúsenosti za posledných 15 rokov a staršie uvádzať len heslovito, aby dokument zostal prehľadný pre náborárov aj systémy ATS.`,
      },
      {
        question: "Čo musí obsahovať správne napísaný životopis?",
        answer:
          "Povinný základ tvoria kontaktné údaje, profesijné zhrnutie, prax, vzdelanie a zručnosti. Profesijné zhrnutie v úvode slúži ako krátky „elevator pitch“ definujúci váš prínos. V sekcii zručností uvádzajte konkrétne nástroje (napr. SAP, Google Workspace) s úrovňou pokročilosti, aby náborár hneď videl vašu technickú zdatnosť.",
      },
      {
        question: "Má byť v životopise fotografia?",
        answer:
          "Fotografia nie je povinná, na Slovensku je však bežná pre lepšiu zapamätateľnosť. Musí byť vždy profesionálna (pasový formát), nie momentka z dovolenky. V zahraničí (USA, UK) sa naopak neodporúča kvôli prevencii diskriminácie. Často je lepšie odkázať na profesionálny portrét na LinkedIne.",
      },
      {
        question: "Ako napísať životopis bez praxe?",
        answer:
          "Zamerajte sa na prenositeľné zručnosti, stáže a dobrovoľníctvo, ktoré náborári uznávajú ako plnohodnotnú prax. Uveďte školské projekty, kde ste preukázali zodpovednosť či vedenie tímu. Zdôraznite digitálnu gramotnosť a certifikáty z kurzov, ktoré dokladajú vašu snahu o profesijný rast aj bez formálnej histórie. Vzor nájdete tu: /sk/profese/zivotopis-absolvent-bez-praxe.",
      },
      {
        question: "Ako upraviť životopis podľa konkrétnej pracovnej ponuky?",
        answer:
          "Prispôsobenie je kľúčové pre priechod cez systémy ATS. Identifikujte kľúčové slová v inzeráte a organicky ich vložte do svojho textu. Príkladom je zrkadlenie odborných termínov (napr. „Agile“) v profesijnom zhrnutí. Personalizácia ukazuje vašu motiváciu a jasne prepája vaše skúsenosti s potrebami konkrétneho zamestnávateľa.",
      },
      {
        question: `Ako má vyzerať životopis pre pozíciu ${name} v roku 2026?`,
        answer:
          `Moderný životopis pre pozíciu ${name} stavia na minimalizme, bezpätkových písmach (Calibri, Aptos) a dostatku bieleho miesta. Musí byť čitateľný pre ľudí aj stroje. Namiesto fráz uvádzajte merateľné výsledky (napr. „úspora 15 % nákladov“). Nezabudnite na funkčné odkazy na LinkedIn či online portfólio pre hlbší vhľad.`,
      },
    ],
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
        : "Podrobný návod, [blog]ako napísať životopis[/blog], nájdete v našom blogu.";
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

  const defaultBodySections = [
    {
      heading: ui.sections.howTo,
      paragraphs:
        locale === "cs"
          ? [
              `Životopis pro pozici ${seed.name} by měl být jasný a věcný. Personalista chce rychle pochopit, co umíte a jaké výsledky můžete přinést.`,
              `Zaměřte se na konkrétní zkušenosti, které souvisí s náplní práce. Uveďte měřitelné výsledky, nástroje a procesy, se kterými pracujete.`,
              `Pokud s profesí začínáte, zdůrazněte praxi, brigády, kurzy nebo projekty. Důležitá je motivace a rychlá adaptace. Podrobný návod, [blog]jak napsat životopis[/blog], najdete v našem blogu.`,
            ]
          : [
              `Životopis pre pozíciu ${seed.name} má byť jasný a vecný. Personalista chce rýchlo pochopiť, čo viete a aké výsledky prinesiete.`,
              `Zamerajte sa na skúsenosti, ktoré súvisia s náplňou práce. Uveďte merateľné výsledky, nástroje a procesy, s ktorými pracujete.`,
              `Ak s profesiou začínate, zvýraznite prax, brigády, kurzy alebo projekty. Dôležitá je motivácia a rýchla adaptácia. Podrobný návod, [blog]ako napísať životopis[/blog], nájdete na našom blogu.`,
            ],
    },
    {
      heading: ui.sections.ats,
      paragraphs:
        locale === "cs"
          ? [
              "Personalisté často používají ATS (automatické systémy). Používejte proto stejné výrazy jako v inzerátu a nezakrývejte důležité informace do grafiky.",
              "Ideální je jednoduchá struktura, dobře čitelné nadpisy a standardní názvy sekcí (Zkušenosti, Vzdělání, Dovednosti).",
              "Níže je ukázka inzerátu s klíčovými výrazy, které se vyplatí použít i v životopise.",
            ]
          : [
              "Personalisti často používajú ATS (automatické systémy). Používajte preto rovnaké výrazy ako v inzeráte a neschovávajte dôležité informácie do grafiky.",
              "Ideálna je jednoduchá štruktúra, dobre čitateľné nadpisy a štandardné názvy sekcií (Skúsenosti, Vzdelanie, Zručnosti).",
              "Nižšie je ukážka inzerátu s kľúčovými výrazmi, ktoré sa oplatí použiť aj v životopise.",
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

  const bodySections = cvData.sections
    ? buildCzSectionsFromJson(cvData.sections)
    : defaultBodySections;

  const adExampleBase = AD_EXAMPLE_OVERRIDES[locale][seed.slug] ?? AD_EXAMPLE_BASE[locale];
  const adResponsibilities = responsibilities.slice(0, 4);
  const adRequirements = pickDeterministic(skills, 6, `${seed.slug}-requirements`);
  const jobAdIntroText = cvData.sections?.jobAdExample?.text?.trim();
  const adIntroText =
    jobAdIntroText && jobAdIntroText.length > 0
      ? jobAdIntroText
      : CATEGORY_INTRO[locale][seed.category].replace("[position]", seed.name);
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
    faqs: cvData.faq?.items ? cvData.faq.items : ui.faqs(seed.name),
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
