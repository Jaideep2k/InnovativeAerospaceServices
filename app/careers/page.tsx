import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join a growing avionics team in Kelowna, BC. IAS Avionics welcomes applications from Avionics Aircraft Maintenance Engineers and experienced avionics apprentices.",
};

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

export default function CareersPage() {
  return (
    <>
      <Hero
        compact
        image="/images/careers/helicopter-bg.jpg"
        imageAlt="Helicopter on the ground — the kind of rotary-wing aircraft IAS teams work on"
        words={["Build", "a", "Career", "in", "Avionics"]}
        sub="A growing team whose work ranges from light-aircraft projects to complete medium- and heavy-rotary-wing rewiring."
      >
        <Link href="/contact" className="btn-red">
          Get in Touch
        </Link>
      </Hero>

      <section className="py-20">
        <div className="wrap grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Who we look for"
              title="Avionics AMEs & Experienced Apprentices"
              intro="IAS welcomes interest from Avionics Aircraft Maintenance Engineers and experienced avionics apprentices. Our work spans multiple rotary-wing and fixed-wing aircraft, including major rewire and retrofit projects on Bell 212, Bell 412 and AS332 helicopters."
            />
            <Stagger className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {qualities.map((q) => (
                <p key={q} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-aerored" />
                  {q}
                </p>
              ))}
            </Stagger>
            <Reveal delay={0.1}>
              <p className="mt-8 text-sm leading-relaxed">
                Compensation and benefits depend on your qualifications and
                assessment. Please note: current openings are subject to
                confirmation — contact us to ask about present availability.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/careers/jet-bg.jpg"
                alt="Corporate jet — fixed-wing aircraft IAS teams also support"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="mt-6 border border-silver/50 bg-white p-7">
              <h3 className="font-heading text-lg font-extrabold uppercase text-jet">
                How to apply
              </h3>
              <span className="red-rule mt-3 h-0.5 w-10" />
              <p className="mt-4 text-sm leading-relaxed">
                Submit a résumé and cover letter, or contact us to discuss
                employment opportunities.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-red">
                  Submit a Résumé
                </Link>
                <a href={site.phoneHref} className="btn-ghost-dark">
                  Call {site.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
