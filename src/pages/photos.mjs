import fs from 'node:fs';
import path from 'node:path';
import { html, esc } from '../lib/html.mjs';
import { img } from '../lib/img.mjs';
import { icon } from '../components/icons.mjs';
import { pageHero } from '../components/blocks.mjs';

// The photo sets of /photos-main/ (alt text and order as published).
const PHOTOS = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../data/gallery.json'), 'utf8'));
const SETS = [
  { id: '2026-10-10', label: '10 October 2026', place: 'AFROTON Festival · Trax, Roeselare' },
  { id: '2026-05-16', label: '16 May 2026', place: 'Vooruit, Gent' },
  { id: '2025-09-27', label: '27 September 2025', place: 'Trax, Roeselare' },
];

export default function photos() {
  const tabs = SETS.map((s, i) => `<button type="button" role="tab" id="tab-${s.id}" aria-controls="set-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-hash="set-${s.id}" class="tabs__tab"><span class="tabs__date">${esc(s.label)}</span><span class="tabs__place">${esc(s.place)}</span></button>`).join('');

  const panels = SETS.map((s) => {
    const list = PHOTOS.filter((p) => p.set === s.id);
    return html`<section class="gallery-set" role="tabpanel" id="set-${s.id}" aria-labelledby="tab-${s.id}">
  <h2 class="gallery-set__title"><span>${esc(s.label)}</span> ${esc(s.place)} <small>${list.length} photos</small></h2>
  <ul class="masonry" role="list">
    ${list.map((p, n) => `<li><a href="${p.src}" data-lightbox-item data-w="${p.w}" data-h="${p.h}">${img(p.src.replace('-1200.jpg', '-600.jpg'), { alt: `${p.alt}, photo ${n + 1}`, sizes: '(min-width: 1100px) 300px, (min-width: 700px) 33vw, 50vw', prefer: 400 })}</a></li>`)}
  </ul>
</section>`;
  }).join('');

  const content = html`
${pageHero({
  eyebrow: 'Photos',
  title: 'Best <span>moments</span>',
  intro: `Relive the nights and find yourself in the pictures.<br><small class="credit">${icon('camera')} Photos: Goetshots, Arjen Visuals</small>`,
  compact: true,
})}

<div class="section section--cream gallery">
  <div class="wrap">
    <div class="tabs" role="tablist" aria-label="Choose an event" data-tabs>${tabs}</div>
    ${panels}
  </div>
</div>

<dialog class="lightbox" data-lightbox aria-label="Photo viewer">
  <figure class="lightbox__figure">
    <img data-lightbox-img alt="">
    <figcaption><span data-lightbox-caption></span> <span class="lightbox__count" data-lightbox-count></span></figcaption>
  </figure>
  <button type="button" class="lightbox__btn lightbox__prev" data-lightbox-prev>${icon('arrowLeft')}<span class="sr-only">Previous photo</span></button>
  <button type="button" class="lightbox__btn lightbox__next" data-lightbox-next>${icon('arrow')}<span class="sr-only">Next photo</span></button>
  <button type="button" class="lightbox__btn lightbox__close" data-lightbox-close>${icon('close')}<span class="sr-only">Close</span></button>
</dialog>
`;
  return {
    route: '/photos-main/',
    title: 'Photos',
    description: 'The best moments of Afroton: photos of the festival in Roeselare (10 October 2026), Vooruit Gent (16 May 2026) and Trax Roeselare (27 September 2025).',
    ogImage: '/wp-content/uploads/2026/08/3Y7A1200-scaled.jpg',
    content,
  };
}
