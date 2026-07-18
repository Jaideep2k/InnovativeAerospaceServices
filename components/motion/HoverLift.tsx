"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

type HoverLiftProps = {
  children: ReactNode;
  className?: string;
};

/** Card hover lift (translateY −4px + shadow) driven by GSAP per stack.md. */
export default function HoverLift({ children, className }: HoverLiftProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const enter = () =>
      gsap.to(el, {
        y: -4,
        boxShadow: "0 18px 40px -18px rgba(13,13,13,0.35)",
        duration: 0.3,
        ease: "power2.out",
      });
    const leave = () =>
      gsap.to(el, {
        y: 0,
        boxShadow: "0 0 0 0 rgba(13,13,13,0)",
        duration: 0.3,
        ease: "power2.out",
      });

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("focusin", enter);
    el.addEventListener("focusout", leave);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("focusin", enter);
      el.removeEventListener("focusout", leave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "all" });
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
