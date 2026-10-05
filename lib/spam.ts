/**
 * Lightweight bot filtering shared by every form, with no CAPTCHA for people.
 *
 * Each form renders a visually hidden "website" field (people never fill it,
 * form-filling bots usually do) and sends the time it was first rendered.
 * Anything submitted faster than a person could type is treated as a bot.
 *
 * Bots get a normal-looking success response so they don't retry or adapt.
 */

export const HONEYPOT_FIELD = "website";
const MIN_FILL_MS = 2500;

export type SpamFields = { website?: unknown; startedAt?: unknown };

export function looksAutomated(body: SpamFields): boolean {
  if (typeof body.website === "string" && body.website.trim() !== "") return true;
  const started = Number(body.startedAt);
  if (Number.isFinite(started) && started > 0 && Date.now() - started < MIN_FILL_MS) {
    return true;
  }
  return false;
}

/** Visitor IP for rate limiting, as reported by the hosting proxy. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}
