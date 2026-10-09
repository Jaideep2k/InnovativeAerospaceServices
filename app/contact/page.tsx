import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import { site, directionsHref } from "@/lib/site";
import LocationMap from "@/components/ui/LocationMap";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: `Contact IAS Avionics at Kelowna International Airport (CYLW), ${site.address.street}, ${site.address.city}, ${site.address.region}. Call ${site.phone} or send a general inquiry.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Hero
        compact
        image="/images/contact/Innovative-Aerospace-Services-jets-rewiring.jpg"
        imageAlt="Corporate jets at the IAS Avionics facility"
        words={["Talk", "to", "IAS"]}
        sub="Estimates and expected expenses are discussed before work begins. Tell us about your aircraft and what you need."
      >
        <a href={site.phoneHref} className="btn-red">
          Call {site.phone}
        </a>
      </Hero>

      <section id="estimate" className="scroll-mt-28 py-16">
        <div className="wrap grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact details */}
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Kelowna International Airport (CYLW)"
            />
            <Reveal delay={0.1}>
              <address className="mt-7 text-sm not-italic leading-relaxed">
                <strong className="font-heading uppercase tracking-wide text-jet">
                  {site.legalName}
                </strong>
                <br />
                {site.address.facility}
                <br />
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postal}
                <br />
                {site.address.country}
              </address>

              <LocationMap tone="light" className="mt-6 h-56 sm:h-64" />
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex min-h-[44px] items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.16em] text-aerored transition-colors hover:text-jet"
              >
                Get directions <span aria-hidden="true">→</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>

              <dl className="mt-6 space-y-3 text-sm">
                <div>
                  <dt className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-jet">
                    Phone
                  </dt>
                  <dd>
                    <a href={site.phoneHref} className="font-semibold text-aerored">
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-jet">
                    General inquiries
                  </dt>
                  <dd>
                    <a href={`mailto:${site.contactEmail}`} className="font-semibold text-aerored">
                      {site.contactEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-jet">
                    AOG emergencies
                  </dt>
                  <dd>
                    <a href={`mailto:${site.aogEmail}`} className="font-semibold text-aerored">
                      {site.aogEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-jet">
                    Laser marked wire orders
                  </dt>
                  <dd>
                    <a href={`mailto:${site.laserWireEmail}`} className="font-semibold text-aerored">
                      {site.laserWireEmail}
                    </a>
                  </dd>
                </div>
              </dl>

              <h3 className="mt-9 font-heading text-xs font-bold uppercase tracking-[0.16em] text-jet">
                Business hours
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {site.hours.map((h) => (
                  <li key={h.days} className="flex flex-wrap justify-between gap-x-6 border-b border-silver/40 pb-1.5">
                    <span className="font-semibold">{h.days}</span>
                    <span>{h.hours}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.15} className="border border-silver/50 bg-white p-6 sm:p-9">
            <h2 className="font-heading text-xl font-extrabold uppercase text-jet">
              Send a General Inquiry
            </h2>
            <span className="red-rule mt-4" />
            <p className="mt-4 text-sm leading-relaxed">
              For estimates, appointments, recertifications, project questions
              or résumés. We&rsquo;ll follow up with you directly. Quick
              question first?{" "}
              <Link
                href="/faq"
                className="font-semibold text-aerored underline underline-offset-2"
              >
                Check the FAQ
              </Link>
              .
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-jet py-16 text-white">
        <Image
          src="/images/home/heli_waterbucket-slider.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="wrap relative">
          <Reveal>
            <p className="max-w-2xl font-heading text-2xl font-extrabold uppercase leading-snug tracking-tight">
              Field support available across the Okanagan, Southern BC and
              beyond, when arrangements are made.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
