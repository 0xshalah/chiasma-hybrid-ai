/**
 * Column 3 — Corpus Callosum Bridge.
 *
 * Techniques:
 * - useAnimatedCounter: friction score and token count animate on change
 * - surface ladder (linear.app pattern): inner rows one shadow-step above container
 */

import { useSandbox } from "./sandbox-context.tsx";
import { useAnimatedCounter } from "./hooks.ts";

export function CorpusCallosumBridge() {
  const { state } = useSandbox();
  const isSystem2 = state.routing?.hemisphere === "system2";
  const fillColor = isSystem2 ? "var(--c-system2)" : "var(--c-system1)";

  // Animated friction counter — re-runs every time friction.value changes
  const { display: frictionDisplay, ref: frictionRef } = useAnimatedCounter({
    to: state.friction.value,
    from: 0,
    duration: 0.8,
    decimals: 2,
  });

  // Animated token count
  const tokenCount = state.contextPacket?.tokenCount ?? 0;
  const { display: tokenDisplay, ref: tokenRef } = useAnimatedCounter({
    to: tokenCount,
    from: 0,
    duration: 0.6,
    decimals: 0,
    suffix: " tok",
  });

  return (
    <div
      style={{
        background: "var(--c-surface-raised)",
        borderRadius: "var(--r-lg)",
        padding: "var(--sp-xl)",
        boxShadow: "var(--shadow-raised)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-sm)",
        height: "100%",
        minHeight: "380px",
      }}
    >
      <div className="frame-chrome">Corpus Callosum Bridge</div>

      {/* Routing decision banner */}
      <div
        className={isSystem2 ? "card card-system2" : "card card-system1"}
        style={{ padding: "var(--sp-md)", textAlign: "center" }}
      >
        <div style={{ fontSize: "var(--fs-ui-sm)", fontWeight: 600, marginBottom: "var(--sp-xs)", opacity: 0.8 }}>
          Routing Decision
        </div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-display-md)", lineHeight: 1.2 }}>
          {isSystem2 ? "Cloud" : "Local"}
        </div>
        <div style={{ fontSize: "var(--fs-ui-sm)", marginTop: "var(--sp-xs)", opacity: 0.7 }}>
          {state.routing ? formatReason(state.routing.reason) : "Awaiting input"}
        </div>
      </div>

      {/* Friction gauge */}
      <div
        style={{
          background: "var(--c-surface)",
          borderRadius: "var(--r-sm)",
          padding: "var(--sp-md)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--sp-sm)" }}>
          <span style={{ fontSize: "var(--fs-ui-sm)", fontWeight: 600, color: "var(--c-ink-muted)" }}>
            Friction Score
          </span>
          <span
            ref={frictionRef as React.Ref<HTMLSpanElement>}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-metric-lg)",
              fontWeight: 500,
              color: fillColor,
              fontVariantNumeric: "tabular-nums",
              transition: "color 0.4s ease",
            }}
          >
            {frictionDisplay}
          </span>
        </div>
        <div className="friction-bar-track">
          <div
            className="friction-bar-fill"
            style={{ transform: `scaleX(${state.friction.value})`, background: fillColor }}
          />
        </div>
        <div style={{ position: "relative", height: "var(--sp-sm)", marginTop: "2px" }}>
          <div style={{
            position: "absolute",
            left: `${state.threshold * 100}%`,
            transform: "translateX(-50%)",
            fontSize: "var(--fs-micro)",
            fontFamily: "var(--font-mono)",
            color: "var(--c-ink-muted)",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}>
            ↑ {state.threshold.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Token counter */}
      {tokenCount > 0 && (
        <div style={{
          background: "var(--c-surface)",
          borderRadius: "var(--r-sm)",
          padding: "var(--sp-sm) var(--sp-md)",
          boxShadow: "var(--shadow-card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "var(--fs-ui-sm)", color: "var(--c-ink-secondary)" }}>Context packet</span>
          <span
            ref={tokenRef as React.Ref<HTMLSpanElement>}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-ui-sm)",
              fontWeight: 600,
              color: "var(--c-system1)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {tokenDisplay}
          </span>
        </div>
      )}

      {/* Bridge status rows */}
      <div
        style={{
          background: "var(--c-surface)",
          borderRadius: "var(--r-sm)",
          padding: "var(--sp-md)",
          boxShadow: "var(--shadow-card)",
          flex: 1,
        }}
      >
        <BridgeRow label="Remote Config" value={`threshold=${state.threshold}`} />
        <BridgeRow label="App Check" value="verified" valueColor="var(--c-system1)" />
        <BridgeRow label="Gemini Nano 4" value={state.hasNano ? "available" : "unavailable"} valueColor={state.hasNano ? "var(--c-system1)" : "var(--c-system2)"} />
        <BridgeRow label="Cloud Model" value="gemini-2.0-flash" isMono />
        <BridgeRow label="Firestore" value={state.isOffline ? "offline → queue" : "online → sync"} valueColor={state.isOffline ? "var(--c-system2)" : "var(--c-system1)"} last />
      </div>
    </div>
  );
}

function BridgeRow({ label, value, valueColor, isMono, last }: {
  label: string; value: string; valueColor?: string; isMono?: boolean; last?: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "var(--sp-sm) 0",
      borderBottom: last ? "none" : "1px solid var(--c-hairline)",
      fontSize: "var(--fs-ui-sm)",
    }}>
      <span style={{ color: "var(--c-ink-secondary)" }}>{label}</span>
      <span style={{
        color: valueColor || "var(--c-ink)",
        fontFamily: isMono ? "var(--font-mono)" : "inherit",
        fontSize: isMono ? "var(--fs-code)" : "inherit",
        fontVariantNumeric: isMono ? "tabular-nums" : "normal",
      }}>
        {value}
      </span>
    </div>
  );
}

function formatReason(reason: string): string {
  const map: Record<string, string> = {
    "below-threshold": "Friction below threshold",
    "above-threshold": "Friction exceeded threshold",
    "manual-trigger": "Manual trigger (Alt+Shift+C)",
    "nano-unavailable": "Fallback — no Nano",
    "fallback": "Cloud fallback",
  };
  return map[reason] ?? reason;
}
