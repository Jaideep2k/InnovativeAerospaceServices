import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { site } from "@/lib/site";
import { rotaryMakers, fixedMakers } from "@/lib/aircraft";

export const metadata: Metadata = pageMeta({
  title: "Careers",
  description:
    "Join a growing avionics team in Kelowna, BC. IAS Avionics welcomes Avionics AMEs and experienced apprentices to work on rotary-wing and fixed-wing aircraft.",
  path: "/careers",
});

const qualities = [
  "Versatile",
  "Able to work independently",
  "Able to work as part of a team",
  "Prepared for occasional travel to customer locations",
  "Safety conscious",
  "Dependable",
  "Professional",
  "Comfortable across changing aircraft and project scopes",
];

/**
 * Manufacturer lists flow down CSS columns (alphabetical reads top to bottom).
 * At lg the rotary list is one column and the fixed-wing list two, so all
 * three columns line up at equal widths. Revealed as a block, not staggered:
 * per-item transforms inside CSS columns can glitch at column breaks.
 */
const fleet = [
  {
    label: "Rotary-wing",
    makers: rotaryMakers,
    span: "",
    cols: "columns-2 lg:columns-1",
  },
  {
    label: "Fixed-wing",
    makers: fixedMakers,
    span: "lg:col-span-2",
    cols: "columns-2",
  },
];

const rewireProjects = ["Bell 212", "Bell 412", "AS332"];

export default function CareersPage() {
  return (
    <>
      <Hero
        compact
        image="/images/careers/helicopter-bg.jpg"
        imageAlt="Helicopter on the ground, the kind of rotary-wing aircraft IAS teams work on"
        words={["Build", "a", "Career", "in", "Avionics"]}
        sub="A growing team whose work ranges from light-aircraft projects to complete medium- and heavy-rotary-wing rewiring."
      >
        <Link href="/contact" className="btn-red">
          Get in Touch
        </Link>
      </Hero>

      {/* Who we look for */}
      <section className="py-20">
        <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Who we look for"
              title="Avionics AMEs & Experienced Apprentices"
              intro="IAS welcomes interest from Avionics Aircraft Maintenance Engineers and experienced avionics apprentices. Our work spans multiple rotary-wing and fixed-wing aircraft."
            />
            <Reveal delay={0.1}>
              <h3 className="mt-10 font-heading text-sm font-extrabold uppercase tracking-[0.16em] text-jet">
                Qualities we look for
              </h3>
            </Reveal>
            <Stagger className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {qualities.map((q) => (
                <p key={q} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-aerored" />
                  {q}
                </p>
              ))}
            </Stagger>
          </div>
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/b412/b412-harness-apprentice.jpg"
                alt="IAS apprentice and technician installing a new wiring harness during a Bell 412 rewire"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Aircraft you'll work on */}
      <section className="bg-jet py-20 text-white">
        <div className="wrap">
          <SectionHeading
            eyebrow="Aircraft you'll work on"
            title="Rotary-Wing & Fixed-Wing"
            intro="The aircraft manufacturers our team has worked on, from light aircraft to heavy helicopters."
            dark
          />

          <div className="mt-12 grid gap-12 lg:grid-cols-3 lg:gap-10">
            {fleet.map((g, i) => (
              <Reveal key={g.label} delay={0.1 * i} className={g.span}>
                <h3 className="border-t-4 border-aerored pt-4 font-heading text-sm font-extrabold uppercase tracking-[0.18em] text-white">
                  {g.label}
                </h3>
                <ul className={`mt-2 gap-x-8 ${g.cols}`}>
                  {g.makers.map((m) => (
                    <li
                      key={m.name}
                      className="break-inside-avoid border-b border-white/10 py-3.5 font-heading text-base font-bold text-white sm:text-lg lg:text-xl"
                    >
                      {m.name}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          {/* Rewire highlight */}
          <Reveal className="mt-16">
            <div className="grid overflow-hidden border border-white/15 md:grid-cols-[2fr_3fr]">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[280px]">
                <Image
                  src="/images/b412/b412-harness-routing.jpg"
                  alt="IAS technicians routing a newly built wiring harness through a Bell 412"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-right"
                />
              </div>
              <div className="p-8 sm:p-10">
                <p className="eyebrow">Project highlight</p>
                <h3 className="mt-3 font-heading text-2xl font-extrabold uppercase tracking-tight text-white">
                  Major Rewires &amp; Retrofits
                </h3>
                <span className="red-rule mt-4 h-0.5 w-10" />
                <p className="mt-5 text-sm leading-relaxed text-silver">
                  Major rewire and retrofit projects our team has worked on
                  include:
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {rewireProjects.map((r) => (
                    <span
                      key={r}
                      className="border border-white/25 px-4 py-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-white"
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <Link
                  href="/projects"
                  className="mt-7 inline-block text-sm font-semibold text-white underline underline-offset-4 hover:text-aerored"
                >
                  See our projects →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How to apply */}
      <section id="apply" className="scroll-mt-28 py-20">
        <div className="wrap grid grid-cols-1 items-start gap-12 lg:grid-cols-[3fr_2fr]">
          <div>
            <SectionHeading
              eyebrow="How to apply"
              title="Send Us Your Résumé"
              intro="Submit a résumé and cover letter, or contact us to discuss employment opportunities."
            />
            <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-red">
                Submit a Résumé
              </Link>
              <a href={site.phoneHref} className="btn-ghost-dark">
                Call {site.phone}
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="border border-silver/50 bg-white p-7">
              <h3 className="font-heading text-lg font-extrabold uppercase text-jet">
                Good to know
              </h3>
              <span className="red-rule mt-3 h-0.5 w-10" />
              <p className="mt-4 text-sm leading-relaxed">
                Compensation and benefits depend on your qualifications and
                assessment.
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                Please note: current openings are subject to confirmation.
                Contact us to ask about present availability.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
