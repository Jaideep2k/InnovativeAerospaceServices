# stack.md — Build Standard for this Tax & Accounting Website

> **READ ME FIRST. EVERY TASK. NO EXCEPTIONS.**
>
> Before you touch a single file in this project — even for a "small" change — you must run **Step 0 → Step 1 → Step 2** below. This file is the single source of truth for how this site gets built. The brand sheet inside `brandassets/` is the single source of truth for how it *looks*. Together they govern everything. If a request conflicts with this file, surface the conflict to the user instead of silently overriding.

---

## Step 0 — Apply the UI/UX skill

At the start of every UI-related task:

- Invoke the **`hallmark`** skill for planning, building, reviewing, refining, or critiquing any UI. This is the project's chosen UI design intelligence — do **not** substitute `ui-ux-pro-max` or other design skills.
- Invoke **`frontend-design:frontend-design`** when generating components.

These skills shape design quality. **This file overrides them** whenever they disagree on:

- Brand identity (colors, fonts, marks)
- Tech stack
- Mandatory animation coverage
- Call-to-action placement
- The contact-form backend

If the skill suggests a different library, a different palette, or skipping animation — ignore that suggestion. The constraints in this file are fixed.

---

## Step 1 — Read `brandassets/`

- The folder is named exactly `brandassets/` — **lowercase, no spaces**.
- List the folder and open **every file** inside it (PNG, PDF, SVG, AI exports, anything).
- Visually parse the contents. The brand sheet defines:
  - Palette and exact hex values
  - Typography (display / heading / body)
  - Logo lockups, alternate marks, badges, icon marks
  - Applied collateral that hints at spacing, scale, and tone
- Transcribe what you find into the project (e.g. `tailwind.config.ts` color tokens, `next/font` imports). **Never invent colors, fonts, or hex values.** If you cannot read a value from the brand sheet, ask.
- Re-read on every task. The user may have replaced or added files since last turn.

---

## Step 2 — Confirm project identity

Before writing any code, confirm you know:

- **Logo files** — **always ask the user directly** for the logo if `brandassets/` does not already contain a clearly-named logo file. The ask is: *"Please drop the logo file(s) into `brandassets/` — raster (PNG or JPG), high resolution, transparent background preferred for the primary mark. Add a separate monogram / app-icon variant if you have one."* Wait for the user to confirm the files are in place; do not invent a logo, do not crop one out of brand-sheet screenshots, do not proceed without it. Once supplied, copy the chosen file(s) into [public/brand/](public/brand/) with descriptive kebab-case names — `brandassets/` remains the source of truth, `/public/brand/` is the served copy. Raster only — see *Image format policy* below; SVG logos caused issues on this build and are off-limits.
- **Business name** (and any trade/legal variants) — **always ask the user directly** for the proper business name if it has not been explicitly provided this session. Do not guess from the folder name, brand assets, or prior context.
- **Location** (city, region, country) — drives tone, imagery, local references, and any sales-tax language
- **Target audience** (individuals, small businesses, corporate, niche industries)
- **Tone** (formal vs. approachable, conservative vs. modern)

If any of these are not already established in the conversation or visible in the repo, **stop and ask the user before doing anything else**. Do not assume.

### Step 2a — Research the business online

Once the user provides the proper business name (and ideally location), search the web for publicly available business information **before** asking the user for it manually. Goal: pre-fill anything the business already publishes so the user is not retyping things that already exist online.

Look for, and capture into the project (e.g. `content/business.json` or equivalent):

- Office address(es)
- Phone number(s)
- Public email address(es)
- Business hours
- Google Business / Maps listing (for map embed coordinates and reviews)
- Existing website copy, taglines, service lists
- Social profiles (LinkedIn, Facebook, Instagram, etc.)
- Credentials, certifications, association memberships
- Years in business, founding year
- Any press, testimonials, or notable client mentions

Rules for this step:

- Use **WebSearch** and **WebFetch** for sources. Prefer the business's own existing website, Google Business profile, LinkedIn, and reputable directories.
- **Show the user what you found** before baking it into the site. Surface a short summary list and ask them to confirm, correct, or fill gaps. Never silently publish scraped data — phone numbers and addresses get wrong on the internet all the time.
- If the business has no online footprint, say so and ask the user to provide the contact details directly.
- Do **not** scrape paywalled, login-gated, or clearly private sources. Public, indexable pages only.
- Cite the source URL next to each captured field in your summary so the user can verify.

---

## Tech stack (locked — do not substitute)

| Concern        | Choice                                                         |
| -------------- | -------------------------------------------------------------- |
| Framework      | **Next.js** (App Router, TypeScript)                           |
| Styling        | **Tailwind CSS** — tokens populated from `brandassets/`        |
| Animation      | **GSAP** (+ ScrollTrigger). Mandatory across the site.         |
| Email backend  | **Resend** — env: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`         |
| Fonts          | Loaded via `next/font/google` or `next/font/local` per brand   |
| Images         | `next/image` referencing local files in `/public/images/`      |

Do not swap libraries. If you think a swap is justified, raise it with the user first.

---

## Brand-assets contract

- Folder name is exactly `brandassets/` — lowercase, no spaces.
- Everything visual (palette, typography, logo lockups, supporting marks, applied collateral) comes from files inside that folder.
- New files dropped in override prior assumptions on the next task.
- Hex codes, font names, and any specific brand values are **never** hardcoded in this file. They live only in `brandassets/` and in the project's config derived from it.

---

## Image format policy + stock sourcing

### Image format policy (locked)

- **All images on this site are raster** — JPG for photography, PNG for logos / marks with transparency.
- **SVG is off-limits** for logos, marks, hero art, and decorative graphics. The previous attempt to use SVG assets caused rendering / sizing / fill issues that wasted a build cycle. If a vector asset is supplied, export it to PNG at 2–3x the largest rendered size before using it.
- Icons inside components (lucide, heroicons, inline UI glyphs) are **not** considered "images" for this rule and may remain as inline SVG components from their icon library. The ban applies to *asset files* in `/public/` and to logo rendering.
- All assets are referenced via `next/image` from `/public/`. Never hotlink, never base64-inline.

### Stock-image sourcing

- **Source:** free commercial-license stock (Unsplash, Pexels, or equivalent). Use your judgement.
- **Storage:** download into `/public/images/<section>/<descriptive-kebab>.jpg`. **Never hotlink.**
- **Selection criteria:** *derive your own rubric per project* after reading `brandassets/`. Define mood, palette compatibility, lighting, and subject matter such that chosen imagery does not clash with the brand sheet. Do not reuse criteria from prior projects.
- **Subject matter for tax & accounting:** calm office scenes, documents on tidy desks, calculators, consultation moments, advisors meeting clients, receipts being reviewed. Avoid stock clichés — giant red arrows, staged "team meeting" shots, piles of cash, exaggerated stress poses.
- **Location accent imagery:** if local flavor would strengthen the site (skyline, neighborhood, regional landmarks), ask the user where the business is based and research imagery appropriate to that area before downloading.
- **Accessibility:** every image gets meaningful `alt` text, written for the actual subject — not "image of...".

---

## Animation rules (GSAP — heavy use is the expectation)

Every page must have visible motion. A fully static section is treated as a bug.

Baseline patterns to wire up on first build:

- **Hero:** staggered text reveal (word or line stagger), parallax on hero media.
- **Section entrances:** scroll-triggered fade + 20–40px upward translate on every section heading and its primary content block.
- **Number counters:** years in business, returns filed, clients served, etc., animate from 0 on enter.
- **Service / feature cards:** hover lift (translateY −4px, shadow grow) handled via GSAP, not CSS-only.
- **Page transitions:** short fade/slide between routes.

Rules:

- Respect `prefers-reduced-motion` — fall back to instant opacity changes when the user prefers reduced motion. The reduced-motion early return must happen **before** any `gsap.set` that hides the element, otherwise reduced-motion users see permanently invisible content.
- All GSAP code runs client-side. Mark animation components `"use client"`.
- Tween durations land between 0.3s and 1.2s. No flashy 3s entrances.
- Easing defaults to GSAP's `power2.out` or `power3.out` unless the moment calls for something else.

### GSAP pitfalls (learned the hard way — do not re-introduce)

These are real bugs that shipped on this build and were patched. Future scroll-triggered animation code in this repo must follow these rules.

#### 1. Never rely on `gsap.fromTo` alone for scroll-triggered reveals

`gsap.fromTo(el, { opacity: 0, y }, { ... })` only applies the "from" state **when the tween runs** — i.e., when the IntersectionObserver / ScrollTrigger fires. Until then, the element renders at its natural CSS state (fully visible). As the user scrolls and the section enters the viewport, the element is visible for one frame, then GSAP snaps it to `opacity: 0` and animates it back in. The result is a visible "flash → disappear → fade in" glitch.

**Correct pattern (used in [components/motion/Reveal.tsx](components/motion/Reveal.tsx) and [components/motion/Stagger.tsx](components/motion/Stagger.tsx)):**

1. Use `useIsomorphicLayoutEffect` from [lib/useIsomorphicLayoutEffect.ts](lib/useIsomorphicLayoutEffect.ts) — **not** `useEffect`. The hidden state must be applied before the browser's first paint, or you reintroduce the flash.
2. Early-return on `prefersReducedMotion()` **before** touching the element's style.
3. `gsap.set(el, { opacity: 0, y })` **synchronously**, before checking visibility or attaching the IntersectionObserver. This guarantees the element is hidden from the first paint.
4. Trigger the reveal with `gsap.to(el, { opacity: 1, y: 0, ... })`. Do not use `fromTo` — the "from" is already set.

**Any new scroll-reveal animation should wrap content in `Reveal` / `Stagger` rather than re-implementing this pattern inline.** If you genuinely need a bespoke animation, replicate all four rules above. A new motion component that uses `useEffect` + `gsap.fromTo` for scroll reveals is a regression.

#### 2. Text-reveal masks clip descenders at tight line-heights

The hero uses a per-word reveal mask — each word wrapped in `<span class="inline-block overflow-hidden ...">` so the inner word can translate up from below. Combined with `leading-[1.0]`, the mask box is exactly 1em tall and has zero room for descenders (the tails of `g`, `y`, `p`, `j`, `q`). They sit below the baseline, outside the mask box, and `overflow: hidden` clips them.

**Rules whenever a word/line is wrapped in an `overflow: hidden` mask:**

- The masked element's line-height must be **≥ 1.08**. `leading-[1.0]` / `leading-[1.02]` will clip descenders in serif display fonts.
- Add `pb-[0.18em] -mb-[0.18em]` (or equivalent) to the outer mask span. The padding expands the clip region downward to include descenders; the negative margin neutralizes the visual offset so vertical rhythm is unchanged. See [components/sections/Hero.tsx](components/sections/Hero.tsx) for the reference implementation.
- Always preview the headline with the actual brand display font loaded — generic-fallback rendering may not reveal the clipping. Eyeball every descender character (`g`, `y`, `p`, `j`, `q`) and any accented descenders the brand language uses.

---

## Custom loading / intro animation (per-industry, mandatory)

Every site built from this standard gets a **custom first-visit loading experience** — a short branded intro that plays when someone first lands on the website, before (or while) the home page reveals. It is not a generic spinner or progress bar. It is designed **specifically for the industry and company** the site is for.

### What it is

- A full-screen loading overlay shown on initial page load, built with GSAP, that plays a short animation unique to the business's industry, then transitions cleanly into the hero.
- The concept must be **derived from the industry** confirmed in Step 2. Examples of the kind of thinking expected (do not copy these literally — invent for the actual business):
  - Tax & accounting → a ledger line drawing itself into the logo, numbers ticking into place, a stamp/"filed" motif resolving.
  - Aerospace → a flight path tracing across the screen into the mark, an altitude/heading readout counting up, a silhouette lifting off.
  - Restaurant → plating motion, a burner ring igniting into the logo mark.
- Visuals come from the **brand assets in `brandassets/`** (logo lockups, marks, palette, typography) and — where the concept needs imagery — the same **licensed stock images** governed by the *Image format policy + stock sourcing* section. Never invent brand elements for the loader; it must feel like the same brand as the rest of the site.

### Rules

- **One per site, designed fresh.** Do not reuse a loader concept from a previous project. Pitch the concept to the user (1–3 sentence description) before building it, since it's the first thing every visitor sees.
- **Short.** Total duration 1.5–3 seconds max, and it must never block longer than the page actually needs to load. If assets are ready sooner, allow the outro to run early. Never loop indefinitely.
- **Skippable in effect:** the transition into the page must feel like a reveal, not a gate. No "click to enter" screens.
- **First visit emphasis:** play the full intro on the first visit per session; on subsequent navigations within the session, either skip it or use a much shorter variant (use `sessionStorage` to track). Route-to-route navigation uses the existing page-transition rules, not the full loader.
- **Tech:** GSAP timeline in a `"use client"` component (e.g. `components/motion/Preloader.tsx`), mounted in the root layout above the page content. Follows every rule in the *Animation rules* and *GSAP pitfalls* sections — including the synchronous initial `gsap.set` so there's no flash of unstyled page behind it.
- **Reduced motion:** if `prefers-reduced-motion` is set, skip the animated intro entirely — at most a brief static brand mark with a fade, or nothing. Never trap reduced-motion users behind a timeline.
- **Assets:** raster only, per the image format policy. Logo/marks from `/public/brand/`, any supporting imagery downloaded into `/public/images/preloader/`.
- **Performance:** the loader itself must be lightweight (no heavy images just for the intro). It should mask load time, not add to it. Largest Contentful Paint of the actual page still matters — don't let the loader delay hydration or asset fetching.

---

## Call to action (non-negotiable)

- **Persistent CTA:** sticky header button (e.g. "Book a Consultation" or equivalent for the business) linking to the contact route or smooth-scrolling to the contact section.
- **Hero:** primary CTA button **and** a secondary ghost button. Colors come from `brandassets/`.
- **Every major section** ends with a contextual CTA appropriate to that section (e.g. after Services → "See if we're a fit").
- **Footer CTA band** sits above the legal line.

If a page ships without a clearly visible CTA above the fold, it is incomplete.

---

## Sitemap and section structure

Generic tax & accounting site. Adjust copy and accents to fit the business identity confirmed in Step 2.

- **`/` Home**
  - Hero (headline + CTA + brand-mark animation)
  - Trust strip (years in business, returns filed, compliance / credential badges)
  - Services overview (4–6 cards)
  - Why-us differentiators (3 points)
  - Process timeline (1-2-3-4)
  - Testimonials
  - FAQ teaser
  - Contact CTA band
  - Footer

- **`/services`**
  - Intro
  - Full service catalogue (Personal Tax, Small Business Tax, Bookkeeping, Payroll, GST/HST or local sales-tax equivalent, Audit Support)
  - Pricing-philosophy note
  - CTA

- **`/about`**
  - Founder / firm story
  - Credentials
  - Community roots
  - Team photo
  - CTA
  - (Specific copy supplied by the user.)

- **`/contact`**
  - NO contact form — the owner does not want website messages emailed to her.
  - Phone call is the primary CTA (large tel: link + call button).
  - Address/directions, Facebook link, seasonal schedule, photos to fill space.

- **`/faq`** *(optional, link from home)*
  - Common tax & bookkeeping questions

All routes use the App Router: `app/<route>/page.tsx`.

---

## Contact form + Resend (removed)

- The client explicitly does not want a contact form or email delivery — she prefers phone calls.
- The form, `app/api/contact/route.ts`, the Resend dependency, and the `.env.example` entries were all removed. Do not reintroduce them.

---

## Mobile optimization pass — the final gated step

Mobile optimization happens **last**, and only after the user has explicitly signed off that the desktop / web version is finished and needs no further edits. Do not begin this pass speculatively, do not interleave it with web work, and do not declare a build complete without it.

**Gate (must be true before starting this pass):**

- The user has reviewed the web (desktop) version and stated, in this session, that no further edits are needed on the web version. A vague "looks good" is not the gate — you need an explicit confirmation that web is locked.

**What the pass covers, once the gate is met:**

- Re-render every route at a 375×812 (iPhone) viewport and a 360×800 (common Android) viewport using the Playwright MCP `browser_resize` + `browser_take_screenshot`.
- Fix anything that breaks at those widths: overflowing text, clipped headlines, horizontal scroll, stacked images that lose their crop focus, nav menus that don't open, CTAs pushed below the fold, tap targets smaller than 44×44 px, form inputs that aren't full-width.
- Confirm the sticky header CTA and the primary hero CTA are both reachable inside the first 100vh on mobile.
- Confirm GSAP animations behave on touch: no parallax that hijacks scroll, no horizontal motion that introduces a horizontal scrollbar, `prefers-reduced-motion` still respected.
- Confirm `next/image` `sizes` props are mobile-aware (e.g. `sizes="(max-width: 768px) 100vw, 50vw"`) so phones don't download desktop-sized assets.
- Tailwind responsive utilities are added as `md:` / `lg:` *additions* on top of the unprefixed mobile defaults — never refactor the desktop layout away during this pass.

**Out of scope for this pass:**

- No new features, no copy changes, no new sections. Mobile pass is layout / sizing / interaction polish only. If a content change is needed, surface it and re-open the web pass.

---

## Acceptance checklist

Before declaring a UI task done, confirm:

- [ ] Step 0–2 executed this turn: `hallmark` skill invoked, `brandassets/` read, logo confirmed present, business name confirmed, online research done and verified with the user, project identity locked in.
- [ ] Stack respected: Next.js + Tailwind + GSAP + Resend. Nothing swapped.
- [ ] Brand colors and fonts pulled from `brandassets/` exactly — none invented.
- [ ] At least one GSAP animation on every new section.
- [ ] Custom first-visit loading animation exists, is unique to this business's industry, uses only `brandassets/`-derived visuals (plus licensed stock if needed), runs ≤ 3s, skips for reduced-motion users, and only plays in full on the first visit per session.
- [ ] Scroll-triggered reveals use the `Reveal` / `Stagger` components (or replicate their four rules: `useIsomorphicLayoutEffect`, reduced-motion early return, synchronous `gsap.set` hidden state, `gsap.to` for the reveal). No `useEffect` + `gsap.fromTo` reveal pattern in new code — that's the glitch we already patched.
- [ ] Any text wrapped in an `overflow: hidden` reveal mask has `leading` ≥ 1.08 and `pb-[0.18em] -mb-[0.18em]` (or equivalent) on the mask span. Visually verified that `g`, `y`, `p`, `j`, `q` descenders are not clipped at the actual rendered font.
- [ ] Primary CTA visible without scrolling on every new page.
- [ ] Images live under `/public/images/`. Never hotlinked.
- [ ] `prefers-reduced-motion` respected.
- [ ] Meaningful `alt` text on every image.
- [ ] Logo present in `brandassets/` and copied into `/public/brand/` as raster (PNG/JPG). If absent, the user was asked to drop it into `brandassets/` and the build paused until they did.
- [ ] No new SVG asset files were added under `/public/`. Icon-library inline SVG components are fine; standalone `.svg` assets are not.
- [ ] User has explicitly confirmed the web version is locked before any mobile pass began.
- [ ] Mobile optimization pass completed: every route reviewed at 375×812 and 360×800, tap targets ≥ 44×44 px, hero CTA above the fold on mobile, no horizontal scroll, animations behave on touch.

If any box is unchecked, the task is not done. The mobile checklist is the **last** gate — a task that ships without web sign-off + mobile pass is not done, even if every other box is ticked.
