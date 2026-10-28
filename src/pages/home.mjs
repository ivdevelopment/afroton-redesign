import { html, esc } from '../lib/html.mjs';
import { img, sources } from '../lib/img.mjs';
import { splitEvents, dateParts, upcomingWorkshops } from '../data/events.mjs';
import { GENRES } from '../data/site.mjs';
import { icon } from '../components/icons.mjs';
import { palmFrond, brushUnderline, tornSide, tornEdge, sun } from '../components/decor.mjs';
import { ticker, sectionHead, featuredEvent, pastEventCard, partnersStrip, sideEvent } from '../components/blocks.mjs';
import { eventLd } from './shared.mjs';

const HERO = '/wp-content/uploads/2026/08/DSA03353-1-scaled.webp';
const HERO_MOBILE = '/wp-content/uploads/2026/08/DSA05903-scaled.webp';

// The gallery strip: real nights, warm light, people first.
const STRIP = [
  { src: '/media/2026-10/DSC02749-1200.jpg', alt: 'A dancer with a crown of curls under green and red light, 10 October 2026', set: '2026-10-10' },
  { src: '/media/2026-05-16/3Y7A1170-1200.jpg', alt: 'Two friends laughing on the dance floor, 16 May 2026', set: '2026-05-16' },
  { src: '/media/2026-10/DSC02267-1200.jpg', alt: 'The crowd facing the stage at the AFROTON festival, 10 October 2026', set: '2026-10-10' },
  { src: '/media/2026-05-16/3Y7A1209-1200.jpg', alt: 'A smiling guest in red light, 16 May 2026', set: '2026-05-16' },
  { src: '/media/2025-09-27/DSC06305-1200.jpg', alt: 'An AFROTON flag above a dancing crowd in purple light, 27 September 2025', set: '2025-09-27' },
  { src: '/media/2026-05-16/3Y7A1175-1200.jpg', alt: 'A guest dancing with his arms out, 16 May 2026', set: '2026-05-16' },
  { src: '/media/2026-10/DSC02609-1200.jpg', alt: 'Two friends smiling for the camera, 10 October 2026', set: '2026-10-10' },
];

export default function home() {
  const { upcoming, past } = splitEvents();
  const workshops = upcomingWorkshops();
  const next = upcoming[0];
  const hero = sources(HERO, 1600);
  const heroM = sources(HERO_MOBILE, 1200);

  const nextCard = next
    ? html`<a class="hero-next" href="${next.tickets}">
        <span class="hero-next__label">${sun()} Next up</span>
        <span class="hero-next__date"><time datetime="${next.start.slice(0, 10)}">${dateParts(next.start).medium}</time></span>
        <span class="hero-next__title">${esc(next.title)}</span>
        <span class="hero-next__meta">${esc(next.hours)} · ${esc(next.venue ? `${next.venue}, ${next.city}` : next.venueNote)}</span>
        <span class="hero-next__cta">Tickets ${icon('arrow')}</span>
      </a>`
    : '';

  const content = html`
<section class="hero" aria-labelledby="hero-title">
  <picture class="hero__media">
    <source media="(max-width: 700px)" srcset="${heroM.srcset}" sizes="100vw" width="${heroM.width}" height="${heroM.height}">
    <img src="${hero.src}" srcset="${hero.srcset}" sizes="100vw" width="${hero.width}" height="${hero.height}" alt="A packed AFROTON crowd dancing under the stage lights" fetchpriority="high">
  </picture>
  <div class="hero__shade" aria-hidden="true"></div>
  <div class="wrap hero__inner">
    <p class="hero__genres">${GENRES.map((g) => `<span>${esc(g)}</span>`).join('')}</p>
    <h1 class="hero__title" id="hero-title"><span class="hero__line">Welcome</span> <span class="hero__line hero__line--home">home${brushUnderline({ className: 'hero__brush' })}</span></h1>
    <p class="hero__lead">A place where you don’t have to explain yourself. Where you can speak your language loudly.</p>
    <div class="hero__actions">
      <a class="btn btn--sun btn--lg" href="${next ? next.tickets : '/tickets/'}">Get tickets ${icon('arrow')}</a>
      <a class="btn btn--ghost btn--lg" href="/about-us/">Our story</a>
    </div>
  </div>
  <div class="wrap hero__foot">${nextCard}</div>
</section>

${ticker()}

<section class="events" aria-labelledby="events-title">
  ${palmFrond({ seed: 3, className: 'events__frond events__frond--l' })}
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Next up', title: 'Upcoming events', id: 'events-title', link: { href: '/tickets/', label: 'All events & tickets' } })}
    ${next
      ? featuredEvent(next)
      : `<p class="events__empty">New dates are on their way. <a href="#newsletter-title">Leave your e-mail</a> and be the first to hear about the next Afroton.</p>`}
    ${workshops.length ? `<div class="side-events">${workshops.map(sideEvent).join('')}</div>` : ''}
    ${upcoming.slice(1).length ? `<div class="past-grid past-grid--upcoming">${upcoming.slice(1).map((e) => featuredEvent(e))}</div>` : ''}
    <div class="past">
      <div class="past__head">
        <h3 class="past__title">Past editions</h3>
        <p class="past__sub">Relive the nights and find yourself in the pictures.</p>
      </div>
      <div class="past-grid">${past.slice(0, 3).map((e) => pastEventCard(e, { headingLevel: 4 }))}</div>
    </div>
  </div>
</section>

<section class="story" aria-labelledby="story-title">
  ${tornEdge({ seed: 23, edge: 'top', className: 'story__tear-top' })}
  <div class="story__media">
    ${img('/media/2025-09-27/DSC04398-1200.jpg', { alt: 'Four friends posing in front of the AFROTON wall, 27 September 2025', sizes: '(min-width: 900px) 48vw, 100vw', prefer: 800 })}
  </div>
  <div class="story__panel">
    ${tornSide({ seed: 31, className: 'story__tear' })}
    <div class="story__content">
      <p class="eyebrow eyebrow--sun">Our story</p>
      <h2 class="display story__title" id="story-title">More than <span>a movement</span></h2>
      <p class="story__manifesto">Welcome home. A place where you don’t have to explain yourself. Where you can speak your language loudly. Where you feel joy surrounded by beautiful souls. Where you’re safe and where you belong.</p>
      <p>In 2024 we started out in our hometown, Roeselare. A small city in a small country. The first edition was so successful it launched the brand worldwide.</p>
      <div class="story__actions">
        <a class="btn btn--sun" href="/about-us/">Read our story ${icon('arrow')}</a>
        <a class="link-arrow link-arrow--light" href="/community/">Join the community ${icon('arrow')}</a>
      </div>
    </div>
  </div>
</section>

<section class="energy" aria-labelledby="energy-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Gallery', title: 'Feel the energy', id: 'energy-title', link: { href: '/photos-main/', label: 'View all photos' } })}
  </div>
  <ul class="strip" role="list">
    ${STRIP.map((s) => `<li class="strip__item"><a href="/photos-main/#set-${s.set}">${img(s.src, { alt: s.alt, sizes: '(min-width: 900px) 22vw, 60vw', prefer: 600 })}</a></li>`)}
  </ul>
  <p class="wrap energy__credit">${icon('camera')} Photos: Goetshots, Arjen Visuals</p>
</section>

<section class="platform" aria-labelledby="platform-title">
  <div class="wrap platform__inner">
    <div class="platform__copy">
      <p class="eyebrow eyebrow--sun">Become a partner</p>
      <h2 class="display platform__title" id="platform-title">“More than a movement, <span>it’s a cultural platform”</span></h2>
    </div>
    <div class="platform__text">
      <p>Afroton is an Afro-Latin inspired movement creating connection, joy and cultural synergy in the whole world. Based in Belgium, Afroton has taken over the European Afro-Latin scene in just 1 year with festivals, club parties &amp; collaborations with creatives.</p>
      <a class="btn btn--outline-light" href="/sponsor/">Partner with us ${icon('arrow')}</a>
    </div>
  </div>
</section>
${partnersStrip({ cta: false })}
`;

  return {
    route: '/',
    title: 'Home',
    description: 'AFROTON is an Afro-Latin inspired movement from Roeselare, Belgium: festivals, club nights and workshops where music, people and culture come together. Welcome home.',
    overlayHeader: true,
    bodyClass: 'is-home',
    preloadImage: [
      { href: hero.src, srcset: hero.srcset, sizes: '100vw', media: '(min-width: 701px)' },
      { href: heroM.src, srcset: heroM.srcset, sizes: '100vw', media: '(max-width: 700px)' },
    ],
    jsonLd: [...upcoming.map(eventLd), ...workshops.map(eventLd)],
    content,
  };
}
