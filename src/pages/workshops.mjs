import { html, esc } from '../lib/html.mjs';
import { img } from '../lib/img.mjs';
import { SHOPS } from '../data/site.mjs';
import { WORKSHOPS, upcomingWorkshops, dateParts } from '../data/events.mjs';
import { icon } from '../components/icons.mjs';
import { pageHero, weeztixShop } from '../components/blocks.mjs';
import { eventLd } from './shared.mjs';

// The live workshops page: status line, heading, text, poster and its Weeztix shop (anchor #tickets, as live).
export default function workshops() {
  const w = WORKSHOPS[0];
  const d = dateParts(w.start);
  const upcoming = upcomingWorkshops().includes(w);
  const content = html`
${pageHero({
  eyebrow: 'Workshops',
  title: 'Learn the <span>rhythm</span>',
  intro: 'Afroton is more than a party. We bring cultures, people &amp; music together with workshops, events and creation.',
  compact: true,
})}

<section class="section section--cream" aria-labelledby="workshop-title">
  <div class="wrap workshop">
    <figure class="workshop__poster">
      ${img(w.image, { alt: w.imageAlt, sizes: '(min-width: 900px) 420px, 90vw', prefer: 819 })}
    </figure>
    <div class="workshop__body">
      <p class="eyebrow"><time datetime="${w.start.slice(0, 10)}">${upcoming ? 'Upcoming' : 'Past'} · ${d.medium}</time></p>
      <h2 class="display workshop__title" id="workshop-title">${esc(w.title)} <span>with ${esc(w.host)}</span></h2>
      <p class="lead">${esc(w.blurb)}</p>
      <dl class="facts workshop__facts">
        <div><dt>Date</dt><dd>${d.long}</dd></div>
        <div><dt>Hours</dt><dd>${esc(w.hours)}</dd></div>
        <div><dt>Location</dt><dd>${esc(w.venue)}, ${esc(w.city)}</dd></div>
      </dl>
      <div class="workshop__actions">
        <a class="btn btn--sun btn--lg" href="#tickets">Free ticket ${icon('arrow')}</a>
        <a class="link-arrow" href="/tickets/">Events ${icon('arrow')}</a>
      </div>
    </div>
  </div>
  <div class="wrap shop-block" id="tickets">
    <div class="shop-block__head">
      <p class="eyebrow">Official shop</p>
      <h2 class="display shop-block__title">Workshop tickets</h2>
      <p class="shop-block__note">Places are booked through Weeztix. Conditions: <a href="/terms-conditions/">terms &amp; conditions</a>.</p>
    </div>
    ${weeztixShop(SHOPS.workshops, 'Afroton workshop')}
  </div>
</section>
`;
  return {
    route: '/workshops/',
    title: 'Workshops',
    description: 'Free djembé workshop with Sidy of Jali Kunda: Thursday 5 November 2026, 19–20h, at Trax in Roeselare. Get your free ticket in the Afroton shop.',
    ogImage: w.image,
    shop: true,
    jsonLd: upcoming ? [eventLd(w)] : [],
    content,
  };
}
