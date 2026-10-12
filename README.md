# cimpla.se

Statisk webbplats för cimpla, en produkt under custom46 AB. Ingen byggkedja.
Typsnitten är självhostade i `fonts/` — sidorna gör inga externa anrop
(utom länken till bokningssidan i Microsoft Bookings). Länken till kundportalen
ligger bortkommenterad i sidfoten på varje sida — ta bort kommentaren när den ska visas.

## Struktur (sedan 2026-10-12)

| Fil | Innehåll |
|---|---|
| `index.html` | Start: heroanimationen, värdet, tre steg, resultat från första piloten |
| `produkt/index.html` | Produkten: flödet in → cimpla → ut, fälten, hur modellen arbetar, CleverApps, data och säkerhet |
| `kom-igang/index.html` | Kom igång: fyra steg, vad vi behöver, vanliga frågor |
| `kontakt/index.html` | Boka intromöte, mejl, kontaktformulär |
| `404.html` | Cloudflare Pages visar den för okända adresser |
| `styles.css` | All CSS, gemensam för sidorna |
| `site.js` | Mobilmeny, sidhuvudets linje, intresseanmälan (dialogen) och kontaktformuläret |
| `hero.js` | Canvasanimationen på startsidan |
| `sitemap.xml`, `robots.txt` | För sökmotorer — lägg till nya sidor i sitemap |

**Sidhuvud, sidfot och dialogen är kopierade i varje sida.** Ändras menyn,
bokningslänken eller kontaktadressen (info@cimpla.se) måste alla fem filerna
ändras. Mappar med `index.html` ger rena adresser (`/produkt/`) både lokalt och
på Cloudflare.

**Cache:** `styles.css`, `site.js` och `hero.js` laddas med `?v=ÅÅÅÅMMDD`. Zonen
cimpla.se har en Browser Cache TTL på 4 h som skriver över `_headers` (samma
problem som portalen) — **byt värdet i alla sidor när någon av filerna ändras**,
annars ser besökare den gamla versionen i upp till fyra timmar.

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

## Formulären (intresseanmälan och kontakt)

Bannern överst öppnar en dialogruta (mejl + fritext), och kontaktsidan har ett
formulär (namn, företag, mejl, meddelande). Båda postas med fetch till
`/pilot` = Cloudflare Pages Function `functions/pilot.js`, som mejlar via
Microsoft Graph till `NOTIFY_TO` (miljövariabler i Cloudflare). Det dolda fältet
`amne` (`intresse`/`kontakt`) styr mejlets ämnesrad. Faller anropet visas ett
felmeddelande med en mailto-länk till info@cimpla.se, så inget går förlorat.

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
