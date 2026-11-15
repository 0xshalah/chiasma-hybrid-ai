# Design — CHIASMA Chrome Extension

**Status:** APPROVED (auto-approved per user directive 2026-11-15)
**Phase:** 4

---

## Architecture

```
packages/chrome-extension/
├── manifest.json              ← MV3, permissions: activeTab + sidePanel + storage
├── package.json               ← vite-based build, @chiasma/shared-core workspace alias
├── vite.config.ts             ← multi-entry: background + content + sidepanel
├── src/
│   ├── background/
│   │   └── service-worker.ts  ← handles messages, Firebase calls
│   ├── content/
│   │   └── content-script.ts  ← watches activeElement, sends text to SW
│   ├── sidepanel/
│   │   ├── index.html
│   │   ├── main.tsx           ← React root
│   │   ├── App.tsx            ← Side panel UI (360px)
│   │   ├── components/
│   │   │   ├── StagePill.tsx  ← reuse from web-sandbox pattern
│   │   │   ├── PIIFeed.tsx    ← live scrub output
│   │   │   ├── ContextCard.tsx← distilled packet display
│   │   │   ├── FrictionBar.tsx← scaleX bar
│   │   │   └── SynthesisCard.tsx ← cloud result
│   │   └── hooks/
│   │       └── useSandboxState.ts ← chrome.storage.local → React state
│   └── shared/
│       └── messages.ts        ← typed message bus between SW ↔ content ↔ sidepanel
```

## Component Interfaces

### Message Bus (content ↔ service-worker ↔ sidepanel)

```typescript
// src/shared/messages.ts
type ChiasmaMessage =
  | { type: "TEXT_CHANGED"; text: string; source: string }
  | { type: "SCRUB_RESULT"; result: ScrubResult }
  | { type: "CONTEXT_PACKET"; packet: ContextPacket }
  | { type: "FRICTION_UPDATE"; friction: FrictionScore }
  | { type: "ROUTING_DECISION"; routing: RoutingDecision }
  | { type: "ESCALATE_REQUEST" }
  | { type: "SYNTHESIS_RESULT"; synthesis: string }
  | { type: "SYNTHESIS_ERROR"; error: string };
```

### Content Script

- Watches `document.activeElement` for `<textarea>`, `<div contenteditable>`, and `.cm-content` (CodeMirror)
- Debounces 300ms before sending `TEXT_CHANGED` to service worker
- Uses `MutationObserver` on `document.body` to detect new editor elements
- Maximum text to send: 4000 chars (truncated, with `[TRUNCATED]` marker)

### Service Worker

```
TEXT_CHANGED
  → scrubPII(text)        → chrome.storage.local.set({scrubResult})
  → buildContextPacket()  → chrome.storage.local.set({contextPacket})
  → updateFriction()      → chrome.storage.local.set({friction})
  → route()               → chrome.storage.local.set({routing})
  → broadcast all results to sidepanel via chrome.runtime.sendMessage
```

Cloud escalation path (only on `ESCALATE_REQUEST`):
```
ESCALATE_REQUEST
  → read contextPacket from storage
  → fetch(VITE_FIREBASE_FUNCTION_URL, { body: JSON.stringify(packet) })
  → on success: chrome.storage.local.set({synthesis})
  → on error: send SYNTHESIS_ERROR
```

### Side Panel App

State lives in `chrome.storage.local`. `useSandboxState` hook:
1. Reads initial state from storage on mount
2. Listens to `chrome.runtime.onMessage` for live updates
3. Returns typed state + `escalate()` action

## Data Model

All state stored in `chrome.storage.local` under key `chiasmaState`:

```typescript
interface ExtensionState {
  scrubResult: ScrubResult;
  contextPacket: ContextPacket | null;
  friction: FrictionScore;
  routing: RoutingDecision | null;
  synthesis: string | null;
  synthesisLoading: boolean;
  synthesisError: string | null;
  stage: "idle" | "scrubbing" | "distilling" | "routing" | "cloud" | "done";
}
```

## Firebase Integration

- Uses same Firebase project as web-sandbox (same `.env` vars)
- In extension, env vars baked at build time via `vite define`
- Cloud escalation calls a Firebase HTTP callable function (or direct Gemini API via AI Logic)
- No Firebase SDK bundled in extension (too heavy) — raw `fetch` to AI Logic REST endpoint

## Error Handling

| Error | User sees |
|---|---|
| Scrub fails | "PII check unavailable" in feed, yellow border |
| Context build fails | "Could not distill context" in packet card |
| Cloud escalation fails | "Cloud reasoning unavailable — try again" in synthesis card |
| Network offline | Synthesis card shows offline state, escalate button disabled |

## Testing Strategy

- Unit: `scrubPII()`, `buildContextPacket()`, `route()` from shared-core (already tested)
- Integration: service worker message flow — mock `chrome.*` APIs
- Manual: load extension in Chrome, open side panel on github.com, type code with email → verify PII badge
- Build check: `vite build` exits 0, bundle < 500KB total

## Constraints

- NO Three.js, NO large animation libraries
- CSS animations only (GSAP allowed for micro-animations if needed, already in workspace)
- Vite multi-entry build (background, content, sidepanel as separate bundles)
- TypeScript strict mode
