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
import HoverLift from "@/components/motion/HoverLift";
import { services, serviceHref } from "@/lib/services";

export const metadata: Metadata = pageMeta({
  title: "Services",
  description:
    "Avionics installations and recertifications, aircraft rewiring, wiring harnesses, laser wire marking, troubleshooting and repairs, ADS-B upgrades and aircraft-support services in Kelowna, BC.",
  path: "/services",
});

// Services without their own route keep their full detail here, anchored by id.
const hubOnly = services.filter((s) => !s.slug);

export default function ServicesPage() {
  return (
    <>
      <Hero
        compact
        image="/images/services/avionics-services-kelowna.jpg"
        imageAlt="Helicopter instrument panel with avionics test connectors at the IAS Kelowna facility"
        words={["Avionics", "&", "Electrical", "Services"]}
        sub="Installations, rewiring, harnesses, laser wire marking, troubleshooting, repairs, recertifications and aircraft-support services — for rotary-wing and fixed-wing aircraft."
      >
        <Link href="/contact#estimate" className="btn-red">
          Request an Estimate
        </Link>
      </Hero>

      {/* Service index */}
      <section className="py-16">
        <div className="wrap">
          <SectionHeading
            eyebrow="What we do"
            title="Nine Services, One Shop"
            intro="Everything below is performed in-house at Kelowna International Airport, or at your location where arrangements can be made. Choose a service for full detail."
          />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <HoverLift key={s.id} className="group h-full">
                <Link
                  href={serviceHref(s)}
                  className="flex h-full flex-col border border-silver/50 bg-white"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={s.card.image}
                      alt={s.card.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="eyebrow">{s.eyebrow}</p>
                    <h3 className="mt-2 font-heading text-lg font-extrabold uppercase tracking-tight text-jet">
                      {s.title}
                    </h3>
                    <span className="red-rule mt-3 h-0.5 w-10" />
                    <p className="mt-4 flex-1 text-sm leading-relaxed">
                      {s.card.text}
                    </p>
                    <span className="mt-5 font-heading text-xs font-bold uppercase tracking-[0.16em] text-aerored">
                      {s.slug ? "Learn more →" : "See details →"}
                    </span>
                  </div>
                </Link>
              </HoverLift>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Aircraft-type entry points */}
      <section className="bg-charcoal py-14 text-white">
        <div className="wrap">
          <SectionHeading
            eyebrow="By aircraft & equipment"
            title="Looking for Something Specific?"
            dark
          />
          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-4">
            <Link href="/helicopter-avionics-electrical" className="btn-ghost-light">
              Helicopter Avionics &amp; Electrical
            </Link>
            <Link href="/garmin-dealer" className="btn-ghost-light">
              Authorized Garmin Dealer
            </Link>
            <Link href="/laser-marked-wire-order-form" className="btn-ghost-light">
              Order Laser Marked Wire
            </Link>
            <Link href="/faq" className="btn-ghost-light">
              FAQ
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Detail for the services that do not have their own page */}
      {hubOnly.map((s, i) => (
        <ServiceBand
          key={s.id}
          id={s.id}
          eyebrow={s.eyebrow}
          title={s.title}
          intro={s.intro}
          items={s.items}
          benefits={s.benefits}
          benefitsTitle={s.benefitsTitle}
          note={s.note}
          image={s.image}
          imageAlt={s.imageAlt}
          cta={s.cta}
          ctaHref={s.ctaHref}
          flip={i % 2 === 1}
          dark={i % 2 === 1}
        />
      ))}

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
