// The page shell: <head> (SEO, Open Graph, structured data), header, footer, newsletter and consent banner.
import { html, esc, attrs } from '../lib/html.mjs';
import { img, sources } from '../lib/img.mjs';
import { SITE, ORG, SOCIALS, NAV, FOOTER_NAV } from '../data/site.mjs';
import { icon } from './icons.mjs';
import { palmFrond, sun } from './decor.mjs';
import { STATIC } from '../config.mjs';

export const BUILD_YEAR = new Date().getFullYear();

const abs = (path) => SITE.url + path;

function organizationLd() {
  return {
    '@type': 'Organization',
    '@id': abs('/#organization'),
    name: SITE.name,
    legalName: ORG.legalName,
    url: abs('/'),
    email: ORG.email,
    vatID: ORG.enterprise.replace(/\s/g, ''),
    logo: { '@type': 'ImageObject', url: abs(SITE.logoPng), width: 1077, height: 657 },
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.street,
      postalCode: ORG.postcode,
      addressLocality: ORG.city,
      addressCountry: 'BE',
    },
    sameAs: SOCIALS.map((s) => s.url),
  };
}

function head(p, assets) {
  const url = abs(p.route);
  const og = p.ogImage || SITE.ogImage;
  const ogSize = sources(og);
  const title = p.route === '/' ? `${SITE.name} – Welcome home` : `${p.title} – ${SITE.name}`;
  const graph = [
    organizationLd(),
    { '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: SITE.name, inLanguage: SITE.lang, publisher: { '@id': abs('/#organization') } },
    {
      '@type': 'WebPage',
      '@id': url,
      url,
      name: title,
      description: p.description,
      inLanguage: SITE.lang,
      isPartOf: { '@id': abs('/#website') },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
          ...(p.route === '/' ? [] : [{ '@type': 'ListItem', position: 2, name: p.title }]),
        ],
      },
    },
    ...(p.jsonLd || []),
  ];
  const preload = p.preloadImage
    ? p.preloadImage.map((pi) => `<link rel="preload" as="image"${attrs({ href: pi.href, imagesrcset: pi.srcset, imagesizes: pi.sizes, media: pi.media, fetchpriority: 'high' })}>`).join('\n')
    : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>document.documentElement.className=document.documentElement.className.replace('no-js','js')</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="robots" content="${SITE.concept || p.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
<meta name="version" content="${SITE.version}">
${p.noindex ? '' : `<link rel="canonical" href="${url}">`}
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:type" content="${p.route === '/' ? 'website' : 'article'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:image" content="${abs(og)}">
<meta property="og:image:width" content="${ogSize.width}">
<meta property="og:image:height" content="${ogSize.height}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#160d07">
<link rel="icon" href="/wp-content/uploads/2026/08/cropped-Afroton-Logo-5-120x120.webp" sizes="32x32">
<link rel="icon" href="/wp-content/uploads/2026/08/cropped-Afroton-Logo-5-300x300.webp" sizes="192x192">
<link rel="apple-touch-icon" href="/wp-content/uploads/2026/08/cropped-Afroton-Logo-5-300x300.webp">
<link rel="preload" href="/assets/fonts/permanent-marker-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
${preload}
${p.shop ? '<link rel="preconnect" href="https://shop.weeztix.com"><link rel="preconnect" href="https://cdn.openticket.tech" crossorigin>' : ''}
<link rel="stylesheet" href="${assets.css}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>
</head>`;
}

function header(p) {
  const current = (href) => (p.route === href || (href !== '/' && p.route.startsWith(href)) ? ' aria-current="page"' : '');
  const links = NAV.map((n) => `<li><a href="${n.href}"${current(n.href)}>${esc(n.label)}</a></li>`).join('');
  return html`<header class="site-header${p.overlayHeader ? ' site-header--overlay' : ''}" data-header>
  <div class="site-header__bar wrap">
    <a class="brand" href="/" aria-label="AFROTON, home">${img(SITE.logo, { alt: '', sizes: '120px', prefer: 300, eager: true, className: 'brand__logo' })}</a>
    <nav class="site-nav" aria-label="Main">
      <ul class="site-nav__list">${links}</ul>
    </nav>
    <a class="btn btn--sun btn--sm site-header__cta" href="/tickets/#tickets">Tickets ${icon('arrow')}</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
      <span class="menu-toggle__open">${icon('menu')}</span><span class="menu-toggle__close">${icon('close')}</span>
      <span class="sr-only">Menu</span>
    </button>
  </div>
  <div class="mobile-menu" id="mobile-menu" data-menu hidden>
    <nav class="mobile-menu__nav" aria-label="Main (mobile)">
      <ul>${NAV.map((n) => `<li><a href="${n.href}"${current(n.href)}>${esc(n.label)}</a></li>`).join('')}</ul>
    </nav>
    <a class="btn btn--sun btn--lg mobile-menu__cta" href="/tickets/#tickets">Get tickets ${icon('arrow')}</a>
    <ul class="social-list mobile-menu__social">${socialItems()}</ul>
    ${palmFrond({ seed: 21, className: 'mobile-menu__frond' })}
  </div>
</header>`;
}

export function socialItems() {
  return SOCIALS.map((s) => `<li><a class="social" href="${esc(s.url)}" target="_blank" rel="noopener">${icon(s.id)}<span class="sr-only">${esc(s.label)} (opens in a new tab)</span></a></li>`).join('');
}

let formCount = 0;
/**
 * The newsletter form. Normal builds keep the live contract (POST JSON to /api/subscribe via afroton-signup.js).
 * Static hosting has no endpoint: the form is a demo that validates the address and sends nothing (site.js).
 */
export function signupForm({ variant = 'dark', button = 'Keep me posted', label = 'E-mail address' } = {}) {
  const id = `signup-${++formCount}`;
  const open = STATIC ? `<form class="signup signup--${variant}" action="#" data-demo-signup novalidate>` : `<form class="signup signup--${variant}" method="post" action="/api/subscribe" novalidate>`;
  return html`${open}
  <label class="signup__label" for="${id}-email">${esc(label)}</label>
  <div class="signup__row">
    <input class="signup__input" id="${id}-email" type="email" name="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required maxlength="320">
    <button class="btn btn--sun signup__btn" type="submit"><span>${esc(button)}</span> ${icon('arrow')}</button>
  </div>
  ${STATIC ? '' : `<div class="signup__hp" aria-hidden="true"><label for="${id}-website">Website</label><input id="${id}-website" type="text" name="website" tabindex="-1" autocomplete="off"></div>`}
  ${STATIC
    ? '<p class="signup__consent">Design concept: this form is a demo and does not send your e-mail anywhere.</p>'
    : '<p class="signup__consent">By signing up you agree that Afroton e-mails you news about its events. Unsubscribe with the link in every mail. <a href="/privacy/">Privacy policy</a></p>'}
  <p class="signup__msg" role="status" aria-live="polite"></p>
</form>`;
}

export function newsletter() {
  return html`<section class="newsletter" aria-labelledby="newsletter-title">
  ${palmFrond({ seed: 5, className: 'newsletter__frond newsletter__frond--l' })}
  <div class="wrap newsletter__inner">
    <div class="newsletter__copy">
      <h2 class="display newsletter__title" id="newsletter-title">Stay tuned <span>for the next one</span></h2>
      <p>Leave your e-mail and be the first to hear about the next Afroton.</p>
    </div>
    ${signupForm()}
  </div>
</section>`;
}

function footer() {
  const cols = FOOTER_NAV.map((c) => html`<div class="footer-col">
      <h2 class="footer-col__title">${esc(c.title)}</h2>
      <ul>${c.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`)}</ul>
    </div>`);
  return html`<footer class="site-footer">
  <div class="wrap site-footer__grid">
    <div class="footer-brand">
      <a href="/" class="footer-brand__logo" aria-label="AFROTON, home">${img(SITE.logo, { alt: '', sizes: '160px', prefer: 300 })}</a>
      <p class="footer-brand__line">Welcome home.</p>
      <ul class="social-list">${socialItems()}</ul>
    </div>
    <nav class="footer-nav" aria-label="Footer">${cols}</nav>
    <div class="footer-contact">
      <h2 class="footer-col__title">Contact</h2>
      <p><a href="mailto:${ORG.email}">${ORG.email}</a></p>
      <address>${ORG.legalName}<br>${ORG.street}<br>${ORG.postcode} ${ORG.city}, ${ORG.country}</address>
      <p class="footer-contact__id">${ORG.enterprise}</p>
    </div>
  </div>
  <div class="wrap site-footer__legal">
    <p>© ${BUILD_YEAR} ${ORG.legalName}. AFROTON ®<span class="site-footer__concept">Unofficial website redesign concept. Not affiliated with Afroton.</span></p>
    <ul>
      <li><a href="/privacy/">Privacy policy</a></li>
      <li><a href="/terms-conditions/">Terms &amp; conditions</a></li>
      <li><a href="/privacy/#cookies" data-consent-open>Cookie settings</a></li>
    </ul>
  </div>
</footer>`;
}

// The cookie banner. The data-consent* attributes and the wording are the live site's (banner version 4/5,
// afroton-consent.js reads them); only the presentation is new.
function consentBanner() {
  const ads = SITE.ads;
  return html`<div class="consent" hidden data-consent role="dialog" aria-modal="false" aria-labelledby="consent-title" aria-describedby="consent-text">
  <div class="consent__head">${sun({ className: 'consent__sun' })}<p class="consent__title" id="consent-title" tabindex="-1">Cookies</p></div>
  <div class="consent__text" id="consent-text">
    <p>Afroton vzw would like to use cookies and similar technology for:</p>
    <ul>
      <li><b>Statistics</b>: Google Analytics counts which pages are visited.</li>
      <li><b>External media</b>: YouTube videos and Spotify players.</li>
      ${ads ? '<li><b>Advertising</b>: our own server tells Meta (Facebook, Instagram) which of our adverts lead to visits and ticket clicks.</li>' : ''}
    </ul>
    <p>Google, YouTube and Spotify then store or read data on your device.${ads ? ' For Advertising, our own server stores two cookies and sends Meta the data listed under Settings.' : ''} Nothing is loaded until you say yes. If you refuse, the whole site still works, tickets included. You can change or withdraw your choice at any time with "Cookie settings" at the bottom of every page. <a href="/privacy/#cookies">Privacy policy and full cookie list</a></p>
  </div>
  <fieldset class="consent__options" data-consent-options hidden>
    <legend class="sr-only">Choose per purpose</legend>
    <label class="consent__opt is-fixed"><input type="checkbox" checked disabled> <span><b>Strictly necessary</b> (always on): remembers this choice in your browser for 6 months. Not a cookie, nothing is sent.</span></label>
    <label class="consent__opt"><input type="checkbox" data-consent-opt="stats"> <span><b>Statistics</b>: Google Analytics (Google Ireland) counts page views and clicks. Cookies _ga and _ga_*, up to 13 months.</span></label>
    <label class="consent__opt"><input type="checkbox" data-consent-opt="media"> <span><b>External media</b>: plays the YouTube videos (Google) and Spotify players (Spotify AB) on the site; they set their own cookies. Without this, each player shows a button to load just that one.</span></label>
    ${ads ? '<label class="consent__opt"><input type="checkbox" data-consent-opt="ads"> <span><b>Advertising</b>: our server on afroton.eu sends Meta Platforms Ireland the pages you view and your ticket clicks, with your IP address, browser type and two cookies (_fbp, _fbc, 90 days), so we see which Facebook and Instagram adverts work. No Meta script loads in your browser.</span></label>' : ''}
    <button type="button" class="btn btn--sun btn--sm" data-consent-save>Save my choice</button>
  </fieldset>
  <div class="consent__actions">
    <button type="button" class="btn btn--outline btn--sm" data-consent-refuse>Refuse all</button>
    <button type="button" class="btn btn--outline btn--sm" data-consent-accept>Accept all</button>
    <button type="button" class="btn btn--link btn--sm" data-consent-choose>Settings</button>
  </div>
</div>`;
}

/**
 * Render a complete page.
 * p: { route, title, description, content, overlayHeader, shop, newsletter, ogImage, jsonLd, preloadImage, bodyClass, noindex }
 */
export function page(p, assets) {
  const config = { tag: SITE.gaTag, ads: SITE.ads, shop: !!p.shop };
  return html`<!doctype html>
<html lang="${SITE.lang}" class="no-js">
${head(p, assets)}
<body class="${p.bodyClass || ''}">
<a class="skip-link" href="#main">Skip to content</a>
${header(p)}
<main id="main" tabindex="-1">
${p.content}
</main>
${p.newsletter === false ? '' : newsletter()}
${footer()}
${consentBanner()}
<script type="application/json" id="afroton-consent-config">${JSON.stringify(config)}</script>
<script src="${assets.js}" defer></script>
<script src="/assets/js/afroton-consent.js" defer></script>
${STATIC ? '' : '<script src="/assets/js/afroton-signup.js" defer></script>'}
${p.shop ? '<script src="/assets/js/vendor/ot-shop-injector.js" defer></script>' : ''}
</body>
</html>
`;
}
