# Items Requiring Confirmation from Innovative Aerospace Services

Per the content brief, the following must be confirmed with the client before
final publication. Nothing below was invented — each item is either published
on the current site or was flagged in the brief as unverified.

## PRIORITY — claims added from the client's August 2026 content document

These went live at the client's written instruction. Two of them are claims we
would not normally publish without documentary backing. Flagging them here so
there is a record, not to block them.

- **"FAA certified"** — added to the About credentials list and the footer
  credential line. **Please supply the FAR 145 repair-station certificate
  number.** This is a regulator-facing credential claim sitting beside
  TC AMO 85-17 and EASA, both of which are documented. If IAS does not hold an
  FAA repair-station certificate, this line must come out before launch.
- **"The only Garmin dealer in Kelowna"** — now used on the Home page, the new
  `/garmin-dealer` page, About and the FAQ. This is an exclusivity claim about
  the competitive landscape. **Confirm against the current Garmin dealer
  agreement**, and note it can go stale silently if Garmin signs another
  Kelowna dealer. Previously withheld pending confirmation; the client's
  document asserted it, so it is now in use.
- **"Fastest rewire in the industry"** — used on `/services#rewiring` and the
  new helicopter page, phrased as a downtime benefit. Unsubstantiated
  superlative. **A specific turnaround figure would be stronger and safer** —
  if IAS can state e.g. a typical Bell 212 rewire turnaround, we should use
  that number instead.

## Address — CHANGED

- Now **1-6280 Airport Way, Kelowna, BC V1V 1S1**, per the client's August 2026
  document (p.5). This replaced `1-6280 Lapointe Drive` which the previous
  build used. A third variant (`101-6197 Airport Way`) appears on some
  third-party listings.
- **Postal code still needs confirming.** The document gave the street but no
  postal code, so `V1V 1S1` was carried over from the Lapointe Drive address.
  A wrong postal code degrades map placement in the LocalBusiness structured
  data. Everything else renders from `lib/site.ts`, so this is a one-line fix.
- Third-party listings (Google Business Profile, AEA directory, Garmin dealer
  locator) should be updated to match, or local search rankings suffer.

## Certifications / credentials (shown on About + Home)
- AMO 85-17 — still current?
- Transport Canada AMO ratings (Avionics, Components, Instruments,
  Structures) — all still current?
- EASA certification — still current?
- FAA certification — see PRIORITY section above.
- Authorized Garmin Aviation dealer — see PRIORITY section above.
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
    disclaimer is stated on the About, Services and helicopter pages.
    **Confirm the hero phrasing is acceptable.**
  - The wildfire/winter-maintenance line is a seasonal announcement. It reads
    correctly for late summer; **it should be revisited each spring.**
- Testimonials (Will Hudson, Steve Jones) are verbatim from the current
  website — confirm permission to republish.

## Services
- **New capability claim:** "Aircraft lighting systems" was added to the
  avionics equipment list from the client's document. It did not previously
  appear anywhere on the site — confirm IAS supplies and installs these.
- Exact scope of the "Aircraft Efficiency & Weight Review" service (the old
  "Helicopter/Aircraft Weight Loss Program") — presented conservatively as a
  wiring/equipment review; confirm scope.
- The new `/helicopter-avionics-electrical` page was deliberately **not**
  titled "Helicopter Repair Services" as the document proposed, because that
  implies airframe/powerplant work beyond the AMO ratings held. **Confirm what
  the Structures rating covers** and whether IAS takes any non-avionics rotary
  work — if so, the page can be broadened.
- Current AOG coverage and availability (no response time is promised).

## Careers
- Are the Avionics AME / experienced-apprentice openings still active? The
  page invites applications without stating positions are currently open.

## Projects
- Project photos are labelled as the Bell 212 rewire per the brief — confirm
  the gallery images and captions (including the seaplane photo from
  brandassets/projects, shown without a project claim).

## FAQ
- The new `/faq` page uses the client's seven questions plus four we added that
  the site can already answer authoritatively (AOG, travel to aircraft, the
  engineering arrangement, consultations). **Confirm the added answers.**
  Content lives in `lib/faq.ts` and feeds the FAQ structured data
  automatically, so edits only need making in one place.

## Technical
- Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`,
  `LASER_WIRE_TO_EMAIL` in `.env` (see `.env.example`) to activate the two
  forms. Until then both forms fail gracefully with phone/email fallbacks.
  **Both forms are currently inactive** — every "Request an Estimate" CTA
  reaches the form, but submissions cannot be delivered until this is done.
- Structured data (`LocalBusiness` on every page, `FAQPage` on `/faq`),
  `robots.txt`, canonical URLs and an OpenGraph share image were added in this
  pass. An earlier version of this file claimed structured data was already in
  use — it was not, until now.
- Mobile-optimization pass (per stack.md) is pending explicit sign-off that
  the desktop version is locked.
