"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import Parallax from "@/components/motion/Parallax";

type HeroProps = {
  image: string;
  imageAlt: string;
  words: string[];
  tagline?: string;
  sub: string;
  children?: ReactNode; // CTA buttons
  compact?: boolean;
};

/**
 * Full-bleed hero with per-word mask reveal.
 * Mask spans carry leading ≥1.08 + pb/-mb 0.18em per stack.md descender rules.
 */
export default function Hero({
  image,
  imageAlt,
  words,
  tagline,
  sub,
  children,
  compact = false,
}: HeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const wordEls = root.querySelectorAll("[data-hero-word]");
    const rest = root.querySelectorAll("[data-hero-rest]");

    gsap.set(wordEls, { yPercent: 110 });
    gsap.set(rest, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(wordEls, {
      yPercent: 0,
      duration: 0.9,
      stagger: 0.09,
      ease: "power3.out",
    }).to(
      rest,
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" },
      "-=0.45"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className={`relative flex items-center overflow-hidden bg-jet ${
        compact ? "min-h-[52vh]" : "min-h-[86vh]"
      }`}
    >
      <Parallax className="absolute inset-0" drift={70}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover"
        />
      </Parallax>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-jet/90 via-jet/70 to-jet/30"
      />
      <div className="wrap relative py-24">
        <h1 className="h-display max-w-4xl text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
          {words.map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden pb-[0.18em] -mb-[0.18em] leading-[1.12]"
            >
              <span data-hero-word className="inline-block">
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h1>
        {tagline && (
          <p
            data-hero-rest
            className="mt-5 font-heading text-xl font-extrabold uppercase tracking-[0.08em] text-aerored sm:text-2xl"
          >
            {tagline}
          </p>
        )}
        <p
          data-hero-rest
          className="mt-6 max-w-2xl text-base leading-relaxed text-silver sm:text-lg"
        >
          {sub}
        </p>
        {children && (
          <div data-hero-rest className="mt-9 flex flex-wrap gap-4">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
