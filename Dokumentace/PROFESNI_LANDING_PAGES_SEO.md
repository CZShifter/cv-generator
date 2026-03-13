# Profesní landing pages (CZ/SK) – dokumentace

Datum: 2026-03-09

Tento dokument popisuje:
1) Jak fungují profesní landing pages (CZ/SK).
2) Jak přidat nové profese.
3) Jak je řešené SEO (schema, hreflang, canonical, sitemap).
4) Jak je řešené LLM (llms.txt).
5) Klíčové soubory a údržba.

---

## 1) Přehled funkcionality

Profesní stránky slouží jako pSEO landing pages pro long‑tail dotazy:
- `/cs/profese/zivotopis-skladnik`
- `/sk/profese/zivotopis-skladnik` (nebo lokalizované SK slugy viz níže)

Stránky obsahují:
- H1 s přesnou shodou (např. „Životopis pro pozici skladník“)
- úvod + unikátní větu pro každou profesi
- rychlé shrnutí (bullet list)
- sekce „Co má obsahovat“, „Typické úkoly“, „Doporučené dovednosti“
- preview CV (A4, responsivní)
- FAQ
- CTA blok ve stylu domovské stránky
- interní prolinkování (related)
- box „Příklad inzerátu“ s intro textem podle kategorie, plus Náplň práce / Požadujeme
- v běžném textu se zvýrazňuje (strong) slovo „životopis“ a název profese; **v nadpisech se strong nepoužívá**
- v H1 profesního rozcestníku se dynamicky používá aktuální rok (pro lepší SEO)

---

## 2) Jak přidat novou profesi

### Krok 1: přidat do datasetu profesí
Soubor:
- `src/data/professions.ts`

Najdi `BASE_PROFESSIONS` a přidej:
```
{ slug: "novy-slug", category: "manual" | "office" | ... , keywords: ["..."] }
```

Poznámky:
- `slug` je základní bez prefixu `zivotopis-`.
- `keywords` jsou CZ (pro SK se používají základní dovednosti).

### Krok 2: doplnit názvy (CZ/SK)
Ve stejném souboru:
- `NAMES.cs[slug] = "Název profese"`
- `NAMES.sk[slug] = "Názov profesie"`

### Krok 3: hotovo
Stránka se vygeneruje automaticky:
- `/cs/profese/zivotopis-novy-slug`
- `/sk/profese/zivotopis-novy-slug` (nebo lokalizovaný SK slug)

Sitemap se aktualizuje automaticky.

### Krok 4: doplnit data pro preview + typické úkoly
Nový systém **nebere data z kategorií**, ale z konkrétní profese.

Soubory:
- `src/data/cv-profese-data-cz.json`
- `src/data/cv-profese-data-sk.json`

Každý záznam musí mít:
- `slug` (shodný s `BASE_PROFESSIONS.slug`)
- `aboutMe` (male/female)
- `skills` (5 bodů)
- `workExperience` (3 pozice × 4 body)

Poznámky:
- CZ a SK soubor se párují **podle `slug`**, ne podle pořadí.
- Pokud se `slug` nezná, běží fallback na CZ data.

### Poznámka: inzerát a intro
U každé profese se generuje box „Příklad inzerátu“. Používá:
- intro z `CATEGORY_INTRO` (CZ/SK) – text se vkládá do boxu u inzerátu
- body „Náplň práce“ = **4 body** z dat profese (stejné jako v „Typické úkoly“)
- body „Požadujeme“ = **5 dovedností** z dat profese

Pokud chceš inzerát upravit ručně pro konkrétní profesi, použij:
- `AD_EXAMPLE_OVERRIDES` v `src/data/professions.ts`

---

## 3) Preview CV pro profese

Preview využívá tvoje existující CV šablony a sample data.

Soubory:
- `src/data/professionPreviewData.ts` (generátor dat)
- `src/data/cvProfessionData.ts` (mapování dat z JSON)
- `src/components/ProfessionCvPreview.tsx`
- `src/components/ProfessionPreviewFrame.tsx` (responsivní A4)

Chování:
- používá `sampleCvData.ts` / `sampleCvDataSK.ts` jako base
- data se upraví podle profese z JSON (CZ/SK)
- pracovní zkušenosti v preview berou **3 pozice × 4 body** z JSON
- automaticky se volí fotka:
  - ženské jméno → `/photo_img/photo.jpg`
  - mužské jméno → `/photo_img/photo2.jpg`
- vzdělání a certifikace se řídí **kategorií profese**
- kontakty (email/telefon/linkedin/web) se generují z vybraného jména
- **rameček je na `.resume`**, ne na `previewFrame`
- náhled se škáluje podle šířky (držení A4 poměru)
- **přepínání šablon**: deterministicky podle `slug` (50/50 mezi `cvtemplate` a `cvtemplate2`)
- `ProfessionCvPreview` páruje vždy **stejné `sections` + `styles`** dle `templateId` (žádné míchání šablon)
- **template2** v profesích má doplněné pravé‑sloupcové typografie v `Profession.module.scss` (bez zásahu do šablon)

Pokud chceš více variant, rozšiř `NAMES` (male/female jména a příjmení).
Pro jemné řízení ženského rodu slouží `FEMININE_SLUG_OVERRIDES`.

--- 

## 4) SEO (canonical, hreflang, schema)

### Head meta
Každá profesní stránka obsahuje:
- `<title>` + `meta description`
- `canonical`
- `hreflang` (CZ/SK + x-default)
- OG/Twitter meta
- `seznam-wmt` (ověření domény, CZ/SK tokeny v `_app.tsx`)

### Structured data
Na profesních stránkách:
- `WebPage`
- `BreadcrumbList`
- `FAQPage`
 - `Product` + `Offer` (cena z `src/config/site.ts`)
   - `image` (logo/OG)
   - `brand` jako `Brand` + `logo`
   - `shippingDetails` a `hasMerchantReturnPolicy` kvůli požadavkům GSC

Globálně v `_app.tsx`:
- `Organization`
- `WebSite`
 - `Product` (globální, včetně ceny a měny podle domény)
   - `image` (logo)
   - `brand` jako `Brand` + `logo`
   - `shippingDetails` a `hasMerchantReturnPolicy`

--- 

## 5) Sitemapy (index + profese)

Aktuální stav:
- `/sitemap.xml` → sitemap index
- `/sitemap-main.xml` → statické stránky + blog
- `/sitemap-profese.xml` → profesní stránky

Poznámky:
- `sitemap.xml` generuje odkazy podle aktuální domény (CZ vrací `.cz`, SK vrací `.sk`).
- Cache pro sitemapy a `robots.txt` je krátká (rychlá aktualizace), viz `next.config.ts`.
- Při přidání nové sitemap:
  - vytvoř nový `src/pages/sitemap-<název>.xml.ts`
  - přidej ji do `src/pages/sitemap.xml.ts` (index)
  - přidej krátkou cache hlavičku do `next.config.ts`
  - přidej výjimku do `src/middleware.ts` (aby nepřidával /cs nebo /sk)

Soubory:
- `src/pages/sitemap.xml.ts`
- `src/pages/sitemap-main.xml.ts`
- `src/pages/sitemap-profese.xml.ts`

Robots:
- `src/pages/robots.txt.ts` ukazuje na `/sitemap.xml`
- `robots.txt` se generuje podle aktuální domény (CZ i SK mají vlastní sitemap URL)

---

## 6) LLM podpora (ChatGPT / Gemini apod.)

V projektu jsou přidány:
- `/llms.txt`
- `/.well-known/llms.txt`
- `/humans.txt`

Soubory:
- `src/pages/llms.txt.ts`
- `src/pages/humans.txt.ts`

`llms.txt` obsahuje:
- popis webu
- hlavní sekce
- odkaz na sitemap podle aktuální domény (CZ/SK)
- poznámky o strukturách a preview

---

## 7) URL struktura (long‑tail)

Používá se:
```
/cs/profese/zivotopis-<slug>
/sk/profese/zivotopis-<slug>
```

Poznámka pro SK:
- Slovenské slugy mohou být **lokalizované** (např. `uklizecka` → `upratovacka`).
- Mapování je v `src/data/professions.ts` v objektu `SK_SLUGS`.
- Při přidání nové profese zvažte, zda má mít SK slug lokalizovaný (běžný slovenský výraz).

Aktuální lokalizované SK slugy:
- `ridic` → `vodic`
- `ridic-kamionu` → `vodic-kamionu`
- `kuryr` → `kurier`
- `montazni-pracovnik` → `montazny-pracovnik`
- `delnik` → `robotnik`
- `svarec` → `zvarac`
- `zednik` → `murar`
- `cisnik` → `casnik`
- `recepcni` → `recepcny`
- `uklizecka` → `upratovacka`
- `bezpecnostni-pracovnik` → `bezpecnostny-pracovnik`
- `prodavac` → `predavac`
- `prodavacka` → `predavacka`
- `pokladni` → `pokladnik`
- `administrativni-pracovnik` → `administrativny-pracovnik`
- `ucetni` → `uctovnik`
- `obchodni-zastupce` → `obchodny-zastupca`
- `mistr-vyroby` → `majster-vyroby`
- `tester-softwaru` → `tester-softveru`
- `ucitel-materske-skoly` → `ucitel-materskej-skoly`
- `lektor-jazyku` → `lektor-jazykov`
- `zdravotni-sestra` → `zdravotna-sestra`
- `pecovatelka` → `opatrovatelka`

Starý formát bez prefixu se přesměruje (301):
```
/cs/profese/<slug>  → /cs/profese/zivotopis-<slug>
/sk/profese/<slug>  → /sk/profese/zivotopis-<slug>
```

--- 

## 8) Klíčové soubory – rychlý seznam

Data:
- `src/data/professions.ts` (hlavní dataset)
- `CATEGORY_INTRO` (intro texty pro inzerát, CZ/SK)
- `AD_EXAMPLE_DATA` / `AD_EXAMPLE_OVERRIDES` (Příklad inzerátu)
- `src/data/cv-profese-data-cz.json` (preview + skills + about me, CZ)
- `src/data/cv-profese-data-sk.json` (preview + skills + about me, SK)
- `src/data/cvProfessionData.ts` (mapování přes slug)
- `src/data/professionPreviewData.ts`
- `src/data/sampleCvData.ts`
- `src/data/sampleCvDataSK.ts`

Stránky:
- `src/pages/cs/profese/[slug].tsx`
- `src/pages/sk/profese/[slug].tsx`
- `src/pages/cs/profese/index.tsx`
- `src/pages/sk/profese/index.tsx`

Styly:
- `src/scss/Profession.module.scss`
- `src/templates/CvTemplate.module.scss` (šablona 1, bez zásahů)
- `src/templates/CvTemplate2.module.scss` (šablona 2, bez zásahů)

Sitemapy a LLM:
- `src/pages/sitemap.xml.ts`
- `src/pages/sitemap-main.xml.ts`
- `src/pages/sitemap-profese.xml.ts`
- `src/pages/llms.txt.ts`
- `src/pages/.well-known/llms.txt.ts`
- `src/pages/humans.txt.ts`

---

## 9) Doporučení pro budoucí rozšíření

- Přidávat profese postupně (např. 20–50 měsíčně).
- Pro top profese přidat 2–3 unikátní věty ručně.
- Z blogu linkovat na profesní stránky (interní prolinkování).
- V GSC kontrolovat indexaci sitemap-profese.

---

## 10) Poznámka k výkonu

Stránky jsou staticky generované (SSG) přes `getStaticPaths` a `getStaticProps`.
To zajišťuje rychlé načítání, dobré CWV a stabilní SEO.

---

## 11) Rychlé shrnutí (anchor links)

Sekce „Rychlé shrnutí“ je nyní klikací a používá kotvy:
1. Stručný návod → `#how-to`
2. Dovednosti + úkoly → `#skills-tasks`
3. Ukázka životopisu → `#cv-preview`
4. Co personalisté ocení → `#highlight`
5. Nejčastější chyby → `#mistakes`

Semantika:
- Rychlé shrnutí je obalené v `<nav>` s `aria-label` (CZ/SK) pro lepší navigaci a přístupnost.

Vše se nastavuje v:
- `src/pages/cs/profese/[slug].tsx`
- `src/pages/sk/profese/[slug].tsx`

---

## 12) Rozložení sekcí (split + preview)

Nové rozložení:
- **Split 50/50**: vlevo „Příklad inzerátu“, vpravo „Co má obsahovat… / Typické úkoly… / Doporučené dovednosti“
- **Preview CV** je pod tím a má vlastní šířku (centrovaný max-width 794px)

Soubory:
- `src/pages/cs/profese/[slug].tsx`
- `src/pages/sk/profese/[slug].tsx`
- `src/scss/Profession.module.scss`

---

## 13) Přepínání šablon v profesích

Použité šablony:
- `cvtemplate`
- `cvtemplate2`

Výběr je **deterministický podle `slug`**:
```
hash(slug) % 2 === 0 → cvtemplate
hash(slug) % 2 === 1 → cvtemplate2
```

Poznámka k typům:
- `TemplateId` je širší (cvtemplate1–4), ale pro profesní preview se používá jen:
  - `PreviewTemplateId = "cvtemplate" | "cvtemplate2"`
  - `pickPreviewTemplateId()` vrací pouze tyto dvě hodnoty

Změny jsou pouze v profesních komponentách:
- `src/components/ProfessionCvPreview.tsx`
- `src/components/ProfessionPreviewFrame.tsx`

---

## 14) Izolace stylů šablony 2 v profesích

Šablony se **nemění**. V profesích se doplňuje pouze:
- pravý sloupec (`contact`, `educationEntry`, `languages` apod.)
- typografie a spacing pod `template2Preview` wrapperem

Soubor:
- `src/scss/Profession.module.scss`

---

## 15) Rychlé shrnutí – název

Nadpis rychlého shrnutí je:
- CZ: **Rychlé shrnutí (navigace)**
- SK: **Rýchle zhrnutie (navigácia)**

Soubory:
- `src/pages/cs/profese/[slug].tsx`
- `src/pages/sk/profese/[slug].tsx`

---

## 16) Nadpis preview

Nadpis nad náhledem CV:
- **Vzor životopisu pro pozici {název profese}**

Soubory:
- `src/pages/cs/profese/[slug].tsx`
- `src/pages/sk/profese/[slug].tsx`

---

## 17) Next/Image – lokální obrázky s query stringem

Používáme verzování přes query (např. `?v=05.10.25`).  
V Next.js je nutné mít povolené lokální patterny pro `/img/**`.

Nastavení:
- `next.config.ts`
```
images: {
  localPatterns: [
    { pathname: "/img/**" }
  ]
}
```

Poznámka:
- `localPatterns.search` se porovnává **na přesnou shodu**, ne jako wildcard.
- Proto ho **nepoužívat** a nechat jen `pathname`.

---

## 18) Share box u inzerátu (CZ/SK)

Ve sloupci s inzerátem je pod boxem „Příklad inzerátu“ vložen share box s ikonami pro sdílení profese:
- Facebook, X, WhatsApp, Telegram, Reddit
- text: **„Sdílejte rady & tipy s ostatními“**
- klikání přes ikonky

Responzivní chování:
- **>= 900px:** share box je pod inzerátem (levý sloupec)
- **< 900px:** share box se přesune **nad náhled životopisu**

Styly:
- ikony 28px, X a WhatsApp 24px
- kruhový background 42px
- ikonky `space-between`
- nadpis 20px, centrovaný, margin-bottom 16px

Soubory:
- `src/pages/cs/profese/[slug].tsx`
- `src/pages/sk/profese/[slug].tsx`
- `src/scss/Profession.module.scss`

