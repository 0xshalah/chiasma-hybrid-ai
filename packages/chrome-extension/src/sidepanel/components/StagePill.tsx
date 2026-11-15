import type { ExtensionStage } from "../../shared/messages";

const STAGE_CONFIG: Record<ExtensionStage, { label: string; bg: string; color: string }> = {
  idle: { label: "Idle", bg: "var(--c-hairline)", color: "var(--c-ink-muted)" },
  scrubbing: { label: "Scrubbing PII", bg: "var(--c-stage-scrubbing)", color: "var(--c-stage-ink)" },
  distilling: { label: "Distilling context", bg: "var(--c-stage-distilling)", color: "var(--c-stage-ink)" },
  routing: { label: "Routing", bg: "var(--c-stage-routing)", color: "var(--c-stage-ink)" },
  cloud: { label: "Cloud reasoning", bg: "var(--c-stage-cloud)", color: "var(--c-stage-ink)" },
  done: { label: "System 1 — Local", bg: "var(--c-stage-done)", color: "var(--c-stage-ink)" },
};

export function StagePill({ stage }: { stage: ExtensionStage }) {
  const config = STAGE_CONFIG[stage];
  return (
    <div className="stage-pill" style={{ background: config.bg, color: config.color }}>
      <span className="stage-dot" style={{ background: config.color }} />
      {config.label}
    </div>
  );
}
