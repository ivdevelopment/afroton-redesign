import fs from 'node:fs';
import path from 'node:path';
import { html } from '../lib/html.mjs';
import { pageHero } from '../components/blocks.mjs';

// Legal texts are kept word for word from the live site (src/content/*.html, converted from the WordPress pages).
const read = (f) => fs.readFileSync(path.resolve(import.meta.dirname, '../content', f), 'utf8');

export function privacy() {
  return {
    route: '/privacy/',
    title: 'Privacy policy',
    description: 'How Afroton vzw handles personal data on afroton.eu: cookies and consent, statistics, external media, advertising, tickets, the newsletter and your rights.',
    content: html`
${pageHero({ eyebrow: 'Legal', title: 'Privacy <span>policy</span>', intro: 'Version 2.3 — 21 October 2026', compact: true })}
<div class="section section--cream legal">
  <div class="wrap legal__wrap">
    <article class="prose legal__body">${read('privacy.html')}</article>
  </div>
</div>`,
  };
}

export function terms() {
  return {
    route: '/terms-conditions/',
    title: 'Terms & conditions',
    description: 'Algemene voorwaarden – General Terms and Conditions of Afroton vzw for tickets and events.',
    content: html`
${pageHero({ eyebrow: 'Legal', title: 'Terms &amp; <span>conditions</span>', intro: 'Algemene voorwaarden – General Terms and Conditions', compact: true })}
<div class="section section--cream legal">
  <div class="wrap legal__wrap">
    <article class="prose legal__body" lang="nl">${read('terms.html').replace('<span id="english" class="anchor"></span>', '</article><article class="prose legal__body legal__body--en" lang="en"><span id="english" class="anchor"></span>')}</article>
  </div>
</div>`,
  };
}

export function notFound() {
  return {
    route: '/404/',
    file: '404.html',
    title: 'Page not found',
    description: 'This page does not exist (anymore).',
    noindex: true,
    content: html`
${pageHero({
  eyebrow: '404',
  title: 'Lost on the <span>dance floor?</span>',
  intro: 'This page does not exist (anymore). Let’s get you back home.',
  actions: '<a class="btn btn--sun btn--lg" href="/">Back home</a><a class="btn btn--ghost btn--lg" href="/tickets/">Tickets</a>',
})}`,
  };
}
