"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type StaggerProps = {
  children: ReactNode;
  /** CSS selector for the children to stagger; defaults to direct children */
  selector?: string;
  y?: number;
  stagger?: number;
  duration?: number;
  className?: string;
};

/** Staggered scroll reveal for lists/grids. Same four safety rules as Reveal. */
export default function Stagger({
  children,
  selector = ":scope > *",
  y = 28,
  stagger = 0.1,
  duration = 0.7,
  className,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const items = Array.from(el.querySelectorAll(selector));
    if (items.length === 0) return;

    gsap.set(items, { opacity: 0, y });

    const tween = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 86%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(items, { clearProps: "all" });
    };
  }, [selector, y, stagger, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
