# cimpla.se

Statisk landningssida för cimpla, en produkt under custom46 AB.

En enda sida, ingen byggkedja. `index.html` innehåller allt: markup, CSS och
canvas-animationen i headern. Typsnitten är självhostade i `fonts/` — sidan gör
inga externa anrop alls.

## Redigera

Öppna `index.html`. Animationens innehåll ligger i skriptet längst ned:

- `DOC_SET` högst upp i skriptet styr vilka av de sex dokumenttyperna som roterar.
  Korta ned listan för att välja bort någon.
- `ROWS`, `SHEET` och `CONF` innehåller artikelraderna som visas i
  illustrationerna. Alla uppgifter där är påhittade och ska förbli det.

## Förhandsgranska lokalt

    python -m http.server 4173

## Deploy

Netlify, publish directory = repots rot. Inget byggkommando behövs.
