// Section-level building blocks shared by the pages.
import { html, esc } from '../lib/html.mjs';
import { img } from '../lib/img.mjs';
import { dateParts } from '../data/events.mjs';
import { PARTNERS } from '../data/people.mjs';
import { icon } from './icons.mjs';
import { sun, palmFrond, tornEdge } from './decor.mjs';

/** The yellow AFROTON band. Decorative: the moving copy is hidden from assistive tech; a button pauses it. */
export function ticker({ words = ['AFROTON'], tone = 'sun' } = {}) {
  const run = Array.from({ length: 8 }, (_, i) => `<span class="ticker__word">${esc(words[i % words.length])}</span>${sun({ className: 'ticker__sun' })}`).join('');
  return html`<div class="ticker ticker--${tone}" data-ticker>
  <div class="ticker__track" aria-hidden="true"><div class="ticker__run">${run}</div><div class="ticker__run">${run}</div></div>
  <button class="ticker__toggle" type="button" aria-pressed="false" data-ticker-toggle>${icon('pause', { className: 'ticker__pause' })}${icon('play', { className: 'ticker__play' })}<span class="sr-only">Pause the moving banner</span></button>
</div>`;
}

/** Eyebrow + brush heading (+ optional link on the right). */
export function sectionHead({ eyebrow, title, id, link, tone = 'light', level = 2, className = '' }) {
  const h = `h${level}`;
  return html`<div class="section-head section-head--${tone} ${className}">
  <div>
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <${h} class="display section-head__title"${id ? ` id="${id}"` : ''}>${title}</${h}>
  </div>
  ${link ? `<a class="link-arrow" href="${link.href}">${esc(link.label)} ${icon('arrow')}</a>` : ''}
</div>`;
}

/** Calendar block: SAT / 19 / DEC */
export function dateBadge(iso, className = '') {
  const d = dateParts(iso);
  return html`<p class="date-badge ${className}" aria-hidden="true"><span class="date-badge__wd">${d.weekday}</span><span class="date-badge__day">${d.day}</span><span class="date-badge__mon">${d.month}</span></p>`;
}

/** The featured upcoming event: photo with date badge, then an editorial block: when, what, where, tickets. */
export function featuredEvent(e, { headingLevel = 3 } = {}) {
  const d = dateParts(e.start);
  const where = e.venue ? `${e.venue}, ${e.city}` : e.venueNote;
  const h = `h${headingLevel}`;
  return html`<article class="feature-event" aria-labelledby="ev-${e.id}">
  <div class="feature-event__media">
    ${img(e.image, { alt: e.imageAlt, sizes: '(min-width: 1100px) 560px, (min-width: 760px) 46vw, 100vw', prefer: 800 })}
    ${dateBadge(e.start, 'feature-event__badge')}
  </div>
  <div class="feature-event__body">
    ${e.tags && e.tags.length ? `<p class="feature-event__kicker">${e.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>` : ''}
    <${h} class="feature-event__title" id="ev-${e.id}">${esc(e.title)}</${h}>
    <p class="feature-event__blurb">${esc(e.blurb)}</p>
    <dl class="facts">
      <div><dt>Date</dt><dd>${d.long}</dd></div>
      <div><dt>Hours</dt><dd>${esc(e.hours)}</dd></div>
      <div><dt>Location</dt><dd>${esc(where)}</dd></div>
    </dl>
    <div class="feature-event__actions">
      <a class="btn btn--sun btn--lg" href="${e.tickets}">Get tickets ${icon('arrow')}</a>
    </div>
  </div>
</article>`;
}

/** Secondary upcoming item (a workshop): one compact row under the featured event. */
export function sideEvent(w) {
  const d = dateParts(w.start);
  return html`<a class="side-event" href="${w.tickets}">
  <span class="side-event__media">${img(w.image, { alt: '', sizes: '120px', prefer: 300 })}</span>
  <span class="side-event__body">
    <span class="side-event__label">Also coming up · <time datetime="${w.start.slice(0, 10)}">${d.medium}</time></span>
    <span class="side-event__title">${esc(w.title)} <span>with ${esc(w.host)}</span></span>
    <span class="side-event__meta">${esc(w.hours)} · ${esc(w.venue)}, ${esc(w.city)} · ${esc(w.price)}</span>
  </span>
  <span class="side-event__cta">Free ticket ${icon('arrow')}</span>
</a>`;
}

/** A past edition: a quieter photo card that leads to its photo set. */
export function pastEventCard(e, { headingLevel = 3 } = {}) {
  const d = dateParts(e.start);
  const h = `h${headingLevel}`;
  return html`<article class="past-card">
  <a class="past-card__link" href="${e.photos}">
    <div class="past-card__media">
      ${img(e.image, { alt: '', sizes: '(min-width: 1100px) 400px, (min-width: 640px) 33vw, 80vw', prefer: 600 })}
    </div>
    <div class="past-card__body">
      <p class="past-card__label"><time datetime="${e.start}">${d.medium}</time></p>
      <${h} class="past-card__title">${esc(e.title)}</${h}>
      <p class="past-card__where">${esc(e.venue)}, ${esc(e.city)}</p>
      <span class="past-card__cta">See the pictures ${icon('arrow')}</span>
    </div>
  </a>
</article>`;
}

/** Inner-page hero: photo (optional), brush title, eyebrow and intro. */
export function pageHero({ eyebrow, title, intro, image, imageAlt = '', position = 'center', tone = 'dark', actions = '', compact = false }) {
  return html`<section class="page-hero page-hero--${tone}${image ? ' page-hero--photo' : ''}${compact ? ' page-hero--compact' : ''}">
  ${image ? `<div class="page-hero__media" style="--pos:${position}">${img(image, { alt: imageAlt, sizes: '(max-width: 700px) 150vw, 100vw', prefer: 1600, priority: true })}</div>` : ''}
  ${!image ? palmFrond({ seed: 13, className: 'page-hero__frond' }) : ''}
  <div class="wrap page-hero__inner">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h1 class="display page-hero__title">${title}</h1>
    ${intro ? `<p class="page-hero__intro">${intro}</p>` : ''}
    ${actions ? `<div class="page-hero__actions">${actions}</div>` : ''}
  </div>
  ${tornEdge({ seed: 17, edge: 'bottom', className: 'page-hero__tear' })}
</section>`;
}

/** Confirmed partners only (the live home page's "supported by" list). */
export function partnersStrip({ title = 'Supported by', id = 'supported', cta = true } = {}) {
  return html`<section class="partners" aria-labelledby="${id}-title" id="${id}">
  <div class="wrap partners__inner">
    <div class="partners__head">
      <h2 class="eyebrow eyebrow--sun" id="${id}-title">${esc(title)}</h2>
      ${cta ? `<a class="link-arrow link-arrow--light" href="/sponsor/">Become a partner ${icon('arrow')}</a>` : ''}
    </div>
    <ul class="partners__list">
      ${PARTNERS.map((p) => `<li><a href="${esc(p.url)}" target="_blank" rel="noopener" class="partners__item">${img(p.logo, { alt: p.name + ' (opens in a new tab)', sizes: '200px', prefer: 300, style: `--s:${p.scale || 1}` })}</a></li>`)}
    </ul>
  </div>
</section>`;
}

/**
 * Consent-gated player. afroton-consent.js swaps the <template> in on an External media yes,
 * or for this one player when its button is pressed.
 */
export function mediaEmbed({ kind, src, title, poster, height = 352 }) {
  const isYt = kind === 'youtube';
  const frame = isYt
    ? `<iframe src="${esc(src)}" title="${esc(title)}" width="560" height="315" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>`
    : `<iframe src="${esc(src)}" title="${esc(title)}" width="100%" height="${height}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
  const text = isYt
    ? 'This video is on YouTube. Playing it loads YouTube, which can store cookies and similar data on your device.'
    : 'This player is from Spotify. Loading it lets Spotify store cookies and similar data on your device.';
  return html`<div class="embed embed--${kind}" data-afroton-media='{"kind":"${kind}"}'${isYt ? '' : ` style="--h:${height}px"`}>
  <template>${frame}</template>
  <div class="embed__ph">
    ${poster ? img(poster, { alt: '', sizes: '(min-width: 900px) 50vw, 100vw', className: 'embed__poster' }) : ''}
    <div class="embed__box">
      <p class="embed__title">${isYt ? icon('youtube') : icon('spotify')} ${esc(title)}</p>
      <p class="embed__text">${text}</p>
      <div class="embed__actions">
        <button type="button" class="btn btn--sun btn--sm" data-afroton-load>${isYt ? `${icon('play')} Play video` : 'Load the Spotify player'}</button>
        <a class="embed__settings" href="/privacy/#cookies" data-consent-open>Cookie settings</a>
      </div>
    </div>
  </div>
</div>`;
}

/** Weeztix ticket shop (the vendor injector turns .ot-iframe into the shop frame). */
export function weeztixShop(url, label) {
  const guid = url.split('/').pop();
  return html`<div class="shop">
  <div class="ot-iframe" data-ot-url="${esc(url)}" data-ot-guid="${esc(guid)}"></div>
  <noscript><p class="shop__fallback">The ticket shop needs JavaScript. <a href="${esc(url)}">Open the ${esc(label)} shop on Weeztix</a>.</p></noscript>
  <p class="shop__fallback shop__fallback--js">Shop not showing? <a href="${esc(url)}" target="_blank" rel="noopener">Open the ${esc(label)} shop on Weeztix ${icon('external')}</a></p>
</div>`;
}

/** Portrait card for team members and roster. */
export function personCard({ name, role, image, href }) {
  const inner = html`<div class="person__media">${img(image, { alt: '', sizes: '(min-width: 1100px) 260px, (min-width: 640px) 30vw, 45vw', prefer: 768 })}</div>
    <h3 class="person__name">${esc(name)}</h3>
    <p class="person__role">${esc(role)}</p>`;
  return href
    ? `<li class="person person--link"><a href="${href}">${inner}<span class="person__more">${icon('arrow')}<span class="sr-only">About ${esc(name)}</span></span></a></li>`
    : `<li class="person">${inner}</li>`;
}
