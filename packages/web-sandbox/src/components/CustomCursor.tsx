/**
 * CustomCursor — Awwwards-pattern cursor with glow trail.
 *
 * Three layers (DIV7NE portfolio pattern + velocity glow):
 *   1. Inner dot  — follows mouse exactly (native-latency feel)
 *   2. Outer ring — lags behind via gsap.quickTo (fabric stretch)
 *   3. Glow halo  — velocity-reactive: fast moves = bigger glow
 *      Uses canvas for the trail to avoid DOM thrashing.
 *
 * Hover over interactive elements: ring expands + glow shifts color.
 * prefers-reduced-motion / touch device: no cursor shown.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (prefersReduced || isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    document.documentElement.style.cursor = "none";

    // ── Position tracking ──
    let mouseX = -200;
    let mouseY = -200;
    let prevX = -200;
    let prevY = -200;

    // ── Dot: instant ──
    const moveDot = (x: number, y: number) => {
      dot.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
    };

    // ── Ring: quickTo lag ──
    const quickX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const quickY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    // ── Glow: slower lag + velocity size ──
    const glowQuickX = gsap.quickTo(glow, "x", { duration: 0.7, ease: "power2.out" });
    const glowQuickY = gsap.quickTo(glow, "y", { duration: 0.7, ease: "power2.out" });

    let velocityScale = 1;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      moveDot(mouseX, mouseY);
      quickX(mouseX - 16);
      quickY(mouseY - 16);
      glowQuickX(mouseX - 48);
      glowQuickY(mouseY - 48);

      // Velocity → glow size
      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      velocityScale = 1 + Math.min(speed * 0.04, 2.5);
      prevX = mouseX;
      prevY = mouseY;
    };
    window.addEventListener("mousemove", onMove);

    // ── Animate glow scale with velocity ──
    const glowTicker = () => {
      velocityScale += (1 - velocityScale) * 0.08;
      gsap.set(glow, { scale: velocityScale });
    };
    gsap.ticker.add(glowTicker);

    // ── Hover: interactive elements ──
    let isHovering = false;
    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role=button], input, textarea, select")) {
        if (!isHovering) {
          isHovering = true;
          gsap.to(ring, { scale: 2.2, opacity: 0.4, duration: 0.25, ease: "power2.out" });
          gsap.to(glow, {
            "--glow-color": "var(--c-system2-soft)",
            opacity: 0.7,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }
    };
    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role=button], input, textarea, select")) {
        isHovering = false;
        gsap.to(ring, { scale: 1, opacity: 0.65, duration: 0.25, ease: "power2.out" });
        gsap.to(glow, { opacity: 0.35, duration: 0.3, ease: "power2.out" });
      }
    };
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    // ── Click pulse ──
    const onClick = () => {
      gsap.timeline()
        .to(ring, { scale: 0.65, duration: 0.08, ease: "power3.in" })
        .to(ring, { scale: 1, duration: 0.45, ease: "elastic.out(1, 0.4)" });
      gsap.to(glow, { scale: 2.5, opacity: 0, duration: 0.4, ease: "power3.out",
        onComplete: () => gsap.set(glow, { scale: 1, opacity: 0.35 }),
      });
    };
    window.addEventListener("click", onClick);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("click", onClick);
      gsap.ticker.remove(glowTicker);
    };
  }, []);

  return (
    <>
      {/* Glow halo — velocity reactive */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--c-system1-soft) 0%, transparent 70%)",
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 9997,
          mixBlendMode: "multiply",
          willChange: "transform",
          filter: "blur(8px)",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid var(--c-system1)",
          opacity: 0.65,
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "multiply",
          willChange: "transform",
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--c-system2)",
          pointerEvents: "none",
          zIndex: 10000,
          willChange: "transform",
        }}
      />
    </>
  );
}
