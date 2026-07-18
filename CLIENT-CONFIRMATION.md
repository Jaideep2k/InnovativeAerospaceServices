# Items Requiring Confirmation from Innovative Aerospace Services

Per the content brief, the following must be confirmed with the client before
final publication. Nothing below was invented — each item is either published
on the current site or was flagged in the brief as unverified.

## Address
- **1-6280 Lapointe Drive, Kelowna, BC V1V 1S1** is used site-wide (footer,
  contact page, structured data). An older address (101-6197 Airport Way)
  appears on some third-party listings — the Lapointe Drive address was
  treated as primary per the brief. **Confirm which is current.** Only one
  address is ever shown to customers.

## Certifications / credentials (shown on About + Home)
- AMO 85-17 — still current?
- Transport Canada AMO ratings (Avionics, Components, Instruments,
  Structures) — all still current?
- EASA certification — still current?
- Authorized Garmin Aviation dealer — still current?
- "Kelowna's only Authorized Garmin Aviation Dealer" — **NOT used on the
  site** pending confirmation; the site says only "an authorized Garmin
  Aviation dealer."
- Kelowna Chamber 2022 Technology Innovator award logo (supplied in
  brandassets/home) is displayed in the Home trust strip — confirm it may be
  used.

## People / emails
- Nancy (nancy@iasavionics.ca) is the laser-marked-wire contact — confirm.
- **Which inbox should receive general contact-form submissions?**
  (`CONTACT_TO_EMAIL` in `.env` — currently unset; the form returns a
  graceful "call us" message until configured.)
- Which email should receive employment applications? (Careers page
  currently routes applicants to the general contact form/phone.)

## Copy
- The home hero uses the client-requested copy: "Offering the highest
  standard in custom engineered avionics and electrical installations,
  repairs, harness building & design. Due to the extreme wildfire season,
  it's critical to start planning your winter maintenance."
  - "custom engineered" sits in tension with the brief's engineering
    disclaimer (IAS does not perform regulated engineering directly —
    engineering is outsourced to registered third-party firms). The
    disclaimer is stated on the About and Services pages. **Confirm the
    hero phrasing is acceptable.**
  - The wildfire/winter-maintenance line is a seasonal announcement —
    **confirm it is still relevant** (brief flags this).
- Testimonials (Will Hudson, Steve Jones) are verbatim from the current
  website — confirm permission to republish.

## Services
- Exact scope of the "Aircraft Efficiency & Weight Review" service (the old
  "Helicopter/Aircraft Weight Loss Program") — presented conservatively as a
  wiring/equipment review; confirm scope.
- Current AOG coverage and availability (no response time is promised).

## Careers
- Are the Avionics AME / experienced-apprentice openings still active? The
  page invites applications without stating positions are currently open.

## Projects
- Project photos are labelled as the Bell 212 rewire per the brief — confirm
  the gallery images and captions (including the seaplane photo from
  brandassets/projects, shown without a project claim).

## Technical
- Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`,
  `LASER_WIRE_TO_EMAIL` in `.env` (see `.env.example`) to activate the two
  forms. Until then both forms fail gracefully with phone/email fallbacks.
- Mobile-optimization pass (per stack.md) is pending explicit sign-off that
  the desktop version is locked.
