"use client";

/**
 * DEV-ONLY "Photo Drop" placement tool.
 *
 * While browsing the local dev site, the owner drags photo files from their
 * computer onto the image they want replaced, or onto the section they want
 * photos added to (or drags a link, e.g. a YouTube URL). Each drop is posted to
 * /api/dev/photo-drop, which saves the files in photo-drops/ along with exactly
 * where they were dropped, so the developer can wire them in properly later.
 *
 * Never touches page DOM structure: highlights, badges and tags live in one
 * fixed, pointer-events-none overlay positioned from getBoundingClientRect.
 * The only page mutation is a temporary src swap on replaced images (preview).
 * When switched off it attaches no listeners, observers or animation frames.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";

/* ================================================================== */
/* Types                                                               */
/* ================================================================== */

type Media = HTMLImageElement | HTMLVideoElement;

type Region = {
  el: HTMLElement;
  label: string;
  id: string | null;
  index: number;
  total: number;
  tag: string;
  sticky: boolean;
};

type ImageMeta = {
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

type DraftFile = {
  key: number;
  file: File;
  ext: string;
  kind: "image" | "video";
  /** object URL when the browser can preview this type */
  url: string | null;
};

type Draft = {
  key: number;
  region: Region;
  media: Media | null;
  image: ImageMeta | null;
  mode: "replace" | "add";
  files: DraftFile[];
  rejected: string[];
  link: string;
  note: string;
  hints: { media: string; region: string };
  via: "drag" | "picker";
  x: number;
  y: number;
  saving: boolean;
  error: string | null;
};

type SavedDrop = {
  id: string;
  createdAt: string;
  page: string;
  pageTitle: string;
  target: "replace" | "add" | "link" | "note";
  section: { label: string; id: string | null; index: number; tag?: string };
  image: ImageMeta | null;
  files: { path: string; originalName: string; size: number; type: string }[];
  link: string | null;
  note: string;
  status: string;
};

type Preview = {
  dropId: string;
  swapped: boolean;
  originalSrc: string;
  attrs: { src: string | null; srcset: string | null; sizes: string | null };
};

type PendingTag = { el: Media; dropId: string; swapped: boolean };
type Highlight = { mode: "replace" | "add"; label: string };
type Toast = { id: number; text: string; thumb: string | null };
type Box = { left: number; top: number; width: number; height: number };

/* ================================================================== */
/* Constants                                                           */
/* ================================================================== */

const API = "/api/dev/photo-drop";
/** The API refuses writes without this header (blocks cross-site requests). */
const WRITE_HEADERS = { "x-photo-drop": "1" };
const STORAGE_KEY = "ias:photo-drop";
const UI_SELECTOR = "[data-photodrop]";
const MAX_FILE_BYTES = 60 * 1024 * 1024;
const ALLOWED_EXT = new Set([
  "jpg", "jpeg", "png", "webp", "avif", "gif", "heic", "heif", "tif", "tiff", "svg", "mp4", "mov", "webm",
]);
const VIDEO_EXT = new Set(["mp4", "mov", "webm"]);
/** Types an <img> can show in Chromium (HEIC/TIFF are saved fine, just not previewed). */
const IMG_PREVIEW_EXT = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"]);
const ACCEPT = Array.from(ALLOWED_EXT, (ext) => `.${ext}`).join(",");
const INSTRUCTIONS =
  "Drag photos onto any image to replace it, or onto any section to add them there. Click a section label to add a link or note instead.";

/* ================================================================== */
/* Module state shared across renders (DOM-bound, client only)         */
/* ================================================================== */

/** Images/videos currently showing a pending replacement, with their originals. */
const previews = new Map<Media, Preview>();
/** dropId -> object URL of the dropped file, for instant previews without a refetch. */
const localUrls = new Map<string, string>();
/** dropId -> the exact element it was dropped on (disambiguates repeated images). */
const pinned = new Map<string, Media>();
/** Last style written to each overlay node, to skip redundant writes per frame. */
const written = new WeakMap<HTMLElement, string>();
/** Overflow-clipping ancestors per element, for drawing only the visible part. */
const clipChains = new WeakMap<Element, Element[]>();
let keySeq = 0;
const nextKey = () => ++keySeq;

/* ================================================================== */
/* DOM helpers                                                         */
/* ================================================================== */

const isUi = (el: Element | null) => !!el?.closest(UI_SELECTOR);
const clean = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));
const extOf = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
};
const fileUrl = (savedPath: string) =>
  `${API}?file=${encodeURIComponent(savedPath.split("/").pop() ?? "")}`;
const isMedia = (el: Element): el is Media =>
  el instanceof HTMLImageElement || el instanceof HTMLVideoElement;
const kindOf = (el: Media): "img" | "video" => (el instanceof HTMLVideoElement ? "video" : "img");

/** A page region: any <section>, plus top-level <header>/<footer> (not card/quote footers). */
function isRegion(el: Element): el is HTMLElement {
  if (el.tagName === "SECTION") return true;
  if (el.tagName === "HEADER" || el.tagName === "FOOTER") {
    return !el.parentElement?.closest("section, article, aside, blockquote, figure, nav, dialog");
  }
  return false;
}

function listRegionEls(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("section, header, footer")).filter(
    (el) => isRegion(el) && !isUi(el)
  );
}

function regionOf(el: Element | null): HTMLElement | null {
  for (let node = el; node; node = node.parentElement) {
    if (isRegion(node)) return isUi(node) ? null : node;
  }
  return null;
}

function regionLabel(el: HTMLElement, index: number): string {
  let text = clean(el.querySelector("h1, h2, h3")?.textContent);
  if (!text) text = clean(el.getAttribute("aria-label"));
  if (!text) {
    const ids = el.getAttribute("aria-labelledby");
    if (ids) text = clean(ids.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? "").join(" "));
  }
  if (!text && el.id) text = el.id;
  if (el.tagName === "HEADER") text = text ? `Header: ${text}` : "Site header";
  else if (el.tagName === "FOOTER") text = text ? `Footer: ${text}` : "Site footer";
  else if (!text) text = `Section ${index + 1}`;
  return clip(text, 60);
}

function describeRegion(el: HTMLElement, all: HTMLElement[]): Region {
  const index = all.indexOf(el);
  const position = getComputedStyle(el).position;
  return {
    el,
    label: regionLabel(el, index),
    id: el.id || null,
    index,
    total: all.length,
    tag: el.tagName.toLowerCase(),
    sticky: position === "sticky" || position === "fixed",
  };
}

function fallbackRegion(total: number): Region {
  const el = document.querySelector<HTMLElement>("main") ?? document.body;
  return { el, label: "Page (outside any section)", id: null, index: -1, total, tag: el.tagName.toLowerCase(), sticky: false };
}

/** Resolve a src to the original asset path (decodes /_next/image?url=...). */
function normalizeSrc(raw: string, depth = 0): string {
  if (!raw) return "";
  if (raw.startsWith("data:")) return "(inline data URL)";
  if (raw.startsWith("blob:")) return "(local preview)";
  try {
    const url = new URL(raw, window.location.href);
    if (url.origin !== window.location.origin) return url.href;
    if (url.pathname === "/_next/image" && depth < 2) {
      const inner = url.searchParams.get("url");
      if (inner) return normalizeSrc(inner, depth + 1);
    }
    return decodeURI(url.pathname);
  } catch {
    return raw;
  }
}

function rawSrc(el: Media): string {
  if (el instanceof HTMLImageElement) return el.currentSrc || el.src;
  return el.currentSrc || el.src || el.querySelector("source")?.src || "";
}

/** The asset an element showed before any preview swap. */
function originalSrc(el: Media): string {
  return previews.get(el)?.originalSrc ?? normalizeSrc(rawSrc(el));
}

function displayName(src: string): string {
  const name = src.split(/[?#]/)[0].split("/").pop() || src;
  // Statically imported assets carry a content hash: hero.3f2a9c1d.jpg -> hero.jpg
  return src.includes("/_next/static/media/") ? name.replace(/\.[0-9a-f]{6,}(?=\.[a-z0-9]+$)/i, "") : name;
}

function mediaMeta(el: Media): ImageMeta {
  const rect = el.getBoundingClientRect();
  // Layout size ignores transforms (parallax/scale), i.e. the box the photo must fill.
  const width = Math.round(el.offsetWidth || rect.width);
  const height = Math.round(el.offsetHeight || rect.height);
  const meta: ImageMeta = {
    kind: kindOf(el),
    src: originalSrc(el),
    alt: el instanceof HTMLImageElement ? el.alt : clean(el.getAttribute("aria-label") ?? el.getAttribute("title")),
    width,
    height,
    aspect: height ? Math.round((width / height) * 1000) / 1000 : 0,
    naturalWidth: el instanceof HTMLImageElement ? el.naturalWidth : el.videoWidth,
    naturalHeight: el instanceof HTMLImageElement ? el.naturalHeight : el.videoHeight,
    fit: getComputedStyle(el).objectFit,
  };
  if (el instanceof HTMLVideoElement && el.poster) meta.poster = normalizeSrc(el.poster);
  return meta;
}

/** Short CSS-ish path, e.g. "main > section:nth-of-type(3) > div > img". */
function pathHint(el: Element): string {
  const parts: string[] = [];
  for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
    const current: Element = node;
    let part = current.tagName.toLowerCase();
    if (current.id) {
      part += `#${current.id}`;
    } else if (current.parentElement) {
      const same = Array.from(current.parentElement.children).filter((c) => c.tagName === current.tagName);
      if (same.length > 1) part += `:nth-of-type(${same.indexOf(current) + 1})`;
    }
    parts.unshift(part);
    if (current.id || current.tagName === "MAIN") break;
  }
  return (parts.length > 8 ? [...parts.slice(0, 3), "…", ...parts.slice(-4)] : parts).join(" > ");
}

function clipChain(el: Element): Element[] {
  const cached = clipChains.get(el);
  if (cached) return cached;
  const chain: Element[] = [];
  for (let n = el.parentElement; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
    const style = getComputedStyle(n);
    if (style.overflowX !== "visible" || style.overflowY !== "visible") chain.push(n);
  }
  clipChains.set(el, chain);
  return chain;
}

/** The on-screen, un-clipped part of an element, or null when none is visible. */
function visibleBox(el: Element, vw: number, vh: number): Box | null {
  const r = el.getBoundingClientRect();
  let left = Math.max(r.left, 0);
  let top = Math.max(r.top, 0);
  let right = Math.min(r.right, vw);
  let bottom = Math.min(r.bottom, vh);
  for (const c of clipChain(el)) {
    const cr = c.getBoundingClientRect();
    left = Math.max(left, cr.left);
    top = Math.max(top, cr.top);
    right = Math.min(right, cr.right);
    bottom = Math.min(bottom, cr.bottom);
  }
  if (right - left < 2 || bottom - top < 2) return null;
  return { left, top, width: right - left, height: bottom - top };
}

/** Fallback for images that elementsFromPoint can't see (pointer-events: none). */
function mediaAtPoint(scope: ParentNode, x: number, y: number): Media | null {
  const all = Array.from(scope.querySelectorAll<Media>("img, video"));
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  for (let i = all.length - 1; i >= 0; i--) {
    const el = all[i];
    if (isUi(el)) continue;
    const box = visibleBox(el, vw, vh);
    if (!box || box.width < 4 || box.height < 4) continue;
    if (x < box.left || x > box.left + box.width || y < box.top || y > box.top + box.height) continue;
    if (getComputedStyle(el).visibility === "hidden") continue;
    return el;
  }
  return null;
}

/**
 * What's under the pointer: the region of the topmost page element, and the
 * first <img>/<video> in the stack inside that region. next/image <img>s often
 * sit under gradient/overlay divs, hence elementsFromPoint rather than e.target.
 */
function hitTest(x: number, y: number): { media: Media | null; regionEl: HTMLElement | null } {
  const stack = document.elementsFromPoint(x, y).filter((el) => !isUi(el));
  const regionEl = stack.length ? regionOf(stack[0]) : null;
  let media: Media | null = null;
  for (const el of stack) {
    if (isMedia(el) && (!regionEl || regionEl.contains(el))) {
      media = el;
      break;
    }
  }
  if (!media) media = mediaAtPoint(regionEl ?? document, x, y);
  return { media, regionEl: (media && regionOf(media)) || regionEl };
}

function linkFrom(dt: DataTransfer): string | null {
  const uri =
    dt
      .getData("text/uri-list")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .find((s) => s && !s.startsWith("#")) ?? "";
  const plain = dt.getData("text/plain").trim();
  for (const candidate of [uri, plain]) {
    if (/^https?:\/\/\S+$/i.test(candidate)) return candidate;
  }
  return null;
}

function isSameOrigin(link: string) {
  try {
    return new URL(link).origin === window.location.origin;
  } catch {
    return false;
  }
}

function intake(list: File[]): { accepted: DraftFile[]; rejected: string[] } {
  const accepted: DraftFile[] = [];
  const rejected: string[] = [];
  for (const file of list) {
    const ext = extOf(file.name);
    if (!ALLOWED_EXT.has(ext)) rejected.push(`${file.name} (not a photo or video type)`);
    else if (file.size === 0) rejected.push(`${file.name} (empty, or a folder)`);
    else if (file.size > MAX_FILE_BYTES) rejected.push(`${file.name} (over 60 MB)`);
    else {
      const kind = VIDEO_EXT.has(ext) ? "video" : "image";
      const previewable = kind === "video" || IMG_PREVIEW_EXT.has(ext);
      accepted.push({ key: nextKey(), file, ext, kind, url: previewable ? URL.createObjectURL(file) : null });
    }
  }
  return { accepted, rejected };
}

function revokeDraft(draft: Draft, keep?: string) {
  for (const f of draft.files) if (f.url && f.url !== keep) URL.revokeObjectURL(f.url);
}

function buildDraft(
  regionEl: HTMLElement | null,
  media: Media | null,
  x: number,
  y: number,
  via: Draft["via"]
): Draft {
  const all = listRegionEls();
  const region = regionEl && all.includes(regionEl) ? describeRegion(regionEl, all) : fallbackRegion(all.length);
  return {
    key: nextKey(),
    region,
    media,
    image: media ? mediaMeta(media) : null,
    mode: media ? "replace" : "add",
    files: [],
    rejected: [],
    link: "",
    note: "",
    hints: { media: media ? pathHint(media) : "", region: pathHint(region.el) },
    via,
    x,
    y,
    saving: false,
    error: null,
  };
}

function applyPreview(el: Media, drop: SavedDrop) {
  const isVideo = el instanceof HTMLVideoElement;
  const file = drop.files.find((f) => (isVideo ? VIDEO_EXT : IMG_PREVIEW_EXT).has(extOf(f.path)));
  const url = localUrls.get(drop.id) ?? (file ? fileUrl(file.path) : null);
  const preview: Preview = {
    dropId: drop.id,
    swapped: !!url,
    originalSrc: normalizeSrc(rawSrc(el)),
    attrs: { src: el.getAttribute("src"), srcset: el.getAttribute("srcset"), sizes: el.getAttribute("sizes") },
  };
  if (url) {
    if (el instanceof HTMLImageElement) {
      el.removeAttribute("srcset");
      el.removeAttribute("sizes");
    }
    el.src = url;
  }
  el.setAttribute("data-photodrop-pending", drop.id);
  previews.set(el, preview);
}

function revertPreview(el: Media) {
  const preview = previews.get(el);
  if (!preview) return;
  previews.delete(el);
  el.removeAttribute("data-photodrop-pending");
  if (!preview.swapped) return;
  const { src, srcset, sizes } = preview.attrs;
  if (el instanceof HTMLImageElement) {
    if (srcset !== null) el.setAttribute("srcset", srcset);
    if (sizes !== null) el.setAttribute("sizes", sizes);
  }
  if (src !== null) el.setAttribute("src", src);
  else {
    el.removeAttribute("src");
    if (el instanceof HTMLVideoElement) el.load();
  }
}

/** Writes an overlay node's position only when it changed. */
function place(node: HTMLElement, x: number, y: number, w?: number, h?: number) {
  const key = `${Math.round(x)},${Math.round(y)},${w === undefined ? "" : Math.round(w)},${h === undefined ? "" : Math.round(h)}`;
  if (written.get(node) === key) return;
  written.set(node, key);
  node.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  if (w !== undefined && h !== undefined) {
    node.style.width = `${Math.round(w)}px`;
    node.style.height = `${Math.round(h)}px`;
  }
  node.style.visibility = "visible";
}

function hide(node: HTMLElement) {
  if (written.get(node) === "hidden") return;
  written.set(node, "hidden");
  node.style.visibility = "hidden";
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/* ================================================================== */
/* Component                                                           */
/* ================================================================== */

export default function PhotoDrop() {
  // layout.tsx already renders this only in development; this keeps it inert
  // (and dead-code eliminated) anywhere else.
  if (process.env.NODE_ENV !== "development") return null;
  return <PhotoDropTool />;
}

function PhotoDropTool() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [drops, setDrops] = useState<SavedDrop[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [dragging, setDragging] = useState(false);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [pending, setPending] = useState<PendingTag[]>([]);
  const [draft, setDraftState] = useState<Draft | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Mirrors of state for listeners and the animation frame loop.
  const enabledRef = useRef(false);
  const dropsRef = useRef<SavedDrop[] | null>(null);
  const pathnameRef = useRef(pathname);
  const draftRef = useRef<Draft | null>(null);
  const regionsRef = useRef<Region[]>([]);
  const pendingRef = useRef<PendingTag[]>([]);
  const targetRef = useRef<Element | null>(null);
  const highlightKeyRef = useRef("");
  const panelRef = useRef<HTMLDivElement>(null);
  const toastSeq = useRef(0);
  const overlay = useRef({
    box: null as HTMLDivElement | null,
    label: null as HTMLDivElement | null,
    badges: new Map<HTMLElement, HTMLButtonElement>(),
    tags: new Map<string, HTMLDivElement>(),
  });

  const setDraft = useCallback((next: Draft | null) => {
    draftRef.current = next;
    setDraftState(next);
  }, []);

  const showHighlight = useCallback((el: Element | null, next: Highlight | null) => {
    targetRef.current = el;
    const key = next ? `${next.mode}|${next.label}` : "";
    if (key === highlightKeyRef.current) return;
    highlightKeyRef.current = key;
    setHighlight(next);
  }, []);

  const pushToast = useCallback((text: string, thumb: string | null = null) => {
    const id = ++toastSeq.current;
    setToasts((prev) => [...prev.slice(-2), { id, text, thumb }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const loadDrops = useCallback(async () => {
    try {
      const res = await fetch(API, { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as { drops?: SavedDrop[]; error?: string } | null;
      if (!res.ok || !Array.isArray(data?.drops)) throw new Error(data?.error ?? `HTTP ${res.status}`);
      setDrops(data.drops);
      setLoadError(null);
    } catch (err) {
      setLoadError(`Couldn't load saved drops (${err instanceof Error ? err.message : "error"}).`);
    }
  }, []);

  /** Make replaced images on this page show their pending photo (only while on). */
  const syncPreviews = useCallback(() => {
    for (const el of Array.from(previews.keys())) if (!el.isConnected) previews.delete(el);
    const wanted = new Map<Media, SavedDrop>();
    const relevant = enabledRef.current
      ? (dropsRef.current ?? []).filter(
          (d) => d.target === "replace" && d.image && d.status === "pending" && d.page === pathnameRef.current
        )
      : [];
    if (relevant.length) {
      const media = Array.from(document.querySelectorAll<Media>("img, video")).filter((m) => !isUi(m));
      let all: HTMLElement[] | null = null;
      for (const drop of relevant) {
        const image = drop.image as ImageMeta;
        let el = pinned.get(drop.id);
        if (!el || !el.isConnected) {
          const matches = media.filter((m) => kindOf(m) === image.kind && originalSrc(m) === image.src);
          if (matches.length > 1) {
            const regionEls = (all ??= listRegionEls());
            el = matches.find((m) => {
              const r = regionOf(m);
              return r !== null && regionEls.indexOf(r) === drop.section.index;
            });
          }
          el ??= matches[0];
        }
        if (el) wanted.set(el, drop); // later drops for the same image win
      }
    }
    for (const [el, preview] of Array.from(previews)) {
      if (wanted.get(el)?.id !== preview.dropId) revertPreview(el);
    }
    for (const [el, drop] of Array.from(wanted)) if (!previews.has(el)) applyPreview(el, drop);

    const next = Array.from(wanted, ([el, drop]) => ({
      el,
      dropId: drop.id,
      swapped: previews.get(el)?.swapped ?? false,
    }));
    const prev = pendingRef.current;
    const same =
      prev.length === next.length &&
      prev.every((p, i) => p.el === next[i].el && p.dropId === next[i].dropId && p.swapped === next[i].swapped);
    if (!same) {
      pendingRef.current = next;
      setPending(next);
    }
  }, []);

  const scanRegions = useCallback(() => {
    const all = listRegionEls();
    const next = all.map((el) => describeRegion(el, all));
    const prev = regionsRef.current;
    const same =
      prev.length === next.length &&
      prev.every((r, i) => r.el === next[i].el && r.label === next[i].label && r.sticky === next[i].sticky);
    if (!same) {
      regionsRef.current = next;
      setRegions(next);
    }
  }, []);

  /* ---------- initial state: sessionStorage or ?photos=1 ---------- */
  useEffect(() => {
    let on = false;
    try {
      on = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
    const param = new URLSearchParams(window.location.search).get("photos");
    if (param === "1" || param === "0") {
      on = param === "1";
      try {
        window.sessionStorage.setItem(STORAGE_KEY, on ? "1" : "0");
      } catch {
        /* ignore */
      }
    }
    setEnabled(on);
    void loadDrops();
  }, [loadDrops]);

  /* ---------- keep refs current; re-sync previews ---------- */
  useEffect(() => {
    enabledRef.current = enabled;
    dropsRef.current = drops;
    pathnameRef.current = pathname;
    syncPreviews();
  }, [enabled, drops, pathname, syncPreviews]);

  /* ---------- close an open draft on navigation or when switched off ---------- */
  useEffect(() => {
    const current = draftRef.current;
    if (current) {
      revokeDraft(current);
      setDraft(null);
    }
  }, [enabled, pathname, setDraft]);

  /* ---------- restore every image if the tool unmounts (hot reload) ---------- */
  useEffect(
    () => () => {
      for (const el of Array.from(previews.keys())) revertPreview(el);
    },
    []
  );

  /* ---------- the live tool: listeners, observer, frame loop (ON only) ---------- */
  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let watchdog = 0;
    let scanTimer = 0;
    let lastHitAt = 0;
    let lastHitKey: Element | null | undefined;
    let point: { x: number; y: number; dirty: boolean } | null = null;
    let isDragging = false;

    const rescan = () => {
      scanRegions();
      syncPreviews();
    };
    rescan();

    const endDrag = () => {
      window.clearTimeout(watchdog);
      point = null;
      lastHitKey = undefined;
      if (isDragging) {
        isDragging = false;
        setDragging(false);
      }
      showHighlight(null, null);
    };

    const wants = (e: DragEvent) => {
      const types = Array.from(e.dataTransfer?.types ?? []);
      if (types.includes("Files") || types.includes("text/uri-list")) return true;
      if (!types.includes("text/plain")) return false;
      // Let plain text drags into form fields behave normally.
      const t = e.target;
      return !(t instanceof HTMLElement && (t.isContentEditable || t.closest("input, textarea, select")));
    };

    const onDragOver = (e: DragEvent) => {
      if (!wants(e)) return;
      e.preventDefault(); // allow dropping here, and never let the browser open the file
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
      if (!point || point.x !== e.clientX || point.y !== e.clientY) {
        point = { x: e.clientX, y: e.clientY, dirty: true };
      }
      if (!isDragging) {
        isDragging = true;
        setDragging(true);
      }
      window.clearTimeout(watchdog);
      watchdog = window.setTimeout(endDrag, 1000);
    };

    const onDragLeave = (e: DragEvent) => {
      if (!e.relatedTarget) endDrag(); // left the window or the drag was cancelled
    };

    const updateDragTarget = (x: number, y: number) => {
      const panel = panelRef.current;
      if (panel && draftRef.current) {
        const r = panel.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          lastHitKey = panel;
          showHighlight(panel, { mode: "add", label: "Add to this drop" });
          return;
        }
      }
      const hit = hitTest(x, y);
      const key = hit.media ?? hit.regionEl;
      if (key === lastHitKey) return;
      lastHitKey = key;
      if (hit.media) {
        showHighlight(hit.media, {
          mode: "replace",
          label: hit.media instanceof HTMLVideoElement ? "Replace this video" : "Replace this image",
        });
      } else if (hit.regionEl) {
        const all = listRegionEls();
        showHighlight(hit.regionEl, {
          mode: "add",
          label: `Add to: ${regionLabel(hit.regionEl, all.indexOf(hit.regionEl))}`,
        });
      } else {
        showHighlight(document.querySelector("main"), { mode: "add", label: "Add to: this page" });
      }
    };

    const onDrop = (e: DragEvent) => {
      if (!wants(e)) return;
      e.preventDefault();
      const { clientX: x, clientY: y } = e;
      endDrag();
      const dt = e.dataTransfer;
      if (!dt) return;

      const current = draftRef.current;
      if (current?.saving) {
        pushToast("Still saving the last drop, try again in a moment.");
        return;
      }
      const files = Array.from(dt.files);
      let link = linkFrom(dt);
      if (link && isSameOrigin(link)) link = null; // a page link/image dragged by accident
      if (!files.length && !link) {
        pushToast("Drop photo or video files, or a web link (e.g. YouTube).");
        return;
      }
      const { accepted, rejected } = intake(files);
      if (!accepted.length && !link) {
        pushToast(`Not saved: ${rejected.join(", ")}`);
        return;
      }

      // Dropped onto the open panel: add to that drop.
      const panel = panelRef.current;
      if (current && panel && e.target instanceof Node && panel.contains(e.target)) {
        setDraft({
          ...current,
          files: [...current.files, ...accepted],
          rejected: [...current.rejected, ...rejected],
          link: link ?? current.link,
          error: null,
        });
        return;
      }

      if (current) revokeDraft(current);
      const hit = hitTest(x, y);
      setDraft({ ...buildDraft(hit.regionEl, hit.media, x, y, "drag"), files: accepted, rejected, link: link ?? "" });
    };

    const tick = () => {
      raf = window.requestAnimationFrame(tick);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const now = performance.now();

      // Re-test when the pointer moves, and periodically (scrolling/animation under a still pointer).
      if (isDragging && point && (point.dirty || now - lastHitAt > 160)) {
        point.dirty = false;
        lastHitAt = now;
        updateDragTarget(point.x, point.y);
      }

      const { box, label, badges, tags } = overlay.current;

      // Highlight rectangle + label.
      const target = targetRef.current;
      const tbox = target && target.isConnected ? visibleBox(target, vw, vh) : null;
      if (box) {
        if (tbox) place(box, tbox.left, tbox.top, tbox.width, tbox.height);
        else hide(box);
      }
      if (label) {
        if (tbox) place(label, clamp(tbox.left + 4, 4, vw - 220), clamp(tbox.top + 4, 4, vh - 90));
        else hide(label);
      }

      // Bottom edge of a stuck sticky header: badges/tags tuck in below it.
      let safeTop = 0;
      for (const region of regionsRef.current) {
        if (!region.sticky) continue;
        const r = region.el.getBoundingClientRect();
        if (r.top <= 1 && r.bottom > safeTop) safeTop = r.bottom;
      }

      // Section badges (top-left of each region, kept in view while scrolling through it).
      for (const region of regionsRef.current) {
        const node = badges.get(region.el);
        if (!node) continue;
        const r = region.el.getBoundingClientRect();
        const minTop = region.sticky ? r.top : safeTop;
        const top = Math.min(Math.max(r.top, minTop) + 6, r.bottom - 30);
        if (r.width < 1 || r.height < 24 || top < minTop || top > vh - 70 || r.right < 0 || r.left > vw) hide(node);
        else place(node, Math.max(r.left, 0) + 6, top);
      }

      // "Pending" tags on replaced images.
      for (const tag of pendingRef.current) {
        const node = tags.get(tag.dropId);
        if (!node) continue;
        const b = tag.el.isConnected ? visibleBox(tag.el, vw, vh) : null;
        const top = b ? Math.max(b.top, safeTop) + 6 : 0;
        if (!b || top > b.top + b.height - 22) hide(node);
        else place(node, b.left + 6, top);
      }
    };
    raf = window.requestAnimationFrame(tick);

    // Re-scan sections when the page's element tree changes (navigation, lazy content).
    const observer = new MutationObserver((records) => {
      const relevant = records.some((m) => {
        if (m.target instanceof Element && isUi(m.target)) return false;
        return [...Array.from(m.addedNodes), ...Array.from(m.removedNodes)].some(
          (n) => n instanceof Element && !n.matches(UI_SELECTOR)
        );
      });
      if (relevant && !scanTimer) {
        scanTimer = window.setTimeout(() => {
          scanTimer = 0;
          rescan();
        }, 300);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const capture = { capture: true } as const;
    window.addEventListener("dragenter", onDragOver, capture);
    window.addEventListener("dragover", onDragOver, capture);
    window.addEventListener("dragleave", onDragLeave, capture);
    window.addEventListener("drop", onDrop, capture);

    return () => {
      window.removeEventListener("dragenter", onDragOver, capture);
      window.removeEventListener("dragover", onDragOver, capture);
      window.removeEventListener("dragleave", onDragLeave, capture);
      window.removeEventListener("drop", onDrop, capture);
      observer.disconnect();
      window.cancelAnimationFrame(raf);
      window.clearTimeout(watchdog);
      window.clearTimeout(scanTimer);
      setDragging(false);
      showHighlight(null, null);
    };
  }, [enabled, scanRegions, syncPreviews, showHighlight, pushToast, setDraft]);

  /* ---------- rescan after client-side navigation ---------- */
  useEffect(() => {
    if (!enabled) return;
    const t = window.setTimeout(() => {
      scanRegions();
      syncPreviews();
    }, 60);
    return () => window.clearTimeout(t);
  }, [enabled, pathname, scanRegions, syncPreviews]);

  /* ---------- Esc closes the panel / drawer (only while one is open) ---------- */
  useEffect(() => {
    if (!draft && !drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const current = draftRef.current;
      if (current) {
        if (current.saving) return;
        revokeDraft(current);
        setDraft(null);
      } else setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [draft, drawerOpen, setDraft]);

  /* ---------- actions ---------- */

  const toggle = () => {
    const on = !enabled;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, on ? "1" : "0");
    } catch {
      /* ignore */
    }
    setEnabled(on);
    if (on) void loadDrops();
  };

  const openFromBadge = (region: Region, anchor: HTMLElement) => {
    const current = draftRef.current;
    if (current?.saving) return;
    if (current) revokeDraft(current);
    const r = anchor.getBoundingClientRect();
    showHighlight(null, null);
    setDraft(buildDraft(region.el, null, r.left, r.bottom + 6, "picker"));
  };

  const cancelDraft = () => {
    const current = draftRef.current;
    if (!current || current.saving) return;
    revokeDraft(current);
    setDraft(null);
  };

  const updateDraft = (patch: Partial<Draft>) => {
    const current = draftRef.current;
    if (current) setDraft({ ...current, ...patch });
  };

  const addFiles = (list: FileList | null) => {
    const current = draftRef.current;
    if (!current || !list?.length) return;
    const { accepted, rejected } = intake(Array.from(list));
    setDraft({
      ...current,
      files: [...current.files, ...accepted],
      rejected: [...current.rejected, ...rejected],
      error: null,
    });
  };

  const removeFile = (key: number) => {
    const current = draftRef.current;
    if (!current) return;
    const gone = current.files.find((f) => f.key === key);
    if (gone?.url) URL.revokeObjectURL(gone.url);
    setDraft({ ...current, files: current.files.filter((f) => f.key !== key) });
  };

  const save = async () => {
    const d = draftRef.current;
    if (!d || d.saving) return;
    const link = d.link.trim();
    const note = d.note.trim();
    if (link && !/^https?:\/\/\S+$/i.test(link)) {
      setDraft({ ...d, error: "Links must start with http:// or https://" });
      return;
    }
    if (!d.files.length && !link && !note) {
      setDraft({ ...d, error: "Add a photo, a link or a note first." });
      return;
    }
    const replacing = d.mode === "replace" && !!d.media;
    const meta = {
      page: window.location.pathname,
      pageTitle: document.title,
      target: replacing ? "replace" : "add",
      section: { label: d.region.label, id: d.region.id, index: d.region.index, tag: d.region.tag },
      image: replacing ? d.image : null,
      link,
      note,
      context: {
        pathHint: replacing ? d.hints.media : d.hints.region,
        viewportWidth: window.innerWidth,
        via: d.via,
      },
    };
    const body = new FormData();
    body.append("meta", JSON.stringify(meta));
    for (const f of d.files) body.append("files", f.file, f.file.name);

    setDraft({ ...d, saving: true, error: null });
    let saved: SavedDrop;
    try {
      const res = await fetch(API, { method: "POST", body, headers: WRITE_HEADERS });
      const data = (await res.json().catch(() => null)) as { drop?: SavedDrop; error?: string } | null;
      if (!res.ok || !data?.drop) throw new Error(data?.error ?? `Save failed (HTTP ${res.status}).`);
      saved = data.drop;
    } catch (err) {
      const current = draftRef.current;
      if (current?.key === d.key) {
        setDraft({ ...current, saving: false, error: err instanceof Error ? err.message : "Save failed." });
      }
      return;
    }

    // Instant preview: reuse the dropped file's object URL on the replaced element.
    let keep: string | undefined;
    if (saved.target === "replace" && d.media) {
      const isVideo = d.media instanceof HTMLVideoElement;
      const f = d.files.find((file) => file.url && (isVideo ? VIDEO_EXT : IMG_PREVIEW_EXT).has(file.ext));
      if (f?.url) {
        keep = f.url;
        localUrls.set(saved.id, f.url);
      }
      pinned.set(saved.id, d.media);
    }
    revokeDraft(d, keep);
    if (draftRef.current?.key === d.key) setDraft(null);
    setDrops((prev) => [...(prev ?? []), saved]);

    const firstImage = saved.files.find((f) => IMG_PREVIEW_EXT.has(extOf(f.path)));
    const n = saved.files.length;
    const files = `${n} file${n === 1 ? "" : "s"}`;
    if (saved.target === "replace") {
      pushToast(
        keep
          ? `Saved (#${saved.id}). The image now shows your photo, marked Pending.`
          : `Saved (#${saved.id}). Marked Pending (this file type can't be previewed here).`,
        null
      );
    } else if (saved.target === "add") {
      pushToast(`Saved ${files} to "${saved.section.label}" (#${saved.id}).`, firstImage ? fileUrl(firstImage.path) : null);
    } else if (saved.target === "link") {
      pushToast(`Link saved for "${saved.section.label}" (#${saved.id}).`);
    } else {
      pushToast(`Note saved for "${saved.section.label}" (#${saved.id}).`);
    }
  };

  const undo = async (drop: SavedDrop) => {
    try {
      const res = await fetch(`${API}?id=${encodeURIComponent(drop.id)}`, {
        method: "DELETE",
        headers: WRITE_HEADERS,
      });
      if (!res.ok && res.status !== 404) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }
    } catch (err) {
      pushToast(`Couldn't undo #${drop.id}: ${err instanceof Error ? err.message : "error"}`);
      return;
    }
    pinned.delete(drop.id);
    setDrops((prev) => (prev ?? []).filter((d) => d.id !== drop.id));
    const url = localUrls.get(drop.id);
    if (url) {
      localUrls.delete(drop.id);
      window.setTimeout(() => URL.revokeObjectURL(url), 1500); // after the preview is reverted
    }
    pushToast(`Removed drop #${drop.id}.`);
  };

  /* ---------- render ---------- */

  const pendingCount = drops?.filter((d) => d.status === "pending").length ?? 0;
  const countFor = (region: Region) =>
    drops?.filter(
      (d) => d.page === pathname && d.section.index === region.index && d.section.label === region.label
    ).length ?? 0;

  return (
    <>
      {enabled && (
        <div data-photodrop className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
          {highlight && (
            <>
              <div
                ref={(node) => {
                  overlay.current.box = node;
                }}
                aria-hidden="true"
                style={{ visibility: "hidden" }}
                className={`absolute left-0 top-0 ${
                  highlight.mode === "replace"
                    ? "border-[3px] border-aerored bg-aerored/10"
                    : "border-[3px] border-dashed border-aerored bg-aerored/5"
                }`}
              />
              <div
                ref={(node) => {
                  overlay.current.label = node;
                }}
                aria-hidden="true"
                style={{ visibility: "hidden" }}
                className="absolute left-0 top-0 max-w-[min(420px,80vw)] truncate bg-aerored px-2.5 py-1 font-heading text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg"
              >
                {highlight.label}
              </div>
            </>
          )}

          {!dragging &&
            regions.map((region) => {
              const count = countFor(region);
              return (
                <button
                  key={`${region.index}-${region.label}`}
                  type="button"
                  ref={(node) => {
                    if (node) overlay.current.badges.set(region.el, node);
                    else overlay.current.badges.delete(region.el);
                  }}
                  style={{ visibility: "hidden" }}
                  title="Add photos, a link or a note to this section"
                  onClick={(e) => openFromBadge(region, e.currentTarget)}
                  onMouseEnter={() =>
                    !draft && showHighlight(region.el, { mode: "add", label: `Add to: ${region.label}` })
                  }
                  onMouseLeave={() => !draft && showHighlight(null, null)}
                  onFocus={() =>
                    !draft && showHighlight(region.el, { mode: "add", label: `Add to: ${region.label}` })
                  }
                  onBlur={() => !draft && showHighlight(null, null)}
                  className="pointer-events-auto absolute left-0 top-0 flex max-w-[260px] items-center gap-1.5 border border-white/20 bg-jet/85 px-2 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-md backdrop-blur-sm transition-colors hover:bg-aerored focus-visible:bg-aerored focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span aria-hidden="true" className="text-sm leading-none">+</span>
                  <span className="truncate">{region.label}</span>
                  {count > 0 && (
                    <span className="ml-0.5 bg-white px-1 text-[10px] text-jet" aria-label={`${count} saved`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}

          {pending.map((tag) => (
            <div
              key={tag.dropId}
              ref={(node) => {
                if (node) overlay.current.tags.set(tag.dropId, node);
                else overlay.current.tags.delete(tag.dropId);
              }}
              aria-hidden="true"
              style={{ visibility: "hidden" }}
              className="absolute left-0 top-0 bg-aerored px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md"
            >
              Pending #{tag.dropId}
              {!tag.swapped && <span className="font-body normal-case tracking-normal"> · no preview</span>}
            </div>
          ))}
        </div>
      )}

      {draft && (
        <DropPanel
          draft={draft}
          pathname={pathname}
          panelRef={panelRef}
          onChange={updateDraft}
          onAddFiles={addFiles}
          onRemoveFile={removeFile}
          onSave={save}
          onCancel={cancelDraft}
        />
      )}

      {drawerOpen && (
        <DropsDrawer
          drops={drops}
          loadError={loadError}
          pathname={pathname}
          enabled={enabled}
          onUndo={undo}
          onRefresh={loadDrops}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      <div
        data-photodrop
        aria-live="polite"
        className={`pointer-events-none fixed right-3 z-[90] flex w-[min(360px,calc(100vw-24px))] flex-col gap-2 ${
          enabled ? "bottom-[68px]" : "bottom-16"
        }`}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 border-l-4 border-aerored bg-jet px-3 py-2.5 text-sm text-white shadow-xl"
          >
            {t.thumb && (
              <img src={t.thumb} alt="" draggable={false} className="h-10 w-10 shrink-0 object-cover" />
            )}
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* Left inset clears the Next.js dev indicator, which also sits bottom-left. */}
      <div
        data-photodrop
        className={
          enabled
            ? "fixed inset-x-0 bottom-0 z-[90] flex items-center gap-4 border-t-2 border-aerored bg-jet py-2 pl-16 pr-3 text-white shadow-[0_-8px_24px_rgba(0,0,0,0.25)]"
            : "fixed bottom-3 left-16 z-[90] flex"
        }
      >
        <div className="flex shrink-0 shadow-lg">
          <button
            type="button"
            aria-pressed={enabled}
            onClick={toggle}
            title={enabled ? "Turn Photo Drop off" : "Turn Photo Drop on"}
            className={`flex items-center gap-2 px-3 py-2 font-heading text-xs font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              enabled ? "bg-aerored text-white hover:bg-[#c4141b]" : "bg-jet text-white hover:bg-charcoal"
            }`}
          >
            <CameraIcon />
            Photo Drop
            <span className={`px-1.5 py-0.5 text-[10px] ${enabled ? "bg-white text-aerored" : "bg-white/15 text-silver"}`}>
              {enabled ? "On" : "Off"}
            </span>
          </button>
          <button
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="photodrop-drawer"
            onClick={() => {
              const open = !drawerOpen;
              setDrawerOpen(open);
              if (open) void loadDrops();
            }}
            title="Saved drops"
            className="flex items-center gap-2 border-l border-white/15 bg-charcoal px-3 py-2 font-heading text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-jet focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Drops
            <span className="min-w-[1.25rem] bg-white px-1 text-center text-[10px] text-jet">{pendingCount}</span>
          </button>
        </div>
        {enabled && (
          <p className="min-w-0 text-xs leading-snug text-silver">
            <span className="hidden md:inline">{INSTRUCTIONS}</span>
            <span className="md:hidden">Drag photos onto an image or a section.</span>
          </p>
        )}
      </div>
    </>
  );
}

/* ================================================================== */
/* Save panel                                                          */
/* ================================================================== */

function DropPanel({
  draft,
  pathname,
  panelRef,
  onChange,
  onAddFiles,
  onRemoveFile,
  onSave,
  onCancel,
}: {
  draft: Draft;
  pathname: string;
  panelRef: RefObject<HTMLDivElement | null>;
  onChange: (patch: Partial<Draft>) => void;
  onAddFiles: (files: FileList | null) => void;
  onRemoveFile: (key: number) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const titleId = `photodrop-title-${draft.key}`;
  const { region, image, media, files, mode, saving } = draft;
  const replacing = mode === "replace" && !!media;
  const what = image ? `${image.kind === "video" ? "video" : "image"} ${displayName(image.src)}` : "";

  // Keep the panel next to the drop point and inside the viewport.
  useLayoutEffect(() => {
    const node = panelRef.current;
    if (!node) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = node.offsetWidth;
    const h = node.offsetHeight;
    let left = draft.x + 16;
    if (left + w > vw - 12) left = draft.x - 16 - w;
    node.style.left = `${clamp(left, 12, vw - w - 12)}px`;
    node.style.top = `${clamp(draft.y - 24, 12, vh - h - 72)}px`;
  });

  // Focus the note on open; hand focus back on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    noteRef.current?.focus({ preventScroll: true });
    return () => {
      if (previous?.isConnected && !previous.closest(UI_SELECTOR)) previous.focus({ preventScroll: true });
    };
  }, [draft.key]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      onCancel();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSave();
    }
  };

  let action: string;
  if (files.length) action = replacing ? `Replace ${what}` : "Add to this section";
  else if (draft.link.trim()) action = replacing ? `Link for ${what}` : "Save a link for this section";
  else if (draft.note.trim()) action = replacing ? `Note about ${what}` : "Save a note for this section";
  else action = replacing ? `Replace ${what}` : "Add to this section";

  return (
    <div
      ref={panelRef}
      data-photodrop
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      style={{ left: 12, top: 12 }}
      className="fixed z-[90] flex max-h-[calc(100vh-96px)] w-[min(380px,calc(100vw-24px))] flex-col border border-jet/20 bg-white text-charcoal shadow-2xl"
    >
      <div className="flex items-center justify-between gap-3 bg-jet px-4 py-2.5">
        <p id={titleId} className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-white">
          Save photo placement
        </p>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Cancel"
          className="flex h-7 w-7 items-center justify-center text-lg leading-none text-silver hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          ×
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
        <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs">
          <dt className="font-heading font-bold uppercase tracking-[0.1em] text-jet">Page</dt>
          <dd className="min-w-0 break-words">{pathname}</dd>
          <dt className="font-heading font-bold uppercase tracking-[0.1em] text-jet">Section</dt>
          <dd className="min-w-0 break-words">
            {region.label}
            {region.index >= 0 && (
              <span className="text-charcoal/60"> ({region.index + 1} of {region.total})</span>
            )}
          </dd>
          <dt className="font-heading font-bold uppercase tracking-[0.1em] text-jet">Action</dt>
          <dd className="min-w-0 break-words">
            {action}
            {replacing && image && image.width > 0 && (
              <span className="text-charcoal/60"> · shown at {image.width}×{image.height}</span>
            )}
          </dd>
        </dl>

        {media && (
          <div role="group" aria-label="What to do with the photos" className="grid grid-cols-2 border border-silver text-xs">
            {(["replace", "add"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                disabled={saving}
                onClick={() => onChange({ mode: m })}
                className={`px-2 py-1.5 font-heading font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-aerored ${
                  mode === m ? "bg-jet text-white" : "bg-white text-charcoal hover:bg-silver/30"
                }`}
              >
                {m === "replace" ? `Replace ${image?.kind === "video" ? "video" : "image"}` : "Add to section"}
              </button>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div>
            <ul className="grid grid-cols-4 gap-2">
              {files.map((f) => (
                <li key={f.key} className="relative aspect-square overflow-hidden bg-silver/25" title={f.file.name}>
                  <FileThumb ext={f.ext} url={f.url} kind={f.kind} />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onRemoveFile(f.key)}
                    aria-label={`Remove ${f.file.name}`}
                    className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-jet/80 text-xs leading-none text-white hover:bg-aerored focus-visible:outline focus-visible:outline-2 focus-visible:outline-aerored"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-xs text-charcoal/70">
              {files.length} file{files.length === 1 ? "" : "s"} ·{" "}
              {formatSize(files.reduce((sum, f) => sum + f.file.size, 0))}
              {replacing && files.length > 1 && " · the first replaces the image, the rest are alternates"}
            </p>
          </div>
        )}

        {draft.rejected.length > 0 && (
          <p className="text-xs text-aerored">Skipped: {draft.rejected.join(", ")}</p>
        )}

        <div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept={ACCEPT}
            tabIndex={-1}
            className="sr-only"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onAddFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={saving}
            onClick={() => fileRef.current?.click()}
            className="w-full border border-dashed border-charcoal/40 px-3 py-2 font-heading text-xs font-bold uppercase tracking-[0.1em] text-jet hover:border-aerored hover:text-aerored focus-visible:outline focus-visible:outline-2 focus-visible:outline-aerored"
          >
            {files.length ? "Add more files…" : "Choose photos…"}
          </button>
        </div>

        <div>
          <label className="label" htmlFor={`photodrop-link-${draft.key}`}>
            Link (e.g. YouTube)
          </label>
          <input
            id={`photodrop-link-${draft.key}`}
            type="url"
            inputMode="url"
            value={draft.link}
            disabled={saving}
            onChange={(e) => onChange({ link: e.target.value, error: null })}
            placeholder="https://www.youtube.com/watch?v=…"
            className="input py-2"
          />
        </div>

        <div>
          <label className="label" htmlFor={`photodrop-note-${draft.key}`}>
            Note (optional)
          </label>
          <textarea
            id={`photodrop-note-${draft.key}`}
            ref={noteRef}
            rows={2}
            value={draft.note}
            disabled={saving}
            onChange={(e) => onChange({ note: e.target.value, error: null })}
            placeholder="e.g. use as the hero, crop to the helicopter"
            className="input resize-y py-2"
          />
        </div>

        {draft.error && (
          <p role="alert" className="border-l-4 border-aerored bg-aerored/10 px-3 py-2 text-xs text-jet">
            {draft.error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-silver/60 px-4 py-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-3 py-2 font-heading text-xs font-bold uppercase tracking-[0.12em] text-charcoal hover:text-jet focus-visible:outline focus-visible:outline-2 focus-visible:outline-aerored"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="bg-aerored px-4 py-2 font-heading text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-[#c4141b] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aerored"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Saved drops drawer                                                  */
/* ================================================================== */

function DropsDrawer({
  drops,
  loadError,
  pathname,
  enabled,
  onUndo,
  onRefresh,
  onClose,
}: {
  drops: SavedDrop[] | null;
  loadError: string | null;
  pathname: string;
  enabled: boolean;
  onUndo: (drop: SavedDrop) => Promise<void>;
  onRefresh: () => Promise<void>;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  // Group by page: this page first, then the rest; newest first within each.
  const groups = new Map<string, SavedDrop[]>();
  for (const drop of [...(drops ?? [])].reverse()) {
    const list = groups.get(drop.page) ?? [];
    list.push(drop);
    groups.set(drop.page, list);
  }
  const pages = Array.from(groups.keys()).sort((a, b) =>
    a === pathname ? -1 : b === pathname ? 1 : a.localeCompare(b)
  );

  return (
    <div
      id="photodrop-drawer"
      data-photodrop
      role="dialog"
      aria-modal="false"
      aria-label="Saved photo drops"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          onClose();
        }
      }}
      className={`fixed left-3 z-[90] flex max-h-[min(70vh,640px)] sm:left-16 w-[min(420px,calc(100vw-24px))] flex-col border border-jet/20 bg-white text-charcoal shadow-2xl ${
        enabled ? "bottom-[68px]" : "bottom-16"
      }`}
    >
      <div className="flex items-center justify-between gap-3 bg-jet px-4 py-2.5">
        <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-white">
          Saved drops {drops ? `(${drops.length})` : ""}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => void onRefresh()}
            className="px-2 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.12em] text-silver hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Refresh
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close saved drops"
            className="flex h-7 w-7 items-center justify-center text-lg leading-none text-silver hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loadError && <p className="px-4 py-3 text-xs text-aerored">{loadError}</p>}
        {drops === null && !loadError && <p className="px-4 py-3 text-xs">Loading…</p>}
        {drops?.length === 0 && (
          <p className="px-4 py-4 text-xs leading-relaxed">
            Nothing saved yet. Turn Photo Drop on, then drag photos from your computer onto an image or
            a section of any page.
          </p>
        )}
        {pages.map((page) => (
          <section key={page} className="border-b border-silver/50 last:border-b-0" aria-label={`Drops on ${page}`}>
            <div className="flex items-center justify-between gap-2 bg-silver/20 px-4 py-1.5">
              <span className="truncate font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-jet">
                {page === pathname ? `This page (${page})` : page}
              </span>
              {page !== pathname && (
                <Link
                  href={page}
                  className="shrink-0 text-[11px] font-semibold text-aerored underline-offset-2 hover:underline"
                >
                  Go to page
                </Link>
              )}
            </div>
            <ul>
              {(groups.get(page) ?? []).map((drop) => (
                <DropRow
                  key={drop.id}
                  drop={drop}
                  busy={busy === drop.id}
                  onUndo={async () => {
                    setBusy(drop.id);
                    await onUndo(drop);
                    setBusy(null);
                  }}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="border-t border-silver/60 px-4 py-2 text-[11px] leading-snug text-charcoal/70">
        Saved to <code className="font-mono">photo-drops/</code> in the project for the developer to apply.
      </p>
    </div>
  );
}

function DropRow({ drop, busy, onUndo }: { drop: SavedDrop; busy: boolean; onUndo: () => void }) {
  const first = drop.files[0];
  const ext = first ? extOf(first.path) : "";
  const n = drop.files.length;
  let title: string;
  if (drop.target === "replace") title = `Replace ${drop.image?.kind === "video" ? "video" : "image"}: ${displayName(drop.image?.src ?? "")}`;
  else if (drop.target === "add") title = `Add ${n} file${n === 1 ? "" : "s"} to: ${drop.section.label}`;
  else if (drop.target === "link") title = `Link for: ${drop.section.label}`;
  else title = `Note for: ${drop.section.label}`;
  const when = new Date(drop.createdAt);

  return (
    <li className="flex gap-3 border-t border-silver/40 px-4 py-3 first:border-t-0">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-silver/25">
        {first ? (
          <FileThumb ext={ext} url={IMG_PREVIEW_EXT.has(ext) ? fileUrl(first.path) : null} kind={VIDEO_EXT.has(ext) ? "video" : "image"} still />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-heading text-[10px] font-bold uppercase text-charcoal/70">
            {drop.target === "link" ? "Link" : "Note"}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 text-xs">
        <p className="break-words font-semibold text-jet">{title}</p>
        {drop.target === "replace" && n > 1 && <p className="text-charcoal/70">{n} files (first is the replacement)</p>}
        {drop.link && (
          <a
            href={drop.link}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-aerored underline-offset-2 hover:underline"
          >
            {drop.link}
          </a>
        )}
        {drop.note && <p className="mt-0.5 break-words italic text-charcoal/80">&ldquo;{drop.note}&rdquo;</p>}
        <p className="mt-1 text-[11px] text-charcoal/60">
          #{drop.id} ·{" "}
          {Number.isNaN(when.getTime())
            ? drop.createdAt
            : when.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
          {drop.status !== "pending" && <span className="ml-1 font-semibold text-jet">· {drop.status}</span>}
        </p>
      </div>
      <button
        type="button"
        onClick={onUndo}
        disabled={busy}
        className="self-start border border-charcoal/30 px-2 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.12em] text-jet hover:border-aerored hover:text-aerored disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-aerored"
      >
        {busy ? "…" : "Undo"}
      </button>
    </li>
  );
}

/* ================================================================== */
/* Small pieces                                                        */
/* ================================================================== */

function FileThumb({
  ext,
  url,
  kind,
  still = false,
}: {
  ext: string;
  url: string | null;
  kind: "image" | "video";
  still?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (url && !failed && kind === "video" && !still) {
    return (
      <video src={url} muted playsInline preload="metadata" className="h-full w-full object-cover" onError={() => setFailed(true)} />
    );
  }
  if (url && !failed && kind === "image") {
    return (
      <img src={url} alt="" draggable={false} className="h-full w-full object-cover" onError={() => setFailed(true)} />
    );
  }
  return (
    <span className="flex h-full w-full items-center justify-center font-heading text-[10px] font-bold uppercase text-charcoal/70">
      {ext || "file"}
    </span>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinejoin="round" d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.6l1.4-2h7l1.4 2h2.6A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
