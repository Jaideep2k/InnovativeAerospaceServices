import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";

type ServiceBandProps = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  items?: string[];
  benefits?: string[];
  benefitsTitle?: string;
  note?: string;
  image?: string;
  imageAlt?: string;
  cta?: string;
  ctaHref?: string;
  flip?: boolean;
  dark?: boolean;
};

export default function ServiceBand({
  id,
  eyebrow,
  title,
  intro,
  items,
  benefits,
  benefitsTitle = "Benefits",
  note,
  image,
  imageAlt,
  cta,
  ctaHref,
  flip = false,
  dark = false,
}: ServiceBandProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 py-16 ${dark ? "bg-charcoal text-white" : ""}`}
    >
      <div
        className={`wrap grid items-start gap-10 ${image ? "lg:grid-cols-2" : ""}`}
      >
        <div className={flip ? "lg:order-2" : ""}>
          <SectionHeading eyebrow={eyebrow} title={title} intro={intro} dark={dark} />
          {items && (
            <Stagger
              className="mt-7 grid gap-x-8 gap-y-2.5 sm:grid-cols-2"
              stagger={0.04}
              y={16}
            >
              {items.map((item) => (
                <p key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-aerored" />
                  <span>{item}</span>
                </p>
              ))}
            </Stagger>
          )}
          {benefits && (
            <Reveal delay={0.08}>
              <h3
                className={`mt-8 font-heading text-xs font-bold uppercase tracking-[0.18em] ${
                  dark ? "text-white" : "text-jet"
                }`}
              >
                {benefitsTitle}
              </h3>
              <Stagger
                className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2"
                stagger={0.04}
                y={16}
              >
                {benefits.map((benefit) => (
                  <p
                    key={benefit}
                    className={`flex items-start gap-2.5 text-sm leading-relaxed ${
                      dark ? "text-silver" : "text-charcoal/90"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 border border-aerored"
                    />
                    <span>{benefit}</span>
                  </p>
                ))}
              </Stagger>
            </Reveal>
          )}
          {note && (
            <Reveal delay={0.1}>
              <p
                className={`mt-6 border-l-4 border-aerored pl-4 text-sm leading-relaxed ${
                  dark ? "text-silver" : "text-charcoal/90"
                }`}
              >
                {note}
              </p>
            </Reveal>
          )}
          {cta && ctaHref && (
            <Reveal delay={0.15}>
              <Link href={ctaHref} className="btn-red mt-8">
                {cta}
              </Link>
            </Reveal>
          )}
        </div>
        {image && (
          <Reveal delay={0.15} className={flip ? "lg:order-1" : ""}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
