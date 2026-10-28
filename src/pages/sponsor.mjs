import { html, esc } from '../lib/html.mjs';
import { img } from '../lib/img.mjs';
import { ORG } from '../data/site.mjs';
import { TRACK_RECORD } from '../data/events.mjs';
import { icon } from '../components/icons.mjs';
import { pageHero, partnersStrip } from '../components/blocks.mjs';

// Figures, track record and the (Dutch) festival opportunities are Afroton's own, as published on /sponsor/.
const PILLARS = [
  { title: 'Unique movement', text: 'Afroton is the biggest Afro-Latin movement with over 5 events per year and an incredible following' },
  { title: 'Influencers', text: 'Afroton works closely with international influencers, accumulating to a reach of 20M followers' },
  { title: 'Community', text: 'Afroton has a very engaged community, eager to follow us wherever we go' },
];
const AUDIENCE = [
  { pct: '49%', text: 'Our core audience are of the Afro Latino diaspora aged 20-30' },
  { pct: '19%', text: 'Our second core audience are of the Latin diaspora aged 20-30' },
  { pct: '18%', text: 'A fair group of our fans are between 30-60 years old, African (54%), European (28%) and Latin (18%) based in Belgium' },
  { pct: '14%', text: 'People from outside of Belgium, travelling from Portugal, UK, Africa, the Netherlands, Spain, …' },
];
const OPPORTUNITIES = [
  ['HERAS', 'claim jouw spot op één (of meerdere) van onze 20 HERASsen'],
  ['Showcase aan de ingang', 'vertoon jouw product aan meer dan 1.000 enthousiaste bezoekers'],
  ['VIP & BEHIND THE DJ coverage', 'de beste brand awareness gebeurt in de zaal, achter de DJ in de VIP tafel'],
  ['Social media', 'wordt gezien door ons enorm bereik (1M+ viewers via organic & advertising)'],
  ['Actie', 'doe een winactie met jouw product'],
  ['Hoofdsponsor', 'wordt hoofdsponsor van onze movement/deze editie'],
  ['Teambuilding', 'kom op teambuilding met jouw bedrijf en geniet van goedkopere tickets en andere voordelen'],
  ['Branded cocktail', 'noem een drankje naar jouw bedrijf'],
  ['Op maat', 'stel gerust zelf iets voor, we denken graag samen met jou ‘out of the box’'],
];

export default function sponsor() {
  const mail = `mailto:${ORG.email}?subject=${encodeURIComponent('Partnership Afroton')}`;
  const content = html`
${pageHero({
  eyebrow: 'Partners',
  title: 'Invest in <span>culture</span>',
  intro: '‘Afroton is more than a movement, it’s a cultural platform.’',
  image: '/wp-content/uploads/2026/08/DSA05903-scaled.webp',
  position: '50% 30%',
  actions: `<a class="btn btn--sun btn--lg" href="#contact">Become a partner ${icon('arrow')}</a>`,
})}

<section class="section section--cream" aria-labelledby="platform-about">
  <div class="wrap split split--text">
    <div>
      <p class="eyebrow">Our story</p>
      <h2 class="display" id="platform-about">A cultural <span class="hl">platform</span></h2>
    </div>
    <div class="split__body">
      <p class="lead">Afroton is an Afro-Latin inspired movement creating connection, joy and cultural synergy in the whole world. Based in Belgium, Afroton has taken over the European Afro-Latin scene in just 1 year with festivals, club parties &amp; collaborations with creatives.</p>
    </div>
  </div>
  <div class="wrap">
    <ul class="pillars" role="list">
      ${PILLARS.map((p) => `<li class="pillar"><h3 class="pillar__title">${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`)}
    </ul>
  </div>
</section>

<section class="section section--dark" aria-labelledby="audience-title">
  <div class="wrap audience">
    <div>
      <p class="eyebrow eyebrow--sun">Who comes</p>
      <h2 class="display audience__title" id="audience-title">Our <span>audience</span></h2>
      <figure class="press">
        ${img('/wp-content/uploads/2026/01/Schermafbeelding-2026-01-06-151909.webp', { alt: 'Newspaper article: “Festival Afroton lokt 1.000 bezoekers naar Trax”', sizes: '(min-width: 900px) 480px, 90vw', prefer: 768 })}
        <figcaption>In the press: the festival at Trax, Roeselare.</figcaption>
      </figure>
    </div>
    <ul class="stats" role="list">
      ${AUDIENCE.map((a) => `<li class="stat"><span class="stat__pct">${esc(a.pct)}</span><p>${esc(a.text)}</p></li>`)}
    </ul>
  </div>
</section>


<section class="section section--cream" aria-labelledby="track-title">
  <div class="wrap track">
    <div class="track__head">
      <p class="eyebrow">Since November 2024</p>
      <h2 class="display" id="track-title">Track <span class="hl">record</span></h2>
      <a class="btn btn--dark" href="#contact">Invest in culture ${icon('arrow')}</a>
    </div>
    <ol class="timeline" role="list">
      ${TRACK_RECORD.map((t) => `<li class="timeline__item${t.visitors ? '' : ' timeline__item--open'}"><span class="timeline__date">${esc(t.date)}</span><span class="timeline__place">${esc(t.place)}</span>${t.visitors ? `<span class="timeline__count">${esc(t.visitors)}</span>` : ''}</li>`)}
    </ol>
  </div>
</section>

<section class="section section--sand" aria-labelledby="opps-title" lang="nl">
  <div class="wrap opps">
    <figure class="opps__plan">
      ${img('/wp-content/uploads/2026/08/Plan-of-Trax-Afroton-1-scaled.webp', { alt: 'Plattegrond van site TRAX voor het Afroton festival', sizes: '(min-width: 900px) 380px, 80vw', prefer: 768 })}
    </figure>
    <div>
      <p class="eyebrow">Festival</p>
      <h2 class="display" id="opps-title">The festival <span class="hl">opportunities</span></h2>
      <p class="lead">Site TRAX is een eventparadijs in het hartje van Roeselare. Op nog geen 100m van het station is het super makkelijk bereikbaar voor intercity verkeer. Daarbovenop: een walhalla voor sponsoringsmogelijkeden. We onderscheiden de grootste mogelijkheden:</p>
      <ul class="opps__list" role="list">
        ${OPPORTUNITIES.map(([t, d]) => `<li><b>${esc(t)}</b>: ${esc(d)}</li>`)}
      </ul>
    </div>
  </div>
</section>

<section class="section section--cream contact-band contact-band--light" id="contact" aria-labelledby="contact-title">
  <div class="wrap contact-band__inner">
    <div>
      <p class="eyebrow">Meet us</p>
      <h2 class="display contact-band__title" id="contact-title">Let’s build <span>something together</span></h2>
    </div>
    <div class="contact-band__actions">
      <p>Tell us about your brand and what you have in mind: <strong>${ORG.email}</strong></p>
      <a class="btn btn--dark btn--lg" href="${mail}">${icon('mail')} Mail us</a>
    </div>
  </div>
</section>

${partnersStrip({ cta: false })}
`;
  return {
    route: '/sponsor/',
    title: 'Partners',
    description: 'Partner with Afroton, the Afro-Latin inspired cultural platform from Belgium: audience, track record and the sponsorship opportunities at our festival at Trax, Roeselare.',
    ogImage: '/wp-content/uploads/2026/08/DSA05903-scaled.webp',
    content,
  };
}
