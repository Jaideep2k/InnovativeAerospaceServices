import Link from "next/link";
import Image from "next/image";
import { site, nav } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";

/**
 * Flat inventory of every page, for the footer link grid — the footer is where
 * the whole site should be reachable in one place, so nested nav groups are
 * expanded and de-duplicated here.
 */
const footerLinks: { href: string; label: string }[] = (() => {
  const out: { href: string; label: string }[] = [];
  const seen = new Set<string>();
  const push = (href: string, label: string) => {
    if (seen.has(href)) return;
    seen.add(href);
    out.push({ href, label });
  };
  for (const item of nav) {
    if (item.children) item.children.forEach((c) => push(c.href, c.label));
    else push(item.href, item.label);
  }
  push("/laser-marked-wire-order-form", "Laser Marked Wire Order Form");
  return out;
})();

export default function Footer() {
  return (
    <footer className="relative bg-jet text-silver">
      {/* CTA band */}
      <div className="border-b border-white/10 bg-charcoal">
        <div className="wrap flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <Reveal>
            <p className="font-heading text-2xl font-extrabold uppercase leading-snug tracking-tight text-white sm:text-3xl">
              Let&rsquo;s Talk About Your Aircraft
            </p>
            <p className="mt-2 max-w-xl text-sm text-silver">
              Talk to us about avionics, rewiring, harnesses, recertifications
              or an upcoming project — estimates are discussed before work
              begins.
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
      </div>

      {/* Main footer */}
      <div className="relative">
        <Image
          src="/images/site/aviation-wiring-footer.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.14]"
        />
        <div className="wrap relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/brand/ias-logo.png"
              alt="Innovative Aerospace Services logo"
              width={440}
              height={90}
              className="h-auto w-56 brightness-0 invert"
            />
            <p className="mt-4 text-sm leading-relaxed">
              Specialized avionics and electrical services for rotary-wing and
              fixed-wing aircraft. Established {site.established}.
            </p>
            <p className="mt-6 text-xs leading-relaxed text-silver/90">
              Transport Canada AMO 85-17 · EASA certified · FAA certified ·
              Authorized Garmin Aviation dealer · AEA member since 2017
            </p>
          </div>

          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-white">
              Visit
            </h2>
            <address className="mt-4 text-sm not-italic leading-relaxed">
              {site.legalName}
              <br />
              {site.address.facility}
              <br />
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region} {site.address.postal}
              <br />
              {site.address.country}
            </address>
          </div>

          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-white">
              Hours
            </h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span className="block font-semibold text-white">{h.days}</span>
                  {h.hours}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-white">
              Contact
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={site.phoneHref} className="hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li>
                AOG:{" "}
                <a
                  href={`mailto:${site.aogEmail}`}
                  className="font-semibold text-aerored hover:text-white"
                >
                  {site.aogEmail}
                </a>
              </li>
              <li>
                Laser marked wire:{" "}
                <a href={`mailto:${site.laserWireEmail}`} className="hover:text-white">
                  {site.laserWireEmail}
                </a>
              </li>
            </ul>
            <nav aria-label="Footer" className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2">
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="wrap flex flex-col items-start justify-between gap-2 py-5 text-xs sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} {site.legalName} All rights reserved.
            </p>
            <p className="font-heading font-bold uppercase tracking-[0.18em] text-white">
              Avionics <span className="text-aerored">•</span> Rewire{" "}
              <span className="text-aerored">•</span> Solutions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
