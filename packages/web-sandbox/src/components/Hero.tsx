/**
 * Hero — Awwwards 2025 full stack.
 *
 * Techniques:
 * 1. GPU particle field (HeroCanvas) — mouse repulsion, scroll dispersion
 * 2. SplitText CHAR reveal on page load (after preloader exits)
 * 3. Pinned scroll-story — hero pins for 3 viewports, scenes crossfade:
 *      Scene 0 "On-Device"  → Scene 1 "PII Scrubbed"  → Scene 2 "Cloud Wakes"
 * 4. MagneticBtn elastic on CTA
 *
 * hallmark: no eyebrow, no gradient, sentence case labels.
 * taste-skill: each scene IS the authored moment, no extra decorative motion.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { HeroCanvas } from "./HeroCanvas.tsx";
import { MagneticBtn } from "./MagneticBtn.tsx";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SCENES = [
  {
    pill: { label: "System 1 — On-Device", cls: "pill-system1" },
    headline: ["Split-Brain AI that keeps", "secrets on your device."],
    sub: "Gemini Nano 4 runs locally at $0 cost. It distills context and scrubs PII before anything ever touches the network.",
    metric: { value: "$0", label: "on-device cost" },
  },
  {
    pill: { label: "PII Scrubbing active", cls: "pill-stage-scrubbing" },
    headline: ["Nine pattern types.", "Zero secrets transmitted."],
    sub: "Stripe keys, AWS creds, emails, JWT, PEM — all replaced with [REDACTED_PII] inside the ≤300-token context packet.",
    metric: { value: "9", label: "PII pattern types" },
  },
  {
    pill: { label: "System 2 — Cloud", cls: "pill-system2" },
    headline: ["Cloud wakes only when", "friction exceeds 0.75."],
    sub: "When the Corpus Callosum detects a blocked coding flow, it escalates the scrubbed packet to Cloud Gemini for deep synthesis.",
    metric: { value: "0.75", label: "escalation threshold" },
  },
];

export function Hero() {
  const outerRef = useRef<HTMLDivElement>(null);  // pinned wrapper (tall)
  const stickyRef = useRef<HTMLDivElement>(null); // sticky inner (100vh)
  const pillRef = useRef<HTMLSpanElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const metricValueRef = useRef<HTMLSpanElement>(null);
  const metricLabelRef = useRef<HTMLSpanElement>(null);
  const scene0Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metricsBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const pill = pillRef.current;
    const h1 = h1Ref.current;
    const sub = subRef.current;
    const metricValue = metricValueRef.current;
    const metricLabel = metricLabelRef.current;
    const cta = ctaRef.current;
    const metricsBar = metricsBarRef.current;

    if (!outer || !sticky || !pill || !h1 || !sub || !cta || !metricsBar) return;

    // ── Phase A: initial entrance (after preloader) ──
    // Delay must be > App wrapper fade-in (400ms) to avoid headline staying invisible
    const ENTRANCE_DELAY = 0.5;

    if (prefersReduced) {
      gsap.set([pill, h1, sub, cta, metricsBar], { opacity: 1, y: 0, filter: "blur(0px)" });
    } else {
      // h1 starts visible at the DOM level (opacity: 1 in JSX) so it never gets
      // stuck invisible if the timeline fires while the App wrapper is still fading in.
      // SplitText sets chars to opacity:0 immediately, then animates them in.
      const split = new SplitText(h1, { type: "chars,words" });
      gsap.set(split.chars, { opacity: 0, y: 20, filter: "blur(6px)" });
      gsap.set([pill, sub, cta, metricsBar], { opacity: 0, y: 14 });

      const entrance = gsap.timeline({ delay: ENTRANCE_DELAY });
      entrance
        .to(pill, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
        .to(split.chars, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.65, ease: "power4.out",
          stagger: { each: 0.025, from: "start" },
        }, "-=0.3")
        .to(sub, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.25")
        .to(cta, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.2")
        .to(metricsBar, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.2");

      entrance.eventCallback("onComplete", () => split.revert());
    }

    if (prefersReduced) return;

    // ── Phase B: pinned scroll-story ──
    // The outer div is 400vh tall so scroll = 3 scenes × 100vh each.
    // We crossfade between SCENES[0] → SCENES[1] → SCENES[2].

    const updateScene = (scene: typeof SCENES[number], progress: number) => {
      // Crossfade: fade out old, type-swap, fade in new
      const tl = gsap.timeline();
      tl.to([pill, h1, sub, metricValue, metricLabel], {
        opacity: 0, y: -10, duration: 0.25, ease: "power2.in",
      })
        .call(() => {
          // Swap content
          pill.textContent = scene.pill.label;
          pill.className = `pill ${scene.pill.cls}`;
          h1.innerHTML = scene.headline.join("<br/>");
          sub.textContent = scene.sub;
          if (metricValue) metricValue.textContent = scene.metric.value;
          if (metricLabel) metricLabel.textContent = scene.metric.label;
        })
        .to([pill, h1, sub, metricValue, metricLabel], {
          opacity: 1, y: 0, duration: 0.35, ease: "power3.out",
        });
    };

    // Build 3-scene scrub via ScrollTrigger
    let lastScene = 0;

    const st = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "bottom bottom",
      pin: sticky,
      scrub: false,  // snap between scenes, not fluid scrub
      onUpdate: (self) => {
        // Divide 0–1 progress into 3 equal scenes
        const sceneIndex = Math.min(
          Math.floor(self.progress * 3),
          SCENES.length - 1
        );
        if (sceneIndex !== lastScene) {
          lastScene = sceneIndex;
          updateScene(SCENES[sceneIndex], self.progress);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    // outerRef: 300vh tall so scroll drives 3 scene changes
    <div ref={outerRef} style={{ height: "300vh" }}>
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          overflow: "hidden",
          background: "var(--c-canvas)",
          padding: "0 var(--sp-xl)",
        }}
      >
        {/* GPU particle field */}
        <HeroCanvas />

        {/* Content layer */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "740px",
            width: "100%",
          }}
        >
          {/* Scroll-hint — subtle, fades out after scene 0 */}
          <div
            ref={scene0Ref}
            style={{
              position: "absolute",
              bottom: "-120px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--sp-xs)",
              opacity: 0.4,
            }}
          >
            <span style={{ fontSize: "var(--fs-micro)", color: "var(--c-ink-muted)", letterSpacing: "0.1em" }}>
              SCROLL
            </span>
            <ScrollArrow />
          </div>

          {/* Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--sp-sm)",
              marginBottom: "var(--sp-xl)",
              opacity: 0,
            }}
          >
            <span ref={pillRef} className="pill pill-system1">
              System 1 — On-Device
            </span>
          </div>

          {/* Headline — opacity starts at 1 so it's never stuck invisible
               if GSAP timeline fires while App wrapper is still fading in.
               SplitText sets individual chars to opacity:0 immediately. */}
          <h1
            ref={h1Ref}
            className="display-hero"
            aria-label="Split-Brain AI that keeps secrets on your device."
          >
            Split-Brain AI that keeps
            <br />
            secrets on your device.
          </h1>

          {/* Sub */}
          <p
            ref={subRef}
            className="lead"
            style={{
              marginTop: "var(--sp-lg)",
              maxWidth: "580px",
              marginInline: "auto",
              opacity: 0,
            }}
          >
            Gemini Nano 4 runs locally at $0 cost. It distills context and
            scrubs PII before anything ever touches the network.
          </p>

          {/* CTA */}
          <div
            ref={ctaRef}
            style={{
              display: "flex",
              gap: "var(--sp-md)",
              justifyContent: "center",
              marginTop: "var(--sp-2xl)",
              flexWrap: "wrap",
              opacity: 0,
            }}
          >
            <MagneticBtn href="#sandbox" className="btn btn-primary" strength={0.4}>
              Try Live Sandbox
            </MagneticBtn>
            <MagneticBtn href="#architecture" className="btn btn-ghost" strength={0.3}>
              How It Works
            </MagneticBtn>
          </div>

          {/* Metrics bar */}
          <div
            ref={metricsBarRef}
            style={{
              display: "flex",
              gap: "var(--sp-3xl)",
              justifyContent: "center",
              marginTop: "var(--sp-4xl)",
              paddingTop: "var(--sp-2xl)",
              borderTop: "1px solid var(--c-hairline)",
              flexWrap: "wrap",
              opacity: 0,
            }}
          >
            {/* Scene-reactive metric */}
            <div style={{ textAlign: "center" }}>
              <span
                ref={metricValueRef}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--fs-body-lg)",
                  fontWeight: 500,
                  color: "var(--c-ink)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                $0
              </span>{" "}
              <span
                ref={metricLabelRef}
                style={{ fontSize: "var(--fs-body-sm)", color: "var(--c-ink-muted)" }}
              >
                on-device cost
              </span>
            </div>
            {/* Static metrics */}
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-body-lg)", fontWeight: 500, color: "var(--c-ink)", fontVariantNumeric: "tabular-nums" }}>{"<20ms"}</span>{" "}
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--c-ink-muted)" }}>local latency</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-body-lg)", fontWeight: 500, color: "var(--c-ink)", fontVariantNumeric: "tabular-nums" }}>{"≤300 tok"}</span>{" "}
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--c-ink-muted)" }}>context packet</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-body-lg)", fontWeight: 500, color: "var(--c-ink)", fontVariantNumeric: "tabular-nums" }}>{"100%"}</span>{" "}
              <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--c-ink-muted)" }}>privacy</span>
            </div>
          </div>

          {/* Scene progress dots */}
          <SceneDots />
        </div>
      </div>
    </div>
  );
}

function ScrollArrow() {
  return (
    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true">
      <rect x="6.5" y="2" width="3" height="6" rx="1.5" fill="var(--c-ink-muted)" />
      <path d="M8 14L4 18H12L8 14Z" fill="var(--c-ink-muted)" />
    </svg>
  );
}

function SceneDots() {
  // Visual indicator: 3 dots, first active
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--sp-xs)",
        justifyContent: "center",
        marginTop: "var(--sp-2xl)",
      }}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: i === 0 ? 20 : 6,
            height: 6,
            borderRadius: "var(--r-pill)",
            background: i === 0 ? "var(--c-system1)" : "var(--c-hairline)",
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}
