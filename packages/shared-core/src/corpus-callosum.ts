/**
 * Corpus Callosum Router — the bridge between System 1 (on-device)
 * and System 2 (cloud).
 *
 * Decides which hemisphere handles the current context based on:
 * 1. Device capability (is Gemini Nano 4 available?)
 * 2. Friction score vs. Remote Config threshold
 * 3. Manual trigger (Alt + Shift + C)
 *
 * When Nano is unavailable, all processing falls back to cloud.
 * When friction is below threshold, System 1 handles it locally ($0, <20ms).
 * When friction exceeds threshold, escalate to System 2 (cloud Gemini).
 */

import type {
  DeviceCapability,
  FrictionScore,
  Hemisphere,
  RemoteConfigValues,
  RoutingDecision,
} from "./types.js";

/** Default Remote Config values (used before Firebase fetch completes). */
export const DEFAULT_REMOTE_CONFIG: RemoteConfigValues = {
  frictionEscalationThreshold: 0.75,
  cloudModel: "gemini-2.0-flash",
  appCheckEnforced: true,
};

/**
 * Decide which hemisphere should handle the current context.
 *
 * @param friction — current friction score from System 1
 * @param device — device capability (Nano availability)
 * @param config — Remote Config values (threshold, model)
 * @param manualTrigger — true if the user pressed Alt + Shift + C
 *
 * @returns A routing decision telling the app which system to invoke
 *
 * @example
 * const decision = route({
 *   friction: { value: 0.82, ... },
 *   device: { hasNano: true },
 *   config: DEFAULT_REMOTE_CONFIG,
 * });
 * // decision.hemisphere === "system2" (friction above 0.75)
 *
 * @example
 * const decision = route({
 *   friction: { value: 0.30, ... },
 *   device: { hasNano: false },
 *   config: DEFAULT_REMOTE_CONFIG,
 * });
 * // decision.hemisphere === "system2" (fallback: no Nano)
 * // decision.reason === "nano-unavailable"
 */
export function route(params: {
  friction: FrictionScore;
  device: DeviceCapability;
  config: RemoteConfigValues;
  manualTrigger?: boolean;
}): RoutingDecision {
  const { friction, device, config, manualTrigger = false } = params;
  const threshold = config.frictionEscalationThreshold;

  // 1. Manual trigger always escalates to System 2
  if (manualTrigger) {
    return {
      hemisphere: "system2",
      reason: "manual-trigger",
      friction: friction.value,
      threshold,
      isFallback: !device.hasNano,
    };
  }

  // 2. No Nano → fallback to cloud regardless of friction
  if (!device.hasNano) {
    return {
      hemisphere: "system2",
      reason: "nano-unavailable",
      friction: friction.value,
      threshold,
      isFallback: true,
    };
  }

  // 3. Friction above threshold → escalate to System 2
  if (friction.value >= threshold) {
    return {
      hemisphere: "system2",
      reason: "above-threshold",
      friction: friction.value,
      threshold,
      isFallback: false,
    };
  }

  // 4. Friction below threshold → System 1 handles it locally
  return {
    hemisphere: "system1",
    reason: "below-threshold",
    friction: friction.value,
    threshold,
    isFallback: false,
  };
}

/**
 * Update the friction score based on a signal.
 *
 * Signals that increase friction:
 * - text-revision: user is editing/revising text frequently
 * - idle-pause: user stopped typing for a while (stuck?)
 * - context-switch: user jumped to a different tab/document
 *
 * @param current — the current friction score
 * @param trigger — what caused this update
 *
 * @returns A new FrictionScore with the updated value
 */
export function updateFriction(
  current: FrictionScore,
  trigger: FrictionScore["trigger"],
): FrictionScore {
  let value = current.value;

  switch (trigger) {
    case "text-revision":
      // Revisions increase friction (user is struggling with the text)
      value = Math.min(1, value + 0.08);
      break;
    case "idle-pause":
      // Long idle pauses increase friction (user is stuck)
      value = Math.min(1, value + 0.05);
      break;
    case "context-switch":
      // Context switches increase friction slightly (fragmented attention)
      value = Math.min(1, value + 0.03);
      break;
    case "manual":
      // Manual reset
      value = 0;
      break;
  }

  // Decay: friction slowly decays when no signal fires
  // (handled by the caller passing a decayed value as `current`)

  return {
    value: Math.round(value * 100) / 100, // keep 2 decimal places
    trigger,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Apply natural decay to the friction score.
 * Call this on a timer (e.g., every 30s) when no signal fires.
 *
 * @param current — the current friction score
 * @param decayRate — how much to subtract per tick (default 0.02)
 */
export function decayFriction(
  current: FrictionScore,
  decayRate = 0.02,
): FrictionScore {
  const value = Math.max(0, current.value - decayRate);
  return {
    value: Math.round(value * 100) / 100,
    trigger: current.trigger,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get the label for a hemisphere (for UI status pills).
 */
export function hemisphereLabel(hemisphere: Hemisphere): string {
  return hemisphere === "system1"
    ? "System 1 — On-Device"
    : "System 2 — Cloud";
}
