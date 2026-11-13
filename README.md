# CHIASMA — Bicameral Cognitive Co-Pilot

> Split-Brain AI that keeps secrets on-device and only wakes the cloud when you need it.

CHIASMA (named after the *Optic Chiasm* — where visual signals cross before becoming consciousness) splits AI into two hemispheres:

- **System 1 — On-Device (Gemini Nano 4):** Runs locally at $0 cost, <20ms latency, with 100% privacy. Distills context, scrubs PII, and measures cognitive friction.
- **System 2 — Cloud (Cloud Gemini):** Wakes only when friction exceeds a Remote Config threshold or the user triggers it manually (`Alt + Shift + C`).

Firebase AI Logic acts as the *Corpus Callosum* — the bridge that routes between hemispheres dynamically.

## 🏗 Architecture

```
                    ┌─────────────────┐
                    │   User Context   │
                    │  (code, docs,    │
                    │   voice, photos) │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  System 1 (Nano) │  ← $0, <20ms, local
                    │  • PII Scrubber  │
                    │  • Context Pack  │  (≤300 tokens)
                    │  • Friction Calc │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Corpus Callosum  │  ← Firebase AI Logic
                    │   Router         │     Remote Config
                    │ (threshold 0.75) │     App Check
                    └───┬──────────┬──┘
                        │          │
              ┌─────────▼──┐  ┌───▼────────┐
              │  System 1   │  │  System 2   │  ← Cloud Gemini
              │  (local)    │  │  (cloud)    │     Firestore sync
              └────────────┘  └────────────┘
```

## 📦 Packages

| Package | Description |
|---|---|
| `packages/shared-core` | Corpus Callosum Router, PII Scrubber, ContextPacket types — shared by all surfaces |
| `packages/web-sandbox` | SaaS Landing Page + 4-Column Live Ecosystem Sandbox (Firebase Hosting) |
| `packages/chrome-extension` | Manifest V3 Side Panel (360px) + Gemini Nano 4 |
| `packages/android-app` | Kotlin / Jetpack Compose + Firebase AI Logic Android SDK |

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)
- Firebase CLI (`npm i -g firebase-tools`)

### Install

```bash
pnpm install
```

### Run the Web Sandbox (Landing Page + Live Sandbox)

```bash
pnpm dev:sandbox
```

Open `http://localhost:5173` to see the landing page and 4-column interactive sandbox.

### Run the Chrome Extension

```bash
pnpm build:extension
```

Load `packages/chrome-extension/dist` as an unpacked extension in `chrome://extensions`.

### Build shared-core

```bash
pnpm build:shared
```

### Run tests

```bash
pnpm test
```

## 🔥 Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable: Authentication (Anonymous), Firestore, Hosting, App Check, Remote Config
3. Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

4. Deploy:

```bash
firebase deploy
```

### Remote Config

Set `friction_escalation_threshold` (default: `0.75`) in Remote Config to control when System 1 escalates to System 2.

## 🧪 For Judges (Zero-Friction Testing)

1. Visit the **Live Sandbox URL** (deployed via Firebase Hosting)
2. Try the 4-column interactive sandbox:
   - **Column 1:** Click `[Inject Secret Key]` to see PII scrubbing in action
   - **Column 2:** Watch the Side Panel show the redacted context card
   - **Column 3:** See the Corpus Callosum bridge route the request
   - **Column 4:** Toggle `Force offline` to test the Android offline queue
3. Press `Alt + Shift + C` to manually trigger cloud escalation

No sign-up required — the sandbox uses Firebase Anonymous Auth (Guest Demo mode).

## 🎨 Design System

See `DESIGN.md` for the complete Warm Swiss Editorial & Calm Paper design system — tokens, components, and rules shared across all three surfaces.

## 📄 License

Apache License 2.0 — see `LICENSE`.

## 🏆 Competition

**#BuildHybridAI 2026** (Google × Devpost)

Deadline: December 1, 2026, 05:00 WIB (Nov 30, 2:00 PM PT)
