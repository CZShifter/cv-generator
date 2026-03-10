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

### Poznámka: inzerát a intro
U každé profese se generuje box „Příklad inzerátu“. Používá:
- intro z `CATEGORY_INTRO` (CZ/SK) – text se vkládá do boxu u inzerátu
- body „Náplň práce“ a „Požadujeme“ z defaultních dovedností a úkolů (kategorie + klíčová slova profese)

Pokud chceš inzerát upravit ručně pro konkrétní profesi, použij:
- `AD_EXAMPLE_OVERRIDES` v `src/data/professions.ts`

---

## 3) Preview CV pro profese

Preview využívá tvoje existující CV šablony a sample data.

Soubory:
- `src/data/professionPreviewData.ts` (generátor dat)
- `src/components/ProfessionCvPreview.tsx`
- `src/components/ProfessionPreviewFrame.tsx` (responsivní A4)

Chování:
- používá `sampleCvData.ts` / `sampleCvDataSK.ts` jako base
- data se upraví podle profese (dovednosti, náplň práce)
- pracovní zkušenosti obsahují kombinaci:
  - 2× bod z „náplně práce“ (responsibilities)
  - 2× bod s výsledkem/dopadem (podle kategorie)
- automaticky se volí fotka:
  - ženské jméno → `/photo_img/photo.jpg`
  - mužské jméno → `/photo_img/photo2.jpg`
- vzdělání a certifikace se řídí **kategorií profese**
- kontakty (email/telefon/linkedin/web) se generují z vybraného jména

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

