import Reveal from "@/components/motion/Reveal";
import type { FaqEntry } from "@/lib/faq";

/**
 * Accessible FAQ accordion built on native <details>/<summary>.
 * No client JS: it is keyboard-operable and expandable without hydration,
 * and it carries no motion of its own beyond the shared Reveal entrance.
 */
export default function Faq({ entries }: { entries: readonly FaqEntry[] }) {
  return (
    <div className="mt-10 border-t border-silver/50">
      {entries.map((entry, i) => (
        <Reveal key={entry.q} delay={Math.min(i * 0.04, 0.24)}>
          <details className="group border-b border-silver/50">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-heading text-base font-extrabold uppercase tracking-tight text-jet transition-colors hover:text-aerored focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aerored [&::-webkit-details-marker]:hidden">
              <span>{entry.q}</span>
              <span
                aria-hidden="true"
                className="relative mt-1 h-4 w-4 shrink-0"
              >
                <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-aerored" />
                <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-aerored transition-transform duration-200 group-open:rotate-90" />
              </span>
            </summary>
            <p className="max-w-3xl pb-6 text-sm leading-relaxed text-charcoal">
              {entry.a}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
