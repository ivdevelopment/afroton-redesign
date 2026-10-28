// Static build: public/ is copied as-is, CSS and site JS get a content hash, every page is rendered to
// <out>/<route>/index.html. This is an unofficial redesign concept. Where it is served from (local "/" or a
// GitHub Pages subpath) is set in src/config.mjs.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BASE, STATIC, OUT_DIR, withBase, cssWithBase } from './config.mjs';
import { page } from './components/layout.mjs';
import { SITE } from './data/site.mjs';
import { PAGES } from './pages/index.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.resolve(ROOT, OUT_DIR);
const t0 = Date.now();

fs.rmSync(DIST, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'public'), DIST, { recursive: true });

const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 10);

function write(rel, content) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

// ---- CSS: concatenated in a fixed order, comments and indentation stripped
const CSS_ORDER = ['tokens', 'base', 'components', 'layout', 'home', 'pages', 'consent'];
const cssSrc = CSS_ORDER.map((n) => fs.readFileSync(path.join(ROOT, 'src/styles', n + '.css'), 'utf8')).join('\n');
const css = cssWithBase(cssSrc
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s*\n\s*/g, '\n')
  .replace(/\n+/g, '\n')
  .trim());
const cssPath = `/assets/css/site.${hash(css)}.css`;
write(cssPath, css);

// ---- JS
const js = fs.readFileSync(path.join(ROOT, 'src/scripts/site.js'), 'utf8');
const jsPath = `/assets/js/site.${hash(js)}.js`;
write(jsPath, js);

const assets = { css: cssPath, js: jsPath };

// ---- pages
const urls = [];
for (const make of PAGES) {
  const p = make();
  const out = withBase(page(p, assets));
  const rel = p.file || (p.route === '/' ? 'index.html' : path.posix.join(p.route, 'index.html'));
  write(rel, out);
  if (!p.noindex) urls.push(p.route);
}

// ---- old addresses (/photos/, /partners/). A host with server redirects uses public/_redirects; static hosting gets
// a small page that forwards, so a direct link or refresh still lands on the right page.
const MOVED = { '/photos/': '/photos-main/', '/partners/': '/sponsor/' };
if (STATIC) {
  for (const [from, to] of Object.entries(MOVED)) {
    write(path.posix.join(from, 'index.html'), withBase(`<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><title>AFROTON</title><meta name="robots" content="noindex, nofollow">
<meta http-equiv="refresh" content="0; url=${BASE}${to.slice(1)}"><link rel="canonical" href="${to}"></head>
<body><p><a href="${to}">Continue to ${to}</a></p></body></html>
`));
  }
  // server-only files mean nothing on static hosting; .nojekyll stops GitHub Pages from running Jekyll
  for (const f of ['_redirects', '_headers']) fs.rmSync(path.join(DIST, f), { force: true });
  write('.nojekyll', '');
}

// ---- sitemap (same file names as live: sitemap-index.xml → sitemap-0.xml)
const today = new Date().toISOString().slice(0, 10);
write('sitemap-0.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('sitemap-index.xml', `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE.url}/sitemap-0.xml</loc></sitemap></sitemapindex>\n`);

console.log(`Built ${PAGES.length} pages into ${path.relative(ROOT, DIST) || '.'} (base ${BASE}${STATIC ? ', static hosting' : ''}) in ${Date.now() - t0} ms`);
