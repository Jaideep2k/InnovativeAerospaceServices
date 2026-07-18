import Link from "next/link";
import { site } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";

/** Highly visible AOG contact band, reused across pages. */
export default function AogBand() {
  return (
    <section aria-label="Aircraft on Ground support" className="bg-aerored text-white">
      <div className="wrap flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <Reveal>
          <p className="font-heading text-2xl font-extrabold uppercase tracking-tight">
            Aircraft on Ground?
          </p>
          <p className="mt-1 max-w-xl text-sm text-white/90">
            AOG support to help minimize downtime — commercial-aircraft AOG
            requests are treated as a priority.
          </p>
        </Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${site.aogEmail}`}
            className="btn bg-jet text-white hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {site.aogEmail}
          </a>
          <a href={site.phoneHref} className="btn-ghost-light">
            {site.phone}
          </a>
          <Link
            href="/aog"
            className="min-h-[44px] px-1 py-2 font-heading text-sm font-bold uppercase tracking-[0.12em] underline underline-offset-4 hover:text-jet"
          >
            AOG details
          </Link>
        </div>
      </div>
    </section>
  );
}
