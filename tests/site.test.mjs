// Checks on the built site (run `npm test`, which builds first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '../dist');
const pages = fs.readdirSync(DIST, { recursive: true })
  .filter((f) => f.endsWith('.html') && !f.startsWith('wp-content') && !f.startsWith('media'))
  .map((f) => ({ file: f.replace(/\\/g, '/'), html: fs.readFileSync(path.join(DIST, f), 'utf8') }));
const redirects = fs.readFileSync(path.join(DIST, '_redirects'), 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split(/\s+/)[0]);

const routeOf = (file) => '/' + file.replace(/index\.html$/, '');
const strip = (h) => h.replace(/<template>[\s\S]*?<\/template>/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
const tags = (h, name) => [...strip(h).matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => m[0]);
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? m[1] : null; };
const ids = (h) => [...strip(h).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);

function resolves(url) {
  const u = url.replace(/[?#].*$/, '');
  if (!u) return true;
  if (redirects.includes(u)) return true;
  const p = path.join(DIST, decodeURIComponent(u));
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return true;
  return fs.existsSync(path.join(p, 'index.html'));
}

test('the expected routes are built', () => {
  const routes = pages.map((p) => routeOf(p.file)).sort();
  for (const r of ['/', '/tickets/', '/workshops/', '/about-us/', '/community/', '/photos-main/', '/sponsor/', '/bookings/', '/tj-west/', '/waruti/', '/privacy/', '/terms-conditions/']) {
    assert.ok(routes.includes(r), `missing ${r}`);
  }
  assert.ok(fs.existsSync(path.join(DIST, '404.html')));
});

for (const { file, html } of pages) {
  test(`${file}: document basics and metadata`, () => {
    assert.match(html, /^<!doctype html>/);
    assert.match(html, /<html lang="en-GB"/);
    assert.match(html, /<title>[^<]{5,70}<\/title>/);
    const desc = html.match(/<meta name="description" content="([^"]*)"/);
    assert.ok(desc && desc[1].length >= 30 && desc[1].length <= 170, `description length ${desc && desc[1].length}`);
    if (file !== '404.html') assert.match(html, /<link rel="canonical" href="https:\/\/www\.afroton\.eu\//);
    const og = html.match(/<meta property="og:image" content="https:\/\/www\.afroton\.eu([^"]+)"/);
    assert.ok(og && resolves(og[1]), `og:image ${og && og[1]}`);
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
    JSON.parse(html.match(/<script type="application\/json" id="afroton-consent-config">([\s\S]*?)<\/script>/)[1]);
  });

  test(`${file}: one h1 and no skipped heading levels`, () => {
    const hs = [...strip(html).matchAll(/<h([1-6])\b/g)].map((m) => +m[1]);
    assert.equal(hs.filter((h) => h === 1).length, 1, 'exactly one h1');
    assert.equal(hs[0], 1, 'h1 comes first');
    for (let i = 1; i < hs.length; i++) assert.ok(hs[i] <= hs[i - 1] + 1, `h${hs[i - 1]} → h${hs[i]}`);
  });

  test(`${file}: unique ids and working in-page anchors`, () => {
    const list = ids(html);
    const dupes = list.filter((x, i) => list.indexOf(x) !== i);
    assert.deepEqual(dupes, [], 'duplicate ids');
    for (const a of tags(html, 'a')) {
      const href = attr(a, 'href');
      if (href && href.startsWith('#') && href.length > 1) assert.ok(list.includes(href.slice(1)), `anchor ${href}`);
    }
    for (const el of tags(html, '[a-z]+').filter((t) => /aria-(controls|labelledby|describedby)=/.test(t))) {
      for (const k of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
        const v = attr(el, k);
        if (v) for (const id of v.split(/\s+/)) assert.ok(list.includes(id), `${k}=${id}`);
      }
    }
  });

  test(`${file}: internal links and assets exist`, () => {
    const urls = [];
    for (const t of tags(html, 'a')) urls.push(attr(t, 'href'));
    for (const t of [...tags(html, 'img'), ...tags(html, 'script'), ...tags(html, 'source')]) {
      urls.push(attr(t, 'src'));
      for (const part of (attr(t, 'srcset') || '').split(',')) urls.push(part.trim().split(/\s+/)[0]);
    }
    for (const t of tags(html, 'link')) urls.push(attr(t, 'href'));
    for (const t of [...tags(html, 'img')]) urls.push(attr(t, 'src'));
    for (const u of urls.filter((x) => x && x.startsWith('/'))) assert.ok(resolves(u), `broken: ${u}`);
    // cross-page anchors (/page/#id) point at an id on that page
    for (const u of urls.filter((x) => x && /^\/[^#]*#./.test(x))) {
      const [p, hash] = u.split('#');
      const target = pages.find((pg) => routeOf(pg.file) === p);
      if (target) assert.ok(ids(target.html).includes(hash), `anchor ${u}`);
    }
  });

  test(`${file}: images have alt text and intrinsic size`, () => {
    for (const t of tags(html, 'img')) {
      if (t.includes('data-lightbox-img')) continue; // filled in by the lightbox
      assert.ok(/\salt="/.test(t), `img without alt: ${t.slice(0, 120)}`);
      assert.ok(attr(t, 'width') && attr(t, 'height'), `img without size: ${t.slice(0, 120)}`);
    }
  });

  test(`${file}: no third-party content before consent`, () => {
    const live = strip(html);
    assert.doesNotMatch(live, /<iframe/i, 'iframes only inside <template> until consent');
    for (const s of tags(html, 'script')) {
      const src = attr(s, 'src');
      if (src) assert.ok(src.startsWith('/'), `external script ${src}`);
    }
    assert.doesNotMatch(live, /fonts\.googleapis|googletagmanager|connect\.facebook/);
  });

  test(`${file}: consent banner and newsletter forms keep the live contract`, () => {
    assert.match(html, /data-consent role="dialog"/);
    for (const k of ['data-consent-accept', 'data-consent-refuse', 'data-consent-choose', 'data-consent-save', 'data-consent-opt="stats"', 'data-consent-opt="media"', 'data-consent-open']) assert.ok(html.includes(k), k);
    const forms = [...html.matchAll(/<form\b[\s\S]*?<\/form>/g)].map((m) => m[0]);
    for (const f of forms) {
      assert.match(f, /action="\/api\/subscribe"/);
      assert.match(f, /<input[^>]*type="email"[^>]*name="email"/);
      assert.match(f, /name="website"/);
      assert.match(f, /<button[^>]*type="submit"/);
      assert.match(f, /role="status"/);
      const id = f.match(/<input[^>]*id="([^"]+)"[^>]*type="email"/)[1];
      assert.ok(f.includes(`<label class="signup__label" for="${id}"`), 'email field has a label');
    }
    assert.match(html, /\/assets\/js\/afroton-consent\.js/);
    assert.match(html, /\/assets\/js\/afroton-signup\.js/);
  });

  test(`${file}: no placeholder or dummy content`, () => {
    const text = strip(html).replace(/placeholder="[^"]*"/g, '');
    assert.doesNotMatch(text, /lorem ipsum|TODO|FIXME|example\.com|href="#"(?=[\s>])|\[object Object\]|undefined<|>undefined|NaN/i);
  });
}

test('ticket and workshop pages embed their Weeztix shop', () => {
  const t = pages.find((p) => p.file === 'tickets/index.html').html;
  const w = pages.find((p) => p.file === 'workshops/index.html').html;
  assert.match(t, /data-ot-url="https:\/\/shop\.weeztix\.com\/dd30d871-ee9d-4008-aa87-dd487ded81ea"/);
  assert.match(w, /data-ot-url="https:\/\/shop\.weeztix\.com\/3b7773b9-13c1-4c34-82e9-547910ee46b6"/);
  for (const h of [t, w]) {
    assert.match(h, /ot-shop-injector\.js/);
    assert.match(h, /"shop":true/);
  }
  assert.match(pages.find((p) => p.file === 'index.html').html, /"shop":false/);
});

test('the upcoming TJ WEST Bday Bash is on the home and ticket pages', () => {
  for (const f of ['index.html', 'tickets/index.html']) {
    const h = pages.find((p) => p.file === f).html;
    assert.match(h, /AFROTON x TJ WEST BDAY BASH/);
    assert.match(h, /19 December 2026/);
    assert.match(h, /href="\/tickets\/#tickets"/);
    assert.match(h, /"@type":"Event"/);
  }
});

test('legal pages keep their content', () => {
  const p = pages.find((x) => x.file === 'privacy/index.html').html;
  for (const s of ['WHO WE ARE', 'id="cookies"', 'Weeztix', 'Brevo', 'Gegevensbeschermingsautoriteit', '_fbp', 'afroton-consent', 'Version 2.3']) assert.ok(p.includes(s), s);
  const t = pages.find((x) => x.file === 'terms-conditions/index.html').html;
  for (const s of ['ARTIKEL 1', 'ARTIKEL 20', 'ARTICLE 1', 'ARTICLE 20', 'id="english"', 'TicketSwap']) assert.ok(t.includes(s), s);
});

test('sitemap lists the pages; the concept stays out of search engines', () => {
  const sm = fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8');
  for (const r of ['/', '/tickets/', '/about-us/', '/photos-main/', '/terms-conditions/']) assert.ok(sm.includes(`<loc>https://www.afroton.eu${r}</loc>`), r);
  assert.ok(!sm.includes('404'));
  // unofficial concept: kept out of search engines
  assert.match(fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8'), /Disallow: \//);
  for (const p of pages) assert.match(p.html, /<meta name="robots" content="noindex, nofollow">/, p.file);
});

test('reused live scripts are unchanged copies', () => {
  // afroton-consent.js and afroton-signup.js come from the live site (1.7.3) and are not edited here
  const c = fs.readFileSync(path.join(DIST, 'assets/js/afroton-consent.js'), 'utf8');
  const s = fs.readFileSync(path.join(DIST, 'assets/js/afroton-signup.js'), 'utf8');
  assert.match(c, /var KEY = "afroton-consent";/);
  assert.match(s, /fetch\("\/api\/subscribe"/);
});

test('the workshop keeps its live content and anchor', () => {
  const w = pages.find((p) => p.file === 'workshops/index.html').html;
  assert.match(w, /Thu 5 Nov 2026/);
  assert.match(w, /the legendary Sidy of Jali Kunda/);
  assert.match(w, /id="tickets"/);
  assert.match(w, /href="#tickets"[^>]*>Free ticket/);
  // while it is upcoming, the home page lists it below (never instead of) the main event
  const home = pages.find((p) => p.file === 'index.html').html;
  if (new Date() < new Date('2026-11-05T20:00:00+01:00')) {
    assert.match(home, /class="side-event" href="\/workshops\/#tickets"/);
    assert.ok(home.indexOf('feature-event') < home.indexOf('side-event'), 'the Bday Bash stays first');
  }
});

test("the concept sends nothing to Afroton's analytics or ad measurement", () => {
  for (const p of pages) assert.match(p.html, /"tag":"","ads":false/, p.file);
});

test('every page carries the concept disclaimer in the footer', () => {
  for (const p of pages) assert.match(p.html, /Unofficial website redesign concept\. Not affiliated with Afroton\./, p.file);
});
