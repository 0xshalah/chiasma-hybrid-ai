/**
 * CHIASMA web-sandbox — SaaS Landing Page + Live Ecosystem Sandbox.
 *
 * Page sections:
 * 1. Navigation bar
 * 2. Hero (landing page)
 * 3. Live Sandbox (4-column interactive demo)
 * 4. Split-Brain Architecture (3-column explanation)
 * 5. Footer
 */

import { SandboxProvider } from "./sandbox/sandbox-context.tsx";
import { SandboxGrid } from "./sandbox/SandboxGrid.tsx";
import { Hero } from "./components/Hero.tsx";
import { Architecture } from "./components/Architecture.tsx";

export default function App() {
  return (
    <>
      {/* ── Navigation ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
          padding: "0 var(--sp-xl)",
          background: "var(--c-canvas)",
          borderBottom: "1px solid var(--c-hairline)",
        }}
      >
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "20px" }}>
          CHIASMA
        </span>
        <div style={{ display: "flex", gap: "var(--sp-md)", alignItems: "center" }}>
          <a
            href="#sandbox"
            style={{
              fontSize: "var(--fs-ui-sm)",
              color: "var(--c-ink-secondary)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Live Sandbox
          </a>
          <a
            href="#architecture"
            style={{
              fontSize: "var(--fs-ui-sm)",
              color: "var(--c-ink-secondary)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Architecture
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
          >
            GitHub
          </a>
          <a href="#sandbox" className="btn btn-primary">
            Try Demo
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <Hero />

      {/* ── Live Sandbox ── */}
      <section
        id="sandbox"
        style={{
          padding: "var(--sp-section) var(--sp-xl)",
          background: "var(--c-canvas)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--sp-3xl)" }}>
            <span className="eyebrow">Interactive Demo</span>
            <h2 className="display-lg" style={{ marginTop: "var(--sp-sm)" }}>
              Live Ecosystem Sandbox
            </h2>
            <p className="lead" style={{ marginTop: "var(--sp-sm)" }}>
              Test the full CHIASMA flow in one view — no install required.
              Press <kbd style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-code)",
                background: "var(--c-surface-raised)",
                border: "1px solid var(--c-hairline)",
                borderRadius: "var(--r-xs)",
                padding: "1px 6px",
              }}>Alt + Shift + C</kbd> to escalate to cloud.
            </p>
          </div>

          <SandboxProvider>
            <SandboxGrid />
          </SandboxProvider>
        </div>
      </section>

      {/* ── Architecture ── */}
      <Architecture />

      {/* ── Footer ── */}
      <footer
        style={{
          background: "var(--c-ink)",
          color: "var(--c-canvas)",
          padding: "var(--sp-section) var(--sp-xl)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "24px" }}>
            CHIASMA
          </span>
          <p style={{ fontSize: "var(--fs-ui-sm)", marginTop: "var(--sp-sm)", opacity: 0.7 }}>
            Bicameral Cognitive Co-Pilot · Apache License 2.0 · #BuildHybridAI 2026
          </p>
        </div>
      </footer>
    </>
  );
}
