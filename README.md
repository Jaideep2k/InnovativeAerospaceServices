# IAS Avionics Website

Marketing website for Innovative Aerospace Services Ltd. (IAS Avionics),
Kelowna International Airport (CYLW).

Stack: **Next.js (App Router, TypeScript) · Tailwind CSS · GSAP (+ ScrollTrigger) · Resend**
per `stack.md`. Brand tokens (Jet Black #0D0D0D, Charcoal #333333, Aerospace
Red #E31B23, Silver Gray #BFC3C7; Raleway + Open Sans) come from
`brandassets/` and live in `tailwind.config.ts`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Forms and email

Every form sends through `lib/mail.ts`. Copy `.env.example` to `.env.local`
(or set the same variables in Vercel) and set **one** of:

- `SENDGRID_API_KEY`: recommended. The old WordPress site sends its form mail
  through SendGrid from `no-reply@iasavionics.ca`, so the domain is already
  verified there and no DNS changes are needed.
- `RESEND_API_KEY`: alternative; requires verifying iasavionics.ca in Resend.

Optional: `MAIL_FROM`, `CONTACT_TO_EMAIL`, `LASER_WIRE_TO_EMAIL`. All default to
the old site's behaviour (from no-reply@, to nancy@iasavionics.ca).

| Form | Old site | New site |
|---|---|---|
| Contact (`/contact`) | Forminator form, emailed nancy@ | `/api/contact`, emails inbox, Reply-To = visitor |
| Laser marked wire | Download .xlsx, email it to nancy@ | Online multi-line form (`/api/laser-wire-order`) **and** the same .xlsx download |
| Write a review | CF7/Forminator form emailed nancy@, posted by hand | `/testimonials`: posts instantly, emails nancy@ with a one-click removal link |

Spam: every form has a hidden honeypot field and a minimum fill time
(`lib/spam.ts`); the review form also blocks links and rate-limits per visitor.
Until a mail key is set, contact and laser-wire forms show a phone/email
fallback instead of failing silently.

## Testimonials

`lib/testimonials.ts` merges curated reviews (in the file) with reviews
submitted on the site (stored in Upstash Redis: in Vercel, Storage > Upstash
for Redis > Connect, which sets `KV_REST_API_URL`/`KV_REST_API_TOKEN`). In
local dev without Redis they are kept in `.data/testimonials.json`.

Moving to Google reviews later: set `NEXT_PUBLIC_GOOGLE_REVIEW_URL` to add a
"Review Us on Google" button, and copy chosen Google reviews into
`curatedTestimonials` with `source: "google"` (they show "via Google").

## Old site URLs

`next.config.mjs` permanently redirects the WordPress URLs that changed
(e.g. `/aircraft-rewiring-services`, `/helicopter-repair-services`,
`/frequently-asked-questions-faq`, `/project/...`) plus the AMO certificate
PDFs and the order template under `/wp-content/uploads/`.

`www.iasavionics.ca/` holds the old site export **including credentials and
customer data**. It is git-ignored; keep it out of the repo and off the server.

## Key routes

- `/` home · `/about` (with AMO certificate PDFs) · `/services` · `/projects`
- `/aog`: Aircraft on Ground emergency contact
- `/laser-marked-wire-order-form`: online multi-line order form plus .xlsx
- `/testimonials`: reviews and "Write a Review" form
- `/careers` · `/contact` · `/faq` · `/garmin-dealer`

## Before publishing

Read `CLIENT-CONFIRMATION.md`. It lists every fact the client must confirm
(address, certifications, Garmin claim, seasonal copy, testimonials, careers
status, form inboxes). The mobile-optimization pass (stack.md) runs after
explicit desktop sign-off.
