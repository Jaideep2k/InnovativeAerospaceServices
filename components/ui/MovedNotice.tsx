"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { site, directionsHref } from "@/lib/site";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

/** Tied to this move, so a future move can show its own notice. */
const STORAGE_KEY = `ias:moved-notice:${site.moveNotice.until}`;
/** The Preloader intro runs ~2.4s on every load; open just after it lifts. */
const DELAY_MS = 2600;
/** Reduced-motion visitors skip the Preloader. */
const DELAY_REDUCED_MS = 500;
/** Lock class on <html>: separate from the Preloader's inline overflow lock. */
const LOCK_CLASS = "overflow-hidden";

function alreadySeen(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false; // storage blocked: treat as a first visit
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // storage blocked: the notice may show again on a later visit
  }
}

function expired(): boolean {
  return Date.now() > new Date(`${site.moveNotice.until}T23:59:59`).getTime();
}

/**
 * "We've moved" pop-up. Shown once per visitor, after the intro, until
 * site.moveNotice.until; after that date it never renders, so it retires
 * itself without anyone having to remember to take it down.
 */
export default function MovedNotice() {
  const [open, setOpen] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const gotItRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const titleId = useId();
  const descId = useId();

  // Schedule. The timer only starts while the tab is visible: in a background
  // tab the Preloader's animation is paused, so a running timer would open the
  // notice underneath it.
  useEffect(() => {
    if (expired() || alreadySeen()) return;
    const delay = prefersReducedMotion() ? DELAY_REDUCED_MS : DELAY_MS;
    let timer: number | undefined;

    const start = () => {
      timer = window.setTimeout(() => {
        markSeen();
        setOpen(true);
      }, delay);
    };
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", onVisible);
      start();
    };

    if (document.visibilityState === "visible") start();
    else document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const close = useCallback(() => {
    if (closingRef.current) return;
    const card = cardRef.current;
    const backdrop = backdropRef.current;
    const done = () => {
      closingRef.current = false;
      setOpen(false);
    };
    if (prefersReducedMotion() || !card || !backdrop) {
      done();
      return;
    }
    closingRef.current = true;
    gsap
      .timeline({ onComplete: done })
      .to(card, { opacity: 0, y: 12, duration: 0.2, ease: "power2.in" })
      .to(backdrop, { opacity: 0, duration: 0.2, ease: "power1.in" }, 0.05);
  }, []);

  // While open: entrance, focus in/out, scroll lock, Esc and focus trap.
  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const card = cardRef.current;
    const backdrop = backdropRef.current;
    const root = document.documentElement;
    const returnFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Scroll lock, padding the scrollbar's width so the page doesn't shift.
    const scrollbar = window.innerWidth - root.clientWidth;
    root.classList.add(LOCK_CLASS);
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    gotItRef.current?.focus({ preventScroll: true });

    let tl: gsap.core.Timeline | undefined;
    if (card && backdrop && !prefersReducedMotion()) {
      gsap.set(backdrop, { opacity: 0 });
      gsap.set(card, { opacity: 0, y: 24 });
      tl = gsap
        .timeline()
        .to(backdrop, { opacity: 1, duration: 0.3, ease: "power1.out" })
        .to(card, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.08);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !card) return;
      const focusables = Array.from(
        card.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (!card.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      tl?.kill();
      root.classList.remove(LOCK_CLASS);
      document.body.style.paddingRight = "";
      if (returnFocus && document.contains(returnFocus)) {
        returnFocus.focus({ preventScroll: true });
      }
    };
  }, [open, close]);

  if (!open) return null;

  const { street, city, region, postal } = site.address;

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center p-4 sm:items-center">
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={close}
        className="absolute inset-0 bg-jet/60"
      />
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md border-t-4 border-aerored bg-white p-7 shadow-2xl sm:p-9"
      >
        <p className="eyebrow">We&rsquo;ve moved</p>
        <h2 id={titleId} className="h-display mt-3 text-balance text-2xl text-jet sm:text-3xl">
          New Address, Same Team
        </h2>
        <p id={descId} className="mt-4 text-sm leading-relaxed sm:text-base">
          IAS has moved from {site.moveNotice.from} to{" "}
          <strong className="font-semibold text-jet">
            <span className="whitespace-nowrap">{street}</span>, {city}, {region}{" "}
            <span className="whitespace-nowrap">{postal}</span>
          </strong>
          . Our phone number hasn&rsquo;t changed:{" "}
          <a href={site.phoneHref} className="font-semibold text-aerored hover:underline">
            {site.phone}
          </a>
          .
        </p>
        <div className="mt-7 grid gap-3 sm:flex">
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="btn-red"
          >
            Get Directions
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button ref={gotItRef} type="button" onClick={close} className="btn-ghost-dark">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
