/**
 * ScrollReveal — GSAP ScrollTrigger entrance for sections.
 * taste-skill: "one dealt moment, two on a long page"
 * gsap-scrolltrigger: batch reveal with stagger
 * hallmark: "transform and opacity only"
 */

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

interface ScrollRevealProps {
  children: React.ReactNode;
  selector?: string;
  stagger?: number;
}

export function ScrollReveal({ children, selector = "[data-reveal]", stagger = 0.12 }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = containerRef.current?.querySelectorAll(selector);
      if (!items || items.length === 0) return;

      // Respect prefers-reduced-motion: CSS guard doesn't reach JS-driven GSAP animations
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(items, { opacity: 0, y: 24 });

      ScrollTrigger.batch(items, {
        start: "top 85%",
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger,
            ease: "power3.out",
            overwrite: true,
          });
        },
        onLeaveBack: (batch) => {
          gsap.set(batch, { opacity: 0, y: 24, overwrite: true });
        },
      });
    },
    { scope: containerRef }
  );

  return <div ref={containerRef}>{children}</div>;
}
