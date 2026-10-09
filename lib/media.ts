/**
 * Videos embedded on the site.
 *
 * To add a video, paste its YouTube link into `youtubeId` below. Any of these
 * work, as does the bare 11-character video ID:
 *
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 *
 * While `youtubeId` is empty, the video's section shows a placeholder in
 * development and is left off the live site entirely, so visitors never see
 * an empty frame.
 *
 * `poster` is a local still shown before the player loads. YouTube only has a
 * 480x360 thumbnail for this video, so the poster is a 1080p frame taken from
 * the video itself (its 4:22 sunset shot).
 */
export const videos = {
  /** IAS's Bell 412 Classic rewire film. Shown on the home and helicopter pages. */
  overview: {
    youtubeId: "https://www.youtube.com/watch?v=swcJK33OTzc",
    title: "Bell 412 Classic rewire at Innovative Aerospace Services, Kelowna BC",
    poster: "/images/video/b412-rewire-video-poster.jpg",
  },
} as const;

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extracts the video ID from a YouTube URL, or passes a bare ID through.
 * Returns null for an empty value or anything it doesn't recognize.
 */
export function youtubeId(urlOrId: string | null | undefined): string | null {
  const value = (urlOrId ?? "").trim();
  if (!value) return null;
  if (VIDEO_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www|m|music)\./, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : (url.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/]+)/)?.[1] ?? null);
  }

  return id && VIDEO_ID.test(id) ? id : null;
}
