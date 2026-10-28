// Every public page, in sitemap order. Each entry is a function returning the page object.
import home from './home.mjs';
import tickets from './tickets.mjs';
import workshops from './workshops.mjs';
import about from './about.mjs';
import community from './community.mjs';
import photos from './photos.mjs';
import sponsor from './sponsor.mjs';
import bookings from './bookings.mjs';
import { tjWest, waruti } from './artists.mjs';
import { privacy, terms, notFound } from './legal.mjs';

export const PAGES = [home, tickets, workshops, about, community, photos, sponsor, bookings, tjWest, waruti, privacy, terms, notFound];
