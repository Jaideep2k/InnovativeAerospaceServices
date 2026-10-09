import Link from "next/link";
import Reveal from "@/components/motion/Reveal";

type DowntimeCalloutProps = {
  /** Optional CTA; omit on pages that already end with one. */
  cta?: string;
  ctaHref?: string;
};

/**
 * "Fastest downtime in the industry" band. The method is proprietary and
 * deliberately not explained: the copy sells the result and leaves the
 * how as a reason to call.
 */
export default function DowntimeCallout({ cta, ctaHref }: DowntimeCalloutProps) {
  return (
    <section aria-label="Turnaround" className="bg-jet py-16 text-white">
      <div className="wrap grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <p className="eyebrow mb-3">Industry-leading turnaround</p>
          <p className="h-display text-3xl text-white sm:text-4xl">
            The Fastest Downtime in the Industry
          </p>
          <span className="red-rule mt-5" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-base leading-relaxed text-silver">
            How we do it stays in our hangar. What you&rsquo;ll notice is the
            result: your aircraft back in service sooner than anywhere else.
          </p>
          {cta && ctaHref && (
            <Link href={ctaHref} className="btn-red mt-6">
              {cta}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
