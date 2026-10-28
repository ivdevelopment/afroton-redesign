import { html } from '../lib/html.mjs';
import { img } from '../lib/img.mjs';
import { ORG } from '../data/site.mjs';
import { TEAM } from '../data/people.mjs';
import { icon } from '../components/icons.mjs';
import { pageHero, sectionHead, personCard } from '../components/blocks.mjs';
import { tornSide } from '../components/decor.mjs';

export default function about() {
  const content = html`
${pageHero({
  eyebrow: 'Our story',
  title: 'Welcome <span>home</span>',
  intro: 'A place where you don’t have to explain yourself. Where you can speak your language loudly. Where you feel joy surrounded by beautiful souls. Where you’re safe and where you belong.',
  image: '/wp-content/uploads/2026/08/DSA04685-scaled.webp',
  position: '50% 35%',
})}

<section class="section section--cream" aria-labelledby="movement-title">
  <div class="wrap split split--text">
    <div>
      <p class="eyebrow">Who we are</p>
      <h2 class="display" id="movement-title">The <span class="hl">movement</span></h2>
    </div>
    <div class="split__body">
      <p class="lead">Afroton is known for high vibrational parties, blending many cultures and building a strong community. Our movement is so much more than that.</p>
      <p>We created Afroton to bring cultures, people &amp; music together with workshops, events and creation. We manage artists, dancers, DJ’s – give workshops &amp; organise events – create multicultural synergy in the world.</p>
      <a class="btn btn--dark" href="mailto:${ORG.email}">${icon('mail')} Meet us</a>
    </div>
  </div>
</section>

<section class="story story--page" aria-labelledby="origin-title">
  <div class="story__media">
    ${img('/wp-content/uploads/2026/03/DSC06175-scaled.jpg', { alt: 'AFROTON flags on stage above the crowd', sizes: '(min-width: 900px) 50vw, 100vw', prefer: 1536 })}
  </div>
  <div class="story__panel">
    ${tornSide({ seed: 37, className: 'story__tear' })}
    <div class="story__content">
      <p class="eyebrow eyebrow--sun">Since 2024</p>
      <h2 class="display story__title" id="origin-title">Born in <span>Roeselare</span></h2>
      <p class="story__manifesto">Founded in Roeselare, Belgium, Afroton is looking to spread our infectious Afro Latin vibes worldwide.</p>
      <p>Originally a release party for TJ WEST &amp; IZZY, it grew out to bring people together from all over the world with festivals and international club events. We’re growing into a cultural platform, where we facilitate connection between ethnicities and synergy between creatives.</p>
      <div class="story__actions">
        <a class="btn btn--sun" href="/tickets/">Upcoming events ${icon('arrow')}</a>
        <a class="link-arrow link-arrow--light" href="/photos-main/">See the pictures ${icon('arrow')}</a>
      </div>
    </div>
  </div>
</section>


<section class="section section--cream" aria-labelledby="team-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'The people behind it', title: 'Meet the team', id: 'team-title', link: { href: '/bookings/', label: 'Our artists' } })}
    <ul class="people" role="list">${TEAM.map(personCard)}</ul>
    <div class="cta-band">
      <p class="cta-band__text">Want to work with us, or just say hi?</p>
      <a class="btn btn--sun btn--lg" href="mailto:${ORG.email}">${icon('mail')} ${ORG.email}</a>
    </div>
  </div>
</section>
`;
  return {
    route: '/about-us/',
    title: 'Our story',
    description: 'Founded in Roeselare, Belgium, in 2024, Afroton brings cultures, people and music together with festivals, club events and workshops. Meet the team.',
    ogImage: '/wp-content/uploads/2026/03/DSC06175-scaled.jpg',
    content,
  };
}
