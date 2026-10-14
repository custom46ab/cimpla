// utkast/riktning – bygger undersidorna (produkt, kom-igang, kontakt) ur de
// skarpa sidorna och lägger in foton, och pekar om alla interna länkar till
// utkastet så att man kan klicka runt. Startsidan (index.html) är handskriven;
// skriptet rör bara dess länkar och foton.
//
//   node utkast/riktning/bygg.js        (från sajtens rot)
//
// Fotona länkas direkt från Unsplash (fri licens, ingen attribution krävs;
// fotograferna står i FOTO nedan). Inför skarp drift: ladda ned och lägg lokalt.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const BAS = '/utkast/riktning/';

const FOTO = {
  hyllor:   { id: 'photo-1441984904996-e0b6ba687e04', av: 'Clark Street Mercantile', alt: 'Butik med klädställ och hyllor' },
  trojor:   { id: 'photo-1582719188393-bb71ca45dbb9', av: 'Markus Winkler',       alt: 'Tröjor på galgar i en butik' },
  lager:    { id: 'photo-1782948603191-065fb15e2e8e', av: 'Sebastian Schuster',   alt: 'Lagergång med höga hyllor fulla av kartonger' },
  pjaxor:   { id: 'photo-1754583340212-5bddfda09f7e', av: 'Clay Banks',           alt: 'Pjäxor och skidutrustning på en vägg' },
  papper:   { id: 'photo-1554224155-1696413565d3',    av: 'Kelly Sikkema',        alt: 'Utspridda papper och anteckningar på ett bord' },
  kartong:  { id: 'photo-1782405183431-893f08e24b1a', av: 'Giorgio Trovato',      alt: 'Öppen kartong på en ljus yta' },
  kangor:   { id: 'photo-1606036525923-525fa3b35465', av: 'Glenn Carstens-Peters', alt: 'Snörkängor i brunt läder' },
};
function foto(namn, klass, ar, overst) {
  const f = FOTO[namn], u = 'https://images.unsplash.com/' + f.id + '?auto=format&fit=crop&q=70';
  const ladd = overst ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<figure class="ph${klass ? ' ' + klass : ''}"${ar ? ` style="--ar:${ar}"` : ''}>`
    + `<img src="${u}&w=1400" srcset="${u}&w=800 800w, ${u}&w=1400 1400w, ${u}&w=2200 2200w" sizes="(max-width:860px) 100vw, 60vw" alt="${f.alt}" ${ladd}>`
    + `</figure>`;
}

// interna länkar → utkastet (inte flaggan som jämför med skarpa sidan)
function lankar(html) {
  return html.split('\n').map(l => l.includes('draft-flag') ? l : l
    .replace(/href="\/"/g, `href="${BAS}"`)
    .replace(/href="\/(produkt|kom-igang|kontakt)\/"/g, `href="${BAS}$1/"`)).join('\n');
}

function utkastHead(html, titel) {
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>Utkast – ${titel} · cimpla</title>`)
    .replace('<link rel="icon"', '<meta name="robots" content="noindex">\n<link rel="icon"')
    .replace(/(<link rel="stylesheet" href="\/styles.css[^>]*>)/, `$1\n<link rel="stylesheet" href="${BAS}riktning.css?v=4">`)
    .replace(/(<script src="\/site.js[^"]*"><\/script>)/, `$1\n<script src="${BAS}riktning.js?v=4"></script>`);
}

// sidhuvudet på en undersida: text till vänster, foto till höger
function heroMedFoto(html, namn) {
  return html.replace(/<section class="page-hero">\s*<div class="wrap">([\s\S]*?)<\/div>\s*<\/section>/,
    (_, inner) => `<section class="page-hero">\n    <div class="wrap ph-split">\n      <div>${inner}</div>\n      ${foto(namn, '', '', true)}\n    </div>\n  </section>`);
}

function flagga(html, skarp) {
  return html.replace('</main>', `</main>\n<a class="draft-flag" href="${skarp}">Utkast · jämför med nuvarande sida →</a>`);
}

const SIDOR = [
  { dir: 'produkt', titel: 'Produkten', hero: 'papper', extra: h => h.replace(
      /(<p class="lede">cimpla fyller i de fält[^<]*<\/p>)/,
      `$1\n        <div style="margin-top:28px">${foto('pjaxor', '', '4/3')}</div>`) },
  { dir: 'kom-igang', titel: 'Kom igång', hero: 'kartong', extra: h => h.replace(
      /(<h2>Underlag ni <em>redan har<\/em>\.<\/h2>\s*<\/div>)/,
      `$1\n      <div style="margin-bottom:40px">${foto('lager', 'ph-band')}</div>`) },
  { dir: 'kontakt', titel: 'Kontakt', hero: 'kangor', extra: h => h },
];

for (const s of SIDOR) {
  let h = fs.readFileSync(path.join(ROOT, s.dir, 'index.html'), 'utf8');
  h = utkastHead(h, s.titel);
  h = heroMedFoto(h, s.hero);
  h = s.extra(h);
  h = flagga(h, `/${s.dir}/`);
  h = lankar(h);
  fs.mkdirSync(path.join(__dirname, s.dir), { recursive: true });
  fs.writeFileSync(path.join(__dirname, s.dir, 'index.html'), h);
  console.log('skrev', s.dir + '/index.html');
}

// startsidan: länkar + foton (idempotent: lägger bara in det som saknas)
const ix = path.join(__dirname, 'index.html');
let st = fs.readFileSync(ix, 'utf8');
st = st.replace(/riktning\.(css|js)\?v=\d+/g, 'riktning.$1?v=4');
if (!st.includes('ph-band')) st = st.replace('<!-- 03 Problemet -->',
  `<section class="sec-tight" style="padding-top:0">\n    <div class="wrap">${foto('hyllor', 'ph-band')}</div>\n  </section>\n\n  <!-- 03 Problemet -->`);
if (!st.includes('case-ph')) st = st.replace('<div class="case">', `<div class="case">\n        ${foto('trojor', 'case-ph')}`);
fs.writeFileSync(ix, lankar(st));
console.log('uppdaterade index.html');
