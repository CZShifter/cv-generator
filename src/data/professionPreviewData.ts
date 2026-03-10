import { CvData } from "./CvData";
import { SAMPLE_CV_DATA as SAMPLE_CV_DATA_CZ } from "./sampleCvData";
import { SAMPLE_CV_DATA as SAMPLE_CV_DATA_SK } from "./sampleCvDataSK";
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

const RESULT_POINTS_BY_CATEGORY: Record<Locale, Record<string, string[]>> = {
  cs: {
    logistics: [
      "Zrychlení vychystávání objednávek díky lepší organizaci práce.",
      "Snížení chybovosti při expedici díky pečlivé kontrole.",
      "Přesnější evidence zásob a rychlejší dohledání položek.",
      "Zlepšení plynulosti příjmu a výdeje zboží během směn.",
      "Lepší využití skladového prostoru díky přehlednému uspořádání.",
      "Rychlejší předání směny díky jasným zápisům.",
    ],
    manual: [
      "Nižší zmetkovitost díky důsledné kontrole kvality.",
      "Dodržení termínů zakázek díky dobrému plánování práce.",
      "Zrychlení montážních kroků díky optimalizaci postupu.",
      "Bezpečný provoz díky striktnímu dodržování BOZP.",
      "Lepší návaznost prací díky průběžné kontrole kroků.",
      "Přesné dodržení technických výkresů bez reklamací.",
    ],
    service: [
      "Vyšší spokojenost hostů díky rychlé a profesionální obsluze.",
      "Zkrácení čekání hostů díky dobré koordinaci v týmu.",
      "Udržení čistoty pracovního prostoru podle standardů provozu.",
      "Plynulý servis i ve špičce díky efektivnímu tempu práce.",
      "Vyšší průměrná útrata hostů díky doporučení menu.",
      "Kladná zpětná vazba hostů díky vstřícnému přístupu.",
    ],
    retail: [
      "Vyšší dostupnost zboží díky pravidelnému doplňování.",
      "Rychlé vyřízení reklamací a spokojenější zákazníci.",
      "Přehlednější uspořádání regálů a lepší orientace zákazníků.",
      "Stabilní úroveň prodeje díky aktivnímu přístupu k zákazníkům.",
      "Menší ztráty díky pečlivé kontrole zboží na skladě.",
      "Lepší prezentace akcí a zvýšení prodeje vybraných položek.",
    ],
    office: [
      "Zkrácení doby zpracování dokumentů díky lepší organizaci.",
      "Přehlednější evidence a rychlejší dohledávání podkladů.",
      "Snížení chybovosti v administrativě díky pečlivé kontrole.",
      "Efektivnější komunikace s klienty a interními týmy.",
      "Lepší průchodnost schvalování díky jasným podkladům.",
      "Rychlejší vyřízení požadavků díky prioritizaci úkolů.",
    ],
    tech: [
      "Zrychlení dodání funkcí díky lepší dokumentaci.",
      "Snížení počtu chyb díky testování a pečlivé kontrole.",
      "Zjednodušení procesů díky automatizaci opakovaných kroků.",
      "Rychlejší řešení incidentů díky jasným postupům.",
      "Stabilnější provoz díky průběžnému monitoringu.",
      "Lepší srozumitelnost systému díky aktualizované dokumentaci.",
    ],
    education: [
      "Srozumitelná výuka díky dobře připraveným materiálům.",
      "Vyšší zapojení studentů díky aktivnímu přístupu.",
      "Jasná zpětná vazba a individuální podpora studentů.",
      "Plynulý průběh výuky díky dobré organizaci hodin.",
      "Lepší výsledky studentů díky pravidelnému procvičování.",
      "Pozitivní atmosféra ve třídě díky otevřené komunikaci.",
    ],
    healthcare: [
      "Pečlivé vedení dokumentace a přesné zápisy.",
      "Citlivý přístup ke klientům a zvýšení jejich komfortu.",
      "Plynulá spolupráce s týmem a rychlá reakce na potřeby.",
      "Zvládání náročných situací s klidem a profesionalitou.",
      "Zvýšení spokojenosti klientů díky individuálnímu přístupu.",
      "Včasné řešení požadavků díky dobré organizaci péče.",
    ],
    student: [
      "Rychlá adaptace na pracovní prostředí a nové úkoly.",
      "Spolehlivá podpora týmu při každodenním provozu.",
      "Flexibilní výpomoc podle aktuálních potřeb.",
      "Samostatné plnění úkolů se smyslem pro detail.",
      "Rychlé zaučení díky proaktivnímu přístupu.",
      "Ochota převzít nové úkoly i mimo vlastní agendu.",
    ],
  },
  sk: {
    logistics: [
      "Rýchlejšie vychystávanie objednávok vďaka lepšej organizácii práce.",
      "Zníženie chybovosti pri expedícii vďaka dôslednej kontrole.",
      "Presnejšia evidencia zásob a rýchlejšie dohľadanie položiek.",
      "Zlepšenie plynulosti príjmu a výdaja tovaru počas zmien.",
      "Lepšie využitie skladového priestoru vďaka prehľadnému usporiadaniu.",
      "Rýchlejšie odovzdanie smeny vďaka jasným zápisom.",
    ],
    manual: [
      "Nižšia chybovosť vďaka dôslednej kontrole kvality.",
      "Dodržanie termínov zákaziek vďaka dobrému plánovaniu práce.",
      "Zrýchlenie montážnych krokov vďaka optimalizácii postupu.",
      "Bezpečná prevádzka vďaka striktnému dodržiavaniu BOZP.",
      "Lepšia nadväznosť prác vďaka priebežnej kontrole krokov.",
      "Presné dodržanie technických výkresov bez reklamácií.",
    ],
    service: [
      "Vyššia spokojnosť hostí vďaka rýchlej a profesionálnej obsluhe.",
      "Skrátenie čakania hostí vďaka dobrej koordinácii v tíme.",
      "Udržiavanie čistoty pracovného priestoru podľa štandardov prevádzky.",
      "Plynulý servis aj v špičke vďaka efektívnemu tempu práce.",
      "Vyššia priemerná útrata hostí vďaka odporúčaniu menu.",
      "Pozitívna spätná väzba hostí vďaka ústretovému prístupu.",
    ],
    retail: [
      "Vyššia dostupnosť tovaru vďaka pravidelnému dopĺňaniu.",
      "Rýchle vybavenie reklamácií a spokojnejší zákazníci.",
      "Prehľadnejšie usporiadanie regálov a lepšia orientácia zákazníkov.",
      "Stabilná úroveň predaja vďaka aktívnemu prístupu k zákazníkom.",
      "Nižšie straty vďaka dôslednej kontrole tovaru na sklade.",
      "Lepšia prezentácia akcií a zvýšenie predaja vybraných položiek.",
    ],
    office: [
      "Skrátenie času spracovania dokumentov vďaka lepšej organizácii.",
      "Prehľadnejšia evidencia a rýchlejšie dohľadanie podkladov.",
      "Zníženie chybovosti v administratíve vďaka dôslednej kontrole.",
      "Efektívnejšia komunikácia s klientmi a internými tímami.",
      "Lepšia priechodnosť schvaľovania vďaka jasným podkladom.",
      "Rýchlejšie vybavenie požiadaviek vďaka prioritizácii úloh.",
    ],
    tech: [
      "Rýchlejšie dodanie funkcií vďaka lepšej dokumentácii.",
      "Zníženie počtu chýb vďaka testovaniu a dôslednej kontrole.",
      "Zjednodušenie procesov vďaka automatizácii opakovaných krokov.",
      "Rýchlejšie riešenie incidentov vďaka jasným postupom.",
      "Stabilnejšia prevádzka vďaka priebežnému monitoringu.",
      "Lepšia zrozumiteľnosť systému vďaka aktualizovanej dokumentácii.",
    ],
    education: [
      "Zrozumiteľná výučba vďaka dobre pripraveným materiálom.",
      "Vyššie zapojenie študentov vďaka aktívnemu prístupu.",
      "Jasná spätná väzba a individuálna podpora študentov.",
      "Plynulý priebeh výučby vďaka dobrej organizácii hodín.",
      "Lepšie výsledky študentov vďaka pravidelnému precvičovaniu.",
      "Pozitívna atmosféra v triede vďaka otvorenej komunikácii.",
    ],
    healthcare: [
      "Dôsledné vedenie dokumentácie a presné záznamy.",
      "Citlivý prístup ku klientom a zvýšenie ich komfortu.",
      "Plynulá spolupráca s tímom a rýchla reakcia na potreby.",
      "Zvládanie náročných situácií s pokojom a profesionalitou.",
      "Zvýšenie spokojnosti klientov vďaka individuálnemu prístupu.",
      "Včasné riešenie požiadaviek vďaka dobrej organizácii starostlivosti.",
    ],
    student: [
      "Rýchla adaptácia na pracovné prostredie a nové úlohy.",
      "Spoľahlivá podpora tímu pri každodennej prevádzke.",
      "Flexibilná výpomoc podľa aktuálnych potrieb.",
      "Samostatné plnenie úloh so zmyslom pre detail.",
      "Rýchle zaučenie vďaka proaktívnemu prístupu.",
      "Ochota prevziať nové úlohy aj mimo vlastnej agendy.",
    ],
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

function pickFromList<T>(list: T[], count: number, seed: string): T[] {
  if (!list.length) return [];
  const start = hashOf(seed) % list.length;
  const result: T[] = [];
  for (let i = 0; i < Math.min(count, list.length); i++) {
    result.push(list[(start + i) % list.length]);
  }
  return result;
}

function isFeminineSlug(slug: string) {
  if (FEMININE_SLUG_OVERRIDES.has(slug)) return true;
  return /(ka|čka|čka|čka|ice|yňa|yne|yně|arka|arka|orka)$/.test(slug);
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
  const responsibilities = content.responsibilities.slice(0, 4);
  const skills = content.skills.slice(0, 8);
  const resultPool =
    RESULT_POINTS_BY_CATEGORY[locale][content.category] || RESULT_POINTS_BY_CATEGORY[locale].office;

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
  data.summary =
    locale === "cs"
      ? `${isFemale ? "Spolehlivá" : "Spolehlivý"} ${role.toLowerCase()} se zaměřením na ${responsibilities[0] ?? "kvalitní práci"}, ${responsibilities[1] ?? "preciznost"} a ${responsibilities[2] ?? "spolupráci"}.
Pečlivě dbám na výsledky, rychlou adaptaci a férovou komunikaci.`
      : `${isFemale ? "Spoľahlivá" : "Spoľahlivý"} ${role.toLowerCase()} so zameraním na ${responsibilities[0] ?? "kvalitnú prácu"}, ${responsibilities[1] ?? "precíznosť"} a ${responsibilities[2] ?? "spoluprácu"}.
Dbám na výsledky, rýchlu adaptáciu a férovú komunikáciu.`;

  data.experience = [
    {
      position: role,
      company: companies[0],
      date_od: "2021",
      date_do: locale === "cs" ? "současnost" : "súčasnosť",
      points: [
        ...responsibilities.slice(0, 2).map((item) => `${capitalize(item)}.`),
        ...pickFromList(resultPool, 2, `${content.slug}-res-a`),
      ],
    },
    {
      position: role,
      company: companies[1],
      date_od: "2018",
      date_do: "2021",
      points: [
        ...responsibilities.slice(2, 4).map((item) => `${capitalize(item)}.`),
        ...pickFromList(resultPool, 2, `${content.slug}-res-b`),
      ],
    },
    {
      position: role,
      company: companies[2] ?? companies[1],
      date_od: "2016",
      date_do: "2018",
      points: [
        ...responsibilities.slice(0, 1).map((item) => `${capitalize(item)}.`),
        ...pickFromList(resultPool, 3, `${content.slug}-res-c`),
      ],
    },
  ];

  return data;
}
