import { site, mapsHref } from "@/lib/site";

const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&z=15&output=embed`;

type LocationMapProps = {
  /** Sizing for the map frame, e.g. "h-40" or "mt-6 h-72". */
  className?: string;
  /** "dark" on jet/charcoal sections (footer), "light" on white pages. */
  tone?: "dark" | "light";
};

/**
 * Small Google map with a pin on the facility. Uses the public embed, so no
 * API key. The map itself ignores the pointer and keyboard; a single link
 * laid over it opens the location in Google Maps in a new tab, so the whole
 * map is one predictable click target instead of a fiddly pan/zoom widget.
 */
export default function LocationMap({
  className = "h-40",
  tone = "dark",
}: LocationMapProps) {
  const dark = tone === "dark";
  const place = `${site.address.street}, ${site.address.city}`;

  return (
    <div
      className={`group relative overflow-hidden border ${
        dark ? "border-white/15 bg-charcoal" : "border-silver/50 bg-silver/20"
      } ${className}`}
    >
      <iframe
        src={embedSrc}
        title={`Map showing ${site.legalName} at ${place}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full border-0 transition-[filter] duration-300 ${
          dark ? "grayscale-[35%] group-hover:grayscale-0" : ""
        }`}
      />
      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${place} in Google Maps (opens in a new tab)`}
        className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-aerored"
      >
        {/* Sits over the embed's own "Open in Maps" button, which the overlay
            makes unclickable anyway. Google's attribution stays visible. */}
        <span
          aria-hidden="true"
          className="absolute left-2 top-2 flex h-9 items-center bg-jet px-3 font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md transition-colors duration-200 group-hover:bg-aerored"
        >
          Open in Google Maps ↗
        </span>
      </a>
    </div>
  );
}
