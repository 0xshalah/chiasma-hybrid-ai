/**
 * DemoWalkthrough — choreographed fake cursor walkthrough.
 *
 * Pattern: Linear/Milanote/Stripe hero demo (gsap-choreography repo).
 * A scripted cursor animates through the product, performing actions
 * that demonstrate value without requiring user input.
 *
 * Timeline: 4 scenes × ~5s each = ~20s total, then loops.
 *
 * Scene 0: Cursor moves to "Inject Secret Key" → clicks → PII appears
 * Scene 1: Cursor moves to "Simulate Coding Block" → clicks → friction rises
 * Scene 2: Cursor moves to Alt+Shift+C → clicks → Cloud routing
 * Scene 3: Cursor moves to "Capture Voice" → clicks → node synced
 *
 * Key rules (gsap-choreography):
 * - ONE GSAP timeline as central authority — no independent tweens
 * - DOM-based measure() — never hardcode coordinates
 * - Cursor squeeze (scale 0.88) + ripple on click
 * - prefers-reduced-motion: static demo, no cursor
 */

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useSandbox } from "./sandbox-context.tsx";

interface DemoWalkthroughProps {
  /** Ref to the sandbox container — cursor is positioned relative to it */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Button refs by action name — measured at runtime, never hardcoded */
  buttonRefs: {
    injectSecret: React.RefObject<HTMLButtonElement | null>;
    simulateCoding: React.RefObject<HTMLButtonElement | null>;
    manualTrigger: React.RefObject<HTMLButtonElement | null>;
    captureVoice: React.RefObject<HTMLButtonElement | null>;
  };
  active: boolean;
  onStop: () => void;
}

export function DemoWalkthrough({
  containerRef,
  buttonRefs,
  active,
  onStop,
}: DemoWalkthroughProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { dispatch } = useSandbox();

  /** Get button position relative to containerRef */
  const measure = useCallback(
    (btnRef: React.RefObject<HTMLElement | null>) => {
      const btn = btnRef.current;
      const container = containerRef.current;
      if (!btn || !container) return { x: 0, y: 0 };
      const bRect = btn.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      return {
        x: bRect.left - cRect.left + bRect.width / 2,
        y: bRect.top - cRect.top + bRect.height / 2,
      };
    },
    [containerRef],
  );

  const doClick = useCallback(
    (tl: gsap.core.Timeline, btnRef: React.RefObject<HTMLElement | null>, action: () => void) => {
      const cursor = cursorRef.current;
      const ripple = rippleRef.current;
      if (!cursor || !ripple) return;

      // Move to button
      tl.add(() => {
        const pos = measure(btnRef);
        gsap.to(cursor, { x: pos.x - 10, y: pos.y - 10, duration: 0.7, ease: "power3.inOut" });
        gsap.to(ripple, { x: pos.x - 20, y: pos.y - 20 });
      });

      tl.to({}, { duration: 0.75 }); // wait for move

      // Hover glow
      tl.to(cursor, { scale: 1.3, duration: 0.15, ease: "power2.out" });

      // Squeeze + ripple + action
      tl.to(cursor, { scale: 0.88, duration: 0.08, ease: "power2.in" })
        .call(() => action())
        .to(cursor, { scale: 1, duration: 0.3, ease: "back.out(2.2)" }, "<+=0.08")
        .fromTo(
          ripple,
          { scale: 0, opacity: 0.6 },
          { scale: 2.5, opacity: 0, duration: 0.5, ease: "power2.out" },
          "<",
        );
    },
    [measure],
  );

  useEffect(() => {
    if (!active) {
      tlRef.current?.kill();
      gsap.set(cursorRef.current, { opacity: 0 });
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { opacity: 1, x: 20, y: 20 });

    const tl = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        dispatch({ type: "RESET_FRICTION" });
      },
    });
    tlRef.current = tl;

    // Scene 0: Inject Secret Key
    tl.to({}, { duration: 0.5 }); // brief pause at start
    doClick(tl, buttonRefs.injectSecret, () =>
      dispatch({ type: "INJECT_SECRET" }),
    );
    tl.to({}, { duration: 2.0 }); // let user see PII scrubbing

    // Scene 1: Simulate Coding Block
    doClick(tl, buttonRefs.simulateCoding, () =>
      dispatch({ type: "SIMULATE_CODING" }),
    );
    tl.to({}, { duration: 2.0 }); // let friction rise animate

    // Scene 2: Alt+Shift+C escalation
    doClick(tl, buttonRefs.manualTrigger, () =>
      dispatch({ type: "MANUAL_TRIGGER" }),
    );
    tl.to({}, { duration: 2.5 }); // show cloud routing

    // Scene 3: Capture Voice on Android
    doClick(tl, buttonRefs.captureVoice, () =>
      dispatch({ type: "CAPTURE_VOICE" }),
    );
    tl.to({}, { duration: 2.0 }); // show sync

    // End: fade cursor out briefly before loop
    tl.to(cursor, { opacity: 0, duration: 0.4 })
      .to({}, { duration: 0.5 })
      .to(cursor, { opacity: 1, duration: 0.3 });

    return () => {
      tl.kill();
    };
  }, [active, buttonRefs, dispatch, doClick]);

  return (
    <>
      {/* Fake cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 20,
          height: 20,
          pointerEvents: "none",
          zIndex: 50,
          opacity: 0,
          willChange: "transform",
        }}
      >
        {/* Arrow cursor SVG */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 2L9 18L12 11L19 8L2 2Z" fill="var(--c-ink)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Click ripple */}
      <div
        ref={rippleRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "2px solid var(--c-system2)",
          pointerEvents: "none",
          zIndex: 49,
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
