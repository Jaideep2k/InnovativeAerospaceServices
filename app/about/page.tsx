import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About Us",
  description:
    "Innovative Aerospace Services was incorporated in 2010 to bring specialized avionics and electrical services to the Okanagan and Southern British Columbia, based at Kelowna International Airport.",
  path: "/about",
});

/** `pdf` links the certificate document, as the previous site did. */
const credentials: { label: string; pdf?: string }[] = [
  {
    label: "Transport Canada Approved Maintenance Organization, AMO 85-17",
    pdf: "/files/IAS-AMO-CERTIFICATE.pdf",
  },
  { label: "AMO rating: Avionics", pdf: "/files/IAS-AMO-AVIONICS-RATING.pdf" },
  { label: "AMO rating: Components", pdf: "/files/IAS-AMO-COMPONENT-RATING.pdf" },
  { label: "AMO rating: Instruments", pdf: "/files/IAS-AMO-INSTRUMENT-RATING.pdf" },
  { label: "AMO rating: Structures", pdf: "/files/IAS-AMO-STRUCTURES-RATING.pdf" },
  { label: "EASA certified" },
  { label: "FAA certified" },
  { label: "Authorized Garmin Aviation dealer, the only Garmin dealer in Kelowna" },
  { label: "Aircraft Electronics Association member since 2017" },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        compact
        image="/images/about/specialized-avionics-kelowna-airport.jpg"
        imageAlt="Aircraft at Kelowna International Airport where IAS Avionics is based"
        words={["Built", "in", "the", "Okanagan.", "Since", "2010."]}
        sub="Innovative Aerospace Services Ltd.: specialized avionics and electrical services at Kelowna International Airport."
      >
        <Link href="/contact" className="btn-red">
          Contact IAS
        </Link>
      </Hero>

      {/* Story */}
      <section className="py-20">
        <div className="wrap grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="Specialized Avionics for Southern BC"
            />
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-5 text-base leading-relaxed">
                <p>
                  Innovative Aerospace Services was incorporated in 2010 to
                  bring specialized avionics and electrical services to the
                  Okanagan and Southern British Columbia. We established our
                  central location at Kelowna International Airport (CYLW)
                  because of the regional demand for high-quality aircraft
                  avionics and electrical services.
                </p>
                <p>
                  Our team has decades of combined experience with general
                  aviation and commercial aircraft, fixed-wing and
                  rotary-wing alike. We provide avionics and electrical
                  troubleshooting, installations, repairs, aircraft rewiring,
                  wiring-harness services, certifications, equipment sales and
                  technical support.
                </p>
                <p>
                  Our employees are extensively trained and held accountable
                  for maintaining high standards, proper procedures and
                  quality workmanship.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/about/about-Innovative-Aerospace.jpg"
                alt="IAS Avionics technicians working on aircraft avionics"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-charcoal py-20 text-white">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Our mission"
              title="Excellence in Quality and Service, Every Day"
              intro="We support commercial helicopters, corporate jets and general aviation aircraft, rotary-wing and fixed-wing. Our mission is to take care of each customer's aircraft while maintaining the quality, reliability and performance its intended operation requires."
              dark
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-silver">
                A note on engineering: IAS does not perform regulated
                engineering work directly. When a project requires it,
                engineering is supplied by registered third-party engineering
                firms. We help you plan, coordinate, document, install and
                complete the project.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/home/mechanic-checking-aircraft-components-while-working-in-repair-station.jpeg"
                alt="Technician checking aircraft components in the repair station"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-20">
        <div className="wrap">
          <SectionHeading
            eyebrow="Certifications"
            title="Approved. Certified. Accountable."
            intro="Credentials held by Innovative Aerospace Services:"
          />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
            {credentials.map((c) => (
              <div
                key={c.label}
                className="flex items-start gap-3 border border-silver/50 bg-white p-5"
              >
                <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 shrink-0 bg-aerored" />
                <div>
                  <p className="text-sm font-semibold text-jet">{c.label}</p>
                  {c.pdf && (
                    <a
                      href={c.pdf}
                      target="_blank"
                      rel="noopener"
                      className="mt-1 inline-block text-xs font-semibold text-aerored underline underline-offset-2"
                    >
                      View certificate (PDF)
                    </a>
                  )}
                </div>
              </div>
            ))}
          </Stagger>
          <Reveal className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-6">
            <Image
              src="/brand/transport-canada-logo.png"
              alt="Transport Canada Approved Maintenance Organization"
              width={1386}
              height={240}
              className="h-9 w-auto"
            />
            <Image
              src="/brand/easa-logo.png"
              alt="European Union Aviation Safety Agency (EASA) logo"
              width={704}
              height={240}
              className="h-12 w-auto"
            />
            <Image
              src="/brand/garmin-logo.png"
              alt="Garmin logo: IAS is an authorized Garmin Aviation dealer"
              width={1200}
              height={173}
              className="h-[22px] w-auto"
            />
            <Image
              src="/brand/aea-logo.png"
              alt="Aircraft Electronics Association member badge"
              width={628}
              height={240}
              className="h-11 w-auto"
            />
          </Reveal>
          <Reveal className="mt-10 border-t border-silver/40 pt-6">
            <Link
              href="/dealers"
              className="text-sm font-semibold text-aerored underline underline-offset-4 hover:text-jet"
            >
              Our dealers →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Where we work */}
      <section className="border-t border-silver/40 bg-white py-20">
        <div className="wrap">
          <SectionHeading
            eyebrow="Where we work"
            title="Kelowna Hangar. Your Hangar. The Field."
            intro={`Based at ${site.address.facility}, we assist customers at our Kelowna facility, at your hangar or location, in the field, and at remote operating locations when arrangements are made.`}
          />
          <Reveal className="mt-8">
            <Link href="/contact" className="btn-red">
              Book an Appointment
            </Link>
          </Reveal>
        </div>
      </section>

      <AogBand />
    </>
  );
}
