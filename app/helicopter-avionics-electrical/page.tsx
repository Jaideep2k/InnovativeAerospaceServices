import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Hero from "@/components/sections/Hero";
import ServiceBand from "@/components/sections/ServiceBand";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Helicopter Avionics & Electrical Services",
  description:
    "Helicopter electrical maintenance, wiring repairs, complete rotary-wing rewires, avionics installation and lighting system repairs for commercial helicopter operators — based at Kelowna International Airport, BC.",
  path: "/helicopter-avionics-electrical",
});

const whyIas = [
  "Experienced aviation technicians",
  "Specialized electrical expertise",
  "Responsive customer support",
  "Quality workmanship",
  "Commitment to safety",
];

const operations = [
  "Aerial firefighting",
  "Search and rescue",
  "Forestry operations",
  "Medevac operations",
  "Wildlife surveying",
  "Mining",
  "Tourism",
  "Remote aviation operations",
];

export default function HelicopterPage() {
  return (
    <>
      <Hero
        compact
        image="/images/home/heli_overfire-slider.jpg"
        imageAlt="Helicopter operating over a wildfire during aerial firefighting"
        words={["Helicopter", "Avionics", "&", "Electrical"]}
        sub="Specialized maintenance and repair support for helicopter operators — focused on safety, reliability and operational readiness for rotary-wing aircraft."
      >
        <Link href="/contact#estimate" className="btn-red">
          Request an Estimate
        </Link>
      </Hero>

      {/* Intro */}
      <section className="py-16">
        <div className="wrap">
          <SectionHeading
            eyebrow="Rotary-wing support"
            title="We Understand What Rotary-Wing Demands"
            intro="Innovative Aerospace Services provides specialized avionics and electrical maintenance and repair support for helicopter operators. We understand the unique demands placed on rotary-wing aircraft — vibration, duty cycle and unforgiving operating environments — and deliver solutions focused on safety, reliability and operational readiness. We work closely with private owners, commercial operators and aviation organizations to minimize downtime and keep aircraft mission-ready."
          />
        </div>
      </section>

      <ServiceBand
        id="services"
        eyebrow="What we do"
        title="Helicopter Services"
        intro="Electrical and avionics work on light, medium and heavy helicopters — at our Kelowna facility, at your hangar, or in the field where arrangements can be made."
        items={[
          "Electrical troubleshooting",
          "Wiring repairs and replacement",
          "Complete and partial rotary-wing rewires",
          "Avionics installation and upgrades",
          "Lighting system repairs",
          "Wiring harness construction and installation",
          "Laser-marked aircraft wire",
          "Inspection support",
          "Modification support",
        ]}
        note="We offer the fastest rewire in the industry, so aircraft downtime is reduced. Note that IAS does not perform regulated engineering work directly — where engineering is required, it is supplied by registered third-party engineering firms."
        image="/images/home/Innovative-Aerospace-rewire-services.jpg"
        imageAlt="Helicopter cockpit instrument panel serviced by IAS"
        cta="Discuss a Helicopter Project"
        ctaHref="/contact#estimate"
        flip
        dark
      />

      <ServiceBand
        id="rewires"
        eyebrow="Rotary-wing rewires"
        title="Complete Helicopter Rewiring"
        intro="Aging wiring on a working helicopter shows up as intermittent faults, unreliable avionics and repeat squawks. We perform complete and partial rewires — replacing aging wiring, connectors and circuit protection, remediating corrosion and damage, and marking every wire in-house for the maintenance life that follows."
        benefits={[
          "Improved system reliability",
          "Enhanced safety",
          "Reduced maintenance downtime",
          "Better avionics performance",
          "Increased aircraft value",
          "Compliance with current standards",
        ]}
        benefitsTitle="Benefits of a rewire"
        image="/images/projects/ias-avionics-212-MAY-A1-1.jpg"
        imageAlt="Bell 212 in the IAS hangar during a complete rewire"
        cta="See Our Rewiring Services"
        ctaHref="/services/aircraft-rewiring"
      />

      {/* Operations supported */}
      <section className="bg-charcoal py-16 text-white">
        <div className="wrap">
          <SectionHeading
            eyebrow="Who we support"
            title="Working Helicopters, Working Operators"
            intro="We support commercial helicopter fleets across the Okanagan and Southern British Columbia — and beyond, where arrangements can be made."
            dark
          />
          <Stagger className="mt-10 flex flex-wrap gap-3">
            {operations.map((op) => (
              <span
                key={op}
                className="border border-white/25 px-4 py-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-white"
              >
                {op}
              </span>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why IAS */}
      <section className="border-t border-silver/40 bg-white py-16">
        <div className="wrap">
          <SectionHeading
            eyebrow="Why IAS"
            title="Why Choose Innovative Aerospace Services?"
            intro={`Based at ${site.address.facility}, with decades of combined experience across rotary-wing and fixed-wing aircraft.`}
          />
          <Stagger className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {whyIas.map((reason) => (
              <p key={reason} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-aerored" />
                <span>{reason}</span>
              </p>
            ))}
          </Stagger>
          <Reveal className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact#estimate" className="btn-red">
              Request an Estimate
            </Link>
            <Link href="/projects" className="btn-ghost-dark">
              See Our Projects
            </Link>
          </Reveal>
        </div>
      </section>

      <AogBand />
    </>
  );
}
