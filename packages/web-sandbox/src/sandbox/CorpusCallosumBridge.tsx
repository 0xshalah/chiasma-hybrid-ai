/**
 * Column 3 — Corpus Callosum Bridge.
 * Shows the routing status: Remote Config, App Check, Firestore flow,
 * friction gauge, and the current routing decision.
 */

import { useSandbox } from "./sandbox-context.tsx";

export function CorpusCallosumBridge() {
  const { state } = useSandbox();
  const friction = state.friction.value;
  const isSystem2 = state.routing?.hemisphere === "system2";
  const fillColor = isSystem2 ? "var(--c-system2)" : "var(--c-system1)";

  return (
    <div
      style={{
        background: "var(--c-surface-raised)",
        border: "1px solid var(--c-hairline)",
        borderRadius: "var(--r-lg)",
        padding: "var(--sp-xl)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-sm)",
        minHeight: "420px",
      }}
    >
      {/* Frame chrome */}
      <div className="frame-chrome">
        Corpus Callosum Bridge
      </div>

      {/* Routing decision banner */}
      <div
        className={isSystem2 ? "card card-system2" : "card card-system1"}
        style={{ padding: "var(--sp-md)", textAlign: "center" }}
      >
        <div
          style={{
            fontSize: "var(--fs-eyebrow)",
            fontWeight: 600,
            letterSpacing: "var(--ls-eyebrow)",
            textTransform: "uppercase",
            marginBottom: "var(--sp-xs)",
            opacity: 0.8,
          }}
        >
          Routing Decision
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--fs-display-md)",
            lineHeight: 1.2,
          }}
        >
          {isSystem2 ? "→ Cloud" : "→ Local"}
        </div>
        <div
          style={{
            fontSize: "var(--fs-ui-sm)",
            marginTop: "var(--sp-xs)",
            opacity: 0.7,
          }}
        >
          {state.routing ? formatReason(state.routing.reason) : "Awaiting input"}
        </div>
      </div>

      {/* Friction Gauge */}
      <div
        style={{
          background: "var(--c-surface)",
          border: "1px solid var(--c-hairline)",
          borderRadius: "var(--r-sm)",
          padding: "var(--sp-md)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "var(--sp-sm)",
          }}
        >
          <span
            style={{
              fontSize: "var(--fs-eyebrow)",
              fontWeight: 600,
              letterSpacing: "var(--ls-eyebrow)",
              textTransform: "uppercase",
              color: "var(--c-ink-muted)",
            }}
          >
            Friction Score
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-metric-lg)",
              fontWeight: 500,
              color: fillColor,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {friction.toFixed(2)}
          </span>
        </div>
        {/* Friction bar */}
        <div className="friction-bar-track">
          <div
            className="friction-bar-fill"
            style={{
              width: `${friction * 100}%`,
              background: fillColor,
            }}
          />
        </div>
        {/* Threshold marker */}
        <div
          style={{
            position: "relative",
            height: "var(--sp-sm)",
            marginTop: "2px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${state.threshold * 100}%`,
              transform: "translateX(-50%)",
              fontSize: "var(--fs-micro)",
              fontFamily: "var(--font-mono)",
              color: "var(--c-ink-muted)",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            ↑ {state.threshold.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Bridge status rows */}
      <div
        style={{
          background: "var(--c-surface)",
          border: "1px solid var(--c-hairline)",
          borderRadius: "var(--r-sm)",
          padding: "var(--sp-md)",
        }}
      >
        <BridgeRow label="Remote Config" value={`threshold=${state.threshold}`} />
        <BridgeRow
          label="App Check"
          value="✓ verified"
          valueColor="var(--c-system1)"
        />
        <BridgeRow
          label="Gemini Nano 4"
          value={state.hasNano ? "✓ available" : "✗ unavailable"}
          valueColor={state.hasNano ? "var(--c-system1)" : "var(--c-system2)"}
        />
        <BridgeRow
          label="Cloud Model"
          value="gemini-2.0-flash"
          isMono
        />
        <BridgeRow
          label="Firestore"
          value={state.isOffline ? "offline → pendingQueue" : "online → sync"}
          valueColor={state.isOffline ? "var(--c-system2)" : "var(--c-system1)"}
          last
        />
      </div>
    </div>
  );
}

function BridgeRow({
  label,
  value,
  valueColor,
  isMono,
  last,
}: {
  label: string;
  value: string;
  valueColor?: string;
  isMono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "var(--sp-sm) 0",
        borderBottom: last ? "none" : "1px solid var(--c-hairline)",
        fontSize: "var(--fs-ui-sm)",
      }}
    >
      <span style={{ color: "var(--c-ink-secondary)" }}>{label}</span>
      <span
        style={{
          color: valueColor || "var(--c-ink)",
          fontFamily: isMono ? "var(--font-mono)" : "inherit",
          fontSize: isMono ? "var(--fs-code)" : "inherit",
          fontVariantNumeric: isMono ? "tabular-nums" : "normal",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function formatReason(reason: string): string {
  switch (reason) {
    case "below-threshold":
      return "Friction below threshold";
    case "above-threshold":
      return "Friction exceeded threshold";
    case "manual-trigger":
      return "Manual trigger (Alt+Shift+C)";
    case "nano-unavailable":
      return "Fallback — no Nano";
    case "fallback":
      return "Cloud fallback";
    default:
      return reason;
  }
}
