# Dokumentace webu a platebního toku (CZ/SK)

Tento dokument shrnuje:
1) Jak web funguje (architektura, klíčové stránky, API, storage).
2) Aktuální platební tok (po změnách).
3) Přehled změn, které byly provedeny a proč.

Datum: 2026-02-23  
Projekty: `rychlyzivotopis.cz` (CZ) a `rychlyzivotopis.sk` (SK)

---

## 1) Přehled systému

### 1.1 Frontend (Next.js, CZ/SK)
- Web běží ve dvou jazykových verzích, separované prefixy:
  - CZ: `/cs/*`
  - SK: `/sk/*`
- Hlavní UX tok:
  1) Uživatel vyplní CV formulář.
  2) Provede platbu přes Comgate.
  3) Po návratu z brány vidí „po-platbě“ stránku, která čeká na potvrzení platby.
  4) Po potvrzení se zobrazí stránka „zaplaceno“ a je dostupné PDF + faktura.

### 1.2 Backend (API routes v Next.js)
- Všechny API endpointy jsou v `src/pages/api`.
- Klíčové platební a PDF endpointy:
  - `POST /api/cs/create-payment` / `POST /api/sk/create-payment`
  - `POST /api/cs/comgate-webhook` / `POST /api/sk/comgate-webhook`
  - `GET  /api/cs/payment-status` / `GET  /api/sk/payment-status`
  - `POST /api/cs/submit-cv` / `POST /api/sk/submit-cv` (server‑side generování PDF)
  - `POST /api/cs/update-cv` / `POST /api/sk/update-cv`
  - `GET /api/download-pdf`
  - `GET /api/download-invoice`

### 1.3 Supabase (DB + Storage)
- Tabulka: `cv_entries`
  - Ukládá data CV (`cv_json`), šablonu (`template_id`), platby, statusy, PDF/Invoice URL.
- Storage buckety:
  - `photos` (fotky z CV)
  - `pdfs` (výsledná CV PDF)
  - `invoices` (doklady o zaplacení)

---

## 2) Datový model `cv_entries` (relevantní sloupce)

- `id` (UUID)
- `cv_json` (JSONB)
- `template_id` (text)
- `created_at`
- `expires_at` (expirace editace – počítá se od `paid_at`)
- `paid` (boolean)
- `amount`
- `order_number` (auto increment)
- `pdf_url`
- `invoice_url`
- `comgate_trans_id`
- `comgate_ref_id`
- `payment_status` (created | pending | paid | failed | cancelled)
- `pdf_status` (not_started | generating | ready | failed)
- `payment_tx_id` (Comgate `transId`, idempotence)
- `paid_at`
- `pdf_generated_at`

---

## 3) Aktuální platební tok (PO ZMĚNÁCH)

### 3.1 Vytvoření platby
1) Uživatel klikne „Zaplatit“ ve formuláři (CZ/SK).
2) Frontend volá:
   - `POST /api/cs/create-payment`
   - `POST /api/sk/create-payment`
   Body: `{ templateId, data }`
3) Backend:
   - založí Comgate platbu
   - uloží „draft“ do DB (`cv_entries`)
   - uloží `comgate_ref_id`, `comgate_trans_id`, `payment_tx_id`
   - uloží `cv_json` a `template_id`
   - fotku (pokud je base64) nahraje do `photos` bucketu
4) Backend vrátí `cvId`, `transId`, `refId`, `redirectUrl`
5) Frontend uloží do `localStorage`:
   - `cvId`, `refId`, `transId`, `templateId`
6) Uživatel je přesměrován na Comgate

### 3.2 Webhook – jediný zdroj pravdy
1) Comgate pošle webhook na:
   - `POST /api/cs/comgate-webhook`
   - `POST /api/sk/comgate-webhook`
2) Webhook:
   - ověří transakci serverově přes `Comgate /v1.0/status`
   - pokud `CANCELLED` → nastaví `payment_status = cancelled`
   - pokud `PENDING` → nastaví `payment_status = pending`
   - pokud `PAID`:
     - nastaví `payment_status = paid`
     - nastaví `paid_at`
     - nastaví `expires_at = paid_at + 24h`
     - spustí generování PDF + faktury (idempotentně)

### 3.3 Generování PDF + faktury (idempotentní)
Generace probíhá server‑side přes helper:
`src/server/cvGeneration.ts`

Chování:
- Pokud `pdf_status = ready` → nic se nedělá.
- Jinak přepne `pdf_status` na `generating` a:
  - vygeneruje PDF přes pdfendpoint
  - upload do `pdfs` bucketu
  - vygeneruje fakturu přes pdfendpoint
  - upload do `invoices` bucketu
  - uloží `pdf_url`, `invoice_url`, `pdf_status = ready`, `pdf_generated_at`

### 3.4 Return page po platbě
Po návratu z Comgate:
1) `/cs/po-platbe` nebo `/sk/po-platbe`
2) Stránka nevolá Comgate.
3) Polluje pouze `GET /api/*/payment-status`
4) Pokud `payment_status=paid` a `pdf_status=ready`, přesměruje na:
   - `/cs/zaplaceno/[id]`
   - `/sk/zaplaceno/[id]`

### 3.5 Stránka Zaplaceno
`/cs/zaplaceno/[id]` / `/sk/zaplaceno/[id]`
- Načítá data z DB
- Umožní download PDF a faktury

---

## 4) Update CV (editace po zaplacení)

- `POST /api/cs/update-cv` / `POST /api/sk/update-cv`
- Chování zůstává stejné:
  - uloží nové `cv_json`
  - znovu vygeneruje PDF
  - aktualizuje `pdf_url`
  - nově aktualizuje i `pdf_status = ready` a `pdf_generated_at`

---

## 5) Provedené změny – souhrn

### 5.1 Důvod změn
Původní tok generoval PDF až po návratu uživatele z brány (return page).  
Pokud se uživatel nevrátil (zavření okna, problém s redirectem), platba byla stržená, ale PDF nikdy nevzniklo.

### 5.2 Změny v systému
1) **Webhook = jediný zdroj pravdy pro „paid“**  
   - Generování PDF se spouští pouze z webhooku.

2) **Idempotentní PDF generace**  
   - `pdf_status` gating + DB update.

3) **Frontend pouze polluje status**  
   - `/po-platbe` už nespouští generování.

4) **Data se ukládají ihned při create-payment**  
   - U bankovních převodů zůstane CV uloženo, PDF se vygeneruje později po paid.

5) **Editace běží od `paid_at`**  
   - `expires_at` se nastavuje až ve webhooku.

6) **Ošetření starého klienta (cache)**  
   - Pokud klient pošle pouze `templateId` bez `data`, server vrátí `code: STALE_CLIENT`.  
   - Frontend zobrazí hlášku a provede automatický reload stránky.  
   - Tím se minimalizuje potřeba hard refreshu u uživatelů, kteří mají v cache starý JS.

7) **iOS/Safari spolehlivější návrat + download**  
   - `/po-platbe` nyní umí fallback přes `refId` z URL, když je `localStorage` prázdný.  
   - Download PDF/faktury je přes `window.open(...)` (iOS-friendly).  
   - Na iOS může mít soubor jiný název (OS někdy ignoruje `Content-Disposition`), ale download je spolehlivější.

8) **Patch: zamezení dvojitého downloadu + fix build**  
   - Přidán `downloadLockRef` (ochrana proti dvojitému spuštění stahování).  
   - Download PDF/faktury upraven na `<a>` click s `target="_blank"` (méně dvojitých tabů).  
   - Doplněn `useRef` import v `/zaplaceno` (CZ/SK) – fix kompilace.

9) **Patch: cacheControl pro PDF/Invoice**  
   - Upload PDF a faktur nyní používá `cacheControl: "0"` (Supabase Storage).  
   - Minimalizuje to situace, kdy se po přegenerování stahuje stará verze.

---

## 6) Změněné / nové soubory (orientačně)

### Nové soubory
- `src/server/cvGeneration.ts` (server helper)
- `src/pages/api/cs/comgate-webhook.ts`
- `src/pages/api/sk/comgate-webhook.ts`
- `src/pages/api/cs/payment-status.ts`
- `src/pages/api/sk/payment-status.ts`

### Upravené soubory
- `src/pages/api/cs/create-payment.ts`
- `src/pages/api/sk/create-payment.ts`
- `src/components/cs/CvForm.tsx`
- `src/components/sk/CvForm.tsx`
- `src/pages/cs/po-platbe.tsx`
- `src/pages/sk/po-platbe.tsx`
- `src/pages/api/cs/submit-cv.ts`
- `src/pages/api/sk/submit-cv.ts`
- `src/pages/api/cs/update-cv.ts`
- `src/pages/api/sk/update-cv.ts`
- `src/pages/api/cs/verify-and-finalize.ts` (zjednodušený)
- `src/pages/api/sk/verify-and-finalize.ts` (zjednodušený)

---

## 7) Nastavení Comgate (důležité)

Webhook (server‑to‑server):
- CZ: `https://rychlyzivotopis.cz/api/cs/comgate-webhook`
- SK: `https://rychlyzivotopis.sk/api/sk/comgate-webhook`

Return URL (fallback):
- CZ: `https://rychlyzivotopis.cz/cs/po-platbe?status=paid`
- SK: `https://rychlyzivotopis.sk/sk/po-platbe?status=paid`

---

## 8) Poznámky pro budoucí rozvoj

- Platební logika je nyní plně server‑side a idempotentní.
- Frontend nikdy nespouští generování PDF.
- Všechny kritické operace (paid → pdf) jsou řízeny webhookem.
- Lze přidat dedikovaný admin endpoint pro „regeneraci PDF po zaplacení“ (pokud potřeba).

Příkazy pro nasazení na vercel:
- git add .
- git commit -m "zruseni footer v renderu_2"
- git push origin dev