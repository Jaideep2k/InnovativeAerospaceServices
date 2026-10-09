"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

type YouTubeEmbedProps = {
  /** Parsed video ID (see youtubeId() in lib/media.ts); null when not set yet. */
  id: string | null;
  /** Describes the video; used for the iframe title and the play button label. */
  title: string;
  /** Local still shown until the player loads. Falls back to YouTube's thumbnail. */
  poster?: string;
  /**
   * Start playing once the player is mostly in view, pause when it scrolls
   * away and resume when it comes back. Plays with sound at a moderate volume
   * when the browser allows it, otherwise muted with a "Sound on" button.
   * Reduced-motion visitors get click-to-play.
   */
  autoplayInView?: boolean;
  className?: string;
};

const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";

/** YouTube volume (0 to 100): audible without blasting anyone. */
const VOLUME = 35;

/** Remembers a visitor who pressed "Sound off", across pages and visits. */
const SOUND_PREF_KEY = "ias:video-sound";

/** idle: poster only · auto: started by scrolling · user: started by a click. */
type Mode = "idle" | "auto" | "user";

function soundTurnedOff(): boolean {
  try {
    return window.localStorage.getItem(SOUND_PREF_KEY) === "off";
  } catch {
    return false;
  }
}

function rememberSound(on: boolean) {
  try {
    if (on) window.localStorage.removeItem(SOUND_PREF_KEY);
    else window.localStorage.setItem(SOUND_PREF_KEY, "off");
  } catch {
    // storage blocked: the choice lasts for this page only
  }
}

/**
 * Browsers only allow sound once the visitor has clicked, tapped or typed on
 * the page (scrolling doesn't count). Where the browser can't tell us, try
 * anyway: a blocked attempt is caught and falls back to muted playback.
 */
function mayPlaySound(): boolean {
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } })
    .userActivation;
  return ua ? ua.hasBeenActive : true;
}

/**
 * YouTube player that loads nothing from YouTube until it is needed (a click,
 * or, with `autoplayInView`, the player scrolling into view). The player comes
 * from youtube-nocookie.com and is driven through YouTube's postMessage API.
 *
 * With no ID it renders a placeholder in development and nothing in
 * production.
 */
export default function YouTubeEmbed({
  id,
  title,
  poster,
  autoplayInView = false,
  className = "",
}: YouTubeEmbedProps) {
  const [mode, setMode] = useState<Mode>("idle");
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);
  mutedRef.current = muted;
  const rootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  /** Latest player state from YouTube: playing or buffering. */
  const playingRef = useRef(false);
  /** True when we paused it for scrolling away, so only we resume it. */
  const autoPausedRef = useRef(false);
  /** Last player state reported (-1 unstarted, 1 playing, 3 buffering...). */
  const lastStateRef = useRef<number | null>(null);
  /** When we last unmuted on our own, to catch the browser blocking it. */
  const soundAttemptRef = useRef(0);
  /** Set once the player first reports playing. */
  const startedRef = useRef(false);

  const command = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      PLAYER_ORIGIN
    );
  }, []);

  /** Unmute at VOLUME unless the visitor chose "Sound off" or can't hear it yet. */
  const trySound = useCallback(() => {
    if (soundTurnedOff() || !mayPlaySound()) return;
    soundAttemptRef.current = Date.now();
    command("setVolume", [VOLUME]);
    command("unMute");
    setMuted(false);
  }, [command]);

  const toggleSound = () => {
    if (muted) {
      rememberSound(true);
      command("setVolume", [VOLUME]);
      command("unMute");
      command("playVideo");
      setMuted(false);
    } else {
      rememberSound(false);
      command("mute");
      setMuted(true);
    }
  };

  // Player state and mute updates (sent after the "listening" handshake).
  useEffect(() => {
    if (mode === "idle") return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== PLAYER_ORIGIN || e.source !== iframeRef.current?.contentWindow) return;
      let data: { event?: string; info?: unknown } | null = null;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (!data) return;
      const info = data.info as { playerState?: number; muted?: boolean } | number | undefined;
      const state =
        data.event === "onStateChange" && typeof info === "number"
          ? info
          : typeof info === "object"
            ? info?.playerState
            : undefined;
      if (typeof state === "number") {
        // YouTube turns auto-generated captions on for muted playback (this
        // video's only say "[Music]"). The module loads with playback, so
        // switch it off each time playback starts; it's a no-op if absent.
        if (state === 1 && lastStateRef.current !== 1) {
          command("unloadModule", ["captions"]);
          command("unloadModule", ["cc"]);
        }
        // First start: a scroll-started player begins muted (always allowed),
        // then turns the sound up; a click-started one just gets the volume.
        if (state === 1 && !startedRef.current) {
          startedRef.current = true;
          if (mode === "auto") trySound();
          else command("setVolume", [VOLUME]);
        }
        // A browser that blocks unmuting pauses the video instead: go back to
        // muted playback and leave the "Sound on" button for the visitor.
        if (
          state === 2 &&
          !autoPausedRef.current &&
          Date.now() - soundAttemptRef.current < 2000
        ) {
          soundAttemptRef.current = 0;
          command("mute");
          command("playVideo");
          setMuted(true);
        }
        lastStateRef.current = state;
        playingRef.current = state === 1 || state === 3;
      }
      if (typeof info === "object" && typeof info?.muted === "boolean") setMuted(info.muted);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [mode, command, trySound]);

  // Scroll-driven start, pause and resume.
  useEffect(() => {
    if (!autoplayInView || !id || prefersReducedMotion()) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMode((m) => (m === "idle" ? "auto" : m));
          if (autoPausedRef.current) {
            autoPausedRef.current = false;
            command("playVideo");
            // They may have clicked something since it started muted.
            if (mutedRef.current) trySound();
          }
        } else if (playingRef.current) {
          autoPausedRef.current = true;
          command("pauseVideo");
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoplayInView, id, command, trySound]);

  // A click-started player takes focus, since the play button it replaced is gone.
  useEffect(() => {
    if (mode === "user") iframeRef.current?.focus();
  }, [mode]);

  if (!id) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        className={`flex aspect-video flex-col items-center justify-center gap-2 border-2 border-dashed border-silver bg-silver/10 p-6 text-center ${className}`}
      >
        <p className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-jet">
          YouTube video goes here
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-charcoal/80">
          Paste the YouTube link into <code>lib/media.ts</code>, or send it to
          Claude. This placeholder only shows in development; the live site
          hides the section until a video is added.
        </p>
      </div>
    );
  }

  const params = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    rel: "0",
    enablejsapi: "1",
    cc_load_policy: "0",
    iv_load_policy: "3",
  });
  if (mode === "auto") {
    params.set("mute", "1");
    // Loop rather than ending on YouTube's suggestions grid.
    params.set("loop", "1");
    params.set("playlist", id);
  }
  if (typeof window !== "undefined") params.set("origin", window.location.origin);

  return (
    <div ref={rootRef} className={`relative aspect-video overflow-hidden bg-jet ${className}`}>
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
      ) : (
        // Plain <img>: next.config allows no remote image domains.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {mode !== "idle" ? (
        <>
          <iframe
            ref={iframeRef}
            src={`${PLAYER_ORIGIN}/embed/${id}?${params}`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() =>
              iframeRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: "listening", id: "ias-video" }),
                PLAYER_ORIGIN
              )
            }
            className="absolute inset-0 h-full w-full border-0"
          />
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            className="absolute left-3 top-3 flex min-h-[40px] items-center gap-2 bg-jet/80 px-4 font-heading text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-colors hover:bg-aerored focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-4 sm:top-4"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              {muted ? (
                <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.2l2.5 2.5V12zM19 12c0 .9-.2 1.8-.5 2.6l1.5 1.5A9 9 0 0 0 14 3.2v2.1a7 7 0 0 1 5 6.7zM4.3 3 3 4.3 7.7 9H3v6h4l5 5v-6.7l4.3 4.3c-.7.5-1.4.9-2.3 1.2v2.1a9 9 0 0 0 3.7-1.8l2 2 1.3-1.3L4.3 3zM12 4 9.9 6.1 12 8.2V4z" />
              ) : (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />
              )}
            </svg>
            {muted ? "Sound on" : "Sound off"}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => {
            setMode("user");
            setMuted(false);
          }}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 block h-full w-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-aerored"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-jet/70 via-jet/10 to-transparent transition-opacity duration-300 group-hover:opacity-70"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-aerored shadow-lg transition-colors duration-200 group-hover:bg-[#c4141b] sm:h-20 sm:w-20"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-white sm:h-8 sm:w-8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 p-4 font-heading text-xs font-bold uppercase tracking-[0.18em] text-white sm:p-5"
          >
            Play video
          </span>
        </button>
      )}
    </div>
  );
}
