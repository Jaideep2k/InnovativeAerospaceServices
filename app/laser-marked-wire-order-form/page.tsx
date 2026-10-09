import { Fragment } from "react";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import LaserWireOrderForm from "@/components/forms/LaserWireOrderForm";
import { wireCatalog, HEAVY_GAUGE_NOTE } from "@/lib/wireCatalog";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Laser Marked Wire Order Form",
  description:
    "Order laser-marked wire from IAS Avionics. Enter the marked wire code, wire type, length and quantity for each wire and receive a quotation for your order.",
  path: "/laser-marked-wire-order-form",
});

export default function LaserWirePage() {
  return (
    <>
      <Hero
        compact
        image="/images/laser-wire/laser-marked-wire.jpg"
        imageAlt="Laser-marked wire with printed wire identification"
        words={["Laser", "Marked", "Wire", "Order", "Form"]}
        sub="Request a quotation for laser-marked wire. Tell us what to print, on which wire type, the length and quantity, and we'll come back to you with pricing."
      />

      {/* Instructions */}
      <section className="py-16">
        <div className="wrap grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading
              eyebrow="How ordering works"
              title="Request a Quote for Marked Wire"
            />
            <Reveal delay={0.1}>
              <ol className="mt-7 space-y-4">
                {[
                  "For each marked wire, enter the marked wire code (the text to print), wire type, length and quantity.",
                  "Submit the online form below (or save the downloadable order form).",
                  `Downloaded forms are emailed to ${site.laserWireEmail}.`,
                  "You will be contacted with a quote for your order.",
                ].map((step, i) => (
                  <li key={step} className="flex gap-4 text-sm leading-relaxed">
                    <span className="font-heading text-lg font-extrabold text-aerored">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-l-4 border-aerored pl-4 text-sm leading-relaxed">
                Submitting an order form is a <strong>request for a
                quotation</strong>. It is not an immediate purchase or a
                confirmed order.
              </p>
              <p className="mt-4 text-sm leading-relaxed">
                New to laser wire marking?{" "}
                <Link
                  href="/services/laser-wire-marking"
                  className="font-semibold text-aerored underline underline-offset-2"
                >
                  Read about the service
                </Link>{" "}
                before you order.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <a
                  href="/files/IAS-LASER-WIRE-MARKING-ORDER-TEMPLATE.xlsx"
                  className="btn-red"
                  download
                >
                  Download the Order Form (Excel)
                </a>
                <a
                  href={`mailto:${site.laserWireEmail}`}
                  className="text-sm font-semibold text-aerored underline underline-offset-2"
                >
                  Email completed forms to {site.laserWireEmail}
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="relative mt-10 aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/laser-wire/wire-2.jpg"
                  alt="Close-up of laser-marked wire identification text"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="border border-silver/50 bg-white p-6 sm:p-9">
            <LaserWireOrderForm />
          </Reveal>
        </div>
      </section>

      {/* Wire reference table */}
      <section className="border-t border-silver/40 bg-white py-16">
        <div className="wrap">
          <SectionHeading
            eyebrow="Reference"
            title="Wire Types"
            intro="Wire types, descriptions and MIL-SPEC references from the IAS laser wire order form. Choose one per line in the Wire type field. MIL-SPEC availability is stock dependent."
          />
          <Reveal delay={0.1}>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-jet text-white">
                    <th className="p-3 font-heading text-xs font-bold uppercase tracking-[0.14em]">
                      Wire Type
                    </th>
                    <th className="p-3 font-heading text-xs font-bold uppercase tracking-[0.14em]">
                      Description
                    </th>
                    <th className="p-3 font-heading text-xs font-bold uppercase tracking-[0.14em]">
                      MIL-SPEC (Stock Dependent)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {wireCatalog.map((cat) => (
                    <Fragment key={cat.category}>
                      <tr className="bg-silver/30">
                        <th
                          colSpan={3}
                          className="p-3 font-heading text-xs font-extrabold uppercase tracking-[0.14em] text-jet"
                        >
                          {cat.category}
                        </th>
                      </tr>
                      {cat.wires.map((w) => (
                        <tr key={`${cat.category}-${w.code}`} className="border-b border-silver/40">
                          <td className="p-3 font-semibold text-jet">{w.code}</td>
                          <td className="p-3">{w.description}</td>
                          <td className="p-3">{w.milSpec ?? "-"}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 max-w-3xl text-xs leading-relaxed text-charcoal/70">
              Note from the order form: {HEAVY_GAUGE_NOTE} (applies to the
              heavy-gauge cable types listed above).
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
