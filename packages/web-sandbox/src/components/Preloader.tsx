/**
 * Preloader — curtain reveal pattern from Awwwards SOTD 2024-2025.
 *
 * Pattern (DIV7NE portfolio, webpage-gpt, Salt & Pepper SOTD):
 *   1. Black panel covers full viewport
 *   2. Counter ticks 0 → 100 via GSAP
 *   3. Clip-path wipe UP reveals the site behind
 *   4. Component unmounts; never shown again
 *
 * Uses CHIASMA tokens: Instrument Serif for counter, Sage Olive accent.
 * prefers-reduced-motion: skip entirely, call onDone immediately.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onDone: () => void;
}

export function Preloader({ onDone }: PreloaderProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      onDone();
      return;
    }

    const panel = panelRef.current;
    const counter = counterRef.current;
    const line = lineRef.current;
    const word = wordRef.current;

    if (!panel || !counter || !line || !word) return;

    // Prevent scroll during preloader
    document.body.style.overflow = "hidden";

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onDone();
      },
    });

    // Phase 1: count 0 → 100 while line grows
    tl.to(obj, {
      val: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        counter.textContent = String(Math.round(obj.val)).padStart(3, "0");
      },
    })
      .to(
        line,
        { scaleX: 1, duration: 1.6, ease: "power2.inOut" },
        "<"
      )
      .to(
        word,
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=1.0"
      )

      // Phase 2: short hold at 100
      .to({}, { duration: 0.25 })

      // Phase 3: curtain wipes up — clip-path from "inset(0% 0% 0% 0%)" to "inset(100% 0% 0% 0%)"
      .to(panel, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.9,
        ease: "power4.inOut",
      })
      // counter fades during wipe
      .to(
        [counter, line, word],
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        "<"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onDone]);

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "var(--c-ink)", // Charcoal #161615
        clipPath: "inset(0% 0% 0% 0%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--sp-xl)",
        pointerEvents: "all",
      }}
    >
      {/* Brand name */}
      <div
        ref={wordRef}
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(28px, 6vw, 56px)",
          color: "var(--c-canvas)",
          letterSpacing: "-0.02em",
          opacity: 0,
          transform: "translateY(16px)",
        }}
      >
        CHIASMA
      </div>

      {/* Progress line */}
      <div
        style={{
          width: "min(320px, 60vw)",
          height: "1px",
          background: "rgba(246,244,240,0.15)",
          borderRadius: "var(--r-pill)",
          overflow: "hidden",
        }}
      >
        <div
          ref={lineRef}
          style={{
            height: "100%",
            width: "100%",
            background: "var(--c-system1)", // Sage Olive
            transformOrigin: "left",
            transform: "scaleX(0)",
            borderRadius: "var(--r-pill)",
          }}
        />
      </div>

      {/* Counter */}
      <span
        ref={counterRef}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-ui-sm)",
          color: "rgba(246,244,240,0.4)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.1em",
        }}
      >
        000
      </span>
    </div>
  );
}
