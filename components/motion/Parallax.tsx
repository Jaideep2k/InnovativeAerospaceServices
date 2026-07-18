"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type ParallaxProps = {
  children: ReactNode;
  /** total vertical drift in px across the scroll range */
  drift?: number;
  className?: string;
};

/** Gentle vertical parallax on scroll. Transform-only; disabled for reduced motion. */
export default function Parallax({ children, drift = 60, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      el,
      { y: -drift / 2 },
      {
        y: drift / 2,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "all" });
    };
  }, [drift]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
