import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Hero from "@/components/sections/Hero";
import ServiceBand from "@/components/sections/ServiceBand";
import SectionHeading from "@/components/ui/SectionHeading";
import AogBand from "@/components/ui/AogBand";
import Reveal from "@/components/motion/Reveal";
import { pageMeta } from "@/lib/meta";
import { services, servicePages, getService, serviceHref } from "@/lib/services";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMeta({
    title: service.meta?.title ?? service.title,
    description: service.meta?.description ?? service.intro.slice(0, 155),
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  // Everything else, so each page feeds the others rather than dead-ending.
  const others = services.filter((s) => s.id !== service.id);

  return (
    <>
      <Hero
        compact
        image={service.card.image}
        imageAlt={service.card.alt}
        words={service.title.split(" ")}
        sub={service.card.text}
      >
        <Link href="/contact#estimate" className="btn-red">
          Request an Estimate
        </Link>
      </Hero>

      {/* Breadcrumb */}
      <div className="border-b border-silver/40">
        <nav aria-label="Breadcrumb" className="wrap py-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-charcoal/70">
            <li>
              <Link href="/services" className="hover:text-aerored">
                Services
              </Link>
            </li>
            <li aria-hidden="true" className="text-aerored">
              /
            </li>
            <li className="text-jet">{service.title}</li>
          </ol>
        </nav>
      </div>

      <ServiceBand
        id={service.id}
        eyebrow={service.eyebrow}
        title={service.title}
        intro={service.intro}
        items={service.items}
        benefits={service.benefits}
        benefitsTitle={service.benefitsTitle}
        note={service.note}
        image={service.image}
        imageAlt={service.imageAlt}
        cta={service.cta}
        ctaHref={service.ctaHref}
      />

      {/* Talk to us */}
      <section className="bg-charcoal py-14 text-white">
        <div className="wrap flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Reveal>
            <p className="font-heading text-2xl font-extrabold uppercase leading-snug tracking-tight text-white">
              Discuss your {service.title.toLowerCase()} project
            </p>
            <p className="mt-2 max-w-xl text-sm text-silver">
              Estimates and expected expenses are discussed before work begins.
            </p>
          </Reveal>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact#estimate" className="btn-red">
              Request an Estimate
            </Link>
            <a href={site.phoneHref} className="btn-ghost-light">
              Call {site.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="border-t border-silver/40 bg-white py-14">
        <div className="wrap">
          <SectionHeading eyebrow="Also from IAS" title="Other Services" />
          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {others.map((s) => (
              <Link
                key={s.id}
                href={serviceHref(s)}
                className="text-sm font-semibold text-aerored underline underline-offset-4 hover:text-jet"
              >
                {s.navLabel ?? s.title} →
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <AogBand />
    </>
  );
}
