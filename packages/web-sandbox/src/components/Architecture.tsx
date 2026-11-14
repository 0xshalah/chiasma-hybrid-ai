/**
 * Architecture — "Two brains, one bridge"
 *
 * Three Awwwards techniques combined:
 *
 * 1. SPLIT SCREEN PINNED (basement-scrollytelling / Vercel pattern)
 *    Section is 400vh tall. Sticky right panel holds the node diagram.
 *    Left panel: 3 text scenes crossfade as user scrolls.
 *    Active node pulses when its scene is visible.
 *
 * 2. SVG PATH DRAW ON SCROLL (smooothy SOTD / DIV7NE portfolio)
 *    Two connecting lines between the 3 nodes.
 *    strokeDashoffset scrubbed via ScrollTrigger — lines "grow" as scroll progresses.
 *
 * 3. ANIMATED COUNTERS PER NODE (react-bits / zentry pattern)
 *    "$0", "9 PII", "0.75" count up when their scene becomes active.
 *    Numbers update in sync with the left-panel scene switch.
 *
 * prefers-reduced-motion: static layout, all 3 cards visible, no scroll pin.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Scene data ────────────────────────────────────────────────────────────────

const SCENES = [
  {
    node: 0,
    pill: { label: "System 1", cls: "pill-system1" },
    heading: "On-Device",
    body: "Gemini Nano 4 runs locally at $0 cost. It distills your active context into a ≤300 token packet, scrubs PII before anything touches the network, and calculates a friction score.",
    list: [
      "PII Scrubber — 9 pattern types",
      "Context Packet builder",
      "Friction Score calculator",
      "Offline queue manager",
    ],
    listIcon: "check" as const,
    metric: { value: 0, to: 0, label: "$0 cost", prefix: "$", suffix: "", decimals: 0 },
    color: "var(--c-system1)",
    softBg: "var(--c-system1-soft)",
    ink: "var(--c-system1-ink)",
  },
  {
    node: 1,
    pill: { label: "Bridge", cls: "pill-idle" },
    heading: "Corpus Callosum",
    body: "Firebase AI Logic acts as the router. When friction exceeds the Remote Config threshold, it escalates from local to cloud — secured by App Check at every step.",
    list: [
      "Remote Config — threshold 0.75",
      "App Check enforcement",
      "Firestore cross-device sync",
      "Seamless cloud fallback",
    ],
    listIcon: "arrow" as const,
    metric: { value: 0, to: 75, label: "threshold", prefix: "0.", suffix: "", decimals: 0 },
    color: "var(--c-ink-secondary)",
    softBg: "var(--c-surface)",
    ink: "var(--c-ink-secondary)",
  },
  {
    node: 2,
    pill: { label: "System 2", cls: "pill-system2" },
    heading: "Cloud",
    body: "Cloud Gemini wakes only when needed. It receives the scrubbed context packet plus the last 5 context nodes from Firestore to produce deep cross-device synthesis.",
    list: [
      "Deep reasoning on demand",
      "Cross-device context merge",
      "Only fires above threshold",
      "Manual trigger — Alt+Shift+C",
    ],
    listIcon: "bolt" as const,
    metric: { value: 0, to: 5, label: "context nodes", prefix: "", suffix: " nodes", decimals: 0 },
    color: "var(--c-system2)",
    softBg: "var(--c-system2-soft)",
    ink: "var(--c-system2-ink)",
  },
];

// ── Main component ────────────────────────────────────────────────────────────

export function Architecture() {
  const outerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const line1Ref = useRef<SVGPathElement>(null);
  const line2Ref = useRef<SVGPathElement>(null);
  const nodeRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const [activeScene, setActiveScene] = useState(0);
  const [metricValues, setMetricValues] = useState([0, 0, 0]);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Animated counter ──
  const animateCounter = useCallback((sceneIdx: number) => {
    const scene = SCENES[sceneIdx];
    const obj = { v: 0 };
    gsap.to(obj, {
      v: scene.metric.to,
      duration: 0.9,
      ease: "power2.out",
      roundProps: "v",
      onUpdate: () => {
        setMetricValues((prev) => {
          const next = [...prev];
          next[sceneIdx] = Math.round(obj.v);
          return next;
        });
      },
    });
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const svg = svgRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    if (!outer || !sticky || !svg || !line1 || !line2) return;

    // ── SVG path draw setup ──
    // Measure total length once, set dasharray = dashoffset = length (invisible)
    const initLines = () => {
      const len1 = line1.getTotalLength();
      const len2 = line2.getTotalLength();
      gsap.set(line1, { strokeDasharray: len1, strokeDashoffset: len1 });
      gsap.set(line2, { strokeDasharray: len2, strokeDashoffset: len2 });
    };
    // Run after layout
    requestAnimationFrame(initLines);

    // ── Main ScrollTrigger: pin sticky panel + drive scenes ──
    let lastScene = -1;

    const st = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "bottom bottom",
      pin: sticky,
      onUpdate: (self) => {
        const p = self.progress; // 0 → 1 over 400vh

        // Scene: divide 0–1 into 3 thirds
        const sceneIdx = Math.min(Math.floor(p * 3), 2);

        // SVG lines: line1 draws in first 50%, line2 in second 50%
        const len1 = line1.getTotalLength();
        const len2 = line2.getTotalLength();
        const t1 = Math.min(p / 0.5, 1); // 0→1 as p goes 0→0.5
        const t2 = Math.max(Math.min((p - 0.5) / 0.5, 1), 0); // 0→1 as p goes 0.5→1
        gsap.set(line1, { strokeDashoffset: len1 * (1 - t1) });
        gsap.set(line2, { strokeDashoffset: len2 * (1 - t2) });

        // Scene switch
        if (sceneIdx !== lastScene) {
          lastScene = sceneIdx;
          setActiveScene(sceneIdx);
          animateCounter(sceneIdx);

          // Pulse active node
          nodeRefs.forEach((ref, i) => {
            if (!ref.current) return;
            gsap.to(ref.current, {
              scale: i === sceneIdx ? 1.12 : 1,
              duration: 0.35,
              ease: "back.out(2)",
            });
          });

          // Crossfade left text
          if (leftRef.current) {
            gsap.timeline()
              .to(leftRef.current, { opacity: 0, y: -10, duration: 0.2, ease: "power2.in" })
              .to(leftRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" });
          }
        }
      },
    });

    // Kick counter for scene 0 on enter
    ScrollTrigger.create({
      trigger: outer,
      start: "top 70%",
      once: true,
      onEnter: () => animateCounter(0),
    });

    return () => {
      st.kill();
    };
  }, [prefersReduced, animateCounter]);

  const scene = SCENES[activeScene];

  // ── Reduced-motion: flat 3-card layout ──
  if (prefersReduced) {
    return (
      <section id="architecture" style={{ padding: "var(--sp-section) var(--sp-xl)", background: "var(--c-canvas)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="display-lg" style={{ textAlign: "center", marginBottom: "var(--sp-3xl)" }}>
            Two brains, one bridge
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.8fr 1.3fr", gap: "var(--sp-xl)" }}>
            {SCENES.map((s) => (
              <StaticCard key={s.node} scene={s} metricValue={s.metric.to} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    // outerRef: 400vh — drives scroll through 3 scenes
    <section
      id="architecture"
      ref={outerRef}
      style={{ height: "400vh", background: "var(--c-canvas)" }}
    >
      {/* Sticky container — 100vh, pinned by ScrollTrigger */}
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--sp-3xl)",
          alignItems: "center",
          padding: "0 var(--sp-xl)",
          maxWidth: "1200px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* ── LEFT: text panel ── */}
        <div ref={leftRef} style={{ padding: "var(--sp-xl) 0" }}>
          {/* Section label */}
          <p style={{
            fontSize: "var(--fs-ui-sm)",
            fontWeight: 600,
            color: "var(--c-ink-muted)",
            letterSpacing: "0.08em",
            marginBottom: "var(--sp-xl)",
          }}>
            ARCHITECTURE
          </p>

          <h2 className="display-lg" style={{ marginBottom: "var(--sp-xl)" }}>
            Two brains,<br />one bridge
          </h2>

          {/* Active pill */}
          <div style={{ marginBottom: "var(--sp-lg)" }}>
            <span className={`pill ${scene.pill.cls}`}>{scene.pill.label}</span>
          </div>

          {/* Headline */}
          <h3 className="display-md" style={{ marginBottom: "var(--sp-md)", color: scene.color }}>
            {scene.heading}
          </h3>

          {/* Body */}
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-body)", color: "var(--c-ink-secondary)", marginBottom: "var(--sp-xl)", maxWidth: "420px" }}>
            {scene.body}
          </p>

          {/* List */}
          <ul style={{ listStyle: "none", padding: 0, fontSize: "var(--fs-ui-sm)", color: scene.ink, lineHeight: "2.2" }}>
            {scene.list.map((item, i) => (
              <li key={i}>
                <ListIcon type={scene.listIcon} /> {item}
              </li>
            ))}
          </ul>

          {/* Animated metric */}
          <div style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "var(--sp-xs)",
            marginTop: "var(--sp-2xl)",
            padding: "var(--sp-md) var(--sp-lg)",
            background: scene.softBg,
            borderRadius: "var(--r-md)",
            border: `1px solid ${scene.color}22`,
          }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-display-md)",
              fontWeight: 600,
              color: scene.color,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}>
              {scene.metric.prefix}{metricValues[activeScene]}{scene.metric.suffix}
            </span>
            <span style={{ fontSize: "var(--fs-ui-sm)", color: scene.ink }}>
              {scene.metric.label}
            </span>
          </div>

          {/* Scroll hint — fades once scrolling starts */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sp-sm)",
            marginTop: "var(--sp-3xl)",
            opacity: 0.4,
          }}>
            <span style={{ fontSize: "var(--fs-micro)", color: "var(--c-ink-muted)", letterSpacing: "0.1em" }}>SCROLL</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {SCENES.map((_, i) => (
                <div key={i} style={{
                  width: i === activeScene ? 16 : 6,
                  height: 6,
                  borderRadius: "var(--r-pill)",
                  background: i === activeScene ? scene.color : "var(--c-hairline)",
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: node diagram + SVG lines ── */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 0, height: "420px", justifyContent: "center" }}>

          {/* SVG connecting lines — drawn via strokeDashoffset scrub */}
          <svg
            ref={svgRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              overflow: "visible",
            }}
            viewBox="0 0 400 420"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Line 1: System 1 → Bridge (top node center → mid node center) */}
            <path
              ref={line1Ref}
              d="M 200 80 C 200 140 200 160 200 210"
              stroke="var(--c-system1)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            {/* Line 2: Bridge → System 2 */}
            <path
              ref={line2Ref}
              d="M 200 250 C 200 290 200 310 200 340"
              stroke="var(--c-system2)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            {/* Flow direction arrows (always visible, subtle) */}
            <path d="M 196 200 L 200 210 L 204 200" fill="none" stroke="var(--c-system1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
            <path d="M 196 332 L 200 342 L 204 332" fill="none" stroke="var(--c-system2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          </svg>

          {/* Node 0: System 1 */}
          <Node
            ref={nodeRefs[0]}
            active={activeScene === 0}
            color="var(--c-system1)"
            softBg="var(--c-system1-soft)"
            label="System 1"
            sublabel="On-Device · $0"
            icon={<DeviceIcon />}
            style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)" }}
          />

          {/* Node 1: Bridge */}
          <Node
            ref={nodeRefs[1]}
            active={activeScene === 1}
            color="var(--c-ink-secondary)"
            softBg="var(--c-surface)"
            label="Bridge"
            sublabel="Corpus Callosum"
            icon={<BridgeIcon />}
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          />

          {/* Node 2: System 2 */}
          <Node
            ref={nodeRefs[2]}
            active={activeScene === 2}
            color="var(--c-system2)"
            softBg="var(--c-system2-soft)"
            label="System 2"
            sublabel="Cloud · On-demand"
            icon={<CloudIcon />}
            style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)" }}
          />
        </div>
      </div>
    </section>
  );
}

// ── Node component ────────────────────────────────────────────────────────────

import { forwardRef } from "react";

interface NodeProps {
  active: boolean;
  color: string;
  softBg: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  style?: React.CSSProperties;
}

const Node = forwardRef<HTMLDivElement, NodeProps>(
  ({ active, color, softBg, label, sublabel, icon, style }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          ...style,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--sp-xs)",
          transition: "transform 0.3s ease",
          willChange: "transform",
          zIndex: 1,
        }}
      >
        {/* Circle */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: softBg,
          border: `2px solid ${active ? color : "var(--c-hairline)"}`,
          boxShadow: active ? `0 0 0 6px ${color}18, 0 4px 20px ${color}30` : "var(--shadow-card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.4s ease",
          color: active ? color : "var(--c-ink-muted)",
        }}>
          {icon}
        </div>
        {/* Label */}
        <span style={{
          fontSize: "var(--fs-ui-sm)",
          fontWeight: 700,
          color: active ? color : "var(--c-ink-secondary)",
          transition: "color 0.3s ease",
          whiteSpace: "nowrap",
        }}>
          {label}
        </span>
        <span style={{
          fontSize: "var(--fs-micro)",
          color: "var(--c-ink-muted)",
          fontFamily: "var(--font-mono)",
          whiteSpace: "nowrap",
        }}>
          {sublabel}
        </span>
      </div>
    );
  }
);
Node.displayName = "Node";

// ── Static card (prefers-reduced-motion) ─────────────────────────────────────

function StaticCard({ scene, metricValue }: { scene: typeof SCENES[number]; metricValue: number }) {
  return (
    <div style={{
      background: scene.softBg,
      borderRadius: "var(--r-md)",
      padding: "var(--sp-xl)",
      color: scene.ink,
    }}>
      <div style={{ marginBottom: "var(--sp-md)" }}>
        <span className={`pill ${scene.pill.cls}`}>{scene.pill.label}</span>
      </div>
      <h3 className="display-md" style={{ marginBottom: "var(--sp-sm)" }}>{scene.heading}</h3>
      <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-body)", marginBottom: "var(--sp-md)" }}>{scene.body}</p>
      <ul style={{ listStyle: "none", padding: 0, fontSize: "var(--fs-ui-sm)", lineHeight: "2" }}>
        {scene.list.map((item, i) => (
          <li key={i}><ListIcon type={scene.listIcon} /> {item}</li>
        ))}
      </ul>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ListIcon({ type }: { type: "check" | "arrow" | "bolt" }) {
  if (type === "check") return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "var(--sp-xs)" }} aria-hidden="true">
      <path d="M2 7.5L5.5 11L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (type === "arrow") return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "var(--sp-xs)" }} aria-hidden="true">
      <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "var(--sp-xs)" }} aria-hidden="true">
      <path d="M8 1L3 8H7L6 13L11 6H7L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 14h10M9 10h6M9 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BridgeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="8" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 7v4M14 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M20 18.5a4 4 0 0 0 0-8 4 4 0 0 0-7.6-1.4A3.5 3.5 0 1 0 8 16.5h12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
