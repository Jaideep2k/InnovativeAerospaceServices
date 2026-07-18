"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

/** Short fade/slide on route change per stack.md. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    gsap.set(el, { opacity: 0, y: 14 });
    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out",
    });

    return () => {
      tween.kill();
      gsap.set(el, { clearProps: "all" });
    };
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
