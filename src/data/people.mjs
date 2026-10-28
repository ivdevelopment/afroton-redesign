// Team (about-us), roster (bookings) and partners (home "supported by"), as on afroton.eu.

export const TEAM = [
  { name: 'Tejan Kamara', role: 'Promotion & Bookings', image: '/wp-content/uploads/2026/01/1.webp' },
  { name: 'Warre Vandoorne', role: 'Creative Director', image: '/wp-content/uploads/2026/01/2.webp' },
  { name: 'Luna Giraldo', role: 'Experience & Design', image: '/wp-content/uploads/2026/01/3-2.webp' },
  { name: 'Britt vanlerberghe', role: 'Content & Community', image: '/wp-content/uploads/2026/03/Pilli-social-media-profile-pics-2.webp' },
  { name: 'Arthur Zwartjes', role: 'Cinema', image: '/wp-content/uploads/2026/03/Pilli-social-media-profile-pics-16.webp' },
  { name: 'Izzy Cabrera', role: 'Partners & Community', image: '/wp-content/uploads/2026/01/Pilli-social-media-profile-pics-2.webp' },
];

const P = (n) => `/wp-content/uploads/2026/01/Pilli-social-media-profile-pics-${n}.webp`;

export const ROSTER = [
  {
    id: 'artists',
    title: 'Our artists',
    people: [
      { name: 'TJ WEST', style: 'Afrobeats & Amapiano', image: '/wp-content/uploads/2026/01/1.webp', href: '/tj-west/' },
      { name: 'WARUTI', style: 'Afroton & Afro House', image: P(3), href: '/waruti/' },
      { name: 'YUKO', style: 'Afrobeats & Soul', image: P(11) },
      { name: 'DRE', style: 'Afrobeats & HipHop', image: P(4) },
    ],
  },
  {
    id: 'dancers',
    title: 'Our dancers',
    people: [
      { name: 'MIKE', style: 'Afrobeats & HipHop', image: P(5) },
      { name: 'DRE', style: 'Afrobeats & HipHop', image: P(10) },
      { name: 'DIOR', style: 'Amapiano', image: P(9) },
      { name: 'MJENAYLA', style: 'Amapiano', image: P(8) },
    ],
  },
  {
    id: 'dj',
    title: 'Our DJ’s',
    people: [
      { name: 'Q Honey B', style: 'Afrobeats & Dancehall', image: P(7) },
      { name: 'WARUTI', style: 'Afroton & Afro House', image: P(3), href: '/waruti/' },
    ],
  },
  {
    id: 'mc',
    title: 'Our MC’s',
    people: [
      { name: 'TJ WEST', style: 'Afrobeats & Amapiano', image: P(12), href: '/tj-west/' },
      { name: 'WARUTI', style: 'Afro & Latin EDM', image: P(13), href: '/waruti/' },
    ],
  },
];

// Logos are white on transparent: they sit on a dark ground. `scale` evens out the files' different padding.
export const PARTNERS = [
  { name: 'Roeselare', url: 'https://roeselare.be/nl', logo: '/wp-content/uploads/2026/09/wurriversal-logo-black-bg-2.webp', scale: 0.95 },
  { name: 'Pilli', url: 'https://www.instagram.com/pilli.be/', logo: '/wp-content/uploads/2026/09/Pilli.be_.webp', scale: 0.92 },
  { name: 'Company Mayimona', url: 'https://www.companymayimona.be/', logo: '/wp-content/uploads/2026/09/Pilli.be-1.webp', scale: 1.12 },
  { name: 'Alheembouw', url: 'https://www.alheembouw.be/nl', logo: '/wp-content/uploads/2026/09/Untitled-design-12.webp', scale: 1 },
  { name: 'Wurriversal', url: 'https://www.wurriversal.com/', logo: '/wp-content/uploads/2026/09/wurriversal-logo-black-bg-1-1.webp', scale: 1.02 },
  { name: 'Callez Concierge', url: 'https://www.instagram.com/callez.concierge/', logo: '/wp-content/uploads/2026/09/Copy-of-Eerste-post-.webp', scale: 0.78 },
];
