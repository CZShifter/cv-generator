# Codex řešení plateb – export tasku

Datum: 2026-02-23

## Shrnutí
- Migrován platební tok na webhook jako jediný zdroj pravdy.
- Generování PDF/faktur je idempotentní a server‑side.
- Return stránky pouze pollují status.
- Zlepšena spolehlivost na iOS (refId fallback, download přes nový tab, cacheControl=0).
- Ošetřen „stale client“ (auto reload).

## Klíčové změny
- Nový server helper: src/server/cvGeneration.ts
- Nové webhooky: src/pages/api/cs/comgate-webhook.ts, src/pages/api/sk/comgate-webhook.ts
- Status API: src/pages/api/cs/payment-status.ts, src/pages/api/sk/payment-status.ts
- create-payment nyní ukládá data do DB (cv_json) + photo upload.
- submit-cv přepracován na server‑side generaci podle cvId.
- update-cv doplněn o pdf_status/pdf_generated_at + cacheControl.
- /po-platbe: fallback přes refId z URL.
- /zaplaceno: download lock, cache-buster, a-click download.

## DB změny (rekapitulace)
- payment_status, pdf_status, payment_tx_id, paid_at, pdf_generated_at
- indexy na comgate_ref_id, payment_tx_id, unikát na payment_tx_id (not null)

## Důležité provozní body
- Webhook URL musí být v Comgate nastaven na produkci.
- Vercel Protection nesmí blokovat webhook.
- SUPABASE_SERVICE_ROLE_KEY musí být v prod i preview.

## Soubory s detailní dokumentací
- DOCUMENTACE_PLATEB_A_WEBU.md

## Patch (diff)
Viz soubor: Codex_reseni_plateb.diff

