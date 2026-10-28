// Facts about Afroton, taken from afroton.eu (audited 27 October 2026). Nothing here is invented:
// if a fact is not on the live site, it does not belong in this file.
import { SITE_URL } from '../config.mjs';


export const SITE = {
  name: 'AFROTON',
  // absolute links (Open Graph, schema.org, sitemap) point at wherever this build is published (src/config.mjs)
  url: SITE_URL || 'https://www.afroton.eu',
  locale: 'en_GB',
  lang: 'en-GB',
  version: '2.0.0',
  // Unofficial redesign concept: never index it, never load Afroton's analytics or ad measurement.
  // (The live site uses Google tag GT-NBJF22T5 and server-side Meta measurement; the concept sends nothing.)
  concept: true,
  gaTag: '',
  ads: false,
  logo: '/wp-content/uploads/2026/09/cropped-cropped-Afroton-LOGo-8.webp',
  logoPng: '/wp-content/uploads/2026/09/cropped-cropped-Afroton-LOGo-8.png',
  ogImage: '/wp-content/uploads/2026/01/Bday-bash-post-afroton-.jpg',
};

export const ORG = {
  legalName: 'Afroton vzw',
  street: 'Hugo Verrieststraat 116',
  postcode: '8800',
  city: 'Roeselare',
  country: 'Belgium',
  enterprise: 'BE 1033.653.873',
  email: 'hi@afroton.eu',
};

export const SOCIALS = [
  { id: 'instagram', label: 'Instagram', handle: '@afro.ton', url: 'https://www.instagram.com/afro.ton/' },
  { id: 'tiktok', label: 'TikTok', handle: '@afro.ton', url: 'https://www.tiktok.com/@afro.ton' },
  { id: 'facebook', label: 'Facebook', handle: 'Afroton', url: 'https://www.facebook.com/profile.php?id=61566961107605' },
  // the live link carries tracking parameters (fbclid, si…); the playlist id is what matters
  { id: 'spotify', label: 'Spotify', handle: 'Afroton playlist', url: 'https://open.spotify.com/playlist/08EDMCBhlAJYu7gkNhfm4I' },
];

// Weeztix shops embedded on the live site (data-ot-url)
export const SHOPS = {
  tickets: 'https://shop.weeztix.com/dd30d871-ee9d-4008-aa87-dd487ded81ea',
  workshops: 'https://shop.weeztix.com/3b7773b9-13c1-4c34-82e9-547910ee46b6',
};

export const NAV = [
  { href: '/tickets/', label: 'Events' },
  { href: '/about-us/', label: 'Our story' },
  { href: '/community/', label: 'Community' },
  { href: '/workshops/', label: 'Workshops' },
  { href: '/photos-main/', label: 'Photos' },
  { href: '/sponsor/', label: 'Partners' },
];

export const FOOTER_NAV = [
  {
    title: 'Events',
    links: [
      { href: '/tickets/', label: 'Tickets' },
      { href: '/workshops/', label: 'Workshops' },
      { href: '/photos-main/', label: 'Photos' },
    ],
  },
  {
    title: 'Afroton',
    links: [
      { href: '/about-us/', label: 'Our story' },
      { href: '/community/', label: 'Community' },
      { href: '/bookings/', label: 'Bookings' },
      { href: '/sponsor/', label: 'Partners' },
    ],
  },
];

// genres named on afroton.eu (artist pages and "Afro-Latin inspired movement")
export const GENRES = ['Afrobeats', 'Amapiano', 'Reggaeton', 'Afro-Latin'];
