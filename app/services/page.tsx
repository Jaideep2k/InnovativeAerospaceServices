import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Avionics installations and recertifications, aircraft rewiring, wiring harnesses, laser wire marking, troubleshooting and repairs, ADS-B upgrades and aircraft-support services in Kelowna, BC.",
};

function ServiceBand({
  id,
  eyebrow,
  title,
  intro,
  items,
  note,
  image,
  imageAlt,
  cta,
  ctaHref,
  flip = false,
  dark = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  items?: string[];
  note?: string;
  image?: string;
  imageAlt?: string;
  cta?: string;
  ctaHref?: string;
  flip?: boolean;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 py-16 ${dark ? "bg-charcoal text-white" : ""}`}
    >
      <div
        className={`wrap grid items-start gap-10 ${image ? "lg:grid-cols-2" : ""}`}
      >
        <div className={flip ? "lg:order-2" : ""}>
          <SectionHeading eyebrow={eyebrow} title={title} intro={intro} dark={dark} />
          {items && (
            <Stagger
              className="mt-7 grid gap-x-8 gap-y-2.5 sm:grid-cols-2"
              stagger={0.04}
              y={16}
            >
              {items.map((item) => (
                <p key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-aerored" />
                  <span>{item}</span>
                </p>
              ))}
            </Stagger>
          )}
          {note && (
            <Reveal delay={0.1}>
              <p
                className={`mt-6 border-l-4 border-aerored pl-4 text-sm leading-relaxed ${
                  dark ? "text-silver" : "text-charcoal/90"
                }`}
              >
                {note}
              </p>
            </Reveal>
          )}
          {cta && ctaHref && (
            <Reveal delay={0.15}>
              <Link href={ctaHref} className="btn-red mt-8">
                {cta}
              </Link>
            </Reveal>
          )}
        </div>
        {image && (
          <Reveal delay={0.15} className={flip ? "lg:order-1" : ""}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Hero
        compact
        image="/images/services/avionics-services-kelowna.jpg"
        imageAlt="Avionics service work at the IAS Avionics facility in Kelowna"
        words={["Avionics", "&", "Electrical", "Services"]}
        sub="Installations, rewiring, harnesses, laser wire marking, troubleshooting, repairs, recertifications and aircraft-support services — for rotary-wing and fixed-wing aircraft."
      >
        <Link href="/contact#estimate" className="btn-red">
          Request an Estimate
        </Link>
      </Hero>

      <ServiceBand
        id="avionics"
        eyebrow="Service 01"
        title="Avionics"
        intro="We perform scheduled avionics recertifications — including work involving RVSM-capable aircraft — and install systems from leading avionics manufacturers, integrating new equipment properly with your aircraft's existing systems to improve reliability, functionality, compliance and operational capability."
        items={[
          "Scheduled recertifications",
          "Avionics troubleshooting",
          "Electrical troubleshooting",
          "Avionics repairs",
          "Electrical repairs",
          "Avionics equipment sales",
          "Avionics installations",
          "Integration with existing aircraft systems",
          "Systems from leading avionics manufacturers",
          "Garmin aviation equipment and installations",
        ]}
        image="/images/services/avionics-service.jpg"
        imageAlt="Avionics installation work on an aircraft instrument panel"
        cta="Discuss an Avionics Project"
        ctaHref="/contact#estimate"
      />

      <ServiceBand
        id="rewiring"
        eyebrow="Service 02"
        title="Aircraft Rewiring"
        intro="We specialize in complete and partial aircraft rewiring. If your aircraft suffers intermittent electrical problems, unreliable systems, aging wiring, obsolete installations or repeated electrical faults — the 'gremlins' every operator knows — a rewire may be the right fix."
        items={[
          "Complete aircraft rewiring",
          "Partial wiring replacement",
          "Replacement of aging or unreliable electrical wiring",
          "Identification and correction of intermittent electrical problems",
          "Wiring cleanup and reorganization",
          "Custom electrical upgrades",
          "Custom avionics upgrades",
          "Instrument upgrades",
          "Laser wire marking",
          "Harness construction",
          "Supporting documentation",
          "Coordination with third-party engineering firms where regulated engineering is required",
        ]}
        image="/images/home/Innovative-Aerospace-rewire-services.jpg"
        imageAlt="New aircraft wiring installed during a rewiring project"
        cta="Discuss a Rewiring Project"
        ctaHref="/contact#estimate"
        flip
        dark
      />

      <ServiceBand
        id="solutions"
        eyebrow="Service 03"
        title="Aircraft Solutions & Upgrades"
        intro="Custom electrical, avionics and instrument projects built around your aircraft and its operational requirements — from IFR and VFR cockpit layouts to full retrofit and modernization projects."
        items={[
          "Custom electrical upgrades",
          "Custom avionics upgrades",
          "Instrument upgrades",
          "Aircraft retrofit projects",
          "IFR cockpit layouts",
          "VFR cockpit layouts",
          "Aircraft modernization",
          "Integration of existing and new systems",
          "Project documentation",
          "AutoCAD drawings",
          "Coordination of design and engineering documentation",
          "Installation, testing and troubleshooting",
        ]}
        note="IAS does not perform regulated engineering work directly. Where engineering is required, it is supplied by registered third-party engineering firms — we plan, coordinate, document, install and complete the project with you."
        image="/images/home/Innovative-Aerospace-Services-jets-rewiring.jpg"
        imageAlt="Corporate jet undergoing avionics upgrade work"
        cta="Plan a Custom Project"
        ctaHref="/contact#estimate"
      />

      <ServiceBand
        id="harnesses"
        eyebrow="Service 04"
        title="Wiring Harnesses"
        intro="Experienced aircraft wiring-harness construction and installation — with laser-marked aircraft wire, stocked options where available, and expedited shipping of harnesses and avionics equipment where available."
        items={[
          "Custom aircraft wiring harnesses",
          "Replacement wiring harnesses",
          "Standard replacement harnesses",
          "Accessory harnesses",
          "Harness building",
          "Harness installation",
          "Laser-marked aircraft wire",
          "Stocked wiring-harness options where available",
          "Expedited shipping where available",
        ]}
        image="/images/home/Innovative-Aerospace-Services-helicopter-wiring.jpg"
        imageAlt="Aircraft wiring harness under construction"
        cta="Ask About a Harness"
        ctaHref="/contact"
        flip
        dark
      />

      <ServiceBand
        id="laser-marking"
        eyebrow="Service 05"
        title="Laser Wire Marking"
        intro="In-house laser wire marking for aircraft wiring projects and customer orders — supporting clear wire identification, installation consistency, maintenance efficiency and professional aircraft wiring practices."
        image="/images/laser-wire/wire-2.jpg"
        imageAlt="Close-up of laser-marked aircraft wire identification"
        cta="Laser Marked Wire Order Form"
        ctaHref="/laser-marked-wire-order-form"
      />

      <ServiceBand
        id="troubleshooting"
        eyebrow="Service 06"
        title="Troubleshooting & Repairs"
        intro="Strong diagnostic capability across avionics and electrical systems — at the IAS facility or, where arranged, at customer locations."
        items={[
          "Avionics fault diagnosis",
          "Electrical fault diagnosis",
          "Intermittent-system troubleshooting",
          "Wiring inspections",
          "Repair of damaged or unreliable wiring",
          "Correction of installation issues",
          "Avionics equipment troubleshooting",
          "Aircraft electrical-system repairs",
        ]}
        image="/images/home/Innovative-Aerospace-Services-helicopter-electrical.jpg"
        imageAlt="Technician troubleshooting a helicopter electrical system"
        cta="Book Troubleshooting"
        ctaHref="/contact"
        flip
        dark
      />

      <ServiceBand
        id="recertifications"
        eyebrow="Service 07"
        title="Inspections & Recertifications"
        intro="Scheduled recertification services to keep your aircraft compliant — and help planning around recertification deadlines and seasonal maintenance requirements."
        items={[
          "Altimeter, transponder and encoder 24-month recertifications",
          "ATE 24-month recertifications",
          "ELT 12-month recertification",
          "Scheduled avionics recertifications",
          "Recertification support for RVSM-capable aircraft",
        ]}
        image="/images/services/avionics-services-kelowna.jpg"
        imageAlt="Avionics test equipment used during recertification"
        cta="Ask About Recertification"
        ctaHref="/contact"
      />

      <ServiceBand
        id="adsb"
        eyebrow="Service 08"
        title="ADS-B Upgrades & Installations"
        intro="ADS-B upgrades, installations and equipment integration — including support for aircraft that need to meet applicable United States ADS-B operating requirements."
        items={[
          "ADS-B upgrades",
          "ADS-B installations",
          "Equipment integration",
          "Support for U.S. ADS-B operating requirements",
        ]}
        image="/images/home/Innovative-Aerospace-Services-aviation-maintenance.jpg"
        imageAlt="Aircraft avionics maintenance in the hangar"
        cta="Ask About ADS-B"
        ctaHref="/contact"
        flip
        dark
      />

      <ServiceBand
        id="efficiency"
        eyebrow="Service 09"
        title="Aircraft Efficiency & Weight Review"
        intro="As part of a rewire or retrofit — with an IFR or VFR layout — we can review your aircraft's wiring and installed equipment to identify obsolete equipment, unnecessary wiring and outdated installations that can be removed where legally and technically appropriate."
        image="/images/home/Innovative-Aerospace-rewire-projects.jpg"
        imageAlt="Aircraft wiring being reviewed during a retrofit project"
        cta="Ask About an Efficiency Review"
        ctaHref="/contact"
      />

      {/* Technology advantage */}
      <section className="border-t border-silver/40 bg-white py-16">
        <div className="wrap">
          <SectionHeading
            eyebrow="The IAS advantage"
            title="Personalized Service, Serious Capability"
            intro="Rotary-wing and fixed-wing support, wiring harnesses, avionics equipment, troubleshooting, installations, recertifications and customized project support — backed by a reputation we take pride in within the aerospace community. Where available, we can help arrange expedited shipping of wiring harnesses and avionics equipment. Our team stays informed about new avionics technologies and helps you identify solutions suited to your aircraft, operating requirements and budget."
          />
          <Reveal className="mt-8 flex flex-wrap gap-4">
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
