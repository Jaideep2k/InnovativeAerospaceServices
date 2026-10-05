import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Customer testimonials.
 *
 * Two sources are merged for display:
 *   1. `curatedTestimonials` below: reviews IAS has chosen to feature. This is
 *      where Google reviews go once IAS has them: copy the reviewer's name,
 *      rating, text and date in with `source: "google"`.
 *   2. Reviews submitted through the form on /testimonials. These publish
 *      immediately and are stored in Redis (Upstash, via the Vercel
 *      integration). IAS is emailed each one with a link to remove it.
 *
 * Storage selection:
 *   - KV_REST_API_URL + KV_REST_API_TOKEN (names set by Vercel's Upstash
 *     integration) or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 *   - Otherwise, outside Vercel, a local JSON file in .data/ for development.
 *   - Otherwise no store: submissions are still emailed to IAS (exactly what
 *     the old WordPress review form did) but cannot appear automatically.
 */

export type Testimonial = {
  id: string;
  name: string;
  /** Optional context shown under the name, e.g. company, aircraft or town. */
  context?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** ISO date. Undated curated entries sort last. */
  date?: string;
  source: "website" | "google" | "curated";
};

/** Private fields kept with a submission but never rendered. */
type StoredTestimonial = Testimonial & { email?: string };

export const curatedTestimonials: Testimonial[] = [
  {
    id: "curated-will-hudson",
    name: "Will Hudson",
    rating: 5,
    text: "IAS rebuilt my PC12 and Beaver panels with new Garmin. IAS is highly professional. The avionics are properly configured/integrated, and the records packages are perfect. A+",
    date: "2026-05-06",
    source: "curated",
  },
  {
    id: "curated-steve-jones",
    name: "Steve Jones",
    rating: 5,
    text: "Extreme high level Quality Avionics, Knowledge and Service! Absolute pleasure working with Nancy. Thank you",
    source: "curated",
  },
];

export const TESTIMONIALS_TAG = "testimonials";
const HASH_KEY = "ias:testimonials";

/* ------------------------------------------------------------------ store */

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

const useFileStore = () => !redisConfig() && !process.env.VERCEL;
const DATA_FILE = path.join(process.cwd(), ".data", "testimonials.json");

/** True when submitted reviews can be saved and shown automatically. */
export function storeAvailable(): boolean {
  return Boolean(redisConfig()) || useFileStore();
}

async function redis<T = unknown>(command: (string | number)[]): Promise<T> {
  const cfg = redisConfig();
  if (!cfg) throw new Error("Redis not configured");
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(`Redis: ${data.error ?? res.status}`);
  return data.result as T;
}

async function readFileStore(): Promise<Record<string, StoredTestimonial>> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeFileStore(data: Record<string, StoredTestimonial>) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

async function readSubmitted(): Promise<StoredTestimonial[]> {
  const cfg = redisConfig();
  if (cfg) {
    // GET form of the REST API so Next can cache it under the testimonials
    // tag; submissions and removals revalidate that tag.
    const res = await fetch(`${cfg.url}/hgetall/${encodeURIComponent(HASH_KEY)}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      next: { revalidate: 300, tags: [TESTIMONIALS_TAG] },
    });
    const data = (await res.json()) as { result?: string[] };
    const flat = data.result ?? [];
    const out: StoredTestimonial[] = [];
    for (let i = 1; i < flat.length; i += 2) {
      try {
        out.push(JSON.parse(flat[i]));
      } catch {
        /* skip a corrupt entry rather than break the page */
      }
    }
    return out;
  }
  if (useFileStore()) return Object.values(await readFileStore());
  return [];
}

/* ------------------------------------------------------------------- API */

const publicFields = ({ email: _email, ...t }: StoredTestimonial): Testimonial => t;

/** All testimonials, newest first. Never throws: falls back to curated only. */
export async function getTestimonials(): Promise<Testimonial[]> {
  let submitted: StoredTestimonial[] = [];
  try {
    submitted = await readSubmitted();
  } catch (err) {
    console.error("[testimonials] read failed:", err);
  }
  return [...submitted.map(publicFields), ...curatedTestimonials].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });
}

export async function addTestimonial(
  input: Omit<StoredTestimonial, "id" | "date" | "source">
): Promise<StoredTestimonial> {
  const t: StoredTestimonial = {
    ...input,
    id: randomUUID(),
    date: new Date().toISOString(),
    source: "website",
  };
  if (redisConfig()) {
    await redis(["HSET", HASH_KEY, t.id, JSON.stringify(t)]);
  } else if (useFileStore()) {
    const all = await readFileStore();
    all[t.id] = t;
    await writeFileStore(all);
  } else {
    throw new Error("No testimonials store configured");
  }
  return t;
}

/** Returns true if something was removed. */
export async function removeTestimonial(id: string): Promise<boolean> {
  if (redisConfig()) return (await redis<number>(["HDEL", HASH_KEY, id])) > 0;
  if (useFileStore()) {
    const all = await readFileStore();
    if (!all[id]) return false;
    delete all[id];
    await writeFileStore(all);
    return true;
  }
  return false;
}

/**
 * Simple fixed-window limit per visitor so one person (or bot) can't flood
 * the page. Allows the submission when no Redis is available.
 */
export async function allowSubmission(ip: string, perHour = 3): Promise<boolean> {
  if (!redisConfig()) return true;
  const key = `ias:rl:review:${ip}`;
  const count = await redis<number>(["INCR", key]);
  if (count === 1) await redis(["EXPIRE", key, 3600]);
  return count <= perHour;
}

/* ------------------------------------------------------- removal links */

function secret(): string {
  return (
    process.env.TESTIMONIALS_SECRET ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    "local-dev-only"
  );
}

export function removalToken(id: string): string {
  return createHmac("sha256", secret()).update(`remove:${id}`).digest("base64url");
}

export function verifyRemovalToken(id: string, token: string): boolean {
  const expected = Buffer.from(removalToken(id));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
