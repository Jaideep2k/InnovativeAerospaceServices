import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Hero from "@/components/sections/Hero";
import ServiceBand from "@/components/sections/ServiceBand";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import DowntimeCallout from "@/components/ui/DowntimeCallout";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { site } from "@/lib/site";
import { rotaryMakers } from "@/lib/aircraft";
import { videos, youtubeId } from "@/lib/media";

export const metadata: Metadata = pageMeta({
  title: "Helicopter Avionics & Electrical Services",
  description:
    "Helicopter electrical maintenance, wiring repairs, complete rotary-wing rewires, avionics installation and lighting system repairs for commercial helicopter operators, based at Kelowna International Airport, BC.",
  path: "/helicopter-avionics-electrical",
});

/** In the client's order of priority; the band fills column by column so it reads top to bottom. */
const helicopterServices = [
  "Avionics installation and upgrades",
  "Complete and partial rewires",
  "Modification support",
  "Electrical troubleshooting",
  "Wiring harness assembly and installations",
  "Lighting system repairs",
  "Inspection support",
  "Laser marked wire",
  "“Weight loss” program",
];

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

const video = videos.overview;
const videoId = youtubeId(video.youtubeId);
// Until a video is added, the section only appears in development (as a placeholder).
const showVideo = videoId !== null || process.env.NODE_ENV !== "production";

export default function HelicopterPage() {
  return (
    <>
      <Hero
        compact
        image="/images/home/heli_overfire-slider.jpg"
        imageAlt="Helicopter operating over a wildfire during aerial firefighting"
        words={["Helicopter", "Avionics", "&", "Electrical"]}
        sub="Specialized maintenance and repair support for helicopter operators, focused on safety, reliability and operational readiness for rotary-wing aircraft."
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
            intro="Innovative Aerospace Services provides specialized avionics and electrical maintenance and repair support for helicopter operators. We understand the unique demands placed on rotary-wing aircraft (vibration, duty cycle and unforgiving operating environments) and deliver solutions focused on safety, reliability and operational readiness. We work closely with private owners, commercial operators and aviation organizations to minimize downtime and keep aircraft mission-ready."
          />
        </div>
      </section>

      <ServiceBand
        id="services"
        eyebrow="What we do"
        title="Helicopter Services"
        intro="Electrical and avionics work on light, medium and heavy helicopters, at our Kelowna facility, at your hangar, or in the field when arrangements are made."
        items={helicopterServices}
        fillColumns
        note="We offer the fastest rewire in the industry, so aircraft downtime is reduced. Note that IAS does not perform regulated engineering work directly. When engineering is required, it is supplied by registered third-party engineering firms."
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
        intro="Aging wiring on helicopters shows up as “gremlins”: intermittent faults, unreliable avionics and repeat snags. We perform complete and partial rewires, replacing aging wiring, connectors and circuit protection, and remediating corrosion and damage."
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

      <DowntimeCallout cta="Ask About Turnaround" ctaHref="/contact#estimate" />

      {/* Video: hidden on the live site until a link is set in lib/media.ts */}
      {showVideo && (
        <section id="video" className="scroll-mt-28 py-16">
          <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.35fr]">
            <SectionHeading
              eyebrow="See how it works"
              title="A Complete Rewire, Start to Finish"
              intro="Watch a Bell 412 Classic completely rewired at our Kelowna facility: main airframe, dual 3-axis autopilot, avionics and utilities, completed in 60 days."
            />
            <Reveal delay={0.1}>
              <YouTubeEmbed id={videoId} title={video.title} poster={video.poster} autoplayInView />
            </Reveal>
          </div>
        </section>
      )}

      {/* Operations supported */}
      <section className="bg-charcoal py-16 text-white">
        <div className="wrap">
          <SectionHeading
            eyebrow="Who we support"
            title="Working Helicopters, Working Operators"
            intro="We support commercial helicopter fleets across the Okanagan and Southern British Columbia, and beyond, when arrangements are made."
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
          <Reveal delay={0.1} className="mt-10 border-t border-white/15 pt-6">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-white">
              Helicopters we work on
            </h3>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-silver">
              {rotaryMakers.map((maker) => (
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
