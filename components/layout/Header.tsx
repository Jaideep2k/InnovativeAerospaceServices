"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site, nav, type NavItem } from "@/lib/site";

/** True when the current path is this item or anything beneath it. */
function isActive(item: NavItem, pathname: string): boolean {
  if (item.href === "/") return pathname === "/";
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return Boolean(item.children?.some((c) => c.href === pathname));
}

function DesktopItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = isActive(item, pathname);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={`font-heading text-sm font-bold uppercase tracking-[0.1em] transition-colors hover:text-aerored ${
          active ? "text-aerored" : "text-jet"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  // Small grace period so the pointer can cross the gap into the panel.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      // Deliberately no onFocus-to-open: it would fight the button's toggle,
      // so keyboard users pressing Enter would close what focus just opened.
      // Pointer users get hover; keyboard users use the button. Focus leaving
      // the group still closes the panel.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 py-2 font-heading text-sm font-bold uppercase tracking-[0.1em] transition-colors hover:text-aerored ${
          active ? "text-aerored" : "text-jet"
        }`}
      >
        {item.label}
        <span
          aria-hidden="true"
          className={`mt-0.5 h-1.5 w-1.5 rotate-45 border-b-2 border-r-2 border-current transition-transform duration-200 ${
            open ? "-translate-y-0.5 -rotate-[135deg]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 min-w-[17rem] border-t-4 border-aerored bg-white pb-2 pt-1 shadow-xl">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className={`block px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-silver/20 hover:text-aerored ${
                pathname === child.href ? "text-aerored" : "text-jet"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const active = isActive(item, pathname);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`border-b border-silver/30 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.12em] ${
          active ? "text-aerored" : "text-jet"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-silver/30">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between py-3.5 font-heading text-sm font-bold uppercase tracking-[0.12em] ${
          active ? "text-aerored" : "text-jet"
        }`}
      >
        {item.label}
        <span aria-hidden="true" className="relative mr-1 h-3.5 w-3.5">
          <span className="absolute left-0 top-1/2 h-0.5 w-3.5 -translate-y-1/2 bg-aerored" />
          <span
            className={`absolute left-1/2 top-0 h-3.5 w-0.5 -translate-x-1/2 bg-aerored transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          />
        </span>
      </button>
      {open && (
        <div className="pb-2">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className={`block border-l-2 border-silver/40 py-2.5 pl-4 text-sm font-semibold ${
                pathname === child.href ? "text-aerored" : "text-charcoal"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
            <DesktopItem key={item.label} item={item} pathname={pathname} />
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
          className="max-h-[75vh] overflow-y-auto border-t border-silver/40 bg-white pb-6 lg:hidden"
        >
          <div className="wrap flex flex-col">
            {nav.map((item) => (
              <MobileItem
                key={item.label}
                item={item}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
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
