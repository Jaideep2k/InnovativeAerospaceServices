import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import Counter from "@/components/motion/Counter";
import HoverLift from "@/components/motion/HoverLift";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "IAS Avionics | Avionics, Aircraft Rewiring & Wiring Harnesses — Kelowna, BC",
};

const services = [
  {
    title: "Avionics",
    text: "Installations, integration with existing systems, equipment sales, troubleshooting, repairs and scheduled recertifications — including RVSM-capable aircraft.",
    image: "/images/services/avionics-service.jpg",
    alt: "Avionics technician working on an aircraft instrument panel",
    href: "/services#avionics",
  },
  {
    title: "Aircraft Rewiring",
    text: "Complete and partial rewires that replace aging or unreliable wiring and track down intermittent electrical problems at the source.",
    image: "/images/home/Innovative-Aerospace-rewire-services.jpg",
    alt: "Aircraft wiring bundles during a rewiring project",
    href: "/services#rewiring",
  },
  {
    title: "Wiring Harnesses",
    text: "Custom, replacement, standard and accessory harnesses — built, installed and documented with laser-marked aircraft wire.",
    image: "/images/home/Innovative-Aerospace-Services-helicopter-wiring.jpg",
    alt: "Helicopter wiring harness work in progress",
    href: "/services#harnesses",
  },
  {
    title: "Laser Wire Marking",
    text: "In-house laser wire marking for clear identification, installation consistency and maintenance efficiency. Order online.",
    image: "/images/laser-wire/laser-marked-wire.jpg",
    alt: "Laser-marked aircraft wire with printed identification",
    href: "/laser-marked-wire-order-form",
  },
  {
    title: "Troubleshooting & Repairs",
    text: "Avionics and electrical fault diagnosis, wiring inspections and repairs — at our Kelowna facility or, where arranged, at your location.",
    image: "/images/home/Innovative-Aerospace-Services-helicopter-electrical.jpg",
    alt: "Technician troubleshooting helicopter electrical systems",
    href: "/services#troubleshooting",
  },
  {
    title: "Inspections & Recertifications",
    text: "Altimeter, transponder and encoder 24-month recertifications, ATE 24-month recertifications, ELT 12-month recertification and ADS-B support.",
    image: "/images/services/avionics-services-kelowna.jpg",
    alt: "Avionics test equipment during a recertification",
    href: "/services#recertifications",
  },
];

const pillars = [
  {
    title: "Reliable",
    text: "Certified. Trusted. Compliant with the highest standards.",
  },
  {
    title: "Expert",
    text: "Decades of combined experience in avionics & electrical systems.",
  },
  {
    title: "Responsive",
    text: "AOG support when you need it most. Minimizing downtime.",
  },
  {
    title: "Precise",
    text: "Attention to detail in every wire, connector and installation.",
  },
  {
    title: "Partner",
    text: "We work with you to deliver solutions that fit your mission.",
  },
];

const sectors = [
  "Corporate aviation",
  "Private aviation",
  "Commercial aviation",
  "Search and rescue",
  "Forestry operations",
  "Aerial firefighting",
  "Tourism",
  "Mining",
  "Wildlife surveying",
  "Medevac operations",
  "Remote aviation operations",
];

export default function HomePage() {
  return (
    <>
      <Hero
        image="/images/home/heli_overfire-slider.jpg"
        imageAlt="Helicopter flying over a wildfire during aerial firefighting operations"
        video="/videos/hero-broll.mp4"
        words={["Every", "Wire.", "Every", "Panel.", "Every", "Flight."]}
        tagline="Because it matters."
        sub="Offering the highest standard in custom engineered avionics and electrical installations, repairs, harness building & design. Due to the extreme wildfire season, it's critical to start planning your winter maintenance. Contact our team today."
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
          Request an Estimate
        </Link>
        <Link href="/services" className="btn-ghost-light">
          Explore Services
        </Link>
      </Hero>

      {/* Trust strip */}
      <section aria-label="Credentials" className="bg-jet text-white">
        <div className="wrap grid gap-8 py-12 sm:grid-cols-3">
          <Reveal className="text-center sm:text-left">
            <p className="font-heading text-4xl font-extrabold text-white">
              <Counter value={site.established} duration={1} />
            </p>
            <p className="mt-1 text-sm uppercase tracking-[0.16em] text-silver">
              Established in Kelowna
            </p>
          </Reveal>
          <Reveal delay={0.1} className="text-center sm:text-left">
            <p className="font-heading text-4xl font-extrabold text-white">
              AMO 85-17
            </p>
            <p className="mt-1 text-sm uppercase tracking-[0.16em] text-silver">
              Transport Canada Approved Maintenance Organization
            </p>
          </Reveal>
          <Reveal delay={0.2} className="text-center sm:text-left">
            <p className="font-heading text-4xl font-extrabold text-white">
              <Counter value={4} duration={1} />
            </p>
            <p className="mt-1 text-sm uppercase tracking-[0.16em] text-silver">
              AMO ratings — Avionics · Components · Instruments · Structures
            </p>
          </Reveal>
        </div>
        <div className="bg-white">
          <div className="wrap flex flex-wrap items-center justify-center gap-x-14 gap-y-6 py-8">
            <Image
              src="/brand/transport-canada-logo.png"
              alt="Transport Canada Approved Maintenance Organization"
              width={1386}
              height={240}
              className="h-9 w-auto"
            />
            <Image
              src="/brand/easa-logo.png"
              alt="EASA certified"
              width={704}
              height={240}
              className="h-11 w-auto"
            />
            <Image
              src="/brand/garmin-logo.png"
              alt="Authorized Garmin Aviation dealer"
              width={892}
              height={240}
              className="h-8 w-auto"
            />
            <Image
              src="/brand/aea-logo.png"
              alt="Aircraft Electronics Association member since 2017"
              width={628}
              height={240}
              className="h-10 w-auto"
            />
            <Image
              src="/images/home/Chamber_2022Award-Techn-Innovator-Logo.png"
              alt="Kelowna Chamber Business Excellence Awards 2022 Winner — Technology Innovator of the Year"
              width={724}
              height={362}
              className="h-16 w-auto"
            />
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-20">
        <div className="wrap">
          <SectionHeading
            eyebrow="What we do"
            title="Avionics & Electrical Services"
            intro="High-quality installations, troubleshooting, repairs, aircraft rewiring, wiring-harness building, equipment sales and aircraft-support services — dependable work that keeps performing behind your panels for years."
          />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <HoverLift key={s.title} className="group h-full">
                <Link
                  href={s.href}
                  className="flex h-full flex-col border border-silver/50 bg-white"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-lg font-extrabold uppercase tracking-tight text-jet">
                      {s.title}
                    </h3>
                    <span className="red-rule mt-3 h-0.5 w-10" />
                    <p className="mt-4 flex-1 text-sm leading-relaxed">{s.text}</p>
                    <span className="mt-5 font-heading text-xs font-bold uppercase tracking-[0.16em] text-aerored">
                      Learn more →
                    </span>
                  </div>
                </Link>
              </HoverLift>
            ))}
          </Stagger>
          <Reveal className="mt-12 text-center">
            <Link href="/services" className="btn-ghost-dark">
              View All Services
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Why IAS — brand pillars */}
      <section className="bg-charcoal py-20 text-white">
        <div className="wrap">
          <SectionHeading
            eyebrow="Why IAS"
            title="Why Operators Choose IAS"
            intro="Our team is extensively trained and held accountable for high standards, proper procedures and quality workmanship — with open, direct communication and estimates discussed before work begins."
            dark
          />
          <Stagger className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map((p) => (
              <div key={p.title}>
                <span className="red-rule" />
                <h3 className="mt-4 font-heading text-base font-extrabold uppercase tracking-[0.1em] text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-silver">{p.text}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Garmin */}
      <section className="py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/home/Garmin-GR500.jpg"
                alt="Garmin avionics display installed in an aircraft panel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Equipment & Installations"
              title="Authorized Garmin Aviation Dealer"
              intro="IAS is an authorized Garmin Aviation dealer and installs systems from leading avionics manufacturers — properly integrating new equipment with your aircraft's existing systems to improve reliability, functionality, compliance and operational capability."
            />
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Image
                  src="/brand/garmin-logo.png"
                  alt="Garmin logo — IAS is an authorized Garmin Aviation dealer"
                  width={892}
                  height={240}
                  className="h-12 w-auto"
                />
                <Link href="/contact#estimate" className="btn-red">
                  Discuss an Avionics Project
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-silver/40 bg-white py-20">
        <div className="wrap">
          <SectionHeading
            eyebrow="How we work"
            title="Consultation Before Installation"
            intro="Our consultation and estimate process verifies expected expenses before a project begins — you understand the proposed work and approve the project before installation starts."
            center
          />
          <Stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                t: "Consult",
                d: "Tell us about your aircraft, its intended operation and what you want to achieve.",
              },
              {
                n: "02",
                t: "Estimate",
                d: "We identify solutions suited to your aircraft, operating requirements and budget, and discuss expected expenses up front.",
              },
              {
                n: "03",
                t: "Approve",
                d: "You review and approve the proposed work before installation begins.",
              },
              {
                n: "04",
                t: "Install & Verify",
                d: "Installation, integration, testing and documentation — quality workmanship behind every panel.",
              },
            ].map((step) => (
              <div key={step.n} className="border-t-4 border-aerored pt-5">
                <p className="font-heading text-sm font-bold text-silver">{step.n}</p>
                <h3 className="mt-1 font-heading text-lg font-extrabold uppercase text-jet">
                  {step.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed">{step.d}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Operations supported */}
      <section className="relative overflow-hidden bg-jet py-20 text-white">
        <Image
          src="/images/home/heli_waterbucket-slider.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="wrap relative">
          <SectionHeading
            eyebrow="Who we support"
            title="From Corporate Jets to Working Helicopters"
            intro="We support commercial helicopters, corporate jets and general aviation aircraft — light aircraft through medium and heavy helicopters — at our Kelowna facility, your hangar, in the field, or at remote operating locations when arrangements can be made."
            dark
          />
          <Stagger className="mt-10 flex flex-wrap gap-3">
            {sectors.map((sector) => (
              <span
                key={sector}
                className="border border-white/25 px-4 py-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-white"
              >
                {sector}
              </span>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <p className="max-w-2xl text-sm leading-relaxed text-silver">
              We can also help you plan around recertification deadlines,
              scheduled maintenance and seasonal operating requirements.
            </p>
            <Link href="/contact" className="btn-red mt-6">
              Plan Your Maintenance Window
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Testimonials — verbatim from the current website */}
      <section className="py-20">
        <div className="wrap">
          <SectionHeading eyebrow="Testimonials" title="What Customers Say" center />
          <Stagger className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
            <blockquote className="border-l-4 border-aerored bg-white p-7 shadow-sm">
              <p className="text-sm leading-relaxed">
                &ldquo;IAS rebuilt my PC12 and Beaver panels with new Garmin.
                IAS is highly professional. The avionics are properly
                configured/integrated, and the records packages are perfect.
                A+&rdquo;
              </p>
              <footer className="mt-4 font-heading text-sm font-bold uppercase tracking-[0.12em] text-jet">
                — Will Hudson
              </footer>
            </blockquote>
            <blockquote className="border-l-4 border-aerored bg-white p-7 shadow-sm">
              <p className="text-sm leading-relaxed">
                &ldquo;Extreme high level Quality Avionics, Knowledge and
                Service! Absolute pleasure working with Nancy. Thank
                you&rdquo;
              </p>
              <footer className="mt-4 font-heading text-sm font-bold uppercase tracking-[0.12em] text-jet">
                — Steve Jones
              </footer>
            </blockquote>
          </Stagger>
        </div>
      </section>

      <AogBand />
    </>
  );
}
