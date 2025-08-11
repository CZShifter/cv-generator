// src/data/sampleCvData.ts
import { CvData } from "./CvData";

export const SAMPLE_CV_DATA: Record<string, CvData> = {
  cvtemplate: {
  name: "Ing. Eliška",
  surname: "Hrabalová",
  title: "Frontend vývojářka",
  phone: "+420 723 456 789",
  email: "eliska.hrabalova@email.cz",
  location: "Praha, Česká republika",
  linkedin: "eliska.hrabalova",
  birthyear: "1995",
  web: "www.mujweb.cz",
  photo: "/photo_img/photo.jpg", // obrázek vlož do složky /public
  showPhoto: true,
  photoVersion: 0,               // ← PŘIDAT
  showSummary: true,
  showLinkedin: true,
  showCertifications: true,
  showTitle: true,
  showBirthyear: true,
  showWeb: true,
  education: [
    { level: "Inženýrka", field: "Softwarové inženýrství", school: "České vysoké učení technické v Praze", year: "2021" },
    { level: "Bakalářka", field: "Informatika", school: "Univerzita Karlova, Fakulta matematiky a fyziky", year: "2018" },
  ],
  certifications: [
    { name: "React Developer Certificate", place: "Czechitas", year: "2020" },
    { name: "Frontend Bootcamp", place: "ITnetwork.cz", year: "2019" },
  ],
  language: [
    { name: "Český jazyk", level: "Rodilý mluvčí",},
    { name: "Anglický jazyk", level: "C1",},
  ],
  skills: [
    "Analytické myšlení",
    "Týmová spolupráce",
    "Organizační schopnosti",
    "Strategické plánování",
    "Výborné komunikační dovednosti",
    "Schopnost pracovat pod tlakem",
  ],
  summary:
    "Zkušená frontend vývojářka se zaměřením na vytváření elegantních, přístupných a responzivních webových rozhraní. Pomáhám firmám růst skrze kvalitní uživatelský zážitek. Pracuji efektivně a s důrazem na detail i použitelnost. Mým cílem je neustále se zlepšovat a přinášet hodnotu uživatelům i týmům, se kterými spolupracuji.",
  experience: [
    {
      position: "Senior frontend vývojářka",
      company: "Seznam.cz",
      date_od: "2021",
      date_do: "současnost",
      points: [
        "Vedení týmu 4 vývojářů při redesignu hlavní stránky",
        "Zvýšení rychlosti načítání komponent o 40 %",
        "Úzká spolupráce s UX/UI týmem na optimalizaci použitelnosti",
      ],
    },
    {
      position: "Frontend vývojářka",
      company: "Ackee",
      date_od: "2019",
      date_do: "2021",
      points: [
        "Vývoj komponent v Reactu pro klienty z veřejného i soukromého sektoru",
        "Zavedení TypeScriptu do frontendového stacku",
        "Správa legacy kódu a jeho refaktoring",
      ],
    },
    {
      position: "Junior vývojářka",
      company: "Webkomplet s.r.o.",
      date_od: "2018",
      date_do: "2019",
      points: [
        "Vývoj menších webových aplikací pro klienty",
        "Zkušenosti s HTML, CSS, JavaScript a jQuery",
        "Úpravy šablon a základní práce s CMS WordPress",
      ],
    },
    {
      position: "Frontend vývojářka",
      company: "Cleevio",
      date_od: "2016",
      date_do: "2018",
      points: [
        "Spolupráce na vývoji mobilních i webových aplikací pro klienty jako T-Mobile nebo Mall.cz",
        "Implementace responzivního designu pomocí CSS preprocesorů (SASS, LESS)",
        "Zodpovědnost za napojení frontendových komponent na REST API",
        "Spolupráce s projektovým manažerem na odhadech časové náročnosti úkolů",
        "Zavedení základních unit testů pomocí Jest a Cypress",
        ],
      },
    ],
  },

  cvtemplate2: {
  name: "Mgr. Petr",
  surname: "Svoboda",
  title: "Manažer prodeje",
  phone: "+420 777 123 456",
  email: "petr.svoboda@email.cz",
  location: "Brno, Česká republika",
  linkedin: "petr.svoboda",
  birthyear: "1986",
  web: "www.mujweb.cz",
  photo: "/photo_img/photo2.jpg", // obrázek vlož do složky /public
  showPhoto: true,
  photoVersion: 0,
  showSummary: true,
  showLinkedin: true,
  showCertifications: true, // Pro manažera prodeje jsou certifikace relevantní
  showTitle: true,
  showBirthyear: true,
  showWeb: true,
  education: [
    { level: "Magisterské studium", field: "Ekonomie a management", school: "Vysoká škola ekonomická v Praze", year: "2010" },
    { level: "Bakalářské studium", field: "Podniková ekonomika a management", school: "Masarykova univerzita v Brně", year: "2007" },
  ],
  certifications: [
    { name: "Certified Sales Manager", place: "Professional Sales Academy", year: "2019" },
    { name: "Projektové řízení (PRINCE2 Foundation)", place: "Akademie Projektového Řízení", year: "2017" },
  ],
  language: [
    { name: "Český jazyk", level: "Rodilý mluvčí" },
    { name: "Anglický jazyk", level: "C1" },
    { name: "Německý jazyk", level: "B2" },
  ],
  skills: [
    "Vedení prodejního týmu",
    "Strategické plánování prodeje",
    "Rozvoj obchodních vztahů",
    "Analýza trhu a konkurence",
    "Vyjednávací dovednosti",
    "Prezentační dovednosti",
  ],
  summary:
    "Zkušený a výsledkově orientovaný manažer prodeje s prokázanou schopností budovat a vést úspěšné prodejní týmy. Specializuji se na rozvoj obchodních strategií, zvyšování tržního podílu a dosahování stanovených cílů.",
  experience: [
    {
      position: "Manažer prodeje",
      company: "Alza.cz a.s.",
      date_od: "2018",
      date_do: "současnost",
      points: [
        "Vedení a mentoring týmu 10 obchodních zástupců, zvýšení prodejních výsledků o 15 % meziročně.",
        "Zodpovědnost za strategické plánování prodeje a rozvoj nových obchodních příležitostí.",
        "Dohled nad klíčovými zákaznickými účty a budování dlouhodobých obchodních vztahů.",
        "Implementace a optimalizace CRM systému Salesforce pro efektivnější správu obchodních procesů.",
      ],
    },
    {
      position: "Obchodní ředitel (divize B2B)",
      company: "Datart International, a.s.",
      date_od: "2015",
      date_do: "2018",
      points: [
        "Kompletní řízení B2B prodejní divize, včetně nastavení prodejních cílů a strategií.",
        "Nábor a školení obchodníků, budování a vedení vysoce výkonného týmu.",
        "Rozšíření portfolia firemních zákazníků o 25 % během dvou let.",
        "Vyjednávání klíčových smluv a partnerství s velkými korporacemi.",
        "Pravidelné reportování prodejních výsledků a analýza výkonnosti.",
      ],
    },
    {
      position: "Regionální prodejní manažer",
      company: "Vodafone Czech Republic a.s.",
      date_od: "2011",
      date_do: "2015",
      points: [
        "Správa a rozvoj prodejní sítě v daném regionu, včetně řízení poboček a externích partnerů.",
        "Dohled nad plněním prodejních plánů a motivačních programů pro zaměstnance.",
        "Realizace marketingových kampaní v regionu a podpora prodejních aktivit.",
        "Školení prodejních týmů v oblasti produktů a prodejních technik.",
      ],
    },
    ],
  },

  cvtemplate3: {
  name: "Tereza",
  surname: "Nováková",
  title: "Asistentka ředitele",
  phone: "+420 603 987 123",
  email: "tereza.novakova@email.cz",
  location: "Praha, Česká republika",
  linkedin: "tereza.novakova",
  birthyear: "1998",
  web: "www.mujweb.cz",
  photo: "/photo_img/photo8.jpg", // obrázek vlož do složky /public
  showPhoto: true,
  photoVersion: 0,
  showSummary: true,
  showLinkedin: true,
  showCertifications: true,
  showTitle: true,
  showBirthyear: true,
  showWeb: true,
  education: [
    { level: "Středoškolské vzdělání s maturitou", field: "Ekonomické lyceum", school: "Obchodní akademie Vinohradská", year: "2018" },
  ],
  certifications: [
    { name: "Kurz pokročilé práce s MS Office (Word, Excel, PowerPoint)", place: "NICOM, a.s.", year: "2020" },
    { name: "Základy účetnictví", place: "Rekvalifikační centrum Praha", year: "2019" },
  ],
  language: [
    { name: "Český jazyk", level: "Rodilý mluvčí" },
    { name: "Anglický jazyk", level: "B2" },
  ],
  skills: [
    "Organizační schopnosti",
    "Komunikační dovednosti",
    "Administrativní podpora",
    "Práce s MS Office (Word, Excel, PowerPoint, Outlook)",
    "Time management",
    "Řízení kalendáře",
    "Zpracování dokumentů",
    "Diskrétnost",
  ],
  summary:
    "Proaktivní a spolehlivá asistentka s praxí v administrativní podpoře a organizaci kanceláře. Mám vynikající komunikační a organizační dovednosti a jsem zvyklá pracovat s důrazem na detail a efektivitu. Hledám pozici, kde budu moci uplatnit své zkušenosti a přispět k hladkému chodu kanceláře.",
  experience: [
    {
      position: "Asistentka ředitele",
      company: "Advokátní kancelář Horák & Partneři",
      date_od: "2021",
      date_do: "současnost",
      points: [
        "Komplexní administrativní podpora pro 3 partnery advokátní kanceláře.",
        "Správa diářů, organizace schůzek a cestovních plánů.",
        "Příprava a formátování právních dokumentů a korespondence.",
        "Komunikace s klienty a obchodními partnery (telefonická i písemná).",
        "Zodpovědnost za správu kancelářských potřeb a vybavení.",
      ],
    },
    {
      position: "Administrativní asistentka",
      company: "ABC Consulting s.r.o.",
      date_od: "2018",
      date_do: "2021",
      points: [
        "Vedení a správa firemní korespondence a databáze kontaktů.",
        "Zajišťování chodu recepce a přijímání návštěv.",
        "Příprava podkladů pro jednání a firemní prezentace.",
        "Pomoc s organizací firemních akcí a školení.",
        "Základní účetní operace a fakturace.",
      ],
    },
    {
      position: "Brigádník - kancelářská výpomoc",
      company: "Městský úřad Praha 1",
      date_od: "2017",
      date_do: "2018",
      points: [
        "Archivace dokumentů a správa databáze.",
        "Roznáška interní pošty a vyřizování drobných pochůzek.",
        "Kopírování a skenování dokumentů.",
        "Zajišťování drobných administrativních úkolů dle potřeby.",
      ],
    },
    ],
  },

  cvtemplate4: {
  name: "Jan",
  surname: "Novák",
  title: "Prodavač",
  phone: "+420 605 987 654",
  email: "jan.novak@email.cz",
  location: "Praha, Česká republika",
  linkedin: "jan.novak",
  birthyear: "1994",
  web: "www.mujweb.cz",
  photo: "/photo_img/photo4.jpg", // obrázek vlož do složky /public
  showPhoto: true,
  photoVersion: 0,
  showSummary: true,
  showLinkedin: true,
  showCertifications: false,
  showTitle: true,
  showBirthyear: true,
  showWeb: true,
  education: [
    { level: "Středoškolské vzdělání s maturitou", field: "Obchodní akademie", school: "Obchodní akademie Vinohradská", year: "2015" },
  ],
  certifications: [
   
  ],
  language: [
    { name: "Český jazyk", level: "Rodilý mluvčí" },
    { name: "Anglický jazyk", level: "B1" },
  ],
  skills: [
    "Výborné komunikační dovednosti",
    "Zákaznický servis",
    "Prodejní dovednosti",
    "Práce s pokladním systémem",
    "Týmová spolupráce",
    "Organizační schopnosti",
    "Řešení problémů",
    "Proaktivní přístup",
  ],
  summary:
    "Zkušený a motivovaný prodavač s praxí v maloobchodním prostředí. Orientuji se na zákazníka a jeho spokojenost, efektivně komunikuji a aktivně přispívám k plnění prodejních cílů. Mám proaktivní přístup k práci a jsem připraven okamžitě se zapojit do dynamického týmu.",
  experience: [
    {
      position: "Prodavač / Pokladní",
      company: "Electro World",
      date_od: "2018",
      date_do: "současnost",
      points: [
        "Aktivní prodej elektrotechniky a poradenství zákazníkům",
        "Obsluha pokladního systému a provádění transakcí",
        "Doplňování zboží a udržování pořádku na prodejně",
        "Řešení reklamací a stížností zákazníků",
        "Školení nových kolegů",
      ],
    },
    {
      position: "Asistent prodeje",
      company: "Sportisimo",
      date_od: "2015",
      date_do: "2018",
      points: [
        "Pomoc zákazníkům s výběrem sportovního vybavení",
        "Aranžování a vystavování zboží",
        "Inventura a kontrola skladových zásob",
        "Asistence při otevírání a zavírání prodejny",
      ],
    },
    {
      position: "Brigádník - doplnění zboží",
      company: "Supermarket Tesco",
      date_od: "2014",
      date_do: "2015",
      points: [
        "Doplňování zboží do regálů a udržování prezentace prodejny",
        "Kontrola data spotřeby a správné rotace zboží",
        "Asistence zákazníkům s nalezením produktů",
        "Příprava zboží k expedici",
      ],
    },
    {
      position: "Prodejní asistent",
      company: "Odeon - knihkupectví",
      date_od: "2013",
      date_do: "2014",
      points: [
        "Poradenství zákazníkům při výběru knih a doplňkového sortimentu.",
        "Obsluha zákazníků u pokladny a balení zakoupeného zboží.",
        "Doplňování a aranžování knih v prodejně dle žánrů a akčních nabídek.",
        "Pomoc při organizaci autogramiád a propagačních akcí.",
        ],
      },
    ],
  },

  // Přidej podobně cvtemplate3 a cvtemplate4 podle potřeby
};
