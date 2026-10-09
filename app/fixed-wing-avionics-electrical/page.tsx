import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Hero from "@/components/sections/Hero";
import ServiceBand from "@/components/sections/ServiceBand";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import DowntimeCallout from "@/components/ui/DowntimeCallout";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { site } from "@/lib/site";
import { fixedMakers } from "@/lib/aircraft";

export const metadata: Metadata = pageMeta({
  title: "Fixed-Wing Avionics & Electrical Services",
  description:
    "Garmin avionics upgrades, complete and partial rewires, electrical troubleshooting and recertifications for corporate jets, private aircraft and commercial operators, based at Kelowna International Airport, BC.",
  path: "/fixed-wing-avionics-electrical",
});

/**
 * Laid out two per row by ServiceBand, so each row is a related pair and the
 * list reads sensibly across or down.
 */
const fixedWingServices = [
  "Garmin avionics installations and upgrades",
  "Instrument upgrades",
  "IFR and VFR cockpit layouts",
  "ADS-B upgrades for potential future Canadian requirements",
  "Complete and partial rewires",
  "Electrical troubleshooting",
  "Wiring harness assembly and installations",
  "Laser marked wire",
  "Altimeter, transponder and encoder 24-month recertifications",
  "ELT 12-month recertifications",
  "Recertification support for RVSM-capable aircraft",
  "“Weight loss” program",
];

const whyIas = [
  "The only Garmin dealer in Kelowna",
  "Specialized avionics and electrical expertise",
  "Experienced aviation technicians",
  "Responsive customer support",
  "Quality workmanship",
  "Commitment to safety",
];

const audiences = [
  "Corporate jets",
  "Private aircraft owners",
  "General aviation",
  "Commercial operators",
];

export default function FixedWingPage() {
  return (
    <>
      <Hero
        compact
        image="/images/home/Innovative-Aerospace-Services-jets-rewiring.jpg"
        imageAlt="Corporate jet in flight above the clouds"
        words={["Fixed-Wing", "Avionics", "&", "Electrical"]}
        sub="Avionics upgrades, rewires and electrical repairs for corporate jets, private aircraft and commercial operators, from Kelowna's only Garmin dealer."
      >
        <Link href="/contact#estimate" className="btn-red">
          Request an Estimate
        </Link>
      </Hero>

      {/* Intro */}
      <section className="py-16">
        <div className="wrap">
          <SectionHeading
            eyebrow="Fixed-wing support"
            title="Built Around Your Aircraft and How You Fly"
            intro="Innovative Aerospace Services provides avionics and electrical installation, upgrade and repair support for fixed-wing aircraft, from light general aviation aircraft to corporate jets. Whether you need a single radio, a complete glass cockpit or a full rewire, we plan the work around your aircraft, your operation and your budget, and work closely with owners and operators to keep downtime to a minimum."
          />
        </div>
      </section>

      <ServiceBand
        id="services"
        eyebrow="What we do"
        title="Fixed-Wing Services"
        intro="Avionics and electrical work on fixed-wing aircraft, at our Kelowna facility or at your hangar when arrangements are made."
        items={fixedWingServices}
        note="Note that IAS does not perform regulated engineering work directly. When engineering is required, it is supplied by registered third-party engineering firms."
        image="/images/home/Innovative-Aerospace-Services-aviation-maintenance.jpg"
        imageAlt="Corporate jet parked on an airport ramp at sunset"
        cta="Discuss a Fixed-Wing Project"
        ctaHref="/contact#estimate"
        flip
        dark
      />

      <ServiceBand
        id="avionics"
        eyebrow="Avionics upgrades"
        title="Garmin Upgrades, Properly Integrated"
        intro="As the only Garmin dealer in Kelowna, we supply, install and integrate Garmin avionics in fixed-wing aircraft, from a single radio to a complete glass-cockpit modernization, with instrument upgrades and IFR or VFR cockpit layouts planned around how you fly."
        items={[
          "Glass cockpit systems",
          "GPS navigation systems",
          "Flight displays",
          "Communication and navigation radios",
          "Transponders",
          "Audio panels",
        ]}
        note="Thinking ahead to potential future Canadian ADS-B requirements? We can plan an upgrade path that fits your aircraft and budget."
        image="/images/home/Garmin-GR500.jpg"
        imageAlt="Garmin flight displays installed in a fixed-wing aircraft instrument panel"
        cta="Explore Garmin at IAS"
        ctaHref="/garmin-dealer"
      />

      <DowntimeCallout cta="Ask About Turnaround" ctaHref="/contact#estimate" />

      <ServiceBand
        id="rewires"
        eyebrow="Fixed-wing rewires"
        title="Complete & Partial Rewires"
        intro="Aging wiring shows up as “gremlins”: intermittent faults, unreliable avionics and repeat snags. We perform complete and partial rewires on fixed-wing aircraft, replacing aging wiring, connectors and circuit protection, and remediating corrosion and damage."
        benefits={[
          "Improved system reliability",
          "Enhanced safety",
          "Reduced maintenance downtime",
          "Better avionics performance",
          "Increased aircraft value",
          "Compliance with current standards",
        ]}
        benefitsTitle="Benefits of a rewire"
        note="As part of a rewire or retrofit, our “weight loss” program identifies obsolete equipment and unnecessary wiring that can come out, where legally and technically appropriate."
        image="/images/laser-wire/laser-marked-wire.jpg"
        imageAlt="Laser-marked aircraft cables with printed identification"
        cta="See Our Rewiring Services"
        ctaHref="/services/aircraft-rewiring"
        flip
      />

      {/* Who we support */}
      <section className="bg-charcoal py-16 text-white">
        <div className="wrap">
          <SectionHeading
            eyebrow="Who we support"
            title="Corporate, Private & Commercial"
            intro="We support corporate jet operators, private and general aviation owners, and commercial operators across the Okanagan and Southern British Columbia, and beyond, when arrangements are made."
            dark
          />
          <Stagger className="mt-10 flex flex-wrap gap-3">
            {audiences.map((audience) => (
              <span
                key={audience}
                className="border border-white/25 px-4 py-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-white"
              >
                {audience}
              </span>
            ))}
          </Stagger>
          <Reveal delay={0.1} className="mt-10 border-t border-white/15 pt-6">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-white">
              Fixed-wing aircraft we work on
            </h3>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-silver">
              {fixedMakers.map((maker) => (
                <li key={maker.name} className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-aerored" />
                  {maker.name}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Why IAS */}
      <section className="border-t border-silver/40 bg-white py-16">
        <div className="wrap">
          <SectionHeading
            eyebrow="Why IAS"
            title="Why Choose Innovative Aerospace Services?"
            intro={`Based at ${site.address.facility}, with decades of combined experience across fixed-wing and rotary-wing aircraft.`}
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
            <Link href="/services" className="btn-ghost-dark">
              See All Services
            </Link>
          </Reveal>
        </div>
      </section>

      <AogBand />
    </>
  );
}
