# Afroton — website redesign concept

An **unofficial, independent redesign concept** for [afroton.eu](https://www.afroton.eu/), made as a design case study.

> Afroton's name, logo, photography, event information and texts belong to Afroton (Afroton vzw).
> This project is not affiliated with, commissioned by or endorsed by Afroton. It can be viewed locally or shared
> as a static demo on GitHub Pages; it is never deployed to afroton.eu or any Afroton infrastructure.

The case study is in [docs/CASE-STUDY.md](docs/CASE-STUDY.md), the presentation screenshots are in
[docs/presentation/](docs/presentation/), and the audit of the live site the concept is based on is in
[docs/AUDIT.md](docs/AUDIT.md).

## Run it locally

Requires Node 20.11 or newer. There are no packages to install.

```bash
npm run dev
```

This builds the site and serves it on **http://localhost:4321**.

| Command | What it does |
|---|---|
| `npm run dev` | Build, then serve `dist/` on port 4321 |
| `npm run build` | Build into `dist/` |
| `npm run build:pages` | Static GitHub Pages build into `dist/`, served from `/afroton-redesign/` |
| `npm run preview:pages` | Build for Pages and serve it locally at http://localhost:4321/afroton-redesign/ |
| `npm run serve` | Serve an existing `dist/` |
| `npm test` | Build, then run 122 checks: the local build (links, assets, headings, alt text, ids, forms, consent, metadata) and a GitHub Pages build under `/afroton-redesign/` |
| `npm run check` | Script syntax, stylesheet sanity, module imports |

## How the concept behaves

- **No data leaves your machine.** The newsletter form posts to `/api/subscribe`, which the local server answers
  itself (`MOCK_SUBSCRIBE=ok|invalid|rate-limit|error npm run dev` shows the other states). Analytics and ad measurement are switched off
  (`concept: true` in `src/data/site.mjs`).
- **The cookie banner, consent-gated Spotify and YouTube players, and the Weeztix shop embeds** mirror how the live
  site works, so the interaction design can be judged as a whole. Afroton's two client scripts
  (`afroton-consent.js`, `afroton-signup.js`) are unchanged copies.
- **Kept out of search engines.** Every page is `noindex, nofollow`, and `robots.txt` disallows everything.

## Publishing as a demo on GitHub Pages

`.github/workflows/pages.yml` runs on every push to `main` (or by hand). It installs, runs the tests, builds with
`--pages` and publishes `dist/` with GitHub's official Pages actions. No secrets are used. In the repository settings,
set **Pages → Source** to **GitHub Actions**.

- **Base path.** Pages and components write site-root paths (`/tickets/`, `/assets/…`). `src/config.mjs` holds the
  base path (`--base=`, default `/`), and `build.mjs` applies it to every URL in the HTML and CSS in one step. The
  workflow passes the repository path that `configure-pages` reports, so a renamed repository or a custom domain needs no code change.
- **Static only.** With `--pages`, the newsletter form becomes a demo that validates the address and sends nothing,
  the signup script isn't loaded, server files (`_redirects`, `_headers`) are left out, and the old `/photos/` and
  `/partners/` addresses get small forwarding pages. `.nojekyll` is included.
- **Still concept mode.** `noindex, nofollow` on every page, `robots.txt` blocks crawlers, no analytics, no ad measurement.
- **Client-side embeds only.** The Weeztix shop embed and the consent-gated Spotify and YouTube players are ordinary
  client-side embeds.

## Project structure

```
public/            static files copied into dist/: Afroton's photos and logos (at their live paths), fonts, scripts
src/
  config.mjs       where the site is served from: base path, static mode, output folder
  build.mjs        renders every page, applies the base path, hashes CSS and JS, writes the sitemap
  data/            site facts, events and workshops, people and partners, gallery (only what afroton.eu publishes)
  components/      layout (head, header, footer, newsletter, consent banner), blocks, icons, decorative SVG
  pages/           one module per page
  content/         privacy and terms texts, converted from the live pages
  styles/          tokens → base → components → layout → home → pages → consent
  scripts/site.js  header, mobile menu, ticker pause, scroll reveals, gallery tabs and lightbox
scripts/           local server (serve.mjs, --base= for a subpath) and static checks (check.mjs)
.github/workflows/ GitHub Pages deployment
tests/             node:test suite over dist/
docs/              case study, audit, presentation screenshots
```

## Editing content

- **Events and workshops** live in `src/data/events.mjs`. Events move from upcoming to past by date when you
  build. A workshop shows as "Also coming up" under the main event while it's upcoming.
- **Photos:** `src/data/gallery.json` and `SETS` in `src/pages/photos.mjs`.
- **Images:** `srcset`, `width` and `height` are read from the files on disk (`src/lib/img.mjs`). Two hero photos
  got extra resized copies (`DSA05903-*x*.webp`, `DSA04685-*x*.webp`) to serve phones a smaller file.
