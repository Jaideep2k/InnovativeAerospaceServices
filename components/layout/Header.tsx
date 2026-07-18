"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site, nav } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Utility bar */}
      <div className="bg-jet text-white">
        <div className="wrap flex min-h-[40px] items-center justify-between gap-3 py-1 text-xs">
          <a
            href={site.phoneHref}
            className="flex min-h-[40px] items-center gap-2 font-heading font-bold tracking-wider hover:text-silver"
          >
            <span aria-hidden="true">☎</span> {site.phone}
          </a>
          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/aog"
              className="flex min-h-[40px] items-center bg-aerored px-4 font-heading font-bold uppercase tracking-[0.14em] text-white hover:bg-[#c4141b]"
            >
              AOG
            </Link>
            <Link
              href="/laser-marked-wire-order-form"
              className="hidden min-h-[40px] items-center px-2 font-heading font-bold uppercase tracking-[0.1em] hover:text-silver sm:flex"
            >
              Laser Marked Wire Order Form
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <Link href="/" aria-label="IAS Avionics — home" onClick={() => setOpen(false)}>
          <Image
            src="/brand/ias-logo.png"
            alt="Innovative Aerospace Services — Avionics, Rewire, Solutions. Since 2010."
            width={440}
            height={90}
            priority
            className="h-auto w-52 sm:w-64"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-heading text-sm font-bold uppercase tracking-[0.1em] transition-colors hover:text-aerored ${
                pathname === item.href ? "text-aerored" : "text-jet"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact#estimate" className="btn-red">
            Request an Estimate
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            className={`block h-0.5 w-6 bg-jet transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`block h-0.5 w-6 bg-jet ${open ? "opacity-0" : ""}`} />
          <span
            className={`block h-0.5 w-6 bg-jet transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-silver/40 bg-white pb-6 lg:hidden"
        >
          <div className="wrap flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`border-b border-silver/30 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.12em] ${
                  pathname === item.href ? "text-aerored" : "text-jet"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/laser-marked-wire-order-form"
              onClick={() => setOpen(false)}
              className="border-b border-silver/30 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.12em] text-jet"
            >
              Laser Marked Wire Order Form
            </Link>
            <Link
              href="/contact#estimate"
              onClick={() => setOpen(false)}
              className="btn-red mt-5"
            >
              Request an Estimate
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
