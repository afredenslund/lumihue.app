# lumihue.app

Hjemmesiden for **LumiHue**, et roligt, lokalt webinterface til Philips Hue. Sitet er én statisk side uden byggetrin, afhængigheder eller sporing.

## Struktur

- `site/` er alt, der udgives: `index.html`, `styles.css`, `404.html`, `robots.txt` og `brand/`.
- `site/brand/` indeholder det vandrette hvide logo og symbolet som leveret, samt to nedskalerede udgaver af symbolet til faneikon og Apple-touch-ikon.
- `.github/workflows/pages.yml` udgiver `site/` til GitHub Pages ved hvert push til `main`.

Alle stier i HTML er relative, så siden virker både på `https://afredenslund.github.io/lumihue.app/` og på `https://lumihue.app/`.

## Se siden lokalt

```sh
python3 -m http.server 8765 --directory site
```

Åbn derefter `http://127.0.0.1:8765/`.

## Udgivelse

GitHub Actions bygger ikke noget, men pakker `site/` og udgiver den til GitHub Pages. Første gang skal Pages være slået til under *Settings → Pages* med kilden **GitHub Actions**. Herefter udgives hvert push til `main` automatisk, og *Actions*-fanen viser status.

## Domænet lumihue.app

Domænets DNS ligger hos Cloudflare. For at pege det på GitHub Pages:

1. Opret disse poster i Cloudflare med proxy-status **DNS only** (grå sky), i hvert fald indtil certifikatet er udstedt:

   | Type  | Navn | Indhold                     |
   | ----- | ---- | --------------------------- |
   | A     | `@`  | `185.199.108.153`           |
   | A     | `@`  | `185.199.109.153`           |
   | A     | `@`  | `185.199.110.153`           |
   | A     | `@`  | `185.199.111.153`           |
   | AAAA  | `@`  | `2606:50c0:8000::153`       |
   | AAAA  | `@`  | `2606:50c0:8001::153`       |
   | AAAA  | `@`  | `2606:50c0:8002::153`       |
   | AAAA  | `@`  | `2606:50c0:8003::153`       |
   | CNAME | `www` | `afredenslund.github.io`   |

2. Skriv `lumihue.app` i *Settings → Pages → Custom domain* på dette repository og gem. GitHub kontrollerer DNS og udsteder et certifikat; det tager typisk få minutter, men kan tage op til en time.
3. Slå **Enforce HTTPS** til, når feltet bliver aktivt. Alle `.app`-domæner kræver HTTPS, fordi hele topdomænet er forhåndsregistreret til HSTS.
4. Valgfrit, men anbefalet: verificér domænet for kontoen under *Settings → Pages → Verified domains* på GitHub-kontoen, så ingen andre kan udgive Pages på domænet.

Når det er gjort, viderestiller `afredenslund.github.io/lumihue.app/` automatisk til `lumihue.app`.

### Alternativ: Cloudflare Pages

Sitet er rene statiske filer, så det kan lige så godt udgives fra Cloudflare Pages med `site/` som output-mappe og uden byggekommando. Så ligger både DNS og hosting samme sted. Workflowet her kan i så fald slettes.

## Logo og rettigheder

Navn og logo tilhører projektets ophavsmand og er ikke frigivet til fri brug. Der er endnu ikke valgt en licens til sitets kode og tekst; indtil da gælder almindelig ophavsret.

Philips og Hue er varemærker tilhørende deres respektive ejere. LumiHue er et uafhængigt hobbyprojekt uden tilknytning til Signify eller Philips.
