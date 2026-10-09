import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";

const steps = [
  {
    n: "01",
    t: "Tell Us How You Fly",
    d: "Your aircraft, its mission, how you fly it and what you want from your panel.",
  },
  {
    n: "02",
    t: "We Design the Package",
    d: "A package built around Garmin and other leading brands, suited to your aircraft, operating requirements and budget.",
  },
  {
    n: "03",
    t: "Approve the Estimate",
    d: "A clear estimate, reviewed and approved by you before any work begins.",
  },
  {
    n: "04",
    t: "Installed & Documented",
    d: "Installed, integrated, tested and documented, with quality workmanship behind every panel.",
  },
];

/** Avionics design-consultation prompt, shown on the avionics service page. */
export default function DesignConsultation() {
  return (
    <section
      id="design-consultation"
      className="scroll-mt-28 border-t border-silver/40 bg-white py-16"
    >
      <div className="wrap">
        <SectionHeading
          eyebrow="Design consultation"
          title="Design Your Dream Avionics Package"
          intro="Sit down with IAS before anything is ordered or installed. We'll talk through how you fly, what you want from your cockpit and your budget, then design an avionics package around it."
        />
        <Stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n} className="border-t-4 border-aerored pt-5">
              <p className="font-heading text-sm font-bold text-silver">{step.n}</p>
              <h3 className="mt-1 font-heading text-lg font-extrabold uppercase text-jet">
                {step.t}
              </h3>
              <p className="mt-3 text-sm leading-relaxed">{step.d}</p>
            </div>
          ))}
        </Stagger>
        <Reveal className="mt-12">
          <Link href="/contact#estimate" className="btn-red">
            Book a Design Consultation
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
