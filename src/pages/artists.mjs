import { html, esc } from '../lib/html.mjs';
import { img } from '../lib/img.mjs';
import { ORG } from '../data/site.mjs';
import { icon } from '../components/icons.mjs';
import { pageHero, mediaEmbed, sectionHead } from '../components/blocks.mjs';

// Artist pages: bios, links, Spotify tracks and YouTube videos exactly as on /tj-west/ and /waruti/.
const ARTISTS = {
  'tj-west': {
    name: 'TJ WEST',
    styles: 'Afrobeats & Amapiano',
    hero: '/wp-content/uploads/2026/01/TJ-WEST-Photos-by-Capture-King-1.webp',
    heroAlt: 'TJ WEST, photo by Capture King',
    heroPos: '50% 12%',
    portrait: '/wp-content/uploads/2026/01/ezgif.com-webp-maker-4-e1767722976345.webp',
    links: [
      { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/iamtjwest/' },
      { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@iamtjwest' },
      { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/watch?v=9HthXL82X2Q' },
    ],
    short: 'TJ WEST is the biggest rising afrobeats star based in Europe. He’s the ambassador of good vibes, and good vibes only. With infectious Amapiano and Afrobeats, he’s conquering Europe &amp; the rest of the world.',
    bio: [
      { p: 'TJ WEST is one of the fastest-rising Afrobeats sensations based in Europe — a dynamic musician proudly carrying the title “Ambassador of Good Vibes.” Blending infectious Amapiano rhythms with vibrant Afrobeats and Afropop melodies, he is rapidly winning hearts across Europe, Africa, and beyond.' },
      { h: 'Childhood', p: 'Born in Freetown, Sierra Leone as Tejan Kamara, TJ WEST is not only an artist, but also a promoter, performer, and electrifying hypeman. Growing up in Africa, music became a part of his life at an early age; he began creating songs at just 12 years old. At 16, he made the bold move to Belgium, where he adapted to a new culture while staying deeply connected to his African roots.' },
      { h: 'Birth of TJ WEST', p: 'Shortly after arriving, he met Warre in Roeselare — a meeting that sparked a powerful creative partnership. Joining Wurriversal led to the birth of TJ WEST, a brand built on positivity, energy, and unstoppable drive. At only 19 years old, he co-founded AFROTON, making history by successfully attracting over 1,000 attendees to its debut festival edition.' },
      { h: 'Who’s TJ WEST?', p: 'Currently based in Belgium, TJ WEST crafts feel-good Afrobeats, Afropop, and Amapiano-inspired records designed to uplift listeners worldwide. His mission is simple yet powerful: to heal the world through high-vibration music, joy, and unity.' },
      { p: 'TJ WEST gained international recognition with standout singles such as “Make Am” and “Happiness,” among others, earning growing streaming numbers and global attention. His work has been celebrated with multiple accolades, including Best Upcoming Artist of the Year in the Netherlands.' },
      { p: 'With his magnetic stage presence, contagious energy, and a rapidly growing fanbase, TJ WEST is not just rising — he is building a global movement of happiness, confidence, and African excellence.' },
    ],
    tracks: ['3ScV3P4J5PMqV18tJ9fRNw', '7hZxHbtpKGVwEyMCseMUpr', '5eb1dNdqlzCMNnxmyWpB3H', '3Cn3kbi0LTFl6b8gX02DS2'],
    videos: ['xk6DDOWevqQ', '9HthXL82X2Q', 'HGCz6mgi4YE', 'TZhE-4ksCRU', 'BCp2aYRDdDs'],
  },
  waruti: {
    name: 'Waruti',
    styles: 'Afroton & Afro House',
    hero: '/wp-content/uploads/2026/05/DSC02059-scaled.webp',
    heroAlt: 'Waruti on stage',
    heroPos: '50% 20%',
    portrait: '/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-21-at-16.49.52.webp',
    studio: '/wp-content/uploads/2026/05/Prod.By-20-scaled-e1680610097712.webp',
    links: [
      { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/warutibaruti/' },
      { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@warutibaruti' },
      { id: 'spotify', label: 'Spotify', url: 'https://open.spotify.com/artist/4l1QrUGqygh7IYBhWII7Ue' },
    ],
    short: 'Waruti’s a genre-fluid producer, DJ and artist. Great in the studio, incredible on stage. You can’t miss his energy the second he’s on the decks and grabs the mic.',
    bio: [
      { p: 'WARUTI has been making music since 2009 as a rapper, producer, singer, poet, studio owner, manager and organiser. Waruti blends genres like no other, he’s most known for the genre Afroton, blending Afrobeats and Reggaeton.' },
      { p: 'At 13 years old Waruti came in contact with HipHop, rap and poetry. His first song was written about the bullies in school. The first song that gained traction was “Early”, written at 15 years old under the name “Winston”. After Early he was invited to perform for 300 people in TRAX, Roeselare, his hometown. From 19 years old he started producing and studying in Ghent, Belgium.' },
      { p: 'After a lot of experimentation in Ghent, he wanted to take things more seriously. Wurriversal got founded at 21 years old.' },
      { quote: 'We made a studio in the garden shed of my parents together with my friends. Some still call it the most legendary studio they’ve ever been at. Here we started taking our production, artist management and marketing very seriously.' },
      { p: 'Waruti &amp; TJ WEST founded #AFROTON. While focusing on his personal (acoustic) career in music, Warre DJ’s for fun and produces trap, amapiano, afrobeat, pop, reggaeton, … for artists like Chris Lobanzo, TJ WEST and more.' },
      { p: 'Waruti’s name is an ‘african’ play on his real name, given by his friends. One of his friends also made a song where he rhymed Waruti with Baruti, which then became the definition of high energy. When Waruti goes Baruti, it means he’s bringing hype &amp; high vibrations.' },
    ],
    tracks: ['16KkHFnywz4OW7EHknx2Az', '46FHvNjDwprzcquRi3dthA', '48zSsqb6628caWexKY1E31'],
    videos: [],
  },
};

// meta descriptions stay under ~160 characters, cut on a word
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, '…'));

function artistPage(slug) {
  const a = ARTISTS[slug];
  const book = `mailto:${ORG.email}?subject=${encodeURIComponent('Booking ' + a.name)}`;
  const links = a.links.map((l) => `<li><a class="social social--labelled" href="${esc(l.url)}" target="_blank" rel="noopener">${icon(l.id)}<span>${esc(l.label)}</span><span class="sr-only"> (opens in a new tab)</span></a></li>`).join('');

  const content = html`
${pageHero({
  eyebrow: a.styles,
  title: esc(a.name),
  intro: a.short,
  image: a.hero,
  imageAlt: a.heroAlt,
  position: a.heroPos,
  actions: `<a class="btn btn--sun btn--lg" href="${book}">${icon('mail')} Book ${esc(a.name)}</a><ul class="social-list artist__links">${links}</ul>`,
})}

<section class="section section--cream" aria-labelledby="bio-title">
  <div class="wrap bio">
    <figure class="bio__portrait">${img(a.portrait, { alt: a.name, sizes: '(min-width: 900px) 420px, 90vw', prefer: 768 })}</figure>
    <div class="bio__text">
      <p class="eyebrow">Long bio</p>
      <h2 class="display" id="bio-title">Meet <span class="hl">${esc(a.name)}</span></h2>
      <div class="prose">
        ${a.bio.map((b) => (b.quote ? `<blockquote class="bio__quote"><p>“${b.quote}”</p></blockquote>` : `${b.h ? `<h3>${b.h}</h3>` : ''}<p>${b.p}</p>`))}
      </div>
      ${a.studio ? `<figure class="bio__studio">${img(a.studio, { alt: 'Waruti in the studio', sizes: '(min-width: 900px) 520px, 90vw', prefer: 768 })}</figure>` : ''}
    </div>
  </div>
</section>


<section class="section section--dark" aria-labelledby="latest-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Listen', title: 'Latest', id: 'latest-title', tone: 'dark' })}
    <div class="media-grid media-grid--tracks">
      ${a.tracks.map((t, i) => mediaEmbed({ kind: 'spotify', src: `https://open.spotify.com/embed/track/${t}?utm_source=generator`, title: `${a.name} on Spotify, track ${i + 1}` }))}
    </div>
  </div>
</section>

${a.videos.length ? html`<section class="section section--ink" aria-labelledby="visuals-title">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Watch', title: 'Visuals', id: 'visuals-title', tone: 'dark' })}
    <div class="media-grid media-grid--videos">
      ${a.videos.map((v, i) => mediaEmbed({ kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${v}`, title: `${a.name} on YouTube, video ${i + 1}`, poster: `/img/yt-${v}-960.webp` }))}
    </div>
  </div>
</section>` : ''}

<section class="section section--sand contact-band contact-band--light" aria-labelledby="book-title">
  <div class="wrap contact-band__inner">
    <div>
      <p class="eyebrow">Bookings</p>
      <h2 class="display contact-band__title" id="book-title">Book <span>${esc(a.name)}</span></h2>
    </div>
    <div class="contact-band__actions">
      <p>For shows, DJ sets and collaborations: <strong>${ORG.email}</strong></p>
      <a class="btn btn--dark btn--lg" href="${book}">${icon('mail')} Booking request</a>
      <a class="link-arrow" href="/bookings/">All artists ${icon('arrow')}</a>
    </div>
  </div>
</section>
`;
  return {
    route: `/${slug}/`,
    title: a.name,
    description: clip(`${a.name} (${a.styles}): ${a.short.replace(/&amp;/g, '&')}`),
    ogImage: a.portrait,
    content,
  };
}

export const tjWest = () => artistPage('tj-west');
export const waruti = () => artistPage('waruti');
