# CHIASMA — Split-Brain AI Co-Pilot

**Every AI tool you use today sends your code to the cloud. CHIASMA doesn't.**

CHIASMA splits AI into two hemispheres — inspired by the brain's optic chiasm, where signals cross before becoming thought. System 1 runs on your device at $0. System 2 (Cloud Gemini) wakes **only** when you're genuinely stuck.

**[→ Try the live sandbox](https://0xshalah.github.io/chiasma-hybrid-ai/)**

---

## The Problem

Every time you paste code into ChatGPT or Copilot, you're sending it to a remote server. That code might contain:

- API keys and secrets
- Internal endpoint URLs
- Personally identifiable information
- Proprietary business logic

CHIASMA makes this a non-issue by design.

---

## How It Works

```
You type code
      ↓
┌─────────────────────────────────┐
│  System 1 — On-Device           │  Gemini Nano 4, $0, <20ms
│                                 │
│  1. PII Scrubber (9 patterns)   │  sk_live_xxx → [REDACTED_PII]
│  2. ContextPacket (≤300 tokens) │  Distilled context, not raw code
│  3. Friction Score              │  How stuck are you? 0.00 → 1.00
└──────────────┬──────────────────┘
               │
      friction < 0.75 → System 1 handles it. Done.
               │
      friction ≥ 0.75 ↓
               │
┌──────────────▼──────────────────┐
│  Corpus Callosum — Firebase     │  Remote Config threshold
│                                 │  App Check enforcement
│  Routes the SCRUBBED packet     │  Never the raw code
│  to Cloud Gemini                │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│  System 2 — Cloud Gemini        │  Deep reasoning on demand
│                                 │  Merges last 5 Firestore nodes
│  Receives: sanitized context    │  Cross-device context (Chrome + Android)
│  Never receives: raw secrets    │
└─────────────────────────────────┘
```

**The PII scrubber runs before any packet ever leaves the device. Always.**

---

## What's Built

| Surface | Status | Description |
|---|---|---|
| **Web Sandbox** | ✅ Live | Awwwards-level landing page + 4-column interactive demo |
| **Chrome Extension** | ✅ Built | MV3 side panel — real PII detection on any website |
| **Android App** | ✅ Scaffold | Kotlin/Compose — voice capture + whiteboard OCR + offline queue |
| **Shared Core** | ✅ Built | PII Scrubber (9 patterns), ContextPacket builder, Corpus Callosum router |

---

## For Judges — 2-Minute Test

**No install, no account required.**

1. Open **[https://0xshalah.github.io/chiasma-hybrid-ai/](https://0xshalah.github.io/chiasma-hybrid-ai/)**
2. Scroll to **Live Ecosystem Sandbox**
3. Click **Inject Secret Key** in the editor column
4. Watch Column 2: `sk_live_xxx` becomes `[REDACTED_PII]` instantly
5. Watch Column 3: Friction gauge rises to 0.98 — routed to System 2
6. Click **Watch Demo** to see the automated walkthrough

**To test the Chrome extension locally:**

```bash
git clone https://github.com/0xshalah/chiasma-hybrid-ai
cd chiasma-hybrid-ai
pnpm install
pnpm build:extension
# Load packages/chrome-extension/dist as unpacked extension in chrome://extensions
# Open any site, type an API key in any textarea
# Open the CHIASMA side panel — watch PII detection in real time
```

---

## Firebase Integration

CHIASMA uses Firebase throughout the architecture — not just for auth:

| Firebase Product | How CHIASMA Uses It |
|---|---|
| **Gemini in Firebase** | Cloud reasoning in System 2 (scrubbed packet only) |
| **Firestore** | Cross-device context sync — Android captures merge with Chrome session |
| **Remote Config** | `friction_escalation_threshold` (default 0.75) — tunable without app update |
| **App Check** | Verifies every cloud request comes from a real CHIASMA client |
| **Firebase Hosting** | Serves the web sandbox |

---

## Architecture

```
chiasma-hybrid-ai/
├── packages/
│   ├── shared-core/          PII Scrubber · ContextPacket · Corpus Callosum router
│   ├── web-sandbox/          Vite + React · GitHub Pages · Awwwards-level UI
│   ├── chrome-extension/     MV3 · Side Panel · Service Worker pipeline
│   └── android-app/          Kotlin · Jetpack Compose · ML Kit · WorkManager
├── .kiro/specs/              Kiro spec files (requirements → design → tasks)
├── DESIGN.md                 Warm Swiss Editorial design system
└── AGENTS.md                 Project rules for AI agents
```

### Shared Core (TypeScript, zero dependencies)

- **PII Scrubber** — 9 patterns: Stripe keys, AWS keys, Google API keys, JWT tokens, Bearer tokens, PEM private keys, emails, credit cards, phone numbers
- **ContextPacket builder** — truncates to ≤300 tokens, extracts entities, estimates token count via 4-chars/token heuristic
- **Corpus Callosum router** — `route(friction, device, config, manualTrigger)` → `system1 | system2`

### Chrome Extension (MV3)

- **Content script** — watches `textarea`, `contenteditable`, CodeMirror, Monaco via `input` event + MutationObserver
- **Service worker** — TEXT_CHANGED → scrubPII → buildContextPacket → updateFriction → route → storage
- **Side panel** — dark-first Raycast surface ladder, 6 pipeline stages, friction glow bar, Raycast-style row hover
- **Build** — 3 Vite passes (background IIFE, content IIFE, sidepanel ESM) → 162KB total

### Android App (Kotlin + Jetpack Compose)

- **VoiceCaptureManager** — SpeechRecognizer wrapper, PII scrub on transcript before storage
- **WhiteboardCaptureManager** — ML Kit text recognition on camera frames, PII scrub before storage
- **Room offline queue** — pending nodes survive network loss, synced by WorkManager on reconnect
- **Firestore sync** — PII scrub enforced on every write (double-checked)

---

## Privacy Guarantee

```kotlin
// FirestoreRepository.kt — this code runs before EVERY Firestore write
val scrubResult = PiiScrubber.scrub(node.packet.summary)
val safeNode = node.copy(packet = node.packet.copy(summary = scrubResult.redacted))

if (PiiScrubber.containsPii(safeNode.packet.summary)) {
    return Result.failure(SecurityException("PII detected after scrubbing — write blocked"))
}
```

PII scrubbing is not optional. It is enforced at the architecture level on every path that touches the network.

---

## Design System

CHIASMA uses a custom **Warm Swiss Editorial** design system (see `DESIGN.md`):

- **Fonts:** Instrument Serif (headings) + Plus Jakarta Sans (body) + JetBrains Mono (code)
- **Palette:** Sage Olive (#3d5a45) × Burnt Terracotta (#d95d39) on Warm Alabaster (#f6f4f0)
- **Motion:** GSAP SplitText, ScrollTrigger, Lenis smooth scroll, Three.js WebGL particle field
- **Rules:** impeccable craft-floor (35/35 heuristic score), hallmark, ui-ux-pro-max

---

## Development

### Prerequisites

- Node.js ≥ 20, pnpm ≥ 9

### Install

```bash
pnpm install
```

### Commands

```bash
pnpm dev:sandbox          # Web sandbox on localhost:5173
pnpm build:sandbox        # Build web sandbox → packages/web-sandbox/dist/
pnpm build:extension      # Build Chrome extension → packages/chrome-extension/dist/
pnpm test                 # Run all unit tests (web-sandbox + chrome-extension)
node deploy-pages.js      # Deploy web sandbox to GitHub Pages (via Git Data API)
```

### Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable: Firestore, App Check, Remote Config, Firebase Hosting, Gemini in Firebase
3. Copy `.env.example` → `.env`, fill in your config
4. Add `packages/android-app/app/google-services.json` (from Firebase console → Android app)
5. Set Remote Config key: `friction_escalation_threshold` = `0.75`

---

## Tests

```bash
# Chrome extension integration tests (13 tests)
cd packages/chrome-extension && pnpm test

# Android unit tests (run with Android Studio or ./gradlew test)
# AND-01: PiiScrubber — 9 PII pattern detection
# AND-02: ContextPacketBuilder — tokenCount ≤ 300
# AND-03: SyncWorker — pending → Firestore → delete
# AND-04: FirestoreRepository — PII scrub enforced before every write
```

---

## License

Apache License 2.0

---

## Kiroween 2026

Built for **#BuildHybridAI** (Google × Firebase × Devpost).

**Three things that make CHIASMA different from other AI tools:**

1. **Privacy by architecture** — PII scrubbing is not a feature toggle. It runs at the type system level before any network call.
2. **Friction-driven escalation** — The system decides when to call the cloud, not the user. Cloud Gemini only wakes when you're genuinely stuck (friction ≥ 0.75).
3. **Cross-device context** — Your Android voice capture and Chrome coding session share context through Firestore, so System 2 has the full picture when it wakes.
