import type { Testimonial } from "@/lib/testimonials";

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className={`inline-flex gap-0.5 text-aerored ${className}`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 ${n <= rating ? "fill-current" : "fill-silver/60"}`}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L10 14.9l-5.25 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

const dateFmt = new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" });

export default function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <blockquote className="flex h-full flex-col border-l-4 border-aerored bg-white p-7 shadow-sm">
      <Stars rating={t.rating} />
      <p className="mt-4 flex-1 whitespace-pre-line text-sm leading-relaxed">
        &ldquo;{t.text}&rdquo;
      </p>
      <footer className="mt-5">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-jet">
          {t.name}
        </p>
        {(t.context || t.date || t.source === "google") && (
          <p className="mt-1 text-xs text-charcoal/70">
            {[
              t.context,
              t.date ? dateFmt.format(new Date(t.date)) : null,
              t.source === "google" ? "via Google" : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </footer>
    </blockquote>
  );
}
