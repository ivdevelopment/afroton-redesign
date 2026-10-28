// Build configuration: the one place that knows where the site is hosted.
//
//   node src/build.mjs                                   local build, served at /
//   node src/build.mjs --pages --base=/afroton-redesign/ GitHub Pages build (static-only, served from a subpath)
//
// Options (CLI flag or environment variable):
//   --base=/path/     BASE_PATH   path the site is served from (default "/")
//   --site-url=URL    SITE_URL    public URL of that path, for absolute links (Open Graph, schema.org, sitemap)
//   --out=dir         OUT_DIR     output folder (default "dist")
//   --pages           SITE_MODE=static   static hosting: no /api endpoints, no server redirects or headers
//
// Pages and components always write site-root paths ("/tickets/", "/assets/…"); build.mjs passes every output
// file through withBase(), so the base path is applied in exactly one place.

const arg = (name) => {
  const hit = process.argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return undefined;
  return hit.includes('=') ? hit.slice(hit.indexOf('=') + 1) : true;
};

function normalizeBase(b) {
  let s = String(b || '/').trim();
  if (!s.startsWith('/')) s = '/' + s;
  if (!s.endsWith('/')) s += '/';
  return s.replace(/\/{2,}/g, '/');
}

export const BASE = normalizeBase(arg('base') ?? process.env.BASE_PATH);
export const STATIC = arg('pages') === true || process.env.SITE_MODE === 'static';
export const SITE_URL = String(arg('site-url') ?? process.env.SITE_URL ?? '').replace(/\/+$/, '');
export const OUT_DIR = String(arg('out') ?? process.env.OUT_DIR ?? 'dist');

const prefix = (url) => BASE + url.slice(1);

/** Prefix the base path to every site-root URL ("/x", not "//cdn" or "https://") in HTML output. */
export function withBase(html) {
  if (BASE === '/') return html;
  return html
    .replace(/\s(href|src|action|poster|content)="(\/(?!\/)[^"]*)"/g, (_, a, u) => ` ${a}="${prefix(u)}"`)
    .replace(/\s(srcset|imagesrcset)="([^"]*)"/g, (_, a, v) => ` ${a}="${v.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE}`)}"`);
}

/** Same for stylesheets: url("/assets/…") */
export function cssWithBase(css) {
  if (BASE === '/') return css;
  return css.replace(/url\((["']?)\/(?!\/)/g, (_, q) => `url(${q}${BASE}`);
}
