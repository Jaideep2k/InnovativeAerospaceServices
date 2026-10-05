# Items Requiring Confirmation from Innovative Aerospace Services

Per the content brief, the following must be confirmed with the client before
final publication. Nothing below was invented — each item is either published
on the current site or was flagged in the brief as unverified.

## PRIORITY: image licensing (October 2026 audit)

Most photos on the site came from the old WordPress site, but the new copies
had their embedded credits stripped. The **old site's copies still carry Adobe
Stock / photographer credits**, so these are confirmed stock photos. They are
only safe to use if IAS (or the agency that built the old site) bought a
license. **Please send the Adobe Stock license history or invoices**, or we
replace them before launch:

| Image | Where it shows | Embedded credit |
|---|---|---|
| heli_overfire-slider.jpg | **Home hero**, helicopter page | (c) Edgar Bullon (also sold via Adobe Stock / iStock) |
| heli_waterbucket-slider.jpg | Home, Contact | (c)toa555 - stock.adobe.com |
| careers/helicopter-bg.jpg | Careers | (c)Klara - stock.adobe.com |
| careers/jet-bg.jpg | Careers | (c)Robert Asento - stock.adobe.com |
| projects/project-placement-3-1.jpg | **Projects gallery** | (c)Nicolas - stock.adobe.com |

Also need a source/receipt for:
- **Seaplane-over-Como-Lake.jpeg** (Projects) and
  **mechanic-checking-aircraft-components-while-working-in-repair-station.jpeg**
  (About). Both added to the old site in 2026, no metadata, stock-style names.
  If they came from a free tier (e.g. Freepik), attribution is required.
  The seaplane (Lake Como, Italy) also should not sit in a gallery of IAS work.
- 2019 images with no metadata that look like stock: about-Innovative-Aerospace,
  jets-rewiring, rewire-projects, helicopter-electrical, helicopter-wiring, both
  AOG images, avionics-service, aviation-wiring-footer, avionics-services-kelowna.
  Ask the 2019 web designer whether these were IAS photos or bought stock.
- Confirm the Bell 212, laser-wire and harness photos were shot by IAS staff
  (EXIF supports this for the Bell 212 series).
- Hero video: built from 5 Pexels clips (Pexels license allows commercial use,
  no attribution). The clip URLs were not recorded; the developer should log them.

Logos:
- **Transport Canada** flag signature: generally reserved for the federal
  government (Federal Identity Program). Recommend replacing with text,
  e.g. "Transport Canada Approved Maintenance Organization 85-17".
- **EASA** logo: EASA restricts use of its logo; approved organisations
  normally cite their approval number instead. Need the EASA approval reference.
- **Garmin**: the site uses the plain Garmin corporate logo. Dealers are
  normally licensed for the *Authorized Dealer* mark (already supplied, unused).
  Confirm with the Garmin rep, or switch to the dealer mark.
- **AEA**: use the official "AEA Member" artwork if available; confirm membership is current.

## PRIORITY: claims added from the client's August 2026 content document

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
- **Home hero now matches the old site, at the client's request:** headline
  "Innovative Aerospace Services in Kelowna, BC", subheader "Every Wire.
  Every Panel. Every Flight." then "Offering the highest standard in custom
  engineered avionics and electrical installations, repairs, harness building
  & design. Due to the extreme wildfire season, it's critical to start planning
  your winter maintenance. Contact our team today." "Because it matters" was
  removed from the hero (it still appears on the brief loading screen).
  - "custom engineered" sits in tension with the engineering disclaimer
    (engineering is outsourced to registered third-party firms). **Confirm.**
  - The wildfire/winter-maintenance line is seasonal; **revisit each spring.**
- **All em dashes were removed from the site copy** at the client's request.
- Testimonials (Will Hudson, Steve Jones) are verbatim from the current
  website. Confirm permission to republish.
- **New /testimonials page.** Visitors' reviews post immediately; Nancy is
  emailed each one with a one-click "remove" link. When IAS has Google reviews,
  we add a "Review us on Google" button and copy Google reviews onto the page.

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
- **Email:** the old site sends form mail through SendGrid (from
  no-reply@iasavionics.ca to nancy@iasavionics.ca). The new site uses the same
  SendGrid account and sender, so **no DNS changes**. Needed: a new SendGrid API
  key (Mail Send only) set as `SENDGRID_API_KEY` in Vercel. After launch, revoke
  the key the WordPress site uses (it was in the site export we received).
- **Reviews storage:** connect Upstash for Redis in Vercel (free tier).
- Old WordPress URLs redirect to their new pages (bookmarks keep working), and
  the five AMO certificate PDFs from the old About page are back on /about.
- Confirm the AMO certificate PDFs are the current versions.
- Structured data (`LocalBusiness` on every page, `FAQPage` on `/faq`),
  `robots.txt`, canonical URLs and an OpenGraph share image were added in this
  pass. An earlier version of this file claimed structured data was already in
  use — it was not, until now.
- Mobile-optimization pass (per stack.md) is pending explicit sign-off that
  the desktop version is locked.
