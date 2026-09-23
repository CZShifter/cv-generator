# Přepnutí slovenské domény

Slovenskou doménu řídí jediná proměnná `SITE_URL_SK`. Změna zachovává jazykové cesty, platební tok, tvorbu CV a českou doménu. Nepřidává přesměrování mezi slovenskými doménami ani závislost na dostupnosti původní domény.

## Nastavení ve Vercelu

1. K příslušnému projektu připojit `zivotopisrychlo.sk` (případně i `www.zivotopisrychlo.sk`) a dokončit DNS/HTTPS nastavení.
2. V Environment Variables pro Production nastavit:

   ```env
   SITE_URL_SK=https://zivotopisrychlo.sk
   ```

3. Nasadit upravený kód s novým buildem. Samotné uložení proměnné existující deployment nepřepne.
4. Pokud jsou CZ a SK samostatné Vercel projekty, nastavit stejnou hodnotu a nasadit změnu i v CZ projektu, aby odkazy na slovenskou verzi mířily správně. České URL a platební nastavení se nemění.

Pro případný návrat k původní doméně po jejím získání nastavit `SITE_URL_SK=https://rychlyzivotopis.sk` a znovu nasadit. Bez proměnné zůstává původní doména jako zpětně kompatibilní výchozí hodnota. Nepoužívat `/sk` v hodnotě proměnné. Konfigurace povoluje HTTPS adresy rychlyzivotopis.sk, zivotopisrychle.sk a zivotopisrychlo.sk; chybné nastavení zastaví build.

`next.config.ts` zpřístupňuje pouze tuto veřejnou URL také klientskému kódu. Další proměnná s prefixem `NEXT_PUBLIC_` není potřeba. Proměnné `SITE_URL`, `SITE_URL_CZ` ani platební klíče kvůli této změně nepřepisovat.

## Platby – nastavení mimo kód

Stávající platební API už používá `SITE_URL_SK` pro návratové adresy. Jeho kód nebyl změněn.

Webhook nastavený v administraci Comgate se však změnou proměnné nepřepíše. Pokud slovenský obchod stále používá starou doménu, nastavit dostupnou adresu:

`https://zivotopisrychlo.sk/api/sk/comgate-webhook`

Ověřit také doménu obchodu a případné výchozí návratové adresy. Českého obchodu se změna netýká. Starou doménu už nelze použít jako spolehlivý endpoint. Bez doručení webhooku se podle stávajícího platebního toku nedokončí potvrzení a generování PDF. Skutečná konfigurace Comgate ani Vercelu nebyla při lokální úpravě ověřena nebo změněna.

## Rozsah a ověření

Hodnotu používají metadata a odkazy na editaci, seznam povolených hostů, cíl přepínače jazyků, robots, sitemapy a analytika. `llms.txt`, `llms-full.txt` a `humans.txt` jsou nově obsluhované přes Pages Router, aby slovenské odkazy používaly tutéž konfiguraci; jejich ostatní obsah je zachován v `src/server/siteTexts.json`.

Lokálně ověřeno:

- `node --test tests/site-domain.test.cjs` – všechny tři slovenské domény, české směrování, robots/sitemapy, preview, veřejné texty a stávající výběr platební návratové adresy.
- `npx tsc --noEmit --incremental false`.
- `npm run build` s novou slovenskou doménou; build prošel se stávajícími lintovými upozorněními.
- Vygenerované CZ/SK HTML obsahuje správné domény; textové soubory zachovávají původní obsah kromě slovenské adresy.

Po produkčním nasazení ověřit otevření webu a dokončení slovenské testovací platby včetně webhooku. Lokální ověření nezahrnovalo skutečnou transakci.
