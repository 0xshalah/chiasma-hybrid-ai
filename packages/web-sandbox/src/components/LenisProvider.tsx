/**
 * LenisProvider — global smooth scroll via @studio-freight/lenis.
 *
 * Synced with GSAP ticker so ScrollTrigger and Lenis never desync.
 * This is the Trionn/studio-freight canonical pattern:
 *   gsap.ticker.add((time) => lenis.raf(time * 1000))
 *   gsap.ticker.lagSmoothing(0)  ← critical: prevents jumps on tab-switch
 *
 * Children render as normal; this component just wires the global RAF.
 */

import { useEffect, type ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    // Canonical GSAP sync: drives lenis via GSAP ticker, not requestAnimationFrame
    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0); // Prevent timestamp jumps on tab switch

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
