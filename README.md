# lumihue.app

Hjemmesiden for **LumiHue**, et roligt, lokalt webinterface til Philips Hue. Sitet er én statisk side uden byggetrin, sporing eller eksterne afhængigheder i browseren.

Live: **https://lumihue.app/** (også `www.lumihue.app`).

## Struktur

- `site/` er alt, der udgives: `index.html`, `styles.css`, `404.html`, `robots.txt`, `favicon.ico` og `brand/`.
- `site/brand/` indeholder det vandrette hvide logo og symbolet som leveret, samt nedskalerede udgaver af symbolet til faneikon og Apple-touch-ikon.
- `wrangler.jsonc` beskriver Cloudflare-Workeren **lumihue-app**: mappen `site` udgives som statiske filer, og `404.html` bruges ved ukendte adresser.
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
