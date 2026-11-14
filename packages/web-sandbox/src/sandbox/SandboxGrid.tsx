/**
 * SandboxGrid — Awwwards-level interactive sandbox.
 *
 * Six techniques applied:
 * 1. Bento grid layout (1 hero cell + side + bridge + android row)
 * 2. ScrollTrigger.batch rotateX entrance per cell (gsap_animation_patterns pattern)
 * 3. Animated counters in CorpusCallosumBridge (via hooks.ts)
 * 4. Choreographed fake cursor (DemoWalkthrough component)
 * 5. Tab switcher with crossfade (Device / PII Scrubber / Cloud)
 * 6. Typewriter char reveal in DesktopEditor (via hooks.ts)
 *
 * Layout (bento):
 *   [Editor (hero)] [Side Panel]
 *   [Bridge       ] [Side Panel]
 *   [Android — full width     ]
 */

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DesktopEditor } from "./DesktopEditor.tsx";
import { SidePanel } from "./SidePanel.tsx";
import { CorpusCallosumBridge } from "./CorpusCallosumBridge.tsx";
import { AndroidCompanion } from "./AndroidCompanion.tsx";
import { DemoWalkthrough } from "./DemoWalkthrough.tsx";
import { useSandbox } from "./sandbox-context.tsx";

gsap.registerPlugin(ScrollTrigger);

// ── Tab Switcher ─────────────────────────────────────────────────────────────

const TABS = [
  { id: "device", label: "On-Device", pill: "pill-system1" },
  { id: "pii", label: "PII Scrubber", pill: "pill-stage-scrubbing" },
  { id: "cloud", label: "Cloud Routing", pill: "pill-system2" },
] as const;

type TabId = typeof TABS[number]["id"];

// ── Main component ────────────────────────────────────────────────────────────

export function SandboxGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>("device");
  const [demoActive, setDemoActive] = useState(false);

  // Button refs for DemoWalkthrough.measure()
  const injectSecretRef = useRef<HTMLButtonElement>(null);
  const simulateCodingRef = useRef<HTMLButtonElement>(null);
  const manualTriggerRef = useRef<HTMLButtonElement>(null);
  const captureVoiceRef = useRef<HTMLButtonElement>(null);

  // Scroll-triggered rotateX entrance per bento cell (technique 2)
  useEffect(() => {
    const cells = gridRef.current?.querySelectorAll<HTMLElement>("[data-bento-cell]");
    if (!cells || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(cells, { opacity: 0, y: 40, rotateX: 18, transformPerspective: 800 });

    const st = ScrollTrigger.batch(cells, {
      start: "top 85%",
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.75,
          stagger: 0.11,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });
      },
      once: true,
    });

    return () => {
      if (Array.isArray(st)) st.forEach((s) => s.kill());
      else st.kill();
    };
  }, []);

  // Tab crossfade (technique 5)
  const tabPanelRef = useRef<HTMLDivElement>(null);
  const switchTab = useCallback((id: TabId) => {
    const panel = tabPanelRef.current;
    if (!panel || id === activeTab) return;
    gsap.timeline()
      .to(panel, { opacity: 0, y: -6, duration: 0.18, ease: "power2.in" })
      .call(() => setActiveTab(id))
      .to(panel, { opacity: 1, y: 0, duration: 0.28, ease: "power3.out" });
  }, [activeTab]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* ── Controls bar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "var(--sp-sm)",
        marginBottom: "var(--sp-xl)",
      }}>
        {/* Tab switcher */}
        <div style={{
          display: "flex",
          gap: "var(--sp-xs)",
          background: "var(--c-surface)",
          borderRadius: "var(--r-md)",
          padding: "4px",
          boxShadow: "var(--shadow-card)",
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--r-sm)",
                border: "none",
                fontSize: "var(--fs-ui-sm)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: activeTab === tab.id ? "var(--c-ink)" : "transparent",
                color: activeTab === tab.id ? "var(--c-canvas)" : "var(--c-ink-secondary)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", gap: "var(--sp-xs)", flexWrap: "wrap", alignItems: "center" }}>
          {/* Demo walkthrough toggle */}
          <button
            className={demoActive ? "btn btn-system2" : "btn btn-ghost"}
            style={{ fontSize: "var(--fs-ui-sm)" }}
            onClick={() => setDemoActive((v) => !v)}
            title="Watch an automated demo of the full pipeline"
          >
            <PlayIcon /> {demoActive ? "Stop Demo" : "Watch Demo"}
          </button>
          <ForceOfflineToggle />
          <ManualTriggerButton ref={manualTriggerRef} />
        </div>
      </div>

      {/* ── Tab content label ── */}
      <div style={{ marginBottom: "var(--sp-lg)", minHeight: "32px" }}>
        {TABS.map((tab) => (
          <div
            key={tab.id}
            style={{ display: activeTab === tab.id ? "flex" : "none", alignItems: "center", gap: "var(--sp-sm)" }}
          >
            <span className={`pill ${tab.pill}`}>{tab.label}</span>
            <span style={{ fontSize: "var(--fs-body-sm)", color: "var(--c-ink-muted)" }}>
              {tab.id === "device" && "Edit code and trigger PII injection — System 1 runs locally at $0"}
              {tab.id === "pii" && "Watch 9 PII patterns get scrubbed before the context packet is built"}
              {tab.id === "cloud" && "Friction gauge drives routing — escalate manually with Alt+Shift+C"}
            </span>
          </div>
        ))}
      </div>

      {/* ── Tab panel wrapper ── */}
      <div ref={tabPanelRef}>

        {/* ── Bento grid ── */}
        <div
          ref={gridRef}
          className="bento-grid"
          style={{ position: "relative" }}
        >
          {/* Cell 1: Editor (hero cell — large) */}
          <div
            data-bento-cell
            className="bento-cell-hero"
            style={{ transformStyle: "preserve-3d" }}
          >
            <ColLabel n={1} label="Desktop Editor" highlight={activeTab === "device"} />
            <DesktopEditor
              injectSecretRef={injectSecretRef}
              simulateCodingRef={simulateCodingRef}
            />
          </div>

          {/* Cell 2: Side Panel (tall, spans 2 rows) */}
          <div
            data-bento-cell
            className="bento-cell-side"
            style={{ transformStyle: "preserve-3d" }}
          >
            <ColLabel n={2} label="PII Scrubber + Context" highlight={activeTab === "pii"} />
            <SidePanel />
          </div>

          {/* Cell 3: Bridge (bottom-left) */}
          <div
            data-bento-cell
            className="bento-cell-bridge"
            style={{ transformStyle: "preserve-3d" }}
          >
            <ColLabel n={3} label="Corpus Callosum Bridge" highlight={activeTab === "cloud"} />
            <CorpusCallosumBridge />
          </div>

          {/* Cell 4: Android (full-width bottom row) */}
          <div
            data-bento-cell
            className="bento-cell-android"
            style={{ transformStyle: "preserve-3d" }}
          >
            <ColLabel n={4} label="Android Companion" highlight={false} />
            <AndroidCompanion captureVoiceRef={captureVoiceRef} />
          </div>

          {/* Fake cursor overlay */}
          <DemoWalkthrough
            containerRef={containerRef}
            buttonRefs={{
              injectSecret: injectSecretRef,
              simulateCoding: simulateCodingRef,
              manualTrigger: manualTriggerRef,
              captureVoice: captureVoiceRef,
            }}
            active={demoActive}
            onStop={() => setDemoActive(false)}
          />
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ColLabel({ n, label, highlight }: { n: number; label: string; highlight: boolean }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--sp-xs)",
      marginBottom: "var(--sp-sm)",
    }}>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "20px",
        height: "20px",
        borderRadius: "var(--r-pill)",
        background: highlight ? "var(--c-system1)" : "var(--c-hairline)",
        color: highlight ? "var(--c-on-system1)" : "var(--c-ink-secondary)",
        fontSize: "var(--fs-micro)",
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        transition: "all 0.3s ease",
        flexShrink: 0,
      }}>
        {n}
      </span>
      <span style={{
        fontSize: "var(--fs-ui-sm)",
        fontWeight: 600,
        color: highlight ? "var(--c-system1)" : "var(--c-ink-muted)",
        transition: "color 0.3s ease",
      }}>
        {label}
      </span>
    </div>
  );
}

import { forwardRef } from "react";

function ForceOfflineToggle() {
  const { state, dispatch } = useSandbox();
  return (
    <button
      className="btn btn-ghost"
      style={{
        fontSize: "var(--fs-ui-sm)",
        ...(state.isOffline ? {
          background: "var(--c-system2)",
          color: "var(--c-on-system2)",
          borderColor: "var(--c-system2)",
        } : {}),
      }}
      onClick={() => dispatch({ type: "TOGGLE_OFFLINE" })}
    >
      {state.isOffline ? "● Offline: ON" : "Force offline"}
    </button>
  );
}

const ManualTriggerButton = forwardRef<HTMLButtonElement>((_, ref) => {
  const { dispatch } = useSandbox();
  return (
    <button
      ref={ref}
      className="btn btn-system2"
      style={{ fontSize: "var(--fs-ui-sm)" }}
      onClick={() => dispatch({ type: "MANUAL_TRIGGER" })}
    >
      <BoltIcon /> Alt + Shift + C
    </button>
  );
});
ManualTriggerButton.displayName = "ManualTriggerButton";

function BoltIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ display: "inline-block", verticalAlign: "-1px", marginRight: "4px" }} aria-hidden="true">
      <path d="M8 1L3 8H7L6 13L11 6H7L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: "inline-block", verticalAlign: "-1px", marginRight: "4px" }} aria-hidden="true">
      <path d="M3 2L10 6L3 10V2Z" fill="currentColor" />
    </svg>
  );
}
