# lumihue.app

Hjemmesiden for **LumiHue**, et roligt, lokalt webinterface til Philips Hue. Sitet er én statisk side i to skærme med scroll snap: introvideoen i fuld højde og derefter den korte tekst med footer. Ingen byggetrin eller eksterne afhængigheder i browseren ud over Google Analytics efter cookievalg.

Live: **https://lumihue.app/** (også `www.lumihue.app`).

## Struktur

- `site/` er alt, der udgives: `index.html`, `styles.css`, `404.html`, `robots.txt`, `sitemap.xml`, `favicon.ico`, `brand/` og `media/`.
- `site/brand/` indeholder det vandrette hvide logo og symbolet som leveret, samt nedskalerede udgaver af symbolet til faneikon og Apple-touch-ikon.
- `site/media/` indeholder introvideoen i fuld højde (1280 × 720, 10 sekunder, H.264, cirka 4 MB) og dens plakatbillede, som også bruges som delingsbillede.
- `wrangler.jsonc` beskriver Cloudflare-Workeren **lumihue-app**: mappen `site` udgives som statiske filer, og `404.html` bruges ved ukendte adresser.
- `src/index.js` kører kun for `/media/*` og svarer på HTTP Range-forespørgsler med 206-delsvar, som Safari kræver for at afspille video. Alle andre adresser serveres direkte som statiske filer.
- `package.json` og `package-lock.json` fastlåser `wrangler`, så Cloudflares byggesystem kører samme version hver gang.

Alle stier i HTML er relative, så siden virker uanset vært.

## Se siden lokalt

```sh
npm run preview
```

Det starter `python3 -m http.server 8765 --directory site`; åbn `http://127.0.0.1:8765/`. Alternativt kører `npx wrangler dev` sitet gennem Cloudflares lokale Worker-runtime.

## Udgivelse

Sitet hostes som Cloudflare Worker med statiske assets. Workers Builds er forbundet til dette repository: hvert push til `main` kører `npx wrangler deploy` uden byggekommando og udgiver en ny version på få sekunder. Status og byggelog findes i Cloudflare under *Workers & Pages → lumihue-app → Deployments*. Preview builds er slået til, så andre grene får en midlertidig preview-adresse.

Adresser:

- `https://lumihue.app/` og `https://www.lumihue.app/` (Custom Domains på Workeren)
- `https://lumihue-app.anders-70b.workers.dev/` (Workerens egen adresse)

## Domænet

`lumihue.app` ligger som zone i samme Cloudflare-konto. Begge værtsnavne er tilføjet som *Custom Domains* under Workerens fane *Domains*; Cloudflare oprettede selv DNS-posterne og certifikatet. Der skal ikke vedligeholdes manuelle DNS-poster for sitet. Alle `.app`-domæner kræver HTTPS, fordi hele topdomænet er forhåndsregistreret til HSTS.

## Søgning og besøgsstatistik

- `site/sitemap.xml` og `site/robots.txt` ligger i udgivelsen; robots.txt henviser til sitemappet. Cloudflare tillader alle bots på zonen: Bot Fight Mode og AI Labyrinth er slået fra, og AI-politikkerne står på *Allow* for søgning, agenter og træning.
- **Google Search Console:** domæneejendommen `lumihue.app` er verificeret via en TXT-post i Cloudflare DNS (`google-site-verification=…`). Sitemappet er indsendt. Slet ikke TXT-posten; Google kontrollerer den løbende.
- **Google Analytics 4:** ejendommen `lumihue.app` med webdatastrømmen `lumihue.app`, målings-id `G-7GD8RTPDVM`. Scriptet i `index.html` sætter Consent Mode til *denied* som standard, så der kun sendes cookieløse målinger, indtil den besøgende har svaret.
- **Cookievalg:** `site/consent.js` viser et lille banner nederst ved første besøg. *Ja, gerne* gemmer `granted` i `localStorage` (nøglen `lumihue-consent`) og slår fuld måling med cookies til med det samme; *Nej tak* gemmer `denied` og fjerner eventuelle `_ga`-cookies. Valget gælder også ved næste besøg, og linket *Cookievalg* i footeren genåbner banneret, så man kan ændre mening.

## Logo og rettigheder

Navn og logo tilhører projektets ophavsmand og er ikke frigivet til fri brug. Der er endnu ikke valgt en licens til sitets kode og tekst; indtil da gælder almindelig ophavsret.

Philips og Hue er varemærker tilhørende deres respektive ejere. LumiHue er et uafhængigt hobbyprojekt uden tilknytning til Signify eller Philips.
