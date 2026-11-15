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
import { MagneticBtn } from "./components/MagneticBtn.tsx";
import { Marquee } from "./components/Marquee.tsx";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Navbar — fixed blur, hides on scroll-down, shows on scroll-up (Awwwards pattern). */
function NavBar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 60) {
        gsap.to(nav, { y: 0, duration: 0.3, ease: "power2.out" });
      } else if (y > lastY) {
        gsap.to(nav, { y: -64, duration: 0.3, ease: "power2.in" });
      } else {
        gsap.to(nav, { y: 0, duration: 0.4, ease: "power3.out" });
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
        padding: "0 var(--sp-xl)",
        background: "rgba(246,244,240,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--c-hairline)",
        willChange: "transform",
      }}
    >
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "20px" }}>
        CHIASMA
      </span>
      <div style={{ display: "flex", gap: "var(--sp-md)", alignItems: "center" }}>
        <a href="#sandbox" style={{ fontSize: "var(--fs-ui-sm)", color: "var(--c-ink-secondary)", textDecoration: "none", fontWeight: 500 }}>
          Live Sandbox
        </a>
        <a href="#architecture" style={{ fontSize: "var(--fs-ui-sm)", color: "var(--c-ink-secondary)", textDecoration: "none", fontWeight: 500 }}>
          Architecture
        </a>
        <MagneticBtn href="https://github.com/0xshalah/chiasma-hybrid-ai" target="_blank" rel="noreferrer" className="btn btn-ghost" strength={0.25}>
          GitHub
        </MagneticBtn>
        <MagneticBtn href="#sandbox" className="btn btn-primary" strength={0.3}>
          Try Demo
        </MagneticBtn>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      {/* ── Navigation — hides on scroll down, shows on scroll up ── */}
      <NavBar />

      {/* ── Hero (300vh pinned scroll-story) ── */}
      <main style={{ paddingTop: "56px" }}>
      <Hero />

      {/* ── Velocity marquee separator ── */}
      <Marquee />

      {/* ── Live Sandbox ── */}
      <section
        id="sandbox"
        aria-labelledby="sandbox-heading"
        style={{
          padding: "var(--sp-section) var(--sp-xl)",
          background: "var(--c-canvas)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--sp-3xl)" }}>
            <h2 id="sandbox-heading" className="display-lg" style={{ marginTop: "var(--sp-sm)" }}>
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
      </main>

      {/* ── Footer ── */}
      <footer
        aria-label="Site footer"
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
          <p style={{ fontSize: "var(--fs-lead)", marginTop: "var(--sp-md)", opacity: 0.9, fontFamily: "var(--font-serif)" }}>
            Your secrets stay on your device. Always.
          </p>
          <div style={{ display: "flex", gap: "var(--sp-md)", justifyContent: "center", marginTop: "var(--sp-xl)", flexWrap: "wrap" }}>
            <MagneticBtn href="#sandbox" className="btn btn-primary" style={{ background: "var(--c-system1)" }} strength={0.3}>
              Try the sandbox
            </MagneticBtn>
            <a
              href="https://github.com/0xshalah/chiasma-hybrid-ai"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "var(--fs-ui-sm)", color: "var(--c-canvas)", opacity: 0.6, alignSelf: "center", textDecoration: "none" }}
            >
              Apache 2.0 · source on GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
