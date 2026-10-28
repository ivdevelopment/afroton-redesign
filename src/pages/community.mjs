import { html, esc } from '../lib/html.mjs';
import { img } from '../lib/img.mjs';
import { SOCIALS } from '../data/site.mjs';
import { icon } from '../components/icons.mjs';
import { signupForm } from '../components/layout.mjs';
import { pageHero } from '../components/blocks.mjs';
import { palmFrond } from '../components/decor.mjs';

export default function community() {
  const content = html`
${pageHero({
  eyebrow: 'Community',
  title: 'Join the <span>#afroton</span> community',
  intro: 'Be the first to know about revelations, new events &amp; exclusive invites.',
  compact: true,
})}

<section class="section section--cream community" aria-labelledby="join-title">
  ${palmFrond({ seed: 15, className: 'community__frond' })}
  <div class="wrap community__grid">
    <div class="community__form">
      <p class="eyebrow">Newsletter</p>
      <h2 class="display community__title" id="join-title">Stay in <span>the loop</span></h2>
      <p class="lead">Leave your e-mail and be the first to hear about the next Afroton.</p>
      ${signupForm({ variant: 'light', button: 'Join' })}
    </div>
    <figure class="community__poster">
      ${img('/wp-content/uploads/2026/01/Bday-bash-post-afroton-.webp', { alt: 'AFROTON guests dancing, one of them with a hand fan', sizes: '(min-width: 900px) 420px, 90vw', prefer: 819 })}
    </figure>
  </div>
</section>


<section class="section section--dark" aria-labelledby="follow-title">
  <div class="wrap">
    <p class="eyebrow eyebrow--sun">Follow along</p>
    <h2 class="display follow__title" id="follow-title">Find us <span>online</span></h2>
    <ul class="follow" role="list">
      ${SOCIALS.map((s) => `<li><a class="follow__card" href="${esc(s.url)}" target="_blank" rel="noopener">${icon(s.id)}<span class="follow__name">${esc(s.label)}</span><span class="follow__handle">${esc(s.handle)}</span>${icon('external', { className: 'follow__ext' })}<span class="sr-only">(opens in a new tab)</span></a></li>`)}
    </ul>
  </div>
</section>
`;
  return {
    route: '/community/',
    title: 'Community',
    description: 'Join the #afroton community: be the first to know about revelations, new events and exclusive invites. Sign up for the Afroton newsletter.',
    newsletter: false, // the sign-up is this page's main content
    content,
  };
}
