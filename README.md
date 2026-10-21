# lumihue.app

Hjemmesiden for **LumiHue**, et roligt, lokalt webinterface til Philips Hue. Sitet er én statisk side: en introvideo i fuld højde og en kort tekst. Ingen byggetrin, sporing eller eksterne afhængigheder i browseren.

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

## Logo og rettigheder

Navn og logo tilhører projektets ophavsmand og er ikke frigivet til fri brug. Der er endnu ikke valgt en licens til sitets kode og tekst; indtil da gælder almindelig ophavsret.

Philips og Hue er varemærker tilhørende deres respektive ejere. LumiHue er et uafhængigt hobbyprojekt uden tilknytning til Signify eller Philips.
