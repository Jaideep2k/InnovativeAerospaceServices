"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

/**
 * First-visit branded intro: a red flight path traces across a jet-black
 * screen (echoing the logo swoosh), the IAS lockup resolves on it, the
 * tagline stamps in, then the overlay lifts to reveal the page.
 * ~2.4s total · sessionStorage-gated · skipped entirely for reduced motion.
 */
export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(true);

  useIsomorphicLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Plays in full on every page load; reduced-motion users skip it.
    if (prefersReducedMotion()) {
      setActive(false);
      return;
    }

    const line = lineRef.current;
    const logo = logoRef.current;
    const tag = tagRef.current;

    gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(logo, { opacity: 0, y: 18 });
    gsap.set(tag, { opacity: 0, y: 12 });

    document.documentElement.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setActive(false);
      },
    });

    tl.to(line, { scaleX: 1, duration: 0.7, ease: "power3.out" }, 0.15)
      .to(logo, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.5)
      .to(tag, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.85)
      .to(
        overlay,
        { yPercent: -100, duration: 0.65, ease: "power3.inOut" },
        1.75
      );

    return () => {
      document.documentElement.style.overflow = "";
      tl.kill();
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-jet"
    >
      <div className="w-full max-w-md px-8">
        <div ref={logoRef} className="mb-6 flex justify-center">
          <Image
            src="/brand/ias-logo.png"
            alt=""
            width={440}
            height={90}
            priority
            className="h-auto w-72 brightness-0 invert sm:w-80"
          />
        </div>
        <div ref={lineRef} className="h-[3px] w-full bg-aerored" />
        <p
          ref={tagRef}
          className="mt-5 text-center font-heading text-xs font-bold uppercase tracking-[0.3em] text-silver"
        >
          Quality. Because it matters.
        </p>
      </div>
    </div>
  );
}
