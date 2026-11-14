/**
 * StagePill — AI pipeline stage indicator.
 * Pattern from cursor's DESIGN.md: 5 pastel stage tokens, used ONLY
 * for in-product pipeline visualization, never as system action colors.
 *
 * Stages map to CHIASMA's real pipeline:
 *   scrubbing  → PII Scrubber active (peach)
 *   distilling → Context Packet building (mint)
 *   routing    → Corpus Callosum deciding (blue)
 *   cloud      → Cloud reasoning engaged (lavender)
 *   done       → Synthesis complete (gold)
 */

export type PipelineStage =
  | "idle"
  | "scrubbing"
  | "distilling"
  | "routing"
  | "cloud"
  | "done";

interface StagePillProps {
  stage: PipelineStage;
}

const STAGE_LABELS: Record<PipelineStage, string> = {
  idle: "Idle",
  scrubbing: "Scrubbing PII",
  distilling: "Distilling context",
  routing: "Routing",
  cloud: "Cloud reasoning",
  done: "Synthesis done",
};

export function StagePill({ stage }: StagePillProps) {
  const cls = stage === "idle" ? "pill pill-idle" : `pill pill-stage-${stage}`;
  return <span className={cls}>{STAGE_LABELS[stage]}</span>;
}

/** Derive the pipeline stage from sandbox state properties. */
export function deriveStage(
  hasPII: boolean,
  hasPacket: boolean,
  routing: { hemisphere: string; reason: string } | null,
  isSystem2: boolean,
): PipelineStage {
  if (!hasPII && !hasPacket && !routing) return "idle";
  if (hasPII && !hasPacket) return "scrubbing";
  if (hasPacket && !routing) return "distilling";
  if (routing && !isSystem2) return "routing";
  if (isSystem2) return "cloud"; // "done" removed — route() never returns reason "done"
  return "routing";
}
