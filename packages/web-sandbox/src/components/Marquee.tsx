/**
 * Marquee — velocity-reactive ticker belt.
 *
 * Pattern: DIV7NE portfolio (Awwwards nominee), Studio Freight examples.
 * Speed reacts to scroll velocity: fast scroll → belt accelerates.
 * Direction: left by default.
 *
 * Renders two copies of the items list side by side so the loop is seamless.
 * prefers-reduced-motion: static (no movement).
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

const ITEMS = [
  "On-Device AI",
  "·",
  "PII Scrubbing",
  "·",
  "Zero Tokens Wasted",
  "·",
  "Gemini Nano 4",
  "·",
  "Corpus Callosum",
  "·",
  "Friction Routing",
  "·",
  "100% Private",
  "·",
];

interface MarqueeProps {
  speed?: number;   // base px/s, default 60
  gap?: number;     // gap between items in px, default 32
}

export function Marquee({ speed = 60, gap = 48 }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const list = listRef.current;
    if (!list) return;

    const listW = list.offsetWidth;
    if (listW === 0) return;

    // Start offset: 0 → animate to -listW, then reset
    let xPos = 0;
    let lastScrollY = window.scrollY;
    let velocity = 0;
    let velocityTarget = 0;

    const onScroll = () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      velocityTarget = delta * 0.8;  // map scroll delta to belt speed boost
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const ticker = () => {
      velocity += (velocityTarget - velocity) * 0.1;
      velocityTarget *= 0.9;  // decay

      const spd = speed / 60 + velocity * 0.5;  // pixels per frame
      xPos -= spd;
      if (xPos < -listW) xPos += listW;
      if (list) list.style.transform = `translateX(${xPos}px)`;
    };
    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      style={{
        overflow: "hidden",
        padding: "var(--sp-lg) 0",
        borderTop: "1px solid var(--c-hairline)",
        borderBottom: "1px solid var(--c-hairline)",
        background: "var(--c-canvas)",
        userSelect: "none",
      }}
    >
      <div
        ref={listRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: `${gap}px`,
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {/* Two copies for seamless loop */}
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: item === "·" ? "var(--font-serif)" : "var(--font-sans)",
              fontSize: item === "·" ? "20px" : "var(--fs-ui-sm)",
              fontWeight: item === "·" ? 400 : 600,
              color: item === "·" ? "var(--c-system1)" : "var(--c-ink-muted)",
              letterSpacing: item === "·" ? "0" : "0.05em",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
