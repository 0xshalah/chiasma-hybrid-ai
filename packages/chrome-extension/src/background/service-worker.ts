/**
 * Service worker (background script) — the brain of the Chrome extension.
 *
 * Flow:
 *   TEXT_CHANGED → scrubPII → buildContextPacket → updateFriction → route
 *   → write to chrome.storage.local → broadcast to side panel
 *
 *   ESCALATE_REQUEST → fetch cloud synthesis → store result → broadcast
 *
 * Runs shared-core functions directly (no network call for System 1).
 */

import {
  scrubPII,
  buildContextPacket,
  updateFriction,
  decayFriction,
  route,
  DEFAULT_REMOTE_CONFIG,
} from "@chiasma/shared-core";

import type {
  ScrubResult,
  ContextPacket,
  FrictionScore,
  RoutingDecision,
} from "@chiasma/shared-core";

import {
  STORAGE_KEY,
  DEFAULT_STATE,
  type ExtensionState,
  type ExtensionStage,
} from "../shared/messages";

const FRICTION_THRESHOLD = 0.75;
const DECAY_INTERVAL_MS = 30_000;

// ── State ──────────────────────────────────────────────

let currentFriction: FrictionScore = {
  value: 0,
  trigger: "manual",
  timestamp: new Date().toISOString(),
};

const deviceCapability = { hasNano: true };

// ── Storage helpers ─────────────────────────────────────

async function patchState(patch: Partial<ExtensionState>): Promise<void> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const current = (result[STORAGE_KEY] as ExtensionState) ?? DEFAULT_STATE;
  const next = { ...current, ...patch };
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
}

async function getState(): Promise<ExtensionState> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as ExtensionState) ?? DEFAULT_STATE;
}

// ── Broadcast to side panel ─────────────────────────────

function broadcast(msg: Record<string, unknown>): void {
  chrome.runtime.sendMessage(msg).catch(() => {
    // Side panel may not be open — ignore
  });
}

// ── Pipeline: TEXT_CHANGED ──────────────────────────────

async function handleTextChanged(text: string, source: string): Promise<void> {
  // 1. Scrub PII
  const scrubResult: ScrubResult = scrubPII(text);
  await patchState({ scrubResult, stage: "scrubbing" });
  broadcast({ type: "SCRUB_RESULT", result: scrubResult });
  broadcast({ type: "STAGE_UPDATE", stage: "scrubbing" as ExtensionStage });

  // 2. Build context packet from scrubbed text
  const packet: ContextPacket = buildContextPacket(
    scrubResult.redacted,
    source,
    "chrome-extension",
  );
  await patchState({ contextPacket: packet, stage: "distilling" });
  broadcast({ type: "CONTEXT_PACKET", packet });
  broadcast({ type: "STAGE_UPDATE", stage: "distilling" as ExtensionStage });

  // 3. Update friction (text-revision signal)
  currentFriction = updateFriction(currentFriction, "text-revision");
  await patchState({ friction: currentFriction, stage: "routing" });
  broadcast({ type: "FRICTION_UPDATE", friction: currentFriction });
  broadcast({ type: "STAGE_UPDATE", stage: "routing" as ExtensionStage });

  // 4. Route the decision
  const routing: RoutingDecision = route({
    friction: currentFriction,
    device: deviceCapability,
    config: { ...DEFAULT_REMOTE_CONFIG, frictionEscalationThreshold: FRICTION_THRESHOLD },
    manualTrigger: false,
  });
  await patchState({
    routing,
    stage: routing.hemisphere === "system2" ? "cloud" : "done",
  });
  broadcast({ type: "ROUTING_DECISION", routing });
  broadcast({
    type: "STAGE_UPDATE",
    stage: (routing.hemisphere === "system2" ? "cloud" : "done") as ExtensionStage,
  });
}

// ── Pipeline: ESCALATE_REQUEST ──────────────────────────

async function handleEscalateRequest(): Promise<void> {
  const state = await getState();

  if (!state.contextPacket) {
    broadcast({ type: "SYNTHESIS_ERROR", error: "No context packet to escalate" });
    return;
  }

  await patchState({ synthesisLoading: true, synthesisError: null });

  const endpoint =
    typeof __FIREBASE_API_KEY__ !== "undefined" && __FIREBASE_API_KEY__
      ? `https://generativelanguage.googleapis.com/v1beta/models/${__GEMINI_CLOUD_MODEL__}:generateContent?key=${__FIREBASE_API_KEY__}`
      : "";

  if (!endpoint) {
    // No Firebase config — return a local placeholder so the UI still works
    const placeholder = "Cloud reasoning unavailable (no API key configured). System 1 handled this locally — friction was below threshold, so no cloud call was needed.";
    await patchState({ synthesis: placeholder, synthesisLoading: false });
    broadcast({ type: "SYNTHESIS_RESULT", synthesis: placeholder });
    return;
  }

  try {
    const prompt = `You are CHIASMA System 2. Analyze this context packet and provide a concise synthesis:\n\n${JSON.stringify(state.contextPacket, null, 2)}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloud returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const synthesis =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No synthesis returned from cloud model.";

    await patchState({ synthesis, synthesisLoading: false });
    broadcast({ type: "SYNTHESIS_RESULT", synthesis });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown cloud error";
    await patchState({ synthesisLoading: false, synthesisError: error });
    broadcast({ type: "SYNTHESIS_ERROR", error });
  }
}

// ── Friction decay timer ────────────────────────────────

setInterval(() => {
  if (currentFriction.value > 0) {
    currentFriction = decayFriction(currentFriction);
    patchState({ friction: currentFriction }).catch(() => {});
  }
}, DECAY_INTERVAL_MS);

// ── Message listener ────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (msg: { type: string; text?: string; source?: string }, _sender, _sendResponse) => {
    if (msg.type === "TEXT_CHANGED" && msg.text !== undefined) {
      handleTextChanged(msg.text, msg.source ?? "unknown").catch((err) => {
        console.error("[CHIASMA SW] TEXT_CHANGED handler failed:", err);
      });
    } else if (msg.type === "ESCALATE_REQUEST") {
      handleEscalateRequest().catch((err) => {
        console.error("[CHIASMA SW] ESCALATE_REQUEST handler failed:", err);
      });
    }
    // Return true to indicate async response (though we don't use sendResponse)
    return false;
  },
);

// ── Side panel open on action click ─────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(() => {});
});

// ── Type declarations for build-time env vars ──────────

declare const __FIREBASE_API_KEY__: string;
declare const __GEMINI_CLOUD_MODEL__: string;
