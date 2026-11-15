# Requirements — CHIASMA Chrome Extension

**Status:** DRAFT — awaiting human approval before design.md is written  
**Phase:** 4  
**Last updated:** 2026-11-14

---

## Overview

The Chrome extension brings the CHIASMA System 1 engine into the browser. It surfaces as a Chrome Side Panel (360px) that shows live PII scrubbing output and the distilled context packet as the user types in any web-based editor (VS Code for Web, GitHub, Linear, Notion, etc.).

---

## User Stories

### US-01 — Activate Side Panel
As a developer working in a browser-based editor,  
I want to open the CHIASMA side panel with one click,  
so that I can see my context being processed without leaving the tab.

**Acceptance criteria:**
- WHEN the user clicks the CHIASMA toolbar icon, THE SYSTEM SHALL open the side panel at 360px width.
- WHEN the side panel is open, THE SYSTEM SHALL show the current PII Scrubber Feed, Stage Pill, and Distilled Context Packet.
- WHEN the side panel is closed, THE SYSTEM SHALL stop all content script listeners to avoid unnecessary processing.

---

### US-02 — PII Scrubbing on Selected Text
As a developer,  
I want CHIASMA to scrub PII from text I select in the browser,  
so that I am warned before pasting sensitive data into an AI tool.

**Acceptance criteria:**
- WHEN the user selects text on any page, THE SYSTEM SHALL run `scrubPII()` on the selection within 200ms.
- WHEN PII is detected, THE SYSTEM SHALL show a badge count in the toolbar icon and highlight the PII Feed in the side panel.
- WHEN no PII is detected, THE SYSTEM SHALL show a clean state (no badge, green pill).
- THE SYSTEM SHALL NOT send selected text to any network — scrubbing runs locally only.

---

### US-03 — Context Packet Distillation
As a developer,  
I want CHIASMA to build a ≤300-token context packet from my active editor content,  
so that I can manually copy-paste it into any AI without worrying about token waste or leaks.

**Acceptance criteria:**
- WHEN the user clicks "Distil Context" in the side panel, THE SYSTEM SHALL run `buildContextPacket()` on the current page's editor text.
- WHEN the packet is built, THE SYSTEM SHALL display: summary, entity tags, token count, and source filename.
- THE SYSTEM SHALL show token count as `{n} / 300 tokens` with a progress bar.
- WHEN token count exceeds 300, THE SYSTEM SHALL truncate and show a warning.

---

### US-04 — Manual Cloud Escalation
As a developer stuck on a problem,  
I want to escalate my context packet to Cloud Gemini with one click,  
so that I get deeper reasoning without manually copying anything.

**Acceptance criteria:**
- WHEN the user clicks "Escalate to Cloud" in the side panel, THE SYSTEM SHALL call the Firebase AI Logic endpoint with the scrubbed context packet only.
- WHEN escalation succeeds, THE SYSTEM SHALL display the Cloud synthesis result in the System 2 Synthesis card.
- WHEN escalation fails (network error, quota), THE SYSTEM SHALL display a user-safe error message and allow retry.
- THE SYSTEM SHALL show "PII scrubbed before sending" reassurance text before every escalation.
- THE SYSTEM SHALL NOT escalate automatically — cloud calls require explicit user action.

---

### US-05 — Friction Score Display
As a developer,  
I want to see my current friction score in the side panel,  
so that I understand why CHIASMA recommends cloud escalation.

**Acceptance criteria:**
- WHEN the user edits text in a detected editor field, THE SYSTEM SHALL update the friction score using `updateFriction()` with trigger `"text-revision"`.
- WHEN friction exceeds 0.75, THE SYSTEM SHALL show the escalation suggestion UI (yellow border, "Consider escalating" text).
- THE SYSTEM SHALL display the friction bar using `scaleX()` transform (not `width%`) to avoid layout reflow.

---

### US-06 — Stage Pill Status
As a developer,  
I want to see the current pipeline stage in the side panel header,  
so that I know what CHIASMA is doing at a glance.

**Acceptance criteria:**
- WHEN no input detected, THE SYSTEM SHALL show `pill-idle` with label "Idle".
- WHEN PII is being scrubbed, THE SYSTEM SHALL show `pill-stage-scrubbing` with label "Scrubbing".
- WHEN context packet is being built, THE SYSTEM SHALL show `pill-stage-distilling` with label "Distilling".
- WHEN routing decision is made, THE SYSTEM SHALL show `pill-stage-routing` with label "Routing".
- WHEN cloud call is active, THE SYSTEM SHALL show `pill-stage-cloud` with label "Cloud".

---

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | Bundle size < 500KB total (no Three.js, no large GSAP) |
| NFR-02 | PII scrubbing latency < 200ms on 10KB text |
| NFR-03 | Side panel opens in < 300ms |
| NFR-04 | Manifest V3 (required by Chrome Web Store) |
| NFR-05 | Permissions: `activeTab`, `sidePanel`, `storage` only — no `tabs`, no `history`, no `webNavigation` |
| NFR-06 | No remote code execution — all JS bundled locally |
| NFR-07 | CSP: `script-src 'self'` — no `unsafe-inline`, no `unsafe-eval` |

---

## Out of Scope (v1)

- Automatic friction-based cloud escalation (always manual in extension)
- Firestore sync between extension and Android app (Phase 5+)
- Multiple simultaneous editor tab monitoring
- Firefox / Edge support

---

## Open Questions

- [NEEDS CLARIFICATION] Does the extension need a Firebase config for cloud escalation, or should it call the web-sandbox's deployed Firebase functions? → Decision needed before design.md

---

## Stack Constraints

- Manifest V3
- Vite + React (same as web-sandbox, shared tooling)
- `@chiasma/shared-core` via workspace alias
- Tailwind or CSS modules — no large UI libraries
- GSAP allowed for micro-animations (already in workspace deps)
