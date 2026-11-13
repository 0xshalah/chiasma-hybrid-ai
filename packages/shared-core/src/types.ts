/**
 * CHIASMA shared-core type definitions.
 * Used by Chrome Extension, Android App (via Kotlin port), and Web Sandbox.
 */

/** The two AI hemispheres. */
export type Hemisphere = "system1" | "system2";

/** Where a context node was captured. */
export type Surface = "chrome-extension" | "android-app" | "web-sandbox";

/** Friction score: 0.00 (no friction) to 1.00 (high friction). */
export interface FrictionScore {
  /** Current value, 0.00 – 1.00 */
  value: number;
  /** What triggered the last update */
  trigger: "text-revision" | "idle-pause" | "context-switch" | "manual";
  /** ISO timestamp of last update */
  timestamp: string;
}

/**
 * A compressed context packet distilled by System 1.
 * Must stay within MAX_PACKET_TOKENS (300).
 */
export interface ContextPacket {
  /** Structured summary of active context */
  summary: string;
  /** Key terms / entities detected */
  entities: string[];
  /** Active file/tab/document reference */
  source: string;
  /** Surface where the packet was created */
  surface: Surface;
  /** Estimated token count */
  tokenCount: number;
  /** ISO timestamp */
  timestamp: string;
}

/**
 * A context node synced to Firestore, shared cross-device.
 */
export interface ContextNode {
  /** Firestore document ID */
  id: string;
  /** Owning user ID (Firebase Auth UID) */
  userId: string;
  /** The distilled packet */
  packet: ContextPacket;
  /** Which hemisphere processed this node */
  hemisphere: Hemisphere;
  /** Source surface */
  surface: Surface;
  /** True while in the offline pendingQueue, false once synced */
  pending: boolean;
  /** ISO timestamp of creation */
  createdAt: string;
  /** ISO timestamp of last Firestore sync */
  syncedAt: string | null;
}

/** Whether Gemini Nano 4 is available on this device. */
export interface DeviceCapability {
  hasNano: boolean;
  /** Why Nano is unavailable, if applicable */
  reason?: "not-supported" | "not-downloaded" | "not-enabled" | "unknown";
}

/** Values pulled from Firebase Remote Config. */
export interface RemoteConfigValues {
  /** Friction score that triggers cloud escalation (default 0.75) */
  frictionEscalationThreshold: number;
  /** Cloud model to use for System 2 */
  cloudModel: string;
  /** Whether App Check enforcement is active */
  appCheckEnforced: boolean;
}

/** A single PII pattern match. */
export interface PIIMatch {
  /** The pattern type that matched */
  type: PIIPatternType;
  /** The matched text (redacted in output, kept here for logging) */
  matched: string;
  /** Start index in the original text */
  start: number;
  /** End index in the original text */
  end: number;
}

/** Types of PII the scrubber can detect. */
export type PIIPatternType =
  | "stripe-key"
  | "aws-key"
  | "google-api-key"
  | "jwt-token"
  | "bearer-token"
  | "private-key"
  | "email"
  | "credit-card"
  | "phone";

/** Result of running the PII scrubber on text. */
export interface ScrubResult {
  /** The text with sensitive content replaced by [REDACTED_PII] */
  redacted: string;
  /** All matches found */
  matches: PIIMatch[];
  /** Whether any PII was found */
  hasPII: boolean;
}

/** Decision from the Corpus Callosum Router. */
export interface RoutingDecision {
  /** Which hemisphere to route to */
  hemisphere: Hemisphere;
  /** Why this route was chosen */
  reason: "below-threshold" | "above-threshold" | "manual-trigger" | "nano-unavailable" | "fallback";
  /** The friction score at decision time */
  friction: number;
  /** The threshold compared against */
  threshold: number;
  /** Whether this is a fallback (no Nano) */
  isFallback: boolean;
}
