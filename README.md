# IAS Avionics — Website

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

## Email (both forms)

Copy `.env.example` → `.env.local` and set:

- `RESEND_API_KEY` — Resend API key
- `RESEND_FROM_EMAIL` — verified sender (e.g. website@iasavionics.ca)
- `CONTACT_TO_EMAIL` — inbox for general inquiries (**client to confirm**)
- `LASER_WIRE_TO_EMAIL` — defaults to nancy@iasavionics.ca

Until configured, both forms return a graceful fallback (call / download +
email) instead of failing silently.

## Key routes

- `/` home · `/about` · `/services` (anchored sections) · `/projects`
- `/aog` — Aircraft on Ground emergency contact
- `/laser-marked-wire-order-form` — online multi-line order form built from
  `brandassets/IAS-WWW-LASER-WIRE-MARKING-ORDER-TEMPLATE.xlsx` (same file is
  the downloadable); submissions email a quotation request to nancy@
- `/careers` · `/contact`

## Before publishing

Read `CLIENT-CONFIRMATION.md` — it lists every fact the client must confirm
(address, certifications, Garmin claim, seasonal copy, testimonials, careers
status, form inboxes). The mobile-optimization pass (stack.md) runs after
explicit desktop sign-off.
