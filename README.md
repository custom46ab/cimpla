# cimpla.se

Statisk landningssida för cimpla, en produkt under custom46 AB.

En enda sida, ingen byggkedja. `index.html` innehåller allt: markup, CSS och
canvas-animationen i headern. Typsnitten är självhostade i `fonts/` — sidan gör
inga externa anrop alls.

## Animationen

Tre zoner som visar ett flöde från vänster till höger:

1. **Vänster** – dokument i olika format (PDF, kalkylblad, textdokument, skannat
   ark, chatt) poppar upp, får värden markerade och krymper bort igen. Innehållet
   är avsiktligt abstrakt; bara formatbadgen namnger dokumentet.
2. **Mitten** – insamlingsboxen. Pulserande streck bär värden dit från varje
   dokument, och en fyllnadsfront vandrar nedåt i boxen.
3. **Höger** – en e-handelsvy som långsamt scrollar. Ett kort som kommer in
   underifrån är tomt; på vägen upp fylls bild, titel, underrubrik och pris i,
   så att kortet är komplett när det lämnar vyn.

Reglage längst upp i skriptet i `index.html`:

- `DOC_SET` – vilka dokumenttyper som roterar. Korta ned listan för att välja
  bort någon.
- `CYCLE` – sekunder per dokument i en slot. `SLOTS` – antal dokumentplatser.
- `SCROLL` – e-handelsvyns scrollfart. `DESIGN` – dess designbredd; högre värde
  ger mindre, tätare produktkort.

Tröskelvärdena i `drawShop` (`fld(..., p, tröskel, ...)`) styr i vilken ordning
fälten populeras när kortet scrollar uppåt.

`prefers-reduced-motion` ger en stillbild i stället för animation.

## Tidigare versioner

`arkiv/hero-v1-dokumentflode.html` är den första animationen (dokument som
driver in mot en perspektivlutad panel med rullande tecken). Filen är en komplett
fristående sida — öppna den direkt för att jämföra, eller kopiera tillbaka den
över `index.html`.

## Förhandsgranska lokalt

    python -m http.server 4173

## Deploy

Netlify, publish directory = repots rot. Inget byggkommando behövs.
