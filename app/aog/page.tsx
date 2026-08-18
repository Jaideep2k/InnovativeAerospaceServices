import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "AOG — Aircraft on Ground Support",
  description:
    "Aircraft on Ground support from IAS Avionics in Kelowna, BC. Email aog@iasavionics.ca or call 778-753-0250. Commercial-aircraft AOG requests are treated as a priority.",
  path: "/aog",
});

export default function AogPage() {
  return (
    <>
      <Hero
        compact
        image="/images/aog/iasavionics-aircraft-on-ground-service.jpg"
        imageAlt="Aircraft on the ground awaiting AOG support"
        words={["Aircraft", "on", "Ground?"]}
        sub="AOG situations are expensive and disruptive — especially for commercial operators. We treat commercial-aircraft AOG requests as a priority and work to return your aircraft to service as quickly as practical."
      >
        <a href={`mailto:${site.aogEmail}`} className="btn-red">
          Email {site.aogEmail}
        </a>
        <a href={site.phoneHref} className="btn-ghost-light">
          Call {site.phone}
        </a>
      </Hero>

      {/* Emergency contact block */}
      <section className="bg-aerored py-14 text-white">
        <div className="wrap grid gap-8 text-center sm:grid-cols-2">
          <Reveal>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-white/80">
              AOG emergency email
            </p>
            <a
              href={`mailto:${site.aogEmail}`}
              className="mt-2 inline-block break-all font-heading text-2xl font-extrabold text-white underline-offset-4 hover:underline sm:text-3xl"
            >
              {site.aogEmail}
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-white/80">
              Phone
            </p>
            <a
              href={site.phoneHref}
              className="mt-2 inline-block font-heading text-2xl font-extrabold text-white underline-offset-4 hover:underline sm:text-3xl"
            >
              {site.phone}
            </a>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="wrap grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="How AOG support works"
              title="Minimizing Your Downtime"
              intro="Every hour an aircraft sits is money and mission lost. Our AOG service exists to help you get back in the air."
            />
            <Stagger className="mt-8 space-y-5">
              {[
                {
                  t: "Reach us directly",
                  d: `Email ${site.aogEmail} or call ${site.phone}. Saturday and Sunday AOG service is available.`,
                },
                {
                  t: "Commercial operators prioritized",
                  d: "Commercial-aircraft AOG requests are treated as a priority.",
                },
                {
                  t: "Support where it's needed",
                  d: "At our Kelowna facility, your hangar, in the field, or at remote operating locations when arrangements can be made.",
                },
              ].map((s) => (
                <div key={s.t} className="border-l-4 border-aerored pl-5">
                  <h3 className="font-heading text-base font-extrabold uppercase text-jet">
                    {s.t}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{s.d}</p>
                </div>
              ))}
            </Stagger>
          </div>
          <Reveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/aog/iasaviaonics-aog.jpg"
                alt="IAS Avionics AOG support work on a grounded aircraft"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-silver/40 bg-white pb-20">
        <div className="wrap pt-14">
          <Reveal>
            <p className="max-w-2xl text-sm leading-relaxed">
              Not an emergency? Use the{" "}
              <Link href="/contact" className="font-semibold text-aerored underline underline-offset-2">
                general contact form
              </Link>{" "}
              for inquiries and scheduling — and keep this page handy for when
              it counts.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
