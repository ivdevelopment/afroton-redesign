# afroton.eu audit (27 October 2026)

*Background research for an unofficial redesign concept; not affiliated with Afroton.*

Phase 1 of the redesign. The working folder had no repository, so this audit is of the deployed site,
https://www.afroton.eu/ (meta `version` 1.7.3).

## Stack

- A static **"replica"** of the former WordPress / Elementor / Astra site, served by **Cloudflare Pages**
  (`cf-cache-status`, `*.pages.dev` noindex note in robots.txt).
- **Cloudflare Pages Functions** behind two endpoints the pages call:
  - `POST /api/subscribe`: newsletter sign-up, handed to **Brevo** server-side with double opt-in.
    Contract: JSON `{ email, website (honeypot), ts }`, answers `{ ok }` or `{ ok:false, error: invalid | unconfigured | rate-limit }`.
  - `POST /api/hello`: server-side Meta measurement (PageView / ViewContent / TicketClick), only after an Advertising yes.
- Hand-written scripts (kept unchanged in the redesign):
  - `afroton-consent.js`: banner v4/v5, Google Consent Mode v2 (basic), consent-gated Spotify/YouTube, ad labels.
  - `afroton-signup.js`: wires every `form[action="/api/subscribe"]`.
  - `ot-shop-injector.js`: Weeztix's own shop injector for `.ot-iframe[data-ot-url]`.
- Security headers: `X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.

## Routes (sitemap + navigation)

| Route | Content |
|---|---|
| `/` | Welcome home, next event, last edition, newsletter card, manifesto, story teaser, partner pitch, supported-by logos |
| `/tickets/` | Same event cards + **Weeztix shop** `dd30d871-ee9d-4008-aa87-dd487ded81ea` at `#tickets` |
| `/workshops/` | "Upcoming · Thu 5 Nov 2026", "5 november- workshop djembé", text (free workshop with Sidy of Jali Kunda), poster (Trax, 19–20h), "free ticket" → `#tickets` + **Weeztix shop** `3b7773b9-13c1-4c34-82e9-547910ee46b6` |
| `/about-us/` | The movement, our story, team of six |
| `/community/` | "Join the #afroton community" + image (the form widget there is empty on live) |
| `/photos-main/` | 158 photos in three sets: 10 Oct 2026, 16 May 2026, 27 Sep 2025 (credits: Goetshots, Arjen Visuals) |
| `/sponsor/` | Pitch, pillars, audience figures, track record, festival opportunities (Dutch), press clipping |
| `/bookings/` | Artists, dancers, DJ's, MC's, promotion (pilli.be), apply (mail) |
| `/tj-west/`, `/waruti/` | Artist bios, socials, Spotify tracks, YouTube videos (consent-gated) |
| `/privacy/` | Privacy policy v2.3 (21 Oct 2026) incl. full cookie table, `#cookies` |
| `/terms-conditions/` | Algemene voorwaarden NL + EN (`#english`) |
| `/photos/` → `/photos-main/`, `/partners/` → `/sponsor/` | redirects |

## Confirmed content

- **Upcoming workshop:** free djembé workshop with Sidy of Jali Kunda, Thu 5 Nov 2026, 19–20h, Trax (second audit pass;
  the first pass missed this copy).
- **Upcoming:** AFROTON x TJ WEST BDAY BASH, **Saturday 19 December 2026, 22:00 till 05:00, location TBA**,
  "Let's make core memories!", tickets at `/tickets/#tickets`.
- **Past:** Festival at Trax, Roeselare (10 Oct 2026); Vooruit, Gent (16 May 2026); Trax, Roeselare (27 Sep 2025),
  plus the sponsor page's full track record since 10 Nov 2024.
- **Partners ("supported by"):** Roeselare, Pilli, Company Mayimona, Alheembouw, Wurriversal, Callez Concierge.
- **Organisation:** Afroton vzw, Hugo Verrieststraat 116, 8800 Roeselare, BE 1033.653.873, hi@afroton.eu.
- **Socials:** Instagram/TikTok @afro.ton, Facebook profile 61566961107605, Spotify playlist 08EDMCBhlAJYu7gkNhfm4I.
- **Brand:** the logo is the white bubble-letter "AFRO TON" roundel with a palm in the O (not the brush
  wordmark of the visual reference); favicon is the orange sun with palm. Brand colours #FF9C00 and #EB8428,
  headline face Anton.

## Limitations found

- No source repository was available, so the concept is a standalone static build. It mirrors the live
  interaction patterns, but it has no backend and is not meant to replace the live site.
- The live "meet us" / booking forms are empty Elementor widgets (the WordPress form plugin did not survive the
  static export). The redesign uses `mailto:hi@afroton.eu` instead of inventing a form backend.
- The visual reference shows events, venues and an EN/NL switch that do not exist; none of it was carried over.
