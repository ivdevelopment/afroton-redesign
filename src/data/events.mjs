// Events as published on afroton.eu (tickets page, home page and the sponsor page's track record).
// An event is "upcoming" until its end; the build sorts them, so moving a date is all it takes.
// Past editions carry only their date: the live site does not publish their doors/closing times.

export const EVENTS = [
  {
    id: 'tj-west-bday-bash-2026',
    title: 'AFROTON x TJ WEST BDAY BASH',
    short: 'TJ West Bday Bash',
    start: '2026-12-19T22:00:00+01:00',
    end: '2026-12-20T05:00:00+01:00',
    hours: '22:00 till 05:00',
    venue: null, // "Location TBA" on the live site — fill in when it is announced
    city: null,
    venueNote: 'Location announced soon',
    blurb: 'Let’s make core memories!',
    tickets: '/tickets/#tickets',
    image: '/media/tj-west/tj-west-hat-1200.jpg',
    imageAlt: 'TJ WEST on stage in a cowboy hat, microphone raised',
    poster: '/wp-content/uploads/2026/01/Bday-bash-post-afroton-.webp', // the Bday Bash announcement image (a crowd photo)
    posterAlt: 'AFROTON guests dancing, one of them with a hand fan',
    tags: ['Afrobeats', 'Amapiano'], // TJ WEST's styles on the bookings page
  },
  {
    id: 'festival-2026',
    title: 'AFROTON Festival',
    short: 'Festival Roeselare',
    start: '2026-10-10',
    venue: 'Trax',
    city: 'Roeselare',
    blurb: 'Our yearly festival, one night in Roeselare. Relive it and find yourself in the pictures.',
    photos: '/photos-main/#set-2026-10-10',
    image: '/media/2026-10/DSC02253-1200.jpg',
    imageAlt: 'Hands and phones up in the crowd at the AFROTON festival, 10 October 2026',
  },
  {
    id: 'vooruit-2026',
    title: 'AFROTON Gent',
    short: 'Vooruit Gent',
    start: '2026-05-16',
    venue: 'Vooruit',
    city: 'Gent',
    photos: '/photos-main/#set-2026-05-16',
    image: '/media/2026-05-16/DSA04685-1200.jpg',
    imageAlt: 'The AFROTON crowd singing along under red light, 16 May 2026',
  },
  {
    id: 'trax-2025',
    title: 'AFROTON Roeselare',
    short: 'Trax Roeselare',
    start: '2025-09-27',
    venue: 'Trax',
    city: 'Roeselare',
    photos: '/photos-main/#set-2025-09-27',
    image: '/media/2025-09-27/DSC05867-1200.jpg',
    imageAlt: 'Dancers under orange light with AFROTON flags, 27 September 2025',
  },
];

// Workshops (the /workshops/ page: status line "Upcoming · Thu 5 Nov 2026", heading, text and poster).
// Kept apart from EVENTS so a workshop never replaces the main party as the featured event.
export const WORKSHOPS = [
  {
    id: 'workshop-djembe-2026',
    title: 'Workshop djembé',
    start: '2026-11-05T19:00:00+01:00',
    end: '2026-11-05T20:00:00+01:00',
    hours: '19–20h',
    venue: 'Trax',
    city: 'Roeselare',
    price: 'Free',
    blurb: 'Always wanted to learn or see how to play a Djembé the right way? Want to impress your friends at the next party? Join us for a FREE (yes free) workshop Djembé with the legendary Sidy of Jali Kunda.',
    host: 'Sidy of Jali Kunda',
    tickets: '/workshops/#tickets',
    image: '/wp-content/uploads/2026/08/Workshop-Announcements-1.webp',
    imageAlt: 'Poster: free djembé workshop by Jali Kunda, AFROTON, Trax, 5 Nov, 19–20h',
  },
];

export const upcomingWorkshops = (now = new Date()) =>
  WORKSHOPS.filter((w) => new Date(w.end).getTime() >= now.getTime()).sort((a, b) => new Date(a.start) - new Date(b.start));

// The sponsor page's track record, verbatim (visitor numbers are Afroton's own published figures).
export const TRACK_RECORD = [
  { date: '10 November 2024', place: 'Club Loco Roeselare', visitors: '450 visitors' },
  { date: '5 April 2025', place: 'Club 69 Gent', visitors: '500 visitors' },
  { date: '3 May 2025', place: 'Trax Roeselare', visitors: '1.000 visitors' },
  { date: '29 August 2025', place: 'Bomboclat Brugge', visitors: '1.100 visitors' },
  { date: '27 September 2025', place: 'Trax Roeselare', visitors: '900 visitors' },
  { date: '20 December 2025', place: 'Club 69 Gent', visitors: '600 visitors' },
  { date: '11 April 2026', place: 'Ikon Antwerp', visitors: '650 visitors' },
  { date: '16 May 2026', place: 'Vooruit Gent', visitors: '1.000 visitors' },
  { date: '4 July 2026', place: 'ZwartWit Open air', visitors: '550 visitors' },
  { date: '10 October 2026', place: 'Festival Roeselare', visitors: null },
  { date: '19 December 2026', place: 'location to be announced', visitors: null },
];

const TZ = 'Europe/Brussels';
const fmt = (iso, o) => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...o }).format(new Date(iso));

export const dateParts = (iso) => ({
  weekday: fmt(iso, { weekday: 'short' }),
  day: fmt(iso, { day: 'numeric' }),
  month: fmt(iso, { month: 'short' }),
  year: fmt(iso, { year: 'numeric' }),
  long: fmt(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  medium: `${fmt(iso, { weekday: 'short' })} ${fmt(iso, { day: 'numeric' })} ${fmt(iso, { month: 'short' })} ${fmt(iso, { year: 'numeric' })}`, // Sat 19 Dec 2026, as on the live cards
});

/** Split into upcoming (soonest first) and past (latest first) relative to `now` (the build time). */
export function splitEvents(now = new Date()) {
  const ends = (e) => new Date(e.end || e.start).getTime();
  const upcoming = EVENTS.filter((e) => ends(e) >= now.getTime()).sort((a, b) => new Date(a.start) - new Date(b.start));
  const past = EVENTS.filter((e) => ends(e) < now.getTime()).sort((a, b) => new Date(b.start) - new Date(a.start));
  return { upcoming, past };
}
