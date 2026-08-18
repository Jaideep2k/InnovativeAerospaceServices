import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import ServiceBand from "@/components/sections/ServiceBand";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";

export const metadata: Metadata = pageMeta({
  title: "Authorized Garmin Dealer",
  description:
    "IAS Avionics is the only Garmin dealer in Kelowna — supplying and installing Garmin glass cockpit systems, GPS navigation, flight displays, ADS-B, audio panels and transponders for fixed-wing aircraft and helicopters.",
  path: "/garmin-dealer",
});

const whyGarmin = [
  "Industry-leading avionics technology",
  "Enhanced flight safety and situational awareness",
  "Improved navigation and communication capabilities",
  "Increased aircraft value",
  "Seamless integration with existing aircraft systems",
  "Reliable support and long-term performance",
];

export default function GarminDealerPage() {
  return (
    <>
      <Hero
        compact
        image="/images/home/Garmin-GR500.jpg"
        imageAlt="Garmin avionics display installed in an aircraft instrument panel"
        words={["Authorized", "Garmin", "Dealer"]}
        sub="Kelowna's only Garmin dealer. Whether you're upgrading a single component or undertaking a complete cockpit modernization, we help you select, install and integrate the right Garmin solution for your aircraft."
        badge={
          <div className="flex items-center gap-4 border-l-4 border-aerored pl-4">
            <Image
              src="/brand/garmin-logo-white.png"
              alt="Garmin"
              width={892}
              height={240}
              className="h-6 w-auto"
            />
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-white">
              Authorized Aviation Dealer
            </p>
          </div>
        }
      >
        <Link href="/contact#estimate" className="btn-red">
          Request a Free Consultation
        </Link>
      </Hero>

      {/* Intro */}
      <section className="py-16">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Garmin at IAS"
              title="Trusted Garmin Avionics, Properly Integrated"
              intro="Innovative Aerospace Services is proud to offer industry-leading avionics solutions as a trusted Garmin dealer and installer — the only Garmin dealer in Kelowna. Garmin products are recognized worldwide for their reliability, innovation and advanced technology, giving pilots and operators enhanced situational awareness, safety and operational efficiency."
            />
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Image
                  src="/brand/garmin-logo.png"
                  alt="Garmin logo — IAS Avionics is an authorized Garmin Aviation dealer"
                  width={892}
                  height={240}
                  className="h-12 w-auto"
                />
                <Link href="/contact#estimate" className="btn-red">
                  Discuss a Garmin Upgrade
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/services/avionics-services-kelowna.jpg"
                alt="Helicopter instrument panel with avionics connectors during an installation at IAS"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <ServiceBand
        id="products"
        eyebrow="Products & solutions"
        title="The Garmin Range We Supply & Install"
        intro="We supply and install a wide range of Garmin avionics — selected around your aircraft type, operating requirements and budget."
        items={[
          "Glass cockpit systems",
          "GPS navigation systems",
          "Flight displays",
          "Engine monitoring systems",
          "Communication and navigation radios",
          "ADS-B In and ADS-B Out solutions",
          "Audio panels",
          "Transponders",
          "Traffic and terrain awareness systems",
          "Flight data management solutions",
        ]}
        image="/images/home/Innovative-Aerospace-Services-jets-rewiring.jpg"
        imageAlt="Corporate jet in flight"
        cta="Ask About a Product"
        ctaHref="/contact#estimate"
        flip
        dark
      />

      <ServiceBand
        id="installation"
        eyebrow="Expert installation & support"
        title="Installed to Specification, Every Time"
        intro="Our technicians are experienced in avionics integration and aircraft electrical systems, ensuring your Garmin equipment is installed to manufacturer specifications and applicable regulatory requirements. We work closely with aircraft owners and operators to develop customized solutions that align with operational needs, aircraft type and budget."
        note="A Garmin upgrade is only as good as the wiring behind it. Because we are an avionics and electrical shop first, we can address aging wiring, connectors and circuit protection as part of the same visit — see our aircraft rewiring services."
        image="/images/projects/212-MAR-B2-1.jpg"
        imageAlt="Bell 212 airframe stripped back with new wiring being routed at the IAS facility"
        cta="Plan an Installation"
        ctaHref="/contact#estimate"
      />

      {/* Why upgrade */}
      <section className="bg-charcoal py-16 text-white">
        <div className="wrap">
          <SectionHeading
            eyebrow="Why upgrade"
            title="Why Upgrade with Garmin?"
            intro="Whether you operate a fixed-wing aircraft or a helicopter, IAS can help modernize your cockpit with trusted Garmin avionics solutions designed to keep you flying confidently."
            dark
          />
          <Stagger className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {whyGarmin.map((reason) => (
              <p
                key={reason}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-silver"
              >
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-aerored" />
                <span>{reason}</span>
              </p>
            ))}
          </Stagger>
          <Reveal className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact#estimate" className="btn-red">
              Request a Free Consultation
            </Link>
            <Link href="/services/avionics" className="btn-ghost-light">
              All Avionics Services
            </Link>
          </Reveal>
        </div>
      </section>

      <AogBand />
    </>
  );
}
