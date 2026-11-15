/**
 * StagePill — dark-first pipeline stage indicator.
 * Dot pulses when stage is active (non-idle) — signals "system is alive".
 * Pattern: Raycast cmd-palette stage chips with animated status dot.
 */

import type { ExtensionStage } from "../../shared/messages";

interface StageConfig {
  label: string;
  bg: string;
  color: string;
  dotColor: string;
  border: string;
}

const STAGE_CONFIG: Record<ExtensionStage, StageConfig> = {
  idle: {
    label: "Idle",
    bg: "var(--c-surface-raised)",
    color: "var(--c-ink-muted)",
    dotColor: "var(--c-dot-idle)",
    border: "var(--c-hairline)",
  },
  scrubbing: {
    label: "Scrubbing PII",
    bg: "var(--c-stage-scrubbing)",
    color: "var(--c-stage-ink)",
    dotColor: "var(--c-dot-scrubbing)",
    border: "transparent",
  },
  distilling: {
    label: "Distilling",
    bg: "var(--c-stage-distilling)",
    color: "var(--c-stage-ink)",
    dotColor: "var(--c-dot-distilling)",
    border: "transparent",
  },
  routing: {
    label: "Routing",
    bg: "var(--c-stage-routing)",
    color: "var(--c-stage-ink)",
    dotColor: "var(--c-dot-routing)",
    border: "transparent",
  },
  cloud: {
    label: "Cloud reasoning",
    bg: "var(--c-stage-cloud)",
    color: "var(--c-stage-ink)",
    dotColor: "var(--c-dot-cloud)",
    border: "transparent",
  },
  done: {
    label: "System 1 — Local",
    bg: "var(--c-stage-done)",
    color: "var(--c-stage-ink)",
    dotColor: "var(--c-dot-done)",
    border: "transparent",
  },
};

export function StagePill({ stage }: { stage: ExtensionStage }) {
  const config = STAGE_CONFIG[stage];
  const isActive = stage !== "idle";

  return (
    <div
      className="stage-pill"
      style={{
        background: config.bg,
        color: config.color,
        borderColor: config.border,
      }}
    >
      <span
        className={`stage-dot${isActive ? " stage-dot--active" : ""}`}
        style={{ background: config.dotColor }}
        aria-hidden="true"
      />
      {config.label}
    </div>
  );
}
