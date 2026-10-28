import { html, esc } from '../lib/html.mjs';
import { ORG } from '../data/site.mjs';
import { ROSTER } from '../data/people.mjs';
import { icon } from '../components/icons.mjs';
import { pageHero, personCard, sectionHead } from '../components/blocks.mjs';

export default function bookings() {
  const mail = `mailto:${ORG.email}?subject=${encodeURIComponent('Booking request')}`;
  const apply = `mailto:${ORG.email}?subject=${encodeURIComponent('Join the Afroton roster')}`;
  const jump = html`<nav class="jump" aria-label="On this page"><ul role="list">
    ${ROSTER.map((r) => `<li><a href="#${r.id}">${esc(r.title.replace(/^Our /, ''))}</a></li>`)}
    <li><a href="https://pilli.be/" target="_blank" rel="noopener">Promotion ${icon('external')}<span class="sr-only">(Pilli, opens in a new tab)</span></a></li>
  </ul></nav>`;

  const content = html`
${pageHero({
  eyebrow: 'Bookings',
  title: 'Book the <span>vibe</span>',
  intro: 'Artists, dancers, DJ’s and MC’s from the Afroton family, for your stage, club or event.',
  compact: true,
  actions: `<a class="btn btn--sun btn--lg" href="${mail}">${icon('mail')} Booking request</a>`,
})}

<div class="section section--cream">
  <div class="wrap">
    ${jump}
    ${ROSTER.map((r) => html`<section class="roster" id="${r.id}" aria-labelledby="${r.id}-title">
      ${sectionHead({ title: esc(r.title), id: `${r.id}-title` })}
      <ul class="people" role="list">${r.people.map((p) => personCard({ name: p.name, role: p.style, image: p.image, href: p.href }))}</ul>
    </section>`)}
    <div class="cta-band">
      <p class="cta-band__text">Artist, dancer, DJ or MC? <strong>Apply</strong> and join us.</p>
      <a class="btn btn--dark btn--lg" href="${apply}">${icon('mail')} Join us</a>
    </div>
  </div>
</div>
`;
  return {
    route: '/bookings/',
    title: 'Bookings',
    description: 'Book Afroton artists, dancers, DJ’s and MC’s: TJ WEST, Waruti and the rest of the Afroton family.',
    content,
  };
}
