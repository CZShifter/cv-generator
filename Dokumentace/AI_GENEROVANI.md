# AI generování životopisu a motivačního dopisu

Stav implementace a ověření: **24. 10. 2026**, včetně následné opravy příliš stručného bio a opakujících se motivačních dopisů.

## Model a migrace

Všechny tři funkce v CZ i SK používají výhradně `gpt-6-luna`. Model je nastaven napevno v pomocných funkcích; nelze předat jiný model. Fallback na GPT-4.1 mini ani jiný model neexistuje.

Při migraci bylo v oficiální dokumentaci ověřeno ukončení GPT-4.1 mini v API k **14. 1. 2027** a doporučení přejít na Lunu. Dotaz přes projektový API klíč potvrdil přístup k Luně a `shutdown_date: null`. To je stav k datu kontroly, nikoli záruka budoucí životnosti. [OpenAI: ukončování modelů](https://developers.openai.com/api/docs/deprecations)

Standardní cena za milion textových tokenů při ověření:

| Model | Vstup bez cache | Výstup |
| --- | ---: | ---: |
| GPT-4.1 mini | 0,40 USD | 1,60 USD |
| GPT-6 Luna | 0,10 USD | 0,50 USD |

Zdroje: [GPT-4.1 mini](https://developers.openai.com/api/docs/models/gpt-4.1-mini), [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna). Reasoning i delší prompty zvyšují spotřebu; případný opravný požadavek se účtuje navíc. Nižší sazba za token nezaručuje stejný poměr úspory za požadavek.

## Konečné nastavení a soubory

| Funkce | Pomocná funkce | API | Parametry |
| --- | --- | --- | --- |
| Odrážky | [chatgpt.ts](../src/pages/api/chatgpt.ts): `askChatGPT(messages)` | Chat Completions | `max_completion_tokens: 600`, `reasoning_effort: "none"`, `temperature: 0.5` |
| Bio | [chatgpt5.ts](../src/pages/api/chatgpt5.ts): `askSummary(messages)` | Responses | `max_output_tokens: 1600`, `reasoning.effort: "low"`, bez `temperature` |
| Motivační dopis | [chatgpt5.ts](../src/pages/api/chatgpt5.ts): `askChatGPT(messages)` | Responses | `max_output_tokens: 3200`, `reasoning.effort: "medium"`, bez `temperature` |

Název `chatgpt5.ts` je historický, nyní jde o sdílené generování souvislých textů Lunou. Obě jeho veřejné funkce vracejí `Promise<string>` nebo vyhodí chybu.

Odrážky zůstaly při následné opravě bio a dopisů beze změny. Bio se přesunulo z původního společného Chat Completions volání na samostatný profil Responses. U dopisu se reasoning zvýšil z `low` na `medium` a limit z 1600 na 3200. Rozpočet zahrnuje viditelný text i reasoning; není to počet slov.

Podpora reasoningu a vztah k nákladům byly ověřeny v [dokumentaci reasoning modelů](https://developers.openai.com/api/docs/guides/reasoning). Režim `high` byl vyzkoušen na dvou dopisech: v těchto vzorcích zvýšil spotřebu, ale opakování spolehlivě neodstranil, proto nebyl nasazen. Při aktivním reasoningu se neposílá `temperature`. [Migrační pravidla](https://developers.openai.com/api/docs/guides/latest-model)

OpenAI SDK je v [package.json](../package.json) připnuto na **6.32.0** místo původního `^5.10.1`; změnu obsahuje i [package-lock.json](../package-lock.json). Aktualizace byla nutná pro typovou podporu `reasoning_effort: "none"`. Nebyl přidán nový požadavek projektu na Node.js 22.

Autentizace používá serverovou proměnnou `OPENAI_API_KEY`. Není nová proměnná pro model. Klíč nevkládat do klientského kódu, dokumentace ani testovacích výpisů.

## Endpointy a datový kontrakt

Česká varianta používá kód `cs`, slovenská `sk`. Všechny endpointy přijímají POST s JSON tělem; URL odpovídá zdrojovému souboru, například `/api/cs/generate-summary`.

| Funkce | Zdroje promptů a handlerů | Tělo požadavku | Úspěšná odpověď |
| --- | --- | --- | --- |
| Odrážky | [CZ](../src/pages/api/cs/generate-exp-points.ts), [SK](../src/pages/api/sk/generate-exp-points.ts) | `{ "position": "název pozice" }` | `{ "points": ["bod bez pomlčky", "..."] }` |
| Bio | [CZ](../src/pages/api/cs/generate-summary.ts), [SK](../src/pages/api/sk/generate-summary.ts) | `{ "summary": "podklady" }` | `{ "summary": "text" }` |
| Dopis | [CZ](../src/pages/api/cs/generate-motivation-letter.ts), [SK](../src/pages/api/sk/generate-motivation-letter.ts) | `{ "motivation": "podklady" }` | `{ "motivation": "text" }` |

Pole musí být neprázdný řetězec i po `trim()`; jinak HTTP 400. Jiná metoda vrací HTTP 405. Selhání generování nebo neplatný výstup vrací HTTP 500 a `{ error: "..." }`. Původní hlavičky proti cachování (`Cache-Control`, `Pragma`, `Expires`) a výstupní klíče zůstávají zachované.

Formuláře pro vytvoření i editaci CV používají stejné endpointy. Jejich vzhled ani napojení se touto opravou neměnily. Zcela prázdné zadání je stále neplatné; minimální vstup znamená například samotnou profesi.

## Prompty: co lze rozvinout a co se nesmí vymýšlet

Instrukce jsou v systémové zprávě a podklad v uživatelské zprávě jako `JSON.stringify({ summary })` apod. Podklad nemá přepsat jazyk nebo pravidla generování; toto oddělení ale samo o sobě není úplná ochrana proti zavádějícím instrukcím.

Souvislé texty mohou autorsky rozvinout zájem, profesní směřování, zamýšlený přínos, obecné souvislosti práce a návaznost myšlenek. Mají být formulované jako záměr či motivace, nikoli jako doložený minulý výkon.

Nelze přidávat smyšlená jména, kontakty, zaměstnavatele, délku praxe, vzdělání, certifikace, konkrétní znalosti nástrojů, úspěchy, objevy, publikace, zdroj inzerátu ani fakta o firmě. Záliba se nesmí změnit v profesní kvalifikaci.

Prompty požadují přirozenou spisovnou češtinu/slovenštinu, diakritiku, správné skloňování a jednotný rod. Nejasný rod má vést k neutrálním formulacím; například samotné české „účetní“ rod neurčuje. Slovenská verze vylučuje české výrazy. Zpřesněny jsou i vazby názvů firem, například „so spoločnosťou Delta“.

### Odrážky

4–6 obecných návrhů běžné náplně práce, každý nejvýše o 8 slovech. Jmenné formulace začínají `- `, jsou na samostatných řádcích a bez úvodu či závěru. Nejde o ověřená tvrzení o zkušenostech autora.

### Bio: oprava pouhé parafráze

Původní problém nebyl v ověřených případech selháním API: zadání „Jsem astrofyzik, mam vlastni teleskop a studuji cerne diry“ se pouze gramaticky opravilo. Přísný původní zákaz jakéhokoli rozvinutí vedl i u jednoslovné profese k jediné větě.

Nový prompt požaduje jeden plnohodnotný odstavec v první osobě, cílově **35–60 slov a 3–4 navazující věty**, i z minimálního vstupu. Postupuje od zaměření přes jeho souvislost se zájmem k osobnímu směřování. Například astrofyziku, černé díry a vlastní teleskop propojí s otázkami o vesmíru a zájmem o pozorování, bez přidání publikací či objevů.

### Dopis: konkrétní adresát a argumentace

Oslovení vychází z příjemce, nikoli z autora:

- Známá osoba: například „Vážená paní Svobodová,“ / „Vážená pani Svobodová,“ s odpovídajícími jazykovými tvary. Tituly se nepřidávají.
- Pouze firma: například „Vážení zástupci společnosti Auto X,“ / „Vážení zástupcovia spoločnosti Auto X,“.
- Neznámý příjemce: neutrální „Dobrý den,“ / „Dobrý deň,“.

Následují čtyři odstavce bez nadpisů:

1. Jednovětý úvod: konkrétní žádost o pozici, případně zadaný zdroj nabídky. Nepředjímá praxi ani zálibu.
2. Proč uchazeč: doložená zkušenost propojená s navrhovaným přínosem. Vynechat tautologie typu „praxe mi dala zkušenosti“.
3. Proč spolupráce s adresátem: osobní motivace a zájem, bez opakování předchozího přínosu. Zadané informace o firmě lze využít; neznámé hodnoty a projekty firmy se nevymýšlejí.
4. Závěr: poděkování a možnost osobního setkání. Skutečně zadané jméno a kontakt mohou následovat za „S pozdravem“ / „S pozdravom“; chybějící údaje se vynechají.

Dopis mluví přímo k adresátovi („u vás“, „vašim zákazníkům“). Zachovává cílovou firmu, předchozího zaměstnavatele, praxi, relevantní zálibu a ostatní dodané údaje. Nedovozuje například, že uchazeč z předchozí práce odešel.

Původní tlak na 300–400 slov byl odstraněn: prompt doporučuje 150–220 slov pro stručné a 180–280 pro bohatší zadání. **Délka dopisu není v kódu vynucená a vzorky mohou být kratší.** Přednost má souvislý text bez opakování a výplně.


## Validace, opravy a chybové chování

- Odrážky: `chatgpt.ts` přijímá neprázdný text pouze s `finish_reason === "stop"`. Handler kontroluje 4–6 řádků, prefix pomlčky, nejvýše 8 slov a duplicity po převodu na malá písmena. Rozděluje po řádcích, ne podle dvojitých mezer. Neplatný seznam vrací chybu místo dřívějšího HTTP 200 s prázdným polem a `raw`.
- Bio i dopis: Responses musí vrátit `status === "completed"` a neprázdný text. Useknutá odpověď se nevrací jako úspěch.
- Normalizace souvislých textů převádí CRLF a doslovné sekvence `\n` na skutečné řádky, odstraňuje koncová zpětná lomítka Markdown zalomení, koncové mezery a přebytečné prázdné řádky. Bio se navíc sjednotí do jednoho odstavce.
- Bio má programově povolený rozsah **30–70 slov** (tolerance kolem cíle promptu). Příliš krátký nebo dlouhý výstup vyvolá nejvýše **jeden opravný požadavek na stejné Luně** s původním zadáním i předchozím textem. Nevyhoví-li ani oprava, vrátí se chyba. Tato kontrola ověřuje délku, nikoli sémantickou kvalitu.
- U dopisu se detekují běžné nevyřešené rodové alternativy typu `chtěl/a`, `rád/a`, `chcel(a)`. Následuje nejvýše jeden opravný požadavek zachovávající fakta a adresáta, s požadavkem na přirozené neutrální formulace. Přetrvávající detekovaný problém vrátí chybu. Nejde o úplnou gramatickou kontrolu všech rodových tvarů.
- Opravný požadavek není fallback: model zůstává Luna. Po chybě API se nepřepíná na jiný model. Nastavení standardních síťových opakování SDK se nemění.
- Gramatika, návaznost, věrohodnost, oslovení a zachování faktů zůstávají převážně řízené promptem. Nejsou programově zaručené pro každý vstup. Kontrola duplicit odrážek nerozpoznává významově podobné formulace.

## Testy a ověření

[tests/cv-ai.test.cjs](../tests/cv-ai.test.cjs) obsahuje **19 automatických testů** se simulovaným OpenAI klientem. Ověřují všech šest handlerů, předání podkladu a jazyk instrukcí, datový kontrakt, nastavení modelu/reasoningu, neplatné vstupy a metody, prázdné či useknuté odpovědi, nepřepínání modelů, formát odrážek, normalizaci textu a omezené opravné pokusy bio a rodových alternativ.

```powershell
node --test tests/cv-ai.test.cjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js src/pages/api/chatgpt.ts src/pages/api/chatgpt5.ts src/pages/api/cs/generate-exp-points.ts src/pages/api/cs/generate-summary.ts src/pages/api/cs/generate-motivation-letter.ts src/pages/api/sk/generate-exp-points.ts src/pages/api/sk/generate-summary.ts src/pages/api/sk/generate-motivation-letter.ts
git diff --check
```

Při úpravě proběhly také skutečné textové API zkoušky:

- původní chování bio na programátorovi se zájmem o grafiku a jednoslovné účetní profesi;
- nové bio pro uživatelův vstup o astrofyzikovi, teleskopu a černých dírách, v CZ i SK;
- nové bio z jediné profese v obou jazycích;
- dopis Jana/Jána Nováka pro Auto X, desetiletá praxe z Auto Y a autocross/autokros;
- stejný dopis konkrétní adresátce Petře Svobodové s testovacím kontaktem na doméně example.com;
- dopis účetní/účtovníčky firmě Delta bez jména a kontaktu, aby se ověřilo minimální zadání, nepřenášení faktů z příkladu, neurčený český rod a slovenská vazba názvu firmy;
- porovnání `medium` a `high` reasoningu pro dopis.

Tyto zkoušky vedly ke zpřesnění promptů pro neopakující se úvod a odstavce, zachování předchozího zaměstnavatele, oslovení, neutrální rod a vazby firemních názvů. Automatické testy s mockem samy jazykové schopnosti modelu neověřují. Skutečné zkoušky představují omezený vzorek, nikoli garanci všech budoucích výstupů.

Dočasný skript pro skutečné API zkoušky není součástí repozitáře. Klíče ani skutečné osobní údaje nebyly ukládány do testů. Vizuální testy nebyly na přání uživatele prováděny. Produkční build ani nasazení nejsou součástí tohoto ověření.

## Nasazení a další práce

Použít aktualizovaný lockfile při instalaci, například `npm ci`, a serverový `OPENAI_API_KEY` s přístupem k Luně. Lokální přístup jedním klíčem neprokazuje oprávnění jiného produkčního projektu. Nasazení vyžaduje nový build; samotná změna dokumentace produkci nepřepíná.

Při další práci:

1. Pro odrážky upravovat `chatgpt.ts`; pro bio a dopis odpovídající profil v `chatgpt5.ts`. Zachovat Lunu bez modelového fallbacku, dokud nebude výslovně požadována další migrace.
2. Úpravy promptů promítnout do CZ i SK. Zachovat UTF-8, datový kontrakt a hranici mezi autorským rozvinutím myšlenky a smyšlenými fakty.
3. Spustit automatické kontroly. U změny promptů/reasoningu ověřit také skutečné texty: stručné i bohaté zadání, mužský/ženský/neznámý rod, firmu/osobu/neznámého adresáta, dodaný i chybějící kontakt.
4. Pokud je nutné pevně vynucovat délku dopisu, věrnost každému faktu či další jazyková pravidla, doplnit cílenou validaci s testy. Současný kód zajišťuje jen výše popsané mechanické kontroly.
5. Vyšší reasoning není náhradou dobrého promptu; porovnávat kvalitu, spotřebu, dobu odezvy a dokončení textu. Rozpočet musí zahrnout reasoning i viditelný text.
6. Před změnou modelu znovu ověřit oficiální parametry, ceny, životní cyklus a oprávnění produkčního projektu.

Součástí původní migrace byly obě AI pomocné funkce, šest generátorů, OpenAI závislost s lockfilem a testy. Následná oprava mění pouze generování souvislých textů, čtyři související handlery, testy a dokumentaci. Vzhled, platební toky, domény a PDF generování do těchto změn nepatří.

