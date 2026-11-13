/**
 * Hero section — the landing page's first impression.
 * Editorial serif headline on warm alabaster. No gradient, no image —
 * the type IS the statement.
 */

export function Hero() {
  return (
    <section
      style={{
        padding: "var(--sp-section-lg) var(--sp-xl)",
        background: "var(--c-canvas)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        {/* System status indicator */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sp-sm)",
            marginBottom: "var(--sp-xl)",
          }}
        >
          <span className="pill pill-system1">
            System 1 — On-Device
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-micro)",
              color: "var(--c-ink-muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            $0 · &lt;20ms · 100% local
          </span>
        </div>

        <h1 className="display-hero">
          Split-Brain AI that keeps
          <br />
          secrets on your device.
        </h1>

        <p className="lead" style={{ marginTop: "var(--sp-lg)", maxWidth: "560px", marginInline: "auto" }}>
          CHIASMA runs Gemini Nano 4 locally to distill context and scrub PII —
          then only wakes the cloud when you actually need deeper reasoning.
          Zero tokens wasted. Zero secrets leaked.
        </p>

        <div
          style={{
            display: "flex",
            gap: "var(--sp-md)",
            justifyContent: "center",
            marginTop: "var(--sp-2xl)",
          }}
        >
          <a href="#sandbox" className="btn btn-primary">
            Try Live Sandbox
          </a>
          <a href="#architecture" className="btn btn-ghost">
            How It Works
          </a>
        </div>

        {/* Key metrics */}
        <div
          style={{
            display: "flex",
            gap: "var(--sp-3xl)",
            justifyContent: "center",
            marginTop: "var(--sp-3xl)",
          }}
        >
          <Metric label="On-device cost" value="$0" />
          <Metric label="Local latency" value="<20ms" />
          <Metric label="Context packet" value="≤300 tok" />
          <Metric label="Privacy" value="100%" />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-metric-lg)",
          fontWeight: 500,
          color: "var(--c-ink)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "var(--fs-eyebrow)",
          fontWeight: 600,
          letterSpacing: "var(--ls-eyebrow)",
          textTransform: "uppercase",
          color: "var(--c-ink-muted)",
          marginTop: "var(--sp-xs)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
