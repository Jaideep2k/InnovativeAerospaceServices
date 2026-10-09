/**
 * DEV-ONLY inbox for the Photo Drop tool (components/dev/PhotoDrop.tsx).
 *
 * Saves photos the site owner drags onto the local dev site into
 * photo-drops/files/ and records where each one was dropped in
 * photo-drops/manifest.json, so the developer can wire them in properly
 * later. Every method answers 404 outside `next dev`.
 *
 *   POST   multipart: "meta" (JSON) + any number of "files"
 *   GET    the manifest; GET ?file=<name> streams a saved file (previews)
 *   DELETE ?id=<drop id> removes a drop and its files (Undo)
 */
import { NextResponse } from "next/server";
import { mkdir, open, readFile, readdir, rename, unlink, writeFile } from "fs/promises";
import type { FileHandle } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROOT = path.join(process.cwd(), "photo-drops");
const FILES_DIR = path.join(ROOT, "files");
const MANIFEST_PATH = path.join(ROOT, "manifest.json");

const MAX_FILE_BYTES = 60 * 1024 * 1024;
const MAX_FILES = 40;

/** Allowed extensions and the content type each is served with. */
const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
  tif: "image/tiff",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
};

/** Browser-reported types we accept (some OSes report none or octet-stream). */
const ALLOWED_MIME = new Set([
  ...Object.values(TYPES),
  "image/pjpeg",
  "image/heic-sequence",
  "image/heif-sequence",
  "image/x-tiff",
  "application/octet-stream",
  "",
]);

type DropTarget = "replace" | "add" | "link" | "note";

type DropFile = { path: string; originalName: string; size: number; type: string };

type DropImage = {
  kind: "img" | "video";
  src: string;
  alt: string;
  width: number;
  height: number;
  aspect: number;
  naturalWidth: number;
  naturalHeight: number;
  fit: string;
  poster?: string;
};

type Drop = {
  id: string;
  createdAt: string;
  page: string;
  pageTitle: string;
  target: DropTarget;
  section: { label: string; id: string | null; index: number; tag: string };
  image: DropImage | null;
  files: DropFile[];
  link: string | null;
  note: string;
  status: string;
  context: { pathHint: string; viewportWidth: number; via: "drag" | "picker" };
};

type Manifest = { about: string; nextSeq: number; drops: Drop[] };

const ABOUT =
  "Photo Drop inbox: placement requests made by dragging files onto the local dev site. See README.md.";

const README = `# Photo Drop inbox

This folder is an **inbox of photo placement requests** for the developer. Nothing in
it is on the live website.

It is filled by the dev-only **Photo Drop** tool (\`components/dev/PhotoDrop.tsx\`,
API in \`app/api/dev/photo-drop/route.ts\`). While browsing the local dev site
(\`npm run dev\`) with Photo Drop switched on (bottom-left button, or add \`?photos=1\`
to any URL), the site owner drags photos from their computer onto:

- an **image or video**, meaning "replace this with my photo", or
- a **section**, meaning "add these photos here",

or clicks a section's label to attach a **link** (for example a YouTube video) or a
**note** instead.

## What's in here

- \`manifest.json\`: one entry per drop. It records the page path and title; the
  section (heading label, id, index on the page); for image drops, the image being
  replaced (original src, alt text, rendered size, aspect ratio, object-fit); the
  saved files; any link and note; a short CSS path hint; the viewport width; and a
  \`status\` (\`pending\` until applied).
- \`files/\`: the dropped files, named \`<NNNN>-<page>-<section>-<original-name>\`.

\`target\` is \`replace\` (swap the image), \`add\` (add photos to the section),
\`link\` (a URL such as a YouTube video, no files) or \`note\` (instructions only).

## How drops get applied

Claude (the developer) reads \`manifest.json\` and applies each pending drop by hand:
converting and optimizing the photo into \`public/images\`, cropping it to the target's
aspect ratio, writing alt text, and wiring it into the right component. Applied
entries get \`"status": "applied"\` (or are removed). The tool itself never changes
the site's real images; the swaps you see while it is on are previews only.

This folder is git-ignored so large originals stay out of the repository.
`;

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function isDev() {
  return process.env.NODE_ENV === "development";
}

function notFound() {
  return new NextResponse("Not found", { status: 404 });
}

function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

/**
 * Mutating requests must carry the header the tool sends. A custom header
 * can't be added cross-origin without a CORS preflight (which this route
 * never grants), so other sites can't write to the inbox while dev runs.
 */
function fromTool(req: Request) {
  return req.headers.get("x-photo-drop") === "1";
}

function errCode(err: unknown) {
  return (err as NodeJS.ErrnoException | null)?.code;
}

/** Serialize manifest read-modify-write cycles (survives dev hot reloads). */
function serialize<T>(task: () => Promise<T>): Promise<T> {
  const g = globalThis as typeof globalThis & { __photoDropQueue?: Promise<unknown> };
  const run = (g.__photoDropQueue ?? Promise.resolve()).then(task);
  g.__photoDropQueue = run.catch(() => undefined);
  return run;
}

function slugify(value: string, max: number) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/g, "");
  return slug;
}

function extOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

function str(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/\u0000/g, "").trim().slice(0, max) : "";
}

function num(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function obj(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

async function ensureScaffold() {
  await mkdir(FILES_DIR, { recursive: true });
  try {
    await writeFile(path.join(ROOT, "README.md"), README, { encoding: "utf8", flag: "wx" });
  } catch (err) {
    if (errCode(err) !== "EEXIST") throw err;
  }
}

async function readManifest(): Promise<Manifest> {
  let raw: string;
  try {
    raw = await readFile(MANIFEST_PATH, "utf8");
  } catch (err) {
    if (errCode(err) === "ENOENT") return { about: ABOUT, nextSeq: 1, drops: [] };
    throw err;
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    // Never overwrite a manifest we can't read; that would lose every drop.
    throw new Error("photo-drops/manifest.json is not valid JSON. Fix or delete it, then retry.");
  }
  const drops = Array.isArray(data) ? data : obj(data)?.drops;
  if (!Array.isArray(drops)) {
    throw new Error("photo-drops/manifest.json has no drops array. Fix or delete it, then retry.");
  }
  const nextSeq = num(obj(data)?.nextSeq);
  return { about: ABOUT, nextSeq: nextSeq > 0 ? nextSeq : 1, drops: drops as Drop[] };
}

/** Atomic write: temp file then rename, retrying briefly if Windows holds a lock. */
async function writeManifest(manifest: Manifest) {
  await mkdir(ROOT, { recursive: true });
  const tmp = `${MANIFEST_PATH}.${process.pid}-${Date.now()}.tmp`;
  await writeFile(tmp, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  for (let attempt = 0; ; attempt++) {
    try {
      await rename(tmp, MANIFEST_PATH);
      return;
    } catch (err) {
      const code = errCode(err);
      if (attempt < 6 && (code === "EPERM" || code === "EBUSY" || code === "EACCES")) {
        await new Promise((resolve) => setTimeout(resolve, 40 * (attempt + 1)));
        continue;
      }
      await unlink(tmp).catch(() => undefined);
      throw err;
    }
  }
}

/** Next sequence number, never reusing one still present on disk. */
async function nextSeq(manifest: Manifest) {
  let max = manifest.nextSeq - 1;
  for (const drop of manifest.drops) {
    const n = Number.parseInt(String(drop.id), 10);
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  const names = await readdir(FILES_DIR).catch(() => [] as string[]);
  for (const name of names) {
    const match = /^(\d+)-/.exec(name);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return max + 1;
}

function checkFile(file: File): string | null {
  const ext = extOf(file.name);
  if (!TYPES[ext]) return `"${file.name}" isn't a supported photo or video type.`;
  if (!ALLOWED_MIME.has(file.type)) return `"${file.name}" has an unexpected type (${file.type}).`;
  if (file.size > MAX_FILE_BYTES) return `"${file.name}" is larger than 60 MB.`;
  return null;
}

function parseImage(value: unknown): DropImage | null {
  const o = obj(value);
  if (!o) return null;
  const src = str(o.src, 2000);
  if (!src) return null;
  const image: DropImage = {
    kind: o.kind === "video" ? "video" : "img",
    src,
    alt: str(o.alt, 500),
    width: Math.round(num(o.width)),
    height: Math.round(num(o.height)),
    aspect: Math.round(num(o.aspect) * 1000) / 1000,
    naturalWidth: Math.round(num(o.naturalWidth)),
    naturalHeight: Math.round(num(o.naturalHeight)),
    fit: str(o.fit, 20),
  };
  const poster = str(o.poster, 2000);
  if (poster) image.poster = poster;
  return image;
}

function parseLink(value: unknown): string | null | { error: string } {
  const link = str(value, 2000);
  if (!link) return null;
  try {
    const url = new URL(link);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch {
    /* fall through */
  }
  return { error: "Links must start with http:// or https://" };
}

/* ------------------------------------------------------------------ */
/* GET: manifest, or one saved file for previews                       */
/* ------------------------------------------------------------------ */

export async function GET(req: Request) {
  if (!isDev()) return notFound();
  const params = new URL(req.url).searchParams;
  const file = params.get("file");
  if (file !== null) return serveFile(req, file);

  try {
    const manifest = await readManifest();
    return NextResponse.json(manifest, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Couldn't read the manifest.", 500);
  }
}

async function serveFile(req: Request, name: string) {
  const ext = extOf(name);
  if (path.basename(name) !== name || !/^[a-z0-9][a-z0-9._-]*$/i.test(name) || !TYPES[ext]) {
    return fail("Bad file name.");
  }
  let handle: FileHandle;
  try {
    handle = await open(path.join(FILES_DIR, name), "r");
  } catch (err) {
    return errCode(err) === "ENOENT" ? fail("File not found.", 404) : fail("Couldn't read file.", 500);
  }
  try {
    const { size } = await handle.stat();
    const headers: Record<string, string> = {
      "Content-Type": TYPES[ext],
      "Cache-Control": "no-store",
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
    };
    // Dropped SVGs are untrusted; never let one run script if opened directly.
    if (ext === "svg") headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; sandbox";

    // Minimal single-range support so previews of dropped videos can play/seek.
    let start = 0;
    let end = size - 1;
    let status = 200;
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
    if (range && size > 0 && (range[1] || range[2])) {
      if (range[1]) {
        start = Number(range[1]);
        if (range[2]) end = Math.min(Number(range[2]), size - 1);
      } else {
        start = Math.max(0, size - Number(range[2]));
      }
      if (start > end || start >= size) {
        return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
      }
      status = 206;
      headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
    }
    const length = Math.max(0, end - start + 1);
    const body = new Uint8Array(length);
    if (length > 0) await handle.read(body, 0, length, start);
    headers["Content-Length"] = String(length);
    return new NextResponse(body, { status, headers });
  } finally {
    await handle.close();
  }
}

/* ------------------------------------------------------------------ */
/* POST: save a drop                                                   */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  if (!isDev()) return notFound();
  if (!fromTool(req)) return fail("Missing Photo Drop header.", 403);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Expected multipart form data.");
  }

  let meta: Record<string, unknown> | null;
  try {
    meta = obj(JSON.parse(String(form.get("meta") ?? "{}")));
  } catch {
    meta = null;
  }
  if (!meta) return fail("Invalid drop details.");

  const files = form
    .getAll("files")
    .filter((v): v is File => typeof v !== "string" && v.size > 0);
  if (files.length > MAX_FILES) return fail(`Please drop at most ${MAX_FILES} files at a time.`);
  const problems = files.map(checkFile).filter((p): p is string => p !== null);
  if (problems.length) return fail(problems.join(" "), 415);

  const link = parseLink(meta.link);
  if (link && typeof link === "object") return fail(link.error);
  const note = str(meta.note, 4000);
  const image = parseImage(meta.image);

  let target: DropTarget;
  if (files.length) target = meta.target === "replace" && image ? "replace" : "add";
  else if (link) target = "link";
  else if (note) target = "note";
  else return fail("Add a photo, a link or a note first.");

  let page = str(meta.page, 300).split(/[?#]/)[0] || "/";
  if (!page.startsWith("/")) page = `/${page}`;
  const sectionIn = obj(meta.section) ?? {};
  const section = {
    label: str(sectionIn.label, 120) || "Page",
    id: str(sectionIn.id, 120) || null,
    index: Math.trunc(num(sectionIn.index)),
    tag: str(sectionIn.tag, 20) || "section",
  };
  const contextIn = obj(meta.context) ?? {};

  try {
    const drop = await serialize(async () => {
      await ensureScaffold();
      const manifest = await readManifest();
      const seq = await nextSeq(manifest);
      const id = String(seq).padStart(4, "0");
      const pageSlug = page === "/" ? "home" : slugify(page, 40) || "page";
      const sectionSlug = slugify(section.label, 40) || `section-${section.index + 1}`;

      const saved: DropFile[] = [];
      const written: string[] = [];
      try {
        for (const file of files) {
          const ext = extOf(file.name);
          const base = slugify(file.name.slice(0, -(ext.length + 1)), 60) || "file";
          const data = Buffer.from(await file.arrayBuffer());
          // "wx" never overwrites; add a counter if two dropped files share a name.
          for (let n = 1; ; n++) {
            const name = `${id}-${pageSlug}-${sectionSlug}-${base}${n > 1 ? `-${n}` : ""}.${ext}`;
            try {
              await writeFile(path.join(FILES_DIR, name), data, { flag: "wx" });
              written.push(path.join(FILES_DIR, name));
              saved.push({
                path: `photo-drops/files/${name}`,
                originalName: file.name.slice(0, 255),
                size: file.size,
                type: file.type || TYPES[ext],
              });
              break;
            } catch (err) {
              if (errCode(err) !== "EEXIST" || n > 50) throw err;
            }
          }
        }

        const entry: Drop = {
          id,
          createdAt: new Date().toISOString(),
          page,
          pageTitle: str(meta.pageTitle, 300),
          target,
          section,
          image,
          files: saved,
          link: typeof link === "string" ? link : null,
          note,
          status: "pending",
          context: {
            pathHint: str(contextIn.pathHint, 400),
            viewportWidth: Math.round(num(contextIn.viewportWidth)),
            via: contextIn.via === "picker" ? "picker" : "drag",
          },
        };
        manifest.drops.push(entry);
        manifest.nextSeq = seq + 1;
        await writeManifest(manifest);
        return entry;
      } catch (err) {
        await Promise.all(written.map((p) => unlink(p).catch(() => undefined)));
        throw err;
      }
    });
    return NextResponse.json({ ok: true, drop });
  } catch (err) {
    console.error("[photo-drop] save failed:", err);
    return fail(err instanceof Error ? err.message : "Couldn't save the drop.", 500);
  }
}

/* ------------------------------------------------------------------ */
/* DELETE: undo a drop                                                 */
/* ------------------------------------------------------------------ */

export async function DELETE(req: Request) {
  if (!isDev()) return notFound();
  if (!fromTool(req)) return fail("Missing Photo Drop header.", 403);
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return fail("Missing id.");

  try {
    const removed = await serialize(async () => {
      const manifest = await readManifest();
      const index = manifest.drops.findIndex((d) => d.id === id);
      if (index < 0) return null;
      const [drop] = manifest.drops.splice(index, 1);
      for (const file of drop.files ?? []) {
        // Only ever delete inside photo-drops/files, whatever the manifest says.
        const name = path.basename(String(file.path ?? ""));
        if (!name) continue;
        await unlink(path.join(FILES_DIR, name)).catch((err) => {
          if (errCode(err) !== "ENOENT") throw err;
        });
      }
      await writeManifest(manifest);
      return drop;
    });
    if (!removed) return fail("Drop not found.", 404);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[photo-drop] delete failed:", err);
    return fail(err instanceof Error ? err.message : "Couldn't remove the drop.", 500);
  }
}
