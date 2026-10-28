import { html, esc } from '../lib/html.mjs';
import { splitEvents, dateParts, upcomingWorkshops } from '../data/events.mjs';
import { SHOPS } from '../data/site.mjs';
import { icon } from '../components/icons.mjs';
import { pageHero, featuredEvent, pastEventCard, weeztixShop, sectionHead, sideEvent } from '../components/blocks.mjs';
import { eventLd } from './shared.mjs';

export default function tickets() {
  const { upcoming, past } = splitEvents();
  const next = upcoming[0];
  const intro = next
    ? `<strong>${esc(next.title)}</strong><br>${dateParts(next.start).long} · ${esc(next.hours)} · ${esc(next.venue ? `${next.venue}, ${next.city}` : next.venueNote)}`
    : 'New dates are on their way. Leave your e-mail below and be the first to hear about the next Afroton.';

  const content = html`
${pageHero({
  eyebrow: 'Events',
  title: 'Get your <span>tickets</span>',
  intro,
  image: '/media/2026-10/DSC02267-1200.jpg',
  position: '50% 40%',
  actions: next ? `<a class="btn btn--sun btn--lg" href="#tickets">To the ticket shop ${icon('arrow')}</a>` : '',
})}

<section class="section section--cream tickets-main" aria-labelledby="tickets-next-title">
  <div class="wrap">
    <h2 class="sr-only" id="tickets-next-title">Upcoming</h2>
    ${upcoming.map((e) => featuredEvent(e, { headingLevel: 3 }))}
    ${upcomingWorkshops().length ? `<div class="side-events">${upcomingWorkshops().map(sideEvent).join('')}</div>` : ''}
    <div class="shop-block" id="tickets">
      <div class="shop-block__head">
        <p class="eyebrow">Official ticket shop</p>
        <h2 class="display shop-block__title">Ticket shop</h2>
        <p class="shop-block__note">Tickets are sold through Weeztix. The shop asks its own question about its marketing cookies; refusing our cookies never blocks a ticket. Conditions: <a href="/terms-conditions/">terms &amp; conditions</a>.</p>
      </div>
      ${weeztixShop(SHOPS.tickets, 'Afroton ticket')}
    </div>
  </div>
</section>


<section class="section section--sand" aria-labelledby="last-time-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Past', title: 'About last time..', id: 'last-time-title', link: { href: '/photos-main/', label: 'See the pictures' } })}
    <p class="section-lead">Our yearly festival, one night in Roeselare. Relive it and find yourself in the pictures.</p>
    <div class="past-grid">${past.slice(0, 3).map((e) => pastEventCard(e))}</div>
  </div>
</section>
`;

  return {
    route: '/tickets/',
    title: 'Tickets',
    description: next
      ? `Tickets for ${next.title}: ${dateParts(next.start).long}, ${next.hours}. Buy them in the official Afroton ticket shop.`
      : 'Tickets for the next Afroton event, sold in the official Afroton ticket shop.',
    ogImage: next?.poster ? next.poster.replace('.webp', '.jpg') : undefined,
    shop: true,
    jsonLd: upcoming.map(eventLd),
    content,
  };
}
