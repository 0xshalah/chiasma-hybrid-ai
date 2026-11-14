/**
 * @chiasma/shared-core — the Corpus Callosum shared library.
 *
 * Three exports, three responsibilities:
 * - pii-scrubber: detect and redact sensitive data locally
 * - corpus-callosum: route between System 1 and System 2
 * - context-packet: distill context into ≤300 token packets
 *
 * Used by:
 * - packages/chrome-extension (Side Panel, Gemini Nano 4)
 * - packages/android-app (Kotlin port, Jetpack Compose)
 * - packages/web-sandbox (Live Sandbox simulation)
 */

// Types
export type {
  Hemisphere,
  Surface,
  FrictionScore,
  ContextPacket,
  ContextNode,
  DeviceCapability,
  RemoteConfigValues,
  PIIMatch,
  PIIPatternType,
  ScrubResult,
  RoutingDecision,
} from "./types.js";

// PII Scrubber
export { scrubPII, containsPII, REDACTION_PLACEHOLDER } from "./pii-scrubber.js";

// Corpus Callosum Router
export {
  route,
  updateFriction,
  decayFriction,
  hemisphereLabel,
  DEFAULT_REMOTE_CONFIG,
} from "./corpus-callosum.js";

// Context Packet
export {
  buildContextPacket,
  estimateTokens,
  truncateToTokens,
  extractEntities,
  serializePacket,
  deserializePacket,
  MAX_PACKET_TOKENS,
} from "./context-packet.js";
