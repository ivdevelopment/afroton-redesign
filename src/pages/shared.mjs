import { SITE } from '../data/site.mjs';

/**
 * schema.org Event for an upcoming event. The venue is not announced yet for the Bday Bash, so no
 * location is claimed; add `location` here once the event has a venue.
 */
export function eventLd(e) {
  const ld = {
    '@type': 'Event',
    name: e.title,
    description: e.blurb,
    startDate: e.start,
    endDate: e.end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [SITE.url + e.image, ...(e.poster ? [SITE.url + e.poster] : [])],
    url: SITE.url + e.tickets.replace(/#.*$/, ''),
    organizer: { '@id': SITE.url + '/#organization' },
    // price and availability live in the Weeztix shop, so only the ticket URL is stated here
    offers: { '@type': 'Offer', url: SITE.url + e.tickets.replace(/#.*$/, '') },
  };
  if (e.price === 'Free') ld.isAccessibleForFree = true;
  if (e.venue) ld.location = { '@type': 'Place', name: e.venue, address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: 'BE' } };
  return ld;
}
