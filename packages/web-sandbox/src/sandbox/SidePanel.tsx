/**
 * Column 2 — Chrome Side Panel (360px).
 * Shows the live PII Scrubber feed, the Distilled Context Card,
 * and the System 2 Synthesis drawer.
 */

import { useSandbox } from "./sandbox-context.tsx";

export function SidePanel() {
  const { state } = useSandbox();
  const isSystem2 = state.routing?.hemisphere === "system2";

  return (
    <div
      style={{
        background: "var(--c-canvas)",
        border: "2px solid var(--c-ink)",
        borderRadius: "var(--r-lg)",
        padding: "var(--panel-pad)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--panel-gap)",
        minHeight: "420px",
      }}
    >
      {/* Frame chrome */}
      <div className="frame-chrome">
        Chrome Side Panel · 360px
      </div>

      {/* Status header */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-sm)" }}>
        {isSystem2 ? (
          <span className="pill pill-system2">System 2 — Cloud</span>
        ) : (
          <span className="pill pill-system1">System 1 — On-Device</span>
        )}
        {state.scrubResult.hasPII && (
          <span className="redacted-badge">PII DETECTED</span>
        )}
      </div>

      {/* PII Scrubber Feed */}
      <div>
        <div
          style={{
            fontSize: "var(--fs-eyebrow)",
            fontWeight: 600,
            letterSpacing: "var(--ls-eyebrow)",
            textTransform: "uppercase",
            color: "var(--c-ink-muted)",
            marginBottom: "var(--sp-xs)",
          }}
        >
          PII Scrubber Feed
        </div>
        <div
          className="code-block"
          style={{ minHeight: "80px", maxHeight: "120px", overflow: "auto" }}
        >
          {renderRedactedText(state.scrubResult.redacted)}
        </div>
        {state.scrubResult.matches.length > 0 && (
          <div
            style={{
              marginTop: "var(--sp-xs)",
              fontSize: "var(--fs-micro)",
              fontFamily: "var(--font-mono)",
              color: "var(--c-system2)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {state.scrubResult.matches.length} redaction{state.scrubResult.matches.length !== 1 ? "s" : ""}:{" "}
            {state.scrubResult.matches.map((m) => m.type).join(", ")}
          </div>
        )}
      </div>

      {/* Distilled Context Card */}
      {state.contextPacket && (
        <div className="card card-system1" style={{ padding: "var(--sp-md)" }}>
          <div
            style={{
              fontSize: "var(--fs-eyebrow)",
              fontWeight: 600,
              letterSpacing: "var(--ls-eyebrow)",
              textTransform: "uppercase",
              color: "var(--c-system1)",
              marginBottom: "var(--sp-xs)",
            }}
          >
            Distilled Context Packet
          </div>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-body)", marginBottom: "var(--sp-sm)" }}>
            {state.contextPacket.summary}
          </p>
          {state.contextPacket.entities.length > 0 && (
            <div style={{ display: "flex", gap: "var(--sp-xxs)", flexWrap: "wrap" }}>
              {state.contextPacket.entities.slice(0, 6).map((e, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "var(--fs-micro)",
                    fontFamily: "var(--font-mono)",
                    background: "var(--c-surface)",
                    border: "1px solid var(--c-hairline)",
                    borderRadius: "var(--r-xs)",
                    padding: "1px 4px",
                    color: "var(--c-system1-ink)",
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
          )}
          <div
            style={{
              marginTop: "var(--sp-sm)",
              fontSize: "var(--fs-micro)",
              fontFamily: "var(--font-mono)",
              color: "var(--c-ink-muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {state.contextPacket.tokenCount} / 300 tokens · {state.contextPacket.source}
          </div>
        </div>
      )}

      {/* System 2 Synthesis (only when escalated) */}
      {isSystem2 && (
        <div className="card card-system2" style={{ padding: "var(--sp-md)" }}>
          <div
            style={{
              fontSize: "var(--fs-eyebrow)",
              fontWeight: 600,
              letterSpacing: "var(--ls-eyebrow)",
              textTransform: "uppercase",
              color: "var(--c-system2)",
              marginBottom: "var(--sp-xs)",
            }}
          >
            System 2 Synthesis
          </div>
          <p style={{ fontSize: "var(--fs-body)", lineHeight: "var(--lh-body)" }}>
            {state.routing?.reason === "manual-trigger"
              ? "Manual cloud escalation triggered. Analyzing context packet with last 5 nodes from Firestore…"
              : state.routing?.reason === "above-threshold"
                ? "Friction exceeded threshold. Cloud reasoning engaged for deeper synthesis."
                : "Gemini Nano 4 unavailable — falling back to cloud reasoning."}
          </p>
        </div>
      )}
    </div>
  );
}

/** Render redacted text, highlighting [REDACTED_PII] badges. */
function renderRedactedText(text: string) {
  if (!text) return <span style={{ color: "var(--c-ink-muted)" }}>Awaiting input…</span>;
  const parts = text.split(/(\[REDACTED_PII\])/g);
  return parts.map((part, i) => {
    if (part === "[REDACTED_PII]") {
      return <span key={i} className="redacted-badge">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}
