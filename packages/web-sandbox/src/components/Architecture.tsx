/**
 * Split-Brain Architecture section — 3-column explanation of how
 * System 1, the Corpus Callosum, and System 2 connect.
 */

export function Architecture() {
  return (
    <section
      id="architecture"
      style={{
        padding: "var(--sp-section) var(--sp-xl)",
        background: "var(--c-canvas)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--sp-3xl)" }}>
          <span className="eyebrow">How It Works</span>
          <h2 className="display-lg" style={{ marginTop: "var(--sp-sm)" }}>
            Two brains, one bridge
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "var(--sp-xl)",
          }}
        >
          {/* System 1 */}
          <div className="card card-system1">
            <span className="pill pill-system1" style={{ marginBottom: "var(--sp-md)", display: "inline-flex" }}>
              System 1
            </span>
            <h3 className="display-md" style={{ marginBottom: "var(--sp-sm)" }}>
              On-Device
            </h3>
            <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-body)", marginBottom: "var(--sp-md)" }}>
              Gemini Nano 4 runs locally at $0 cost. It distills your active
              context into a ≤300 token packet, scrubs PII before anything
              touches the network, and calculates a friction score.
            </p>
            <ul style={{ listStyle: "none", fontSize: "var(--fs-ui-sm)", color: "var(--c-system1-ink)", lineHeight: "2" }}>
              <li>✓ PII Scrubber (9 pattern types)</li>
              <li>✓ Context Packet builder</li>
              <li>✓ Friction Score calculator</li>
              <li>✓ Offline queue manager</li>
            </ul>
          </div>

          {/* Corpus Callosum */}
          <div className="card">
            <span className="pill pill-idle" style={{ marginBottom: "var(--sp-md)", display: "inline-flex" }}>
              Bridge
            </span>
            <h3 className="display-md" style={{ marginBottom: "var(--sp-sm)" }}>
              Corpus Callosum
            </h3>
            <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-body)", marginBottom: "var(--sp-md)", color: "var(--c-ink-secondary)" }}>
              Firebase AI Logic acts as the router. When friction exceeds the
              Remote Config threshold, it escalates from local to cloud —
              secured by App Check at every step.
            </p>
            <ul style={{ listStyle: "none", fontSize: "var(--fs-ui-sm)", color: "var(--c-ink-secondary)", lineHeight: "2" }}>
              <li>→ Remote Config (threshold 0.75)</li>
              <li>→ App Check enforcement</li>
              <li>→ Firestore cross-device sync</li>
              <li>→ Seamless cloud fallback</li>
            </ul>
          </div>

          {/* System 2 */}
          <div className="card card-system2">
            <span className="pill pill-system2" style={{ marginBottom: "var(--sp-md)", display: "inline-flex" }}>
              System 2
            </span>
            <h3 className="display-md" style={{ marginBottom: "var(--sp-sm)" }}>
              Cloud
            </h3>
            <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-body)", marginBottom: "var(--sp-md)" }}>
              Cloud Gemini wakes only when needed. It receives the scrubbed
              context packet plus the last 5 context nodes from Firestore to
              produce deep cross-device synthesis.
            </p>
            <ul style={{ listStyle: "none", fontSize: "var(--fs-ui-sm)", color: "var(--c-system2-ink)", lineHeight: "2" }}>
              <li>⚡ Deep reasoning on demand</li>
              <li>⚡ Cross-device context merge</li>
              <li>⚡ Only fires above threshold</li>
              <li>⚡ Manual trigger (Alt+Shift+C)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
