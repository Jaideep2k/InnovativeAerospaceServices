import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import Faq from "@/components/ui/Faq";
import Reveal from "@/components/motion/Reveal";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { faq } from "@/lib/faq";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Frequently Asked Questions",
  description:
    "Answers about aircraft rewiring, laser wire marking, avionics installation and upgrades, helicopter and fixed-wing support, consultations and where to find IAS Avionics at Kelowna International Airport.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd />

      <Hero
        compact
        image="/images/services/avionics-services-kelowna.jpg"
        imageAlt="Helicopter instrument panel with test connectors attached at the IAS Kelowna facility"
        words={["Frequently", "Asked", "Questions"]}
        sub="Common questions about rewiring, laser wire marking, avionics upgrades, consultations and working with IAS."
      >
        <Link href="/contact#estimate" className="btn-red">
          Request an Estimate
        </Link>
      </Hero>

      <section className="py-16">
        <div className="wrap">
          <SectionHeading
            eyebrow="Answers"
            title="What Operators Ask Us Most"
            intro="If your question isn't covered here, call us or send an inquiry — we'll give you a straight answer before anything is quoted."
          />
          <Faq entries={faq} />
        </div>
      </section>

      <section className="border-t border-silver/40 bg-white py-16">
        <div className="wrap">
          <SectionHeading
            eyebrow="Still have a question?"
            title="Talk to a Technician, Not a Call Centre"
            intro="Tell us about your aircraft, its intended operation and what you want to achieve. Estimates and expected expenses are discussed before work begins."
          />
          <Reveal className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact#estimate" className="btn-red">
              Request an Estimate
            </Link>
            <a href={site.phoneHref} className="btn-ghost-dark">
              Call {site.phone}
            </a>
          </Reveal>
        </div>
      </section>

      <AogBand />
    </>
  );
}
