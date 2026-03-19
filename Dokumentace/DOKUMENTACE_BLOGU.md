# Dokumentace blogu (MDX)

Tato dokumentace popisuje, jak funguje blog, jak jsou posty načítány, jaké používáme komponenty a kde upravovat SEO, sitemapu a vzhled. Cílem je, aby šlo blog dlouhodobě udržovat bez dohledávání v kódu.

---

## Struktura blogu

Blog má dvě jazykové mutace:
- `cs` – české články
- `sk` – slovenské články

Obsah je uložen v:
- `src/content/cs/blog`
- `src/content/sk/blog`

Každý článek může být:
- `.md` (starší Markdown)
- `.mdx` (preferovaná nová forma – Markdown + React)

Blog automaticky podporuje **oba formáty**.

**Aktuálně:** podporujeme pouze `.mdx` (fallback na `.md` byl odstraněn).

---

## Frontmatter (metadata)

Každý článek musí mít frontmatter (hlavičku) ve formátu:

```md
---
title: "Název článku"
date: "14.03.2026"
description: "Krátký popis článku (používá se i v kartách a SEO)."
coverImage: "/img/blog/obrazek.jpg"
coverImageWebp: "/img/blog/obrazek.webp"
author: "JanCV"
pairId: "post-0008"
---
```

**Poznámky:**
- `title` + `description` se propisují do SEO metadat a do schématu `BlogPosting`.
- `coverImage` se používá v detailu i v listingu.
- `pairId` slouží k propojení CZ a SK verze (hreflang, sitemap).

---

## Renderování článku (detail)

Detail článku je renderován přes:
- `src/pages/cs/blog/[slug].tsx`
- `src/pages/sk/blog/[slug].tsx`

Logika:
1. Zjistí se, jestli existuje `.mdx`, jinak se použije `.md`.
2. Pokud je `.mdx`, vykreslí se přes `next-mdx-remote`.
3. Pokud je `.md`, vykreslí se přes `react-markdown`.

Zpětná kompatibilita je zachována.

**Aktuálně:** renderujeme pouze `.mdx` přes `next-mdx-remote` a používáme:
- `serialize(content, { blockJS: false, blockDangerousJS: true })`
  - umožní props/JS výrazy v MDX (např. `items={[...]}`)
  - zároveň blokuje nebezpečné JS

---

## Sdílení článku (share ikonky)

Sdílecí box je nyní samostatná komponenta:
- `src/components/blog/BlogShareBox.tsx`

Použití:
- Vkládá se **hned pod cover image** a je v **jednom řádku** s metadaty (autor + datum).
- Zarovnání je `space-between`, share box je vpravo, a při nedostatku místa se může zalomit pod metadata.
- Sdílí se: Facebook, X, WhatsApp, Telegram, LinkedIn.

Styly:
- `src/scss/BlogPost.module.scss`
  - `.blogMetaRow`
  - `.blogShareBox`
  - `.blogShareLinks`
  - `.blogShareLink`
  - `.blogShareXIcon` (speciální velikost pro X)

---
## Komponenty pro MDX (sjednocený vzhled)

Komponenty jsou definované v:
- `src/components/blog/BlogMdxComponents.tsx`

Aktuálně dostupné komponenty:
- `Perex` – úvodní perex (větší font, tučné)
- `TwoThirds` – dvousloupcový layout s obrázkem (vlevo/vpravo)
- `DressBox` – stylizovaný box „Co si obléct?“
- `QuoteBox` – jednosloupcový box s uvozovkami a label (např. „Příklad:“)
- `SummaryNav` – box „Rychlé shrnutí (navigace)“ se skoky na sekce
- `Faq` – FAQ accordion
- `AfterGrid` – dvousloupcová sekce pod závěrem
- `AfterCol` – sloupec do `AfterGrid`
- `RelatedList` – seznam souvisejících článků s obrázkem + title + description
- `BlogCta` – CTA blok použitý místo starého tlačítka
- `TextLink` – stylovaný inline link (nahrazuje `className="textLink"`)
- `TextBlock` – obal pro delší blok textu (nahrazuje `className="text2"`)

Tyto komponenty **sjednocují vzhled** článků a umožňují psát nové články bez inline stylů.

Příklad použití v MDX:

```mdx
<Perex>Krátký úvodní text…</Perex>

<SummaryNav
  title="Rychlé shrnutí (navigace)"
  items={[
    { href: "#krok-1", label: "Co má být v životopisu vidět na první pohled" },
    { href: "#krok-2", label: "Jak psát text, aby personalista četl dál" }
  ]}
/>

<TwoThirds position="left" imageJpg="/img/blog/1.jpg" imageWebp="/img/blog/1.webp" alt="Popisek">
  <p>Obsah textu…</p>
</TwoThirds>

<QuoteBox label="Příklad:">Krátký ukázkový text…</QuoteBox>

<Faq
  title="Rychlé FAQ"
  items={[
    { question: "Otázka 1", answer: <p>Odpověď…</p> },
    { question: "Otázka 2", answer: <p>Odpověď…</p> }
  ]} />

<AfterGrid>
  <AfterCol>
    <Faq ... />
  </AfterCol>
  <AfterCol>
    <RelatedList ... />
  </AfterCol>
</AfterGrid>

<BlogCta
  title="Vyzkoušejte naši aplikaci"
  text="Za 5 minut budete mít hotovo."
  buttonLabel="Vyzkoušet aplikaci"
  href="/cs/preview"
/>
```

---

## SEO a Schema

SEO je generováno přímo v `[slug].tsx`:
- `<title>`, `<meta description>`
- OG + Twitter metadate
- `BlogPosting` schema

`BlogPosting` automaticky využívá:
- `title`
- `description`
- `coverImage`
- `author`
- `date`

Pokud článek nemá `coverImage`, použije se fallback.

---

## Hreflang a párování CZ/SK

Propojení funguje přes `pairId`:
- CZ a SK článek se stejným `pairId` se spárují.
- V `<head>` se vygenerují `alternate` odkazy.
- V `sitemap-main.xml` se vygenerují `hreflang` alternates.

---

## Sitemap

Sitemap je generována v:
- `src/pages/sitemap-main.xml.ts`

Automaticky zahrnuje:
- všechny články z `/cs/blog` a `/sk/blog`
- podporuje `.md` i `.mdx`

**Aktuálně:** sitemap zahrnuje pouze `.mdx` články.

---

## Blog listing (index)

Listing pro CZ a SK:
- `src/pages/cs/blog/index.tsx`
- `src/pages/sk/blog/index.tsx`

Seznam článků bere data z frontmatteru:
- `title`
- `description`
- `date`
- `coverImage`

Řazení je podle data (nejnovější nahoře).

---

## Důležité soubory

- `src/pages/cs/blog/[slug].tsx` – detail CZ
- `src/pages/sk/blog/[slug].tsx` – detail SK
- `src/pages/cs/blog/index.tsx` – listing CZ
- `src/pages/sk/blog/index.tsx` – listing SK
- `src/components/blog/BlogMdxComponents.tsx` – komponenty pro MDX
- `src/scss/BlogPost.module.scss` – styling detailu
- `src/scss/Blog.module.scss` – styling listingu

---

## Nový článek (doporučený postup)

1. Vytvořit `.mdx` v:
   - `src/content/cs/blog`
   - `src/content/sk/blog`
2. Vyplnit frontmatter (včetně `pairId`).
3. Použít MDX komponenty pro layout (včetně `SummaryNav`, `QuoteBox`).
4. Pro navigaci přidejte `id` do hlavních `<h2>` (např. `id="krok-1"`).
5. Ověřit sitemap a listing.

---

## Závislosti

Pro MDX používáme:
- `next-mdx-remote`
- `@mdx-js/react`

Tyto balíčky musí být v `package.json` a nainstalované přes `npm install`.

---

## Poznámky

- Všechny blog články byly převedené na `.mdx` a sjednocené přes komponenty.
- `:global(...)` styly byly odstraněny – styling jde pouze přes CSS Modules.
- Nové články doporučujeme psát výhradně jako `.mdx`.
- Pokud se přidává nová sekce, doplňte ji jako komponentu do `BlogMdxComponents.tsx`.
- `SummaryNav` používá stejné vizuální zpracování jako box „Rychlé shrnutí (navigace)“ z profesí.
- `QuoteBox` používá ikonu `<RiDoubleQuotesR />` a label (např. „Příklad:“).

