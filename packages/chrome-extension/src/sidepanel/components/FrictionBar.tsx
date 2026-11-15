import type { FrictionScore, RoutingDecision } from "@chiasma/shared-core";

const THRESHOLD = 0.75;

export function FrictionBar({
  friction,
  routing,
}: {
  friction: FrictionScore | null;
  routing: RoutingDecision | null;
}) {
  const value = friction?.value ?? 0;
  const pct = Math.min(100, value * 100);
  const thresholdPct = THRESHOLD * 100;

  const isSystem2 = routing?.hemisphere === "system2";

  return (
    <div className="card">
      <div className="card-label">
        Friction
        <span className="friction-value" style={{ color: isSystem2 ? "var(--c-system2)" : "var(--c-ink)" }}>
          {value.toFixed(2)}
        </span>
      </div>

      <div className="friction-track">
        <div
          className="friction-fill"
          style={{
            transform: `scaleX(${pct / 100})`,
            background: isSystem2 ? "var(--c-system2)" : "var(--c-system1)",
          }}
        />
        <div className="friction-threshold" style={{ left: `${thresholdPct}%` }} />
      </div>

      <div className="friction-labels">
        <span>System 1 (local)</span>
        <span>System 2 (cloud)</span>
      </div>

      {routing && (
        <div className="routing-decision" style={{ color: isSystem2 ? "var(--c-system2-ink)" : "var(--c-system1-ink)" }}>
          Routed to {routing.hemisphere === "system1" ? "System 1 — On-Device" : "System 2 — Cloud"}
          <span className="routing-reason">{routing.reason.replace("-", " ")}</span>
        </div>
      )}
    </div>
  );
}
