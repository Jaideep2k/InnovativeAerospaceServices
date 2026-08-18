import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";

export const metadata: Metadata = pageMeta({
  title: "Projects",
  description:
    "IAS Avionics project work, including a Bell 212 complete rewire. Projects are continually in progress at our Kelowna facility.",
  path: "/projects",
});

const gallery = [
  {
    src: "/images/projects/212-DEC-A2.jpg",
    alt: "Bell 212 rewire project — wiring work in progress at IAS Avionics",
  },
  {
    src: "/images/projects/212-MAR-B2-1.jpg",
    alt: "Bell 212 rewire project — harness routing and panel work",
  },
  {
    src: "/images/projects/ias-avionics-212-MAY-A1-1.jpg",
    alt: "Bell 212 rewire project — avionics installation progress",
  },
  {
    src: "/images/projects/laser-marked-wire.jpg",
    alt: "Laser-marked aircraft wire prepared for a rewire project",
  },
  {
    src: "/images/projects/project-placement-3-1.jpg",
    alt: "Aircraft project work at the IAS Avionics facility",
  },
  {
    src: "/images/projects/Seaplane-over-Como-Lake.jpeg",
    alt: "Seaplane in flight over a lake",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Hero
        compact
        image="/images/home/Innovative-Aerospace-rewire-projects.jpg"
        imageAlt="Aircraft rewiring project underway at IAS Avionics"
        words={["Projects", "in", "Progress"]}
        sub="From light general-aviation aircraft to complete medium- and heavy-helicopter rewires — projects are continually in progress at our Kelowna facility."
      >
        <Link href="/contact#estimate" className="btn-red">
          Discuss Your Project
        </Link>
      </Hero>

      {/* Featured project */}
      <section className="py-20">
        <div className="wrap">
          <SectionHeading
            eyebrow="Featured project"
            title="Bell 212 Complete Rewire"
            intro="A complete rewire of a Bell 212 — replacing aircraft wiring end to end, with laser-marked wire, new harness construction and supporting documentation. The photographs below are from this project."
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((img) => (
              <div key={img.src} className="relative aspect-[4/3] overflow-hidden bg-jet">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Experience */}
      <section className="bg-charcoal py-20 text-white">
        <div className="wrap">
          <SectionHeading
            eyebrow="Project experience"
            title="Rewire & Retrofit Experience"
            intro="Major rewire and retrofit projects our team has worked on include:"
            dark
          />
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              "Bell 212 rewire and retrofit",
              "Bell 412 rewire and retrofit",
              "AS332 helicopter rewire and retrofit",
            ].map((p) => (
              <div key={p} className="border border-white/20 p-6">
                <span className="red-rule" />
                <p className="mt-4 font-heading text-lg font-extrabold uppercase tracking-tight text-white">
                  {p}
                </p>
              </div>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <p className="max-w-2xl text-sm leading-relaxed text-silver">
              Aircraft our team has experience with also include the Pilatus
              PC-12 and de Havilland Beaver. This is not a complete list — if
              you don&rsquo;t see your aircraft here, ask us.
            </p>
            <Link href="/contact" className="btn-red mt-6">
              Ask About Your Aircraft
            </Link>
          </Reveal>
        </div>
      </section>

      <AogBand />
    </>
  );
}
