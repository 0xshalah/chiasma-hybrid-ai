/**
 * Typed message bus — shared between content script, service worker, and side panel.
 */
import type { ScrubResult, ContextPacket, FrictionScore, RoutingDecision } from "@chiasma/shared-core";

export type ChiasmaMessage =
  | { type: "TEXT_CHANGED"; text: string; source: string }
  | { type: "SCRUB_RESULT"; result: ScrubResult }
  | { type: "CONTEXT_PACKET"; packet: ContextPacket }
  | { type: "FRICTION_UPDATE"; friction: FrictionScore }
  | { type: "ROUTING_DECISION"; routing: RoutingDecision }
  | { type: "ESCALATE_REQUEST" }
  | { type: "SYNTHESIS_RESULT"; synthesis: string }
  | { type: "SYNTHESIS_ERROR"; error: string }
  | { type: "STAGE_UPDATE"; stage: ExtensionStage };

export type ExtensionStage =
  | "idle"
  | "scrubbing"
  | "distilling"
  | "routing"
  | "cloud"
  | "done";

export interface ExtensionState {
  scrubResult: ScrubResult | null;
  contextPacket: ContextPacket | null;
  friction: FrictionScore | null;
  routing: RoutingDecision | null;
  synthesis: string | null;
  synthesisLoading: boolean;
  synthesisError: string | null;
  stage: ExtensionStage;
}

export const STORAGE_KEY = "chiasmaState";

export const DEFAULT_STATE: ExtensionState = {
  scrubResult: null,
  contextPacket: null,
  friction: null,
  routing: null,
  synthesis: null,
  synthesisLoading: false,
  synthesisError: null,
  stage: "idle",
};

export async function readState(): Promise<ExtensionState> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as ExtensionState) ?? DEFAULT_STATE;
}

export async function writeState(patch: Partial<ExtensionState>): Promise<void> {
  const current = await readState();
  await chrome.storage.local.set({ [STORAGE_KEY]: { ...current, ...patch } });
}

export function sendToRuntime(msg: ChiasmaMessage): void {
  chrome.runtime.sendMessage(msg).catch(() => {
    // Side panel may not be open — ignore connection errors
  });
}
