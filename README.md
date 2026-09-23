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
3. **Höger** – en e-handelsvy som långsamt scrollar, kolumn för kolumn i olika
   takt. Produktbilden ligger på plats direkt; motivet är en av arton enkla
   streckfigurer (`drawProduct`) och väljs med `productKind()`, som steppar med
   7 genom en fast permutation — steget är relativt primt med antalet, så två
   kort under varandra i samma kolumn aldrig får samma produkt. Fälten
   (kategori, artikelnamn och variant till vänster, pris till höger) poppar upp
   färdiga ett i taget på vägen upp, gröna i samma ögonblick de dyker upp och
   tonar sedan över till grafit.

Reglage längst upp i skriptet i `index.html`:

- `DOC_SET` – vilka dokumenttyper som roterar. Korta ned listan för att välja
  bort någon.
- `CYCLE` – sekunder per dokument i en slot. `SLOTS` – antal dokumentplatser.
- `SCROLL` – e-handelsvyns scrollfart. `DESIGN` – dess designbredd; högre värde
  ger mindre, tätare produktkort.

Tröskelvärdena i `drawShop` (`fld(..., p, tröskel, ...)`) styr i vilken ordning
fälten populeras när kortet scrollar uppåt.

`prefers-reduced-motion` ger en stillbild i stället för animation.

## Pilotanmälan ("Håll mig informerad")

Bannern överst öppnar en dialogruta med mejladress (obligatorisk) och ett
fritextfält. Formuläret är ett **Netlify-formulär** (`name="pilot"`,
`data-netlify="true"`) som postas med fetch, så rutan kan visa ett tack utan
att sidan laddas om. Faller anropet returneras ett felmeddelande med en
mailto-länk till kontakt@custom46.com, så ingen anmälan går förlorad.

> ⚠️ **TRASIGT efter flytten till Cloudflare (2026-09-23).** Netlify Forms
> fungerar bara på Netlify. Formuläret postar `fetch('/')` som Netlify
> fångade — Cloudflare gör det inte, så pilotanmälningar tas **inte** emot
> någonstans just nu. Felfallet (mailto till kontakt@custom46.com) visas dock
> fortfarande. Måste ersättas med ett Cloudflare-kompatibelt upplägg: en Pages
> Function som mejlar via Graph, eller en formtjänst (t.ex. Formspree). Beslut
> ej fattat.

Lokalt (`python -m http.server`) svarar servern 501 på POST — då visas
felmeddelandet. Det är väntat och säger inget om hur det fungerar i drift.

## Tidigare versioner

`arkiv/hero-v1-dokumentflode.html` är den första animationen (dokument som
driver in mot en perspektivlutad panel med rullande tecken). Filen är en komplett
fristående sida — öppna den direkt för att jämföra, eller kopiera tillbaka den
över `index.html`.

## Förhandsgranska lokalt

    python -m http.server 4173

## Deploy

Cloudflare Pages, kopplat till detta repo (`custom46ab/cimpla`, gren `master`).
Framework preset **None**, inget byggkommando, output = repots rot. Push till
master auto-deployar. Custom domains: `cimpla.se` + `www.cimpla.se`.

Flyttad från Netlify 2026-09-23 (Netlifys kreditmodell gjorde ~20 deployer/mån
till taket; Cloudflare ger 500). Netlify-projektet finns kvar men med byggen
**stoppade**.
