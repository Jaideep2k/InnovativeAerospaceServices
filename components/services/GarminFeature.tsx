import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

/** Garmin dealer feature, shown near the top of the avionics service page. */
export default function GarminFeature() {
  return (
    <section aria-label="Authorized Garmin dealer" className="border-b border-silver/40 py-16">
      <div className="wrap grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src="/images/garmin/garmin-flight-deck-keypad.jpg"
              alt="Pilot using a Garmin glass-cockpit flight deck and keypad"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <Image
              src="/images/home/GarminAuthorizedDealer_LOGO_1000.jpg"
              alt="Garmin Authorized Dealer"
              width={451}
              height={126}
              className="mb-8 h-12 w-auto"
            />
          </Reveal>
          <SectionHeading
            eyebrow="Authorized Garmin dealer"
            title="Kelowna's Only Garmin Dealer"
            intro="IAS is an authorized Garmin Aviation dealer and the only Garmin dealer in Kelowna. We supply, install and integrate Garmin avionics (from GPS navigation and flight displays to complete glass cockpits) for helicopters and fixed-wing aircraft, alongside systems from other leading manufacturers."
          />
          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-4">
            <Link href="/garmin-dealer" className="btn-red">
              Explore Garmin Solutions
            </Link>
            <a href="#design-consultation" className="btn-ghost-dark">
              Design Your Package
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
