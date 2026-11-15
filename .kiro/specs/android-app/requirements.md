# Requirements — CHIASMA Android App

**Status:** DRAFT — awaiting human approval before design.md is written  
**Phase:** 5  
**Last updated:** 2026-11-14

---

## Overview

The Android companion app captures context from mobile surfaces (voice memos, whiteboard scans, photos of notes) and syncs them as ContextNodes to Firestore. When on-device Gemini Nano is available, it distills context locally before sync. It shows the user's friction-based routing status from their desktop session in real-time.

---

## User Stories

### US-01 — On-Device AI Check
As an Android user,  
I want the app to check if Gemini Nano is available on my device,  
so that I know whether local AI processing is possible.

**Acceptance criteria:**
- WHEN the app launches, THE SYSTEM SHALL check Gemini Nano availability via Android AICore API within 2 seconds.
- WHEN Gemini Nano is available, THE SYSTEM SHALL show `System 1 — Nano` pill in green.
- WHEN Gemini Nano is unavailable, THE SYSTEM SHALL show `System 1 — Limited` pill in amber and skip local distillation.

---

### US-02 — Voice Memo Capture
As a developer away from their desk,  
I want to record a voice memo that CHIASMA processes into a context node,  
so that my verbal thought is captured and synced to my desktop session.

**Acceptance criteria:**
- WHEN the user taps "Capture Voice", THE SYSTEM SHALL start recording using the device microphone.
- WHEN recording stops, THE SYSTEM SHALL transcribe the audio locally (on-device STT).
- WHEN Gemini Nano is available, THE SYSTEM SHALL run `buildContextPacket()` on the transcript.
- WHEN the context packet is built, THE SYSTEM SHALL create a ContextNode with `surface: "android-app"`.
- WHEN online, THE SYSTEM SHALL sync the ContextNode to Firestore immediately.
- WHEN offline, THE SYSTEM SHALL add the ContextNode to `pendingQueue` and show pending count badge.

---

### US-03 — Whiteboard Scan
As a developer working at a physical whiteboard,  
I want to scan the whiteboard with my camera and have CHIASMA extract the content,  
so that my architectural diagrams are captured as context nodes.

**Acceptance criteria:**
- WHEN the user taps "Scan Board", THE SYSTEM SHALL open the camera.
- WHEN a photo is taken, THE SYSTEM SHALL run OCR + image description on-device.
- WHEN text is extracted, THE SYSTEM SHALL run `scrubPII()` on the extracted text.
- WHEN the scrubbed text is clean, THE SYSTEM SHALL build a ContextNode and sync to Firestore.
- THE SYSTEM SHALL display a preview of the extracted text before saving.

---

### US-04 — Offline Queue Management
As a developer in a low-connectivity environment,  
I want CHIASMA to queue my captures when offline and sync automatically when back online,  
so that I never lose context due to connectivity.

**Acceptance criteria:**
- WHEN the device is offline, THE SYSTEM SHALL save all new ContextNodes to local `pendingQueue` (Room database).
- WHEN connectivity is restored, THE SYSTEM SHALL sync all pending nodes to Firestore automatically.
- WHEN sync completes, THE SYSTEM SHALL show a toast "X nodes synced" and clear the pending badge.
- WHEN sync fails for a node, THE SYSTEM SHALL retain it in queue and retry on next connectivity event.
- THE SYSTEM SHALL display `pendingQueue` count in the main UI badge.

---

### US-05 — Cross-Device Session View
As a developer,  
I want to see the last 5 ContextNodes from my desktop Chrome session in the Android app,  
so that I have full context continuity.

**Acceptance criteria:**
- WHEN the user opens the app and is online, THE SYSTEM SHALL fetch the last 5 ContextNodes from Firestore ordered by `createdAt` descending.
- THE SYSTEM SHALL display each node with: source, summary (truncated to 80 chars), token count, and synced time.
- WHEN a node is from the Chrome extension, THE SYSTEM SHALL show a browser icon badge.
- WHEN a node is from the Android app, THE SYSTEM SHALL show a phone icon badge.

---

### US-06 — Friction Status from Desktop
As a developer,  
I want to see my current desktop friction score on my phone,  
so that I know my AI routing status at a glance.

**Acceptance criteria:**
- WHEN the desktop session writes a friction score to Firestore, THE SYSTEM SHALL receive it via Firestore real-time listener within 2 seconds.
- THE SYSTEM SHALL display the friction bar using the same visual language as the web-sandbox.
- WHEN friction > 0.75, THE SYSTEM SHALL show a notification chip "High friction — consider escalating".

---

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | Minimum SDK: API 34 (Android 14) — required for Android AICore / Gemini Nano |
| NFR-02 | App size < 15MB APK (excluding Android AICore model, downloaded separately) |
| NFR-03 | Voice capture → ContextNode built < 3 seconds on mid-range device |
| NFR-04 | Offline queue survives app kill (Room database, not in-memory) |
| NFR-05 | No PII in Firestore — always run `scrubPII()` before any Firestore write |
| NFR-06 | Firebase App Check enforced for all Firestore writes |

---

## Out of Scope (v1)

- In-app AI chat interface
- Photo OCR for handwritten text (typed/printed only)
- Push notifications from desktop to Android
- Multiple user accounts / team sharing
- iOS support

---

## Open Questions

- [NEEDS CLARIFICATION] Which on-device STT API to use for voice transcription — Android SpeechRecognizer (free, needs network) or ML Kit on-device STT (offline, needs setup)? → affects NFR-01 and offline capability
- [NEEDS CLARIFICATION] Should Firestore ContextNode schema match exactly what `ContextNode` type in shared-core defines, or does Android use a separate schema? → Decision needed before design.md

---

## Stack Constraints

- Kotlin + Jetpack Compose
- Android AICore API (Gemini Nano on-device)
- Firebase Android SDK (Firestore, App Check)
- Room database for offline queue
- Shared `ContextNode` type must match `packages/shared-core/src/types.ts` exactly
