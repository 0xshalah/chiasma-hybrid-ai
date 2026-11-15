/**
 * CHIASMA Side Panel — Dark-first redesign (Raycast surface ladder).
 *
 * Layout:
 *   Header (sticky): logo + stage pill
 *   Body: PIIFeed → ContextCard → FrictionBar → BridgeStatus → SynthesisCard
 *   Footer: privacy statement
 *
 * New in dark-first upgrade:
 * - BridgeStatus section: Raycast cmd-palette row hover pattern (Technique 6)
 * - Panel entrance animation: slide-in from right (Technique 3)
 * - Stage dot pulse: active on non-idle (Technique 4 — in StagePill)
 * - Friction glow: box-shadow on threshold (Technique 4 — in FrictionBar)
 */

import { useSandboxState } from "./hooks/useSandboxState";
import { StagePill } from "./components/StagePill";
import { PIIFeed } from "./components/PIIFeed";
import { ContextCard } from "./components/ContextCard";
import { FrictionBar } from "./components/FrictionBar";
import { SynthesisCard } from "./components/SynthesisCard";

export function App() {
  const { state, escalate } = useSandboxState();
  const isSystem2 = state.routing?.hemisphere === "system2";

  return (
    <div className="chiasma-panel">
      <header className="panel-header">
        <div className="panel-logo">CHIASMA</div>
        <StagePill stage={state.stage} />
      </header>

      <main className="panel-body" role="main" aria-label="CHIASMA pipeline status">
        <PIIFeed scrubResult={state.scrubResult} />
        <ContextCard packet={state.contextPacket} />
        <FrictionBar friction={state.friction} routing={state.routing} />

        {/* Bridge status rows — Raycast cmd-palette hover pattern (Technique 6) */}
        <div className="card">
          <div className="card-label">Bridge status</div>
          <BridgeRow
            label="Remote Config"
            value="threshold 0.75"
          />
          <BridgeRow
            label="App Check"
            value="verified"
            valueVariant="system1"
          />
          <BridgeRow
            label="Gemini Nano 4"
            value="available"
            valueVariant="system1"
          />
          <BridgeRow
            label="Cloud model"
            value="gemini-2.0-flash"
          />
          <BridgeRow
            label="Routing"
            value={isSystem2 ? "System 2" : "System 1"}
            valueVariant={isSystem2 ? "system2" : "system1"}
          />
        </div>

        <SynthesisCard
          synthesis={state.synthesis}
          loading={state.synthesisLoading}
          error={state.synthesisError}
          onEscalate={escalate}
          routing={state.routing}
        />
      </main>

      <footer className="panel-footer">
        Your secrets stay on your device. Always.
      </footer>
    </div>
  );
}

/** Raycast cmd-palette row — hover bg step-up, hairline divider (Technique 6). */
function BridgeRow({
  label,
  value,
  valueVariant,
}: {
  label: string;
  value: string;
  valueVariant?: "system1" | "system2";
}) {
  return (
    <div className="bridge-row">
      <span className="bridge-row-label">{label}</span>
      <span
        className={`bridge-row-value${valueVariant ? ` bridge-row-value--${valueVariant}` : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
