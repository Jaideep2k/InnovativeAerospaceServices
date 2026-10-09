import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import HoverLift from "@/components/motion/HoverLift";
import { dealers, type Dealer } from "@/lib/dealers";

export const metadata: Metadata = pageMeta({
  title: "Our Dealers",
  description:
    "The avionics brands IAS Avionics is a dealer for in Kelowna, BC: Garmin (the only Garmin dealer in Kelowna), Avidyne, BendixKing, L3Harris, uAvionix, PS Engineering and more.",
  path: "/dealers",
});

const featured = dealers.find((d) => d.featured);
const grid = dealers.filter((d) => !d.featured);

const approach = [
  {
    title: "Supply",
    text: "Equipment from the manufacturers below, selected around your aircraft type, operating requirements and budget.",
  },
  {
    title: "Install",
    text: "Installed and integrated by our avionics and electrical technicians to manufacturer specifications and applicable regulatory requirements.",
  },
  {
    title: "Support",
    text: "Troubleshooting, repairs and technical support after the installation, at our Kelowna facility or at your location.",
  },
];

/*
 * Logos are shown at a roughly equal visual area rather than an equal height,
 * so a compact mark (AEM) and a long wordmark (Cobham) carry the same weight.
 * Values are CSS pixels; tiles narrower than this scale the logo down.
 */
const LOGO_AREA = 5000;
const LOGO_MAX_W = 176;
const LOGO_MAX_H = 56;

function logoDisplayWidth(width: number, height: number) {
  const ratio = width / height;
  return Math.round(
    Math.min(LOGO_MAX_W, LOGO_MAX_H * ratio, Math.sqrt(LOGO_AREA * ratio))
  );
}

function BrandTile({ dealer }: { dealer: Dealer }) {
  const displayWidth = dealer.logo
    ? logoDisplayWidth(dealer.logo.width, dealer.logo.height)
    : 0;

  return (
    <HoverLift className="group h-full">
      <figure className="relative flex h-full flex-col border border-silver/50 bg-white transition-colors duration-300 group-hover:border-silver">
        <span
          aria-hidden="true"
          className="absolute -inset-x-px -top-px h-0.5 origin-left scale-x-0 bg-aerored transition-transform duration-300 group-hover:scale-x-100"
        />
        <div className="flex min-h-[112px] flex-1 items-center justify-center px-4 py-7 sm:min-h-[140px] sm:px-6 sm:py-9">
          {dealer.logo ? (
            <Image
              src={dealer.logo.src}
              alt={`${dealer.name} logo`}
              width={dealer.logo.width}
              height={dealer.logo.height}
              sizes={`${displayWidth}px`}
              style={{ width: displayWidth, height: "auto" }}
              className="max-w-full transition duration-300 group-hover:opacity-100 group-hover:brightness-100 group-hover:grayscale-0 [@media(hover:hover)]:opacity-80 [@media(hover:hover)]:brightness-[.55] [@media(hover:hover)]:grayscale"
            />
          ) : (
            <span
              aria-hidden="true"
              className="text-center font-heading text-lg font-extrabold uppercase leading-none tracking-[0.16em] text-charcoal transition-colors duration-300 group-hover:text-jet sm:text-2xl md:text-lg lg:text-2xl"
            >
              {dealer.name}
            </span>
          )}
        </div>
        <figcaption className="border-t border-silver/40 px-3 py-3 text-center">
          <span className="block font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-jet">
            {dealer.name}
          </span>
          {dealer.note && (
            <span className="mt-0.5 block text-[11px] leading-snug text-charcoal/70">
              {dealer.note}
            </span>
          )}
        </figcaption>
      </figure>
    </HoverLift>
  );
}

export default function DealersPage() {
  return (
    <>
      <Hero
        compact
        image="/images/home/Garmin-GR500.jpg"
        imageAlt="Garmin avionics display installed in an aircraft instrument panel"
        words={["Our", "Dealers"]}
        sub="Avionics and aircraft equipment from leading manufacturers, supplied, installed and supported by IAS at Kelowna International Airport."
      >
        <Link href="/contact#estimate" className="btn-red">
          Ask About a Brand
        </Link>
        <a href="#brands" className="btn-ghost-light">
          View All Dealers
        </a>
      </Hero>

      {/* Intro */}
      <section className="py-16">
        <div className="wrap grid items-start gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Equipment sales & installation"
            title="Leading Manufacturers, Properly Integrated"
            intro="IAS supplies, installs and supports equipment from leading avionics manufacturers. Whether you are replacing a single unit or planning a complete panel upgrade, we help you choose the right equipment for your helicopter or fixed-wing aircraft and integrate it properly with your existing systems."
          />
          <Stagger className="grid gap-6 lg:pt-2">
            {approach.map((step, i) => (
              <div key={step.title} className="flex gap-5 border-l-2 border-silver/60 pl-5">
                <span className="font-heading text-sm font-extrabold tracking-[0.12em] text-aerored">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-heading text-base font-extrabold uppercase tracking-[0.1em] text-jet">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Featured: Garmin */}
      {featured?.logo && (
        <section aria-label="Featured brand: Garmin" className="bg-charcoal py-16 text-white">
          <div className="wrap grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <Reveal>
              <div className="relative flex aspect-[16/10] flex-col items-center justify-center bg-white px-8">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-aerored" />
                <Image
                  src={featured.logo.src}
                  alt="Garmin logo"
                  width={featured.logo.width}
                  height={featured.logo.height}
                  sizes="(max-width: 1024px) 70vw, 320px"
                  className="h-auto w-3/4 max-w-[320px]"
                />
                <p className="mt-6 font-heading text-[11px] font-bold uppercase tracking-[0.24em] text-charcoal sm:text-xs">
                  Authorized Aviation Dealer
                </p>
              </div>
            </Reveal>
            <div>
              <SectionHeading
                eyebrow="Featured line"
                title="Authorized Garmin Aviation Dealer"
                intro="IAS is an authorized Garmin Aviation dealer and the only Garmin dealer in Kelowna. We supply, install and integrate Garmin avionics for helicopters and fixed-wing aircraft, from GPS navigation and flight displays to complete glass cockpits."
                dark
              />
              <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-4">
                <Link href={featured.page ?? "/garmin-dealer"} className="btn-red">
                  Explore Garmin at IAS
                </Link>
                <Link href="/contact#estimate" className="btn-ghost-light">
                  Request a Consultation
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* Brand grid */}
      <section id="brands" className="scroll-mt-28 py-20">
        <div className="wrap">
          <SectionHeading
            eyebrow="Product lines"
            title="Manufacturers We Supply & Install"
            intro="Alongside Garmin, IAS is a dealer for the avionics, communications, audio, instrument and safety equipment manufacturers below."
          />
          <Stagger selector=":scope > ul > li" y={20} stagger={0.035} className="mt-12">
            <ul role="list" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {grid.map((dealer) => (
                <li key={dealer.slug}>
                  <BrandTile dealer={dealer} />
                </li>
              ))}
            </ul>
          </Stagger>
          <p className="mt-6 text-xs leading-relaxed text-charcoal/70">
            Brand names and logos are trademarks of their respective owners and
            are shown to identify the equipment lines available through IAS.
          </p>

          {/* CTA */}
          <Reveal className="mt-14">
            <div className="flex flex-col items-start gap-6 border-l-4 border-aerored bg-jet p-8 text-white sm:p-10 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow mb-3">Not listed here?</p>
                <h2 className="h-display text-2xl text-white sm:text-3xl">
                  Looking for a specific brand or part?
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-silver">
                  Ask us. Tell us about your aircraft and the equipment or part
                  number you need, and our team will follow up.
                </p>
              </div>
              <Link href="/contact#estimate" className="btn-red shrink-0">
                Ask Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <AogBand />
    </>
  );
}
