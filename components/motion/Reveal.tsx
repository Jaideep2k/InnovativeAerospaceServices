"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  /** vertical travel in px */
  y?: number;
  delay?: number;
  duration?: number;
  className?: string;
};

/**
 * Scroll-triggered reveal. Per stack.md GSAP rules:
 * reduced-motion early return BEFORE any gsap.set, synchronous hidden state
 * via gsap.set in a layout effect, then gsap.to (never fromTo).
 */
export default function Reveal({
  children,
  y = 32,
  delay = 0,
  duration = 0.8,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    gsap.set(el, { opacity: 0, y });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "all" });
    };
  }, [y, delay, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
