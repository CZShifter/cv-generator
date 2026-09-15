# Supabase heartbeat přes Vercel Cron

## Co se přeneslo

Endpoint `GET /api/supa-heartbeat` nebo `POST /api/supa-heartbeat` v souboru
`src/pages/api/supa-heartbeat.ts` nahrazuje původní App Router route z projektu
`feetsin`. Tento projekt používá Pages Router, proto zde nejde o soubor `route.ts`.

Každé autorizované ruční volání a vybrané půlnoční volání cronu vloží přes Supabase REST jeden prázdný záznam `{}` do
existující tabulky **`hearthbeat`** (původní pravopis). Databáze doplní `id` a
`created_at`. Úspěšná odpověď zůstává `201 { ok: true, inserted: { id, created_at } }`;
neplatné přihlášení vrací 401 a chyba Supabase 500. Jiné metody vrací 405.

Route používá stávající serverové `SUPABASE_URL` a `SUPABASE_SERVICE_ROLE_KEY`.
Nevytváří ani nemění tabulky a neupravuje platební, PDF ani SEO endpointy.
Odpovědi se necachují, zápis do Supabase má timeout 8 sekund. Automatické opakování
zápisu není součástí route; opakované volání vytvoří další řádek stejně jako dříve.

## Nastavení na Vercelu

1. V projektu **cv-generator**, v **Settings → Environment Variables**, nastav pro
   **Production** proměnnou `CRON_SECRET` na náhodný tajný řetězec alespoň 32 znaků.
   Nepoužívej prefix `NEXT_PUBLIC_` a hodnotu neukládej do repozitáře.
2. Ověř, že `SUPABASE_URL` a `SUPABASE_SERVICE_ROLE_KEY` ukazují do Supabase projektu,
   ve kterém už existuje původní tabulka `hearthbeat` s výchozími hodnotami sloupců.
   Pokud jde o stejnou databázi jako u plateb, stávající hodnoty neměň.
3. Nasaď změny do produkce. `vercel.json` registruje dva denní rozvrhy pro
   `/api/supa-heartbeat`: `0 22 * * *` a `0 23 * * *` (UTC). Route u Vercel Cron
   požadavků ověří hodinu v `Europe/Prague` a zapisuje pouze mezi 00:00 a 00:59.
   V létě tak zapisuje volání ve 22:00 UTC, v zimě ve 23:00 UTC. Druhé volání
   vrací `200 { ok: true, skipped: true, reason: "Outside Europe/Prague midnight hour" }`
   bez přístupu do databáze. Změny času řeší automaticky časová zóna Europe/Prague.
4. V **Settings → Cron Jobs** ověř registraci a spusť job přes **Run**.
   Mimo českou půlnoční hodinu cron správně vrací 200 se skipped: true. Pro
   okamžité ověření zápisu zavolej endpoint ručně s hlavičkou Authorization
   podle návodu níže. Ověř HTTP 201 a nový řádek v hearthbeat.
5. Až po ověření nového jobu vypni původní externí plánovač. Původní projekt
   ani jeho route tento přesun neupravuje.

Vercel Cron volá produkční endpoint metodou GET a automaticky připojuje
`Authorization: Bearer <CRON_SECRET>`. Preview ani lokální `npm run dev`
nepouštějí plánované úlohy. Podrobnosti:
[Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) a
[zabezpečení a správa cronu](https://vercel.com/docs/cron-jobs/manage-cron-jobs).

Pokud tento repozitář nasazuješ do více samostatných Vercel projektů (například CZ
a SK), každý produkční projekt zaregistruje vlastní cron. Pro jednu společnou
databázi stačí jeden plánovač; ostatní vypni v jejich nastavení Cron Jobs.

## Přesnost času

Rozvrh se mění v `vercel.json` a změna se projeví po produkčním nasazení.
Vercel používá vždy UTC. Dva samostatné denní crony umožňují českou půlnoc
v letním i zimním čase bez ručního přenastavování.

**Hobby** může cron spustit kdykoliv v naplánované hodině: zápis tedy proběhne
mezi 00:00 a 00:59 českého času. **Pro/Enterprise** mají přesnost na minutu.
Viz [limity plánovače](https://vercel.com/docs/cron-jobs/usage-and-pricing).

Časový filtr platí po autorizaci pro požadavky s hlavičkou
`x-vercel-cron-schedule` nebo User-Agent `vercel-cron/1.0`. Tyto hlavičky samy
neopravňují k zápisu; vždy je nutný platný klíč. Ruční volání bez těchto hlaviček
zapisuje kdykoliv. Každý rozvrh běží jednou denně; běžně vznikne jeden řádek denně.
Vercel negarantuje přesně jedno doručení, takže opakované doručení může stejně
jako u původní route vytvořit další řádek.

## Ruční volání a původní autentizace

Pro ruční test lze použít GET i POST s hlavičkou `Authorization: Bearer <CRON_SECRET>`.
Pouhé otevření URL bez klíče správně vrátí 401.

Pro kompatibilitu s původním voláním lze volitelně nastavit také
`HEARTBEAT_CRON_SECRET`. Pak funguje původní hlavička `x-cron-key` nebo parametr
`?key=...`. Pro novou integraci používej hlavičku Authorization, aby klíč nebyl v URL.
Samotný `HEARTBEAT_CRON_SECRET` nestačí pro automatické ověření Vercel Cron;
ten potřebuje `CRON_SECRET`. Bez nastaveného odpovídajícího tajemství route
požadavek odmítne a do databáze nezapisuje.

## Lokální kontrola

```powershell
node --experimental-strip-types --test tests/supa-heartbeat.test.mjs
npx tsc --noEmit --incremental false
npx eslint src/pages/api/supa-heartbeat.ts
```

Testy používají Node.js 22.6+ a simulované Supabase odpovědi. Ověřují autorizaci,
metody, parametry zápisu a chybové stavy bez přístupu do skutečné databáze.
