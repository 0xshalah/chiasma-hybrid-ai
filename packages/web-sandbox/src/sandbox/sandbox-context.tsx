/**
 * Sandbox shared state — connects all 4 columns.
 *
 * Column 1 (Desktop Editor) writes text → Column 2 (Side Panel) scrubs PII
 * and distills context → Column 3 (Corpus Callosum) routes the decision →
 * Column 4 (Android Companion) captures and syncs context nodes.
 *
 * Uses @chiasma/shared-core for PII scrubbing, context distillation, and routing.
 */

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import {
  scrubPII,
  buildContextPacket,
  route,
  updateFriction,
  decayFriction,
  type ScrubResult,
  type ContextPacket,
  type FrictionScore,
  type RoutingDecision,
  type ContextNode,
} from "@chiasma/shared-core";

// ── State ──

interface SandboxState {
  editorText: string;
  scrubResult: ScrubResult;
  contextPacket: ContextPacket | null;
  friction: FrictionScore;
  routing: RoutingDecision | null;
  threshold: number;
  hasNano: boolean;
  isOffline: boolean;
  pendingQueue: ContextNode[];
  syncedNodes: ContextNode[];
  manualTrigger: boolean;
}

const initialState: SandboxState = {
  editorText: "// Start typing or click a preset below…",
  scrubResult: { redacted: "", matches: [], hasPII: false },
  contextPacket: null,
  friction: { value: 0, trigger: "manual", timestamp: new Date().toISOString() },
  routing: null,
  threshold: 0.75,
  hasNano: true,
  isOffline: false,
  pendingQueue: [],
  syncedNodes: [],
  manualTrigger: false,
};

// ── Actions ──

type Action =
  | { type: "SET_EDITOR_TEXT"; text: string }
  | { type: "INJECT_SECRET" }
  | { type: "SIMULATE_CODING" }
  | { type: "RESET_FRICTION" }
  | { type: "TOGGLE_OFFLINE" }
  | { type: "CAPTURE_VOICE" }
  | { type: "SCAN_WHITEBOARD" }
  | { type: "SYNC_QUEUE" }
  | { type: "MANUAL_TRIGGER" }
  | { type: "CLEAR_MANUAL_TRIGGER" };

// ── Preset texts ──

const SECRET_TEXT = `// User profile config
const config = {
  email: "admin@chiasma.dev",
  phone: "+1-555-867-5309",
  card: "4111-1111-1111-1111",
  backup: "billing@chiasma.dev",
};`;

const CODING_TEXT = `function calculateFrictionScore(revisions, idleTime, contextSwitches) {
  const revisionWeight = 0.4;
  const idleWeight = 0.35;
  const switchWeight = 0.25;
  return Math.min(1,
    revisions * revisionWeight +
    idleTime * idleWeight +
    contextSwitches * switchWeight
  );
}

// TODO: figure out why the score keeps hitting 0.82
// I've revised this 7 times now and I'm stuck…`;

// ── Reducer ──

function reducer(state: SandboxState, action: Action): SandboxState {
  switch (action.type) {
    case "SET_EDITOR_TEXT": {
      const text = action.text;
      const scrubResult = scrubPII(text);
      const contextPacket = buildContextPacket(
        scrubResult.redacted,
        "editor.ts",
        "web-sandbox",
      );
      const friction = updateFriction(state.friction, "text-revision");
      const routing = route({
        friction,
        device: { hasNano: state.hasNano },
        config: {
          frictionEscalationThreshold: state.threshold,
          cloudModel: "gemini-2.0-flash",
          appCheckEnforced: true,
        },
        manualTrigger: state.manualTrigger,
      });
      return { ...state, editorText: text, scrubResult, contextPacket, friction, routing };
    }

    case "INJECT_SECRET": {
      const scrubResult = scrubPII(SECRET_TEXT);
      const contextPacket = buildContextPacket(
        scrubResult.redacted,
        "config.ts",
        "web-sandbox",
      );
      const friction = updateFriction(state.friction, "text-revision");
      const routing = route({
        friction,
        device: { hasNano: state.hasNano },
        config: {
          frictionEscalationThreshold: state.threshold,
          cloudModel: "gemini-2.0-flash",
          appCheckEnforced: true,
        },
        manualTrigger: state.manualTrigger,
      });
      return { ...state, editorText: SECRET_TEXT, scrubResult, contextPacket, friction, routing };
    }

    case "SIMULATE_CODING": {
      const scrubResult = scrubPII(CODING_TEXT);
      const contextPacket = buildContextPacket(
        scrubResult.redacted,
        "friction.ts",
        "web-sandbox",
      );
      // Simulate high friction (stuck on a problem)
      const friction: FrictionScore = {
        value: 0.82,
        trigger: "idle-pause",
        timestamp: new Date().toISOString(),
      };
      const routing = route({
        friction,
        device: { hasNano: state.hasNano },
        config: {
          frictionEscalationThreshold: state.threshold,
          cloudModel: "gemini-2.0-flash",
          appCheckEnforced: true,
        },
        manualTrigger: state.manualTrigger,
      });
      return { ...state, editorText: CODING_TEXT, scrubResult, contextPacket, friction, routing };
    }

    case "RESET_FRICTION": {
      const friction: FrictionScore = {
        value: 0,
        trigger: "manual",
        timestamp: new Date().toISOString(),
      };
      const routing = route({
        friction,
        device: { hasNano: state.hasNano },
        config: {
          frictionEscalationThreshold: state.threshold,
          cloudModel: "gemini-2.0-flash",
          appCheckEnforced: true,
        },
        manualTrigger: false,
      });
      // Full reset: clear editor, PII feed, context packet, and routing too
      return {
        ...state,
        editorText: "// Start typing or click a preset below…",
        scrubResult: { redacted: "", matches: [], hasPII: false },
        contextPacket: null,
        friction,
        routing,
        manualTrigger: false,
      };
    }

    case "TOGGLE_OFFLINE": {
      return { ...state, isOffline: !state.isOffline };
    }

    case "CAPTURE_VOICE": {
      const packet = buildContextPacket(
        "Voice memo: Need to refactor the friction calculation module. The weight distribution feels off.",
        "voice-memo-001",
        "android-app",
      );
      const node: ContextNode = {
        id: crypto.randomUUID(),
        userId: "demo-user",
        packet,
        hemisphere: "system1",
        surface: "android-app",
        pending: state.isOffline,
        createdAt: new Date().toISOString(),
        syncedAt: state.isOffline ? null : new Date().toISOString(),
      };
      if (state.isOffline) {
        return { ...state, pendingQueue: [...state.pendingQueue, node] };
      }
      return { ...state, syncedNodes: [...state.syncedNodes, node] };
    }

    case "SCAN_WHITEBOARD": {
      const packet = buildContextPacket(
        "Whiteboard scan: Architecture diagram showing System 1 → Corpus Callosum → System 2 routing flow with Firestore sync.",
        "whiteboard-001",
        "android-app",
      );
      const node: ContextNode = {
        id: crypto.randomUUID(),
        userId: "demo-user",
        packet,
        hemisphere: "system1",
        surface: "android-app",
        pending: state.isOffline,
        createdAt: new Date().toISOString(),
        syncedAt: state.isOffline ? null : new Date().toISOString(),
      };
      if (state.isOffline) {
        return { ...state, pendingQueue: [...state.pendingQueue, node] };
      }
      return { ...state, syncedNodes: [...state.syncedNodes, node] };
    }

    case "SYNC_QUEUE": {
      const synced = state.pendingQueue.map((n) => ({
        ...n,
        pending: false,
        syncedAt: new Date().toISOString(),
      }));
      return {
        ...state,
        pendingQueue: [],
        syncedNodes: [...state.syncedNodes, ...synced],
      };
    }

    case "MANUAL_TRIGGER": {
      const routing = route({
        friction: state.friction,
        device: { hasNano: state.hasNano },
        config: {
          frictionEscalationThreshold: state.threshold,
          cloudModel: "gemini-2.0-flash",
          appCheckEnforced: true,
        },
        manualTrigger: true,
      });
      return { ...state, manualTrigger: true, routing };
    }

    case "CLEAR_MANUAL_TRIGGER": {
      const routing = route({
        friction: state.friction,
        device: { hasNano: state.hasNano },
        config: {
          frictionEscalationThreshold: state.threshold,
          cloudModel: "gemini-2.0-flash",
          appCheckEnforced: true,
        },
        manualTrigger: false,
      });
      return { ...state, manualTrigger: false, routing };
    }

    default:
      return state;
  }
}

// ── Context ──

interface SandboxContextValue {
  state: SandboxState;
  dispatch: React.Dispatch<Action>;
}

const SandboxContext = createContext<SandboxContextValue | null>(null);

export function SandboxProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SandboxContext.Provider value={{ state, dispatch }}>
      {children}
    </SandboxContext.Provider>
  );
}

export function useSandbox() {
  const ctx = useContext(SandboxContext);
  if (!ctx) throw new Error("useSandbox must be used within SandboxProvider");
  return ctx;
}
