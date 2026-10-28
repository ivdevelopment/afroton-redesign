// The GitHub Pages build: served from /afroton-redesign/, static only, concept mode.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'dist-pages-test');
const BASE = '/afroton-redesign/';
const SITE_URL = 'https://example.github.io/afroton-redesign';
let pages = [];

before(() => {
  execFileSync(process.execPath, ['src/build.mjs', '--pages', `--base=${BASE}`, `--site-url=${SITE_URL}`, '--out=dist-pages-test'], { cwd: ROOT, stdio: 'pipe' });
  pages = fs.readdirSync(OUT, { recursive: true })
    .map((f) => f.replace(/\\/g, '/'))
    .filter((f) => f.endsWith('.html') && !f.startsWith('wp-content') && !f.startsWith('media'))
    .map((file) => ({ file, html: fs.readFileSync(path.join(OUT, file), 'utf8') }));
});

const strip = (h) => h.replace(/<template>[\s\S]*?<\/template>/g, '');
/** every URL-carrying attribute value on the page (srcset split into its URLs) */
function urls(html) {
  const out = [];
  for (const m of strip(html).matchAll(/\s(href|src|action|poster|content|srcset|imagesrcset)="([^"]*)"/g)) {
    if (m[1].endsWith('srcset')) for (const part of m[2].split(',')) out.push(part.trim().split(/\s+/)[0]);
    else out.push(m[2]);
  }
  return out.filter(Boolean);
}
const fileFor = (u) => {
  const p = path.join(OUT, decodeURIComponent(u.replace(/[?#].*$/, '').slice(BASE.length)));
  return fs.existsSync(p) && fs.statSync(p).isDirectory() ? path.join(p, 'index.html') : p;
};

test('all 13 pages plus the forwarding pages for old addresses are real files', () => {
  for (const r of ['index.html', 'tickets/index.html', 'workshops/index.html', 'about-us/index.html', 'community/index.html', 'photos-main/index.html', 'sponsor/index.html', 'bookings/index.html', 'tj-west/index.html', 'waruti/index.html', 'privacy/index.html', 'terms-conditions/index.html', '404.html', 'photos/index.html', 'partners/index.html']) {
    assert.ok(fs.existsSync(path.join(OUT, r)), r);
  }
});

test('no site-root URL escapes the base path, and every one resolves to a built file', () => {
  for (const { file, html } of pages) {
    for (const u of urls(html)) {
      if (!u.startsWith('/') || u.startsWith('//')) continue;
      assert.ok(u.startsWith(BASE), `${file}: ${u} is outside ${BASE}`);
      assert.ok(fs.existsSync(fileFor(u)), `${file}: ${u} does not exist`);
    }
  }
});

test('stylesheet URLs (fonts) carry the base path and exist', () => {
  const dir = path.join(OUT, 'assets/css');
  for (const f of fs.readdirSync(dir)) {
    const css = fs.readFileSync(path.join(dir, f), 'utf8');
    const found = [...css.matchAll(/url\(["']?(\/[^)"']+)/g)].map((m) => m[1]);
    assert.ok(found.length > 0);
    for (const u of found) {
      assert.ok(u.startsWith(BASE), `${f}: ${u}`);
      assert.ok(fs.existsSync(fileFor(u)), `${f}: ${u} missing`);
    }
  }
});

test('absolute URLs (Open Graph) point at the published concept, not at afroton.eu', () => {
  for (const { file, html } of pages.filter((p) => !/^(photos|partners)\//.test(p.file))) {
    const og = html.match(/<meta property="og:image" content="([^"]+)"/);
    assert.ok(og && og[1].startsWith(SITE_URL + '/'), `${file}: ${og && og[1]}`);
    assert.ok(fs.existsSync(path.join(OUT, og[1].slice(SITE_URL.length))), `${file}: og:image file`);
  }
});

test('static only: no API endpoints, no signup script, no server files', () => {
  for (const { file, html } of pages) {
    assert.doesNotMatch(html, /\/api\//, `${file} references an API endpoint`);
    assert.doesNotMatch(html, /afroton-signup\.js/, file);
    for (const f of html.match(/<form\b[^>]*>/g) || []) {
      assert.match(f, /data-demo-signup/, file);
      assert.doesNotMatch(f, /method="post"/, file);
    }
  }
  assert.ok(fs.existsSync(path.join(OUT, '.nojekyll')));
  assert.ok(!fs.existsSync(path.join(OUT, '_redirects')));
  assert.ok(!fs.existsSync(path.join(OUT, '_headers')));
  // the demo handler never makes a request
  const js = fs.readdirSync(path.join(OUT, 'assets/js')).filter((f) => f.startsWith('site.')).map((f) => fs.readFileSync(path.join(OUT, 'assets/js', f), 'utf8')).join('');
  assert.match(js, /data-demo-signup/);
  assert.doesNotMatch(js, /fetch\(|XMLHttpRequest|sendBeacon/);
});

test('old addresses forward inside the base path', () => {
  assert.match(fs.readFileSync(path.join(OUT, 'photos/index.html'), 'utf8'), /url=\/afroton-redesign\/photos-main\//);
  assert.match(fs.readFileSync(path.join(OUT, 'partners/index.html'), 'utf8'), /url=\/afroton-redesign\/sponsor\//);
});

test('concept mode: noindex everywhere, robots blocks crawlers, no analytics or ad measurement', () => {
  for (const { file, html } of pages) {
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/, file);
    assert.doesNotMatch(strip(html), /googletagmanager|gtag\/js|connect\.facebook|fbevents/, file);
  }
  for (const { file, html } of pages.filter((p) => !/^(photos|partners)\//.test(p.file))) {
    assert.match(html, /"tag":"","ads":false/, file);
  }
  assert.match(fs.readFileSync(path.join(OUT, 'robots.txt'), 'utf8'), /Disallow: \//);
});

test('every page carries the concept disclaimer in the footer', () => {
  for (const { file, html } of pages.filter((p) => !/^(photos|partners)\//.test(p.file))) {
    assert.match(html, /class="site-footer__concept">Unofficial website redesign concept\. Not affiliated with Afroton\./, file);
  }
});

test('the 404 page links back inside the base path', () => {
  const nf = pages.find((p) => p.file === '404.html').html;
  assert.match(nf, /href="\/afroton-redesign\/"/);
  assert.match(nf, /href="\/afroton-redesign\/tickets\/"/);
});
