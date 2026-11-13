---
version: "1.0"
name: CHIASMA
description: >
  Warm Swiss Editorial & Calm Paper design system for CHIASMA — a Bicameral
  Cognitive Co-Pilot that splits AI into on-device System 1 (Gemini Nano 4)
  and cloud System 2 (Cloud Gemini). Three surfaces share one visual language:
  a Chrome Extension Side Panel (360px), an Android Companion App (Jetpack
  Compose), and a SaaS Landing Page & Live Ecosystem Sandbox (Firebase Hosting).
  The feel is research software: mature, calm, clear, release-ready — never a
  dark-hacker terminal cliché.

colors:
  # ── Surface ──
  canvas: "#F6F4F0"        # Warm Alabaster — page background
  surface: "#FFFFFF"        # Crisp Ivory — cards, panels, inputs
  surface-raised: "#FAF8F4" # Alabaster lifted one step — nested containers
  hairline: "#E5E2DC"       # Architectural border — 1px structural lines

  # ── Text ──
  ink: "#161615"            # Charcoal Ink — primary text, headlines
  ink-secondary: "#575550"  # Muted Slate — captions, metadata, descriptions
  ink-muted: "#8A8580"      # Faded Slate — placeholder text, disabled labels

  # ── System 1 — On-Device / Subconscious / Calm ──
  system1: "#3D5A45"        # Sage Olive — local processing, sync-safe, offline
  system1-soft: "#E6EDE8"   # Sage Olive tint — System 1 card backgrounds
  system1-ink: "#2A4132"    # Deep Sage — text on system1-soft surfaces

  # ── System 2 — Cloud / Conscious / Action ──
  system2: "#D95D39"        # Burnt Terracotta — cloud escalation, scan trigger, PII warning
  system2-soft: "#F9EAE5"   # Burnt Terracotta tint — System 2 card backgrounds
  system2-ink: "#A03E22"    # Deep Terracotta — text on system2-soft surfaces

  # ── Semantic ──
  on-system1: "#FFFFFF"     # Text/buttons on Sage Olive fills
  on-system2: "#FFFFFF"     # Text/buttons on Burnt Terracotta fills
  redacted: "#D95D39"       # [REDACTED_PII] badge text — same as system2
  redacted-bg: "#F9EAE5"    # [REDACTED_PII] badge background — same as system2-soft

  # ── Code & Telemetry ──
  code-bg: "#F0EDE7"        # Warm code block background
  code-ink: "#3A3733"       # Warm dark text for code

typography:
  # ── Display: Editorial Serif ──
  display-hero:
    fontFamily: "Instrument Serif, Newsreader, Georgia, serif"
    fontSize: "52px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.5px"
  display-lg:
    fontFamily: "Instrument Serif, Newsreader, Georgia, serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.3px"
  display-md:
    fontFamily: "Instrument Serif, Newsreader, Georgia, serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.2px"

  # ── UI & Body: Geometric Sans ──
  lead:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  body-lg:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  ui:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
  ui-sm:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.2px"
  eyebrow:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.6px"
    textTransform: uppercase

  # ── Telemetry & Code: Monospace ──
  metric:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
    fontVariantNumeric: "tabular-nums"
  metric-lg:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0
    fontVariantNumeric: "tabular-nums"
  code:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  micro:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.3px"
    fontVariantNumeric: "tabular-nums"

rounded:
  none: "0px"
  xs: "4px"       # tags, micro-badges, small chips
  sm: "8px"       # inputs, small cards, side panel inner elements
  md: "12px"      # primary cards, panels, context cards
  lg: "16px"      # larger containers, sandbox columns
  pill: "9999px"  # status pills, badges, toggle switches

spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  4xl: "64px"
  section: "80px"
  section-lg: "120px"

  # ── Side Panel specific (360px width) ──
  panel-pad: "16px"       # side panel horizontal padding
  panel-gap: "12px"       # gap between side panel cards
  panel-section: "24px"  # gap between side panel sections

shadows:
  flat: "none"
  card: "0 1px 2px rgba(22, 22, 21, 0.04)"
  raised: "0 2px 8px rgba(22, 22, 21, 0.06)"
  overlay: "0 4px 16px rgba(22, 22, 21, 0.08)"

components:
  # ── Navigation ──
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    borderBottom: "1px solid {colors.hairline}"
    height: "56px"
    padding: "0 {spacing.xl}"

  nav-link:
    textColor: "{colors.ink-secondary}"
    typography: "{typography.ui-sm}"
    padding: "8px 12px"
    activeColor: "{colors.ink}"

  # ── Buttons ──
  button-primary:
    backgroundColor: "{colors.system1}"
    textColor: "{colors.on-system1}"
    typography: "{typography.ui}"
    rounded: "{rounded.sm}"
    padding: "0 {spacing.lg}"
    height: "36px"

  button-system2:
    backgroundColor: "{colors.system2}"
    textColor: "{colors.on-system2}"
    typography: "{typography.ui}"
    rounded: "{rounded.sm}"
    padding: "0 {spacing.lg}"
    height: "36px"

  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.ui}"
    rounded: "{rounded.sm}"
    padding: "0 {spacing.md}"
    height: "36px"
    border: "1px solid {colors.hairline}"

  button-preset:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.ui-sm}"
    rounded: "{rounded.xs}"
    padding: "0 {spacing.sm}"
    height: "28px"
    border: "1px solid {colors.hairline}"

  button-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.ui-sm}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
    height: "28px"
    border: "1px solid {colors.hairline}"
    activeBg: "{colors.ink}"
    activeText: "{colors.surface}"

  # ── Cards & Containers ──
  context-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline}"
    boxShadow: "{shadows.card}"

  context-card-system1:
    backgroundColor: "{colors.system1-soft}"
    textColor: "{colors.system1-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.system1}"

  context-card-system2:
    backgroundColor: "{colors.system2-soft}"
    textColor: "{colors.system2-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.system2}"

  # ── Side Panel (360px Chrome Extension) ──
  side-panel:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    width: "360px"
    padding: "{spacing.panel-pad}"
    gap: "{spacing.panel-gap}"

  # ── Status Badges ──
  status-pill-system1:
    backgroundColor: "{colors.system1-soft}"
    textColor: "{colors.system1}"
    typography: "{typography.ui-sm}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
    border: "1px solid {colors.system1}"

  status-pill-system2:
    backgroundColor: "{colors.system2-soft}"
    textColor: "{colors.system2}"
    typography: "{typography.ui-sm}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
    border: "1px solid {colors.system2}"

  status-pill-idle:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.ui-sm}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
    border: "1px solid {colors.hairline}"

  # ── PII Scrubber ──
  redacted-badge:
    backgroundColor: "{colors.redacted-bg}"
    textColor: "{colors.redacted}"
    typography: "{typography.micro}"
    rounded: "{rounded.xs}"
    padding: "1px 6px"
    border: "1px solid {colors.system2}"

  pii-feed:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline}"
    fontFamily: "{typography.code.fontFamily}"

  # ── Friction Score Gauge ──
  friction-gauge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.metric-lg}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline}"

  friction-bar:
    trackColor: "{colors.hairline}"
    fillColor: "{colors.system2}"
    height: "4px"
    rounded: "{rounded.pill}"

  # ── Corpus Callosum Bridge ──
  bridge-panel:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"

  bridge-row:
    textColor: "{colors.ink-secondary}"
    typography: "{typography.ui-sm}"
    padding: "{spacing.sm} 0"
    borderBottom: "1px solid {colors.hairline}"

  # ── Live Sandbox Columns ──
  sandbox-column:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
    boxShadow: "{shadows.card}"

  sandbox-frame-chrome:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline}"

  # ── Code Editor (Sandbox) ──
  code-editor:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.code-ink}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline}"

  # ── Landing Page Sections ──
  hero-section:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.section-lg} {spacing.section}"

  architecture-column:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"

  download-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"

  # ── Android Companion Frame ──
  android-frame:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    width: "360px"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "2px solid {colors.ink}"
    borderRadius: "{rounded.lg}"

  # ── Footer ──
  site-footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.ui-sm}"
    padding: "{spacing.section} {spacing.section}"

  # ── Offline Queue Indicator ──
  queue-badge:
    backgroundColor: "{colors.system2-soft}"
    textColor: "{colors.system2}"
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"

  queue-badge-synced:
    backgroundColor: "{colors.system1-soft}"
    textColor: "{colors.system1}"
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"

  # ── Context Node (Firestore synced item) ──
  context-node:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline}"

---

## Overview

CHIASMA feels like research software that happens to have an AI inside. The surface is a warm, paper-like canvas (`#F6F4F0`) — not white, not grey, but alabaster with a touch of warmth that reads as calm paper stock. Cards lift one step to crisp ivory (`#FFFFFF`), separated from the canvas by 1px architectural hairlines (`#E5E2DC`) rather than shadows. The page never shouts: depth is tonal, elevation is quiet, and the only saturated colour appears when something needs attention.

Two semantic colours carry the bicameral identity:

- **System 1 — Sage Olive (`#3D5A45`):** The calm, local, on-device hemisphere. Sage Olive appears when Gemini Nano 4 is processing locally, when sync is safe, and when the offline queue is active. Its tint (`#E6EDE8`) fills System 1 cards with a muted green-grey warmth that reads as "working quietly in the background."
- **System 2 — Burnt Terracotta (`#D95D39`):** The active, cloud, conscious hemisphere. Terracotta appears when cloud reasoning escalates, when a multimodal scan triggers, and when the PII Scrubber redacts sensitive data (`[REDACTED_PII]`). Its tint (`#F9EAE5`) fills System 2 cards with a warm warning glow.

Typography runs in three voices. Editorial serif headlines (Instrument Serif / Newsreader) carry authority and humanism — they make the landing page read like a research journal, not a SaaS template. Geometric sans-serif body (Plus Jakarta Sans) handles UI, body copy, and navigation with high readability. Telemetry and code (JetBrains Mono) renders latency metrics, friction scores, and context packet JSON with tabular numerals so numbers never jump.

**Key characteristics:**
- A warm paper canvas with tonal depth — never a flat white or dark terminal.
- Two semantic colours map to two AI hemispheres: Sage Olive (calm/local) and Burnt Terracotta (active/cloud).
- Editorial serif for headlines, geometric sans for UI, monospace for telemetry.
- 1px architectural hairlines separate surfaces — shadows are whisper-thin and rare.
- The 360px Side Panel and the 4-column Live Sandbox share the same component vocabulary, scaled to fit.
- Every status, badge, and metric uses the same pill, card, and gauge primitives across all three surfaces.

## Colors

### Surface
- **Canvas** (`{colors.canvas}` — #F6F4F0): Warm Alabaster. The page background on every surface — landing page, sandbox, side panel, Android app.
- **Surface** (`{colors.surface}` — #FFFFFF): Crisp Ivory. Cards, panels, inputs, and code editors sit one step above the canvas.
- **Surface Raised** (`{colors.surface-raised}` — #FAF8F4): Alabaster lifted a whisper. Used for nested containers, preset buttons, and context nodes that sit inside a card but need their own fill.
- **Hairline** (`{colors.hairline}` — #E5E2DC): The architectural border. Every 1px line that separates cards, rows, and sections. Warm, not grey.

### Text
- **Ink** (`{colors.ink}` — #161615): Charcoal Ink. Headlines, primary body text, and labels on light surfaces. Near-black with a warm undertone.
- **Ink Secondary** (`{colors.ink-secondary}` — #575550): Muted Slate. Captions, descriptions, metadata, and secondary navigation text.
- **Ink Muted** (`{colors.ink-muted}` — #8A8580): Faded Slate. Placeholder text in inputs, disabled labels, and de-emphasised telemetry labels.

### System 1 — On-Device / Calm
- **System 1** (`{colors.system1}` — #3D5A45): Sage Olive. The primary action colour for local processing. Fills the "Distill Context" button, the sync-safe indicator, and the offline-mode badge.
- **System 1 Soft** (`{colors.system1-soft}` — #E6EDE8): Sage Olive tint. Background for System 1 context cards — the "local processing" card, the friction gauge when below threshold, and the offline queue badge.
- **System 1 Ink** (`{colors.system1-ink}` — #2A4132): Deep Sage. Text on system1-soft surfaces. Dark enough for WCAG AA at 14px+.

### System 2 — Cloud / Action
- **System 2** (`{colors.system2}` — #D95D39): Burnt Terracotta. The escalation colour. Fills the "Escalate to Cloud" button, the scan trigger, and the PII warning badge text. Appears on friction bars when the score exceeds threshold.
- **System 2 Soft** (`{colors.system2-soft}` — #F9EAE5): Burnt Terracotta tint. Background for System 2 synthesis cards, PII scrubber feed highlights, and the friction gauge when above threshold.
- **System 2 Ink** (`{colors.system2-ink}` — #A03E22): Deep Terracotta. Text on system2-soft surfaces. Dark enough for WCAG AA at 14px+.

### Code & Telemetry
- **Code Background** (`{colors.code-bg}` — #F0EDE7): Warm code block background. Not a dark terminal — a warm paper-tinted surface for code editors and JSON displays.
- **Code Ink** (`{colors.code-ink}` — #3A3733): Warm dark text for code. Lighter than ink for a softer code reading experience.

### Semantic
- **Redacted** (`{colors.redacted}` — #D95D39): The `[REDACTED_PII]` badge text colour. Same as system2 because PII redaction is a System 2 alert.
- **Redacted Background** (`{colors.redacted-bg}` — #F9EAE5): The `[REDACTED_PII]` badge background.

## Typography

### Font Families

Three families, three roles:

1. **Instrument Serif** (with Newsreader as fallback) — the editorial display face. Used for hero headlines, section titles, and card headings. Weight 400 only: the serif's character comes from its letterform, not from bold weight.
2. **Plus Jakarta Sans** — the geometric sans for UI, body, and navigation. Weights 400–600. Carries all interactive text, body copy, and metadata.
3. **JetBrains Mono** — the monospace for telemetry, code, and metrics. Uses `font-variant-numeric: tabular-nums` so latency numbers, friction scores, and token counts never shift width as they update.

### Hierarchy

| Token | Family | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|---|
| `{typography.display-hero}` | Instrument Serif | 52px | 400 | 1.1 | -0.5px | Landing page hero headline |
| `{typography.display-lg}` | Instrument Serif | 36px | 400 | 1.15 | -0.3px | Section headings, sandbox column titles |
| `{typography.display-md}` | Instrument Serif | 28px | 400 | 1.2 | -0.2px | Card titles, feature headings |
| `{typography.lead}` | Plus Jakarta Sans | 18px | 400 | 1.45 | 0 | Hero subtitle, lead paragraphs |
| `{typography.body-lg}` | Plus Jakarta Sans | 16px | 400 | 1.5 | 0 | Primary body copy, descriptions |
| `{typography.body}` | Plus Jakarta Sans | 14px | 400 | 1.5 | 0 | Default body, card content, side panel text |
| `{typography.ui}` | Plus Jakarta Sans | 14px | 500 | 1.3 | 0 | Button labels, nav, inputs |
| `{typography.ui-sm}` | Plus Jakarta Sans | 12px | 500 | 1.3 | 0.2px | Small pills, badges, accordion labels |
| `{typography.eyebrow}` | Plus Jakarta Sans | 11px | 600 | 1 | 0.6px | Uppercase section labels, column headers |
| `{typography.metric-lg}` | JetBrains Mono | 20px | 500 | 1.1 | 0 (tabular) | Large friction score, latency display |
| `{typography.metric}` | JetBrains Mono | 13px | 500 | 1.3 | 0 (tabular) | Inline metrics, token counts, status codes |
| `{typography.code}` | JetBrains Mono | 12px | 400 | 1.5 | 0 | Code editor body, JSON context packets |
| `{typography.micro}` | JetBrains Mono | 10px | 500 | 1.2 | 0.3px (tabular) | Queue badges, micro-metrics, timestamps |

### Principles
- **Serif for display, sans for structure, mono for numbers.** The serif face never carries button labels or nav text. The mono face never carries body copy. Each family has one job.
- **Display weight 400 only.** Instrument Serif's authority comes from its high-contrast letterforms, not from bold weight. Never push display beyond 400.
- **Tabular numerals everywhere in telemetry.** Every JetBrains Mono instance uses `font-variant-numeric: tabular-nums` so digits in latency counters and friction gauges never shift.
- **Eyebrows are uppercase, small, and tracked.** The 11px eyebrow with 0.6px letter-spacing labels sections without competing with headlines.

### Font Loading
Load via Google Fonts or self-host. Instrument Serif and Plus Jakarta Sans are on Google Fonts. JetBrains Mono is on Google Fonts with the `tabular-nums` feature.

## Layout

### Spacing System
- **Base unit**: 4px.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.2xl}` 32px · `{spacing.3xl}` 48px · `{spacing.4xl}` 64px · `{spacing.section}` 80px · `{spacing.section-lg}` 120px.
- **Side panel padding**: 16px horizontal, 12px gap between cards, 24px between sections.
- **Landing page sections**: 80–120px vertical separation between major sections.

### Grid & Container
- **Landing page**: centered column, max-width ~1200px. Headlines narrower (~640px) and centered.
- **Live Sandbox**: 4-column grid. Each column is a `sandbox-column` with `{spacing.xl}` padding. On tablet, columns 3+4 stack below 1+2. On mobile, all stack vertically.
- **Side Panel**: fixed 360px width. Content stacks vertically with `{spacing.panel-gap}` (12px) between cards.

### Whitespace Philosophy
Generous vertical space gives every section a calm, gallery-like pace. Cards rely on fill colour and 1px hairlines to separate from the canvas — shadows are whisper-thin (4–8% ink opacity) and reserved for raised elements like the sandbox columns and overlay drawers.

### Responsive Strategy

#### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Desktop | ≥ 1200px | Full 4-column sandbox; centered landing page |
| Laptop | 1024–1199px | Sandbox columns 3+4 wrap below; narrower container |
| Tablet | 768–1023px | Sandbox 2×2 grid; landing sections narrower |
| Mobile | < 768px | Single column; sandbox stacks; side panel unchanged (already 360px) |

#### Side Panel
The Chrome Extension Side Panel is always 360px. It does not respond to breakpoints — the panel width is fixed by Chrome. Internal elements use the spacing and component tokens defined here.

#### Android App
Jetpack Compose mirrors the side panel's component vocabulary. The Android frame uses the same card, badge, and gauge primitives, adapted to Material 3 where the platform requires (e.g., `Modifier.clip` for rounded corners).

#### Touch Targets
Buttons are 36px tall on desktop. On touch surfaces (Android, tablet sandbox), pad hit areas to 44px minimum.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No shadow; separated by fill + 1px hairline | Canvas, cards on canvas, side panel cards |
| 1 — Card | `0 1px 2px rgba(22, 22, 21, 0.04)` | Sandbox columns, raised context cards |
| 2 — Raised | `0 2px 8px rgba(22, 22, 21, 0.06)` | Hover state on interactive cards |
| 3 — Overlay | `0 4px 16px rgba(22, 22, 21, 0.08)` | System 2 synthesis drawer, modals |

Depth is almost entirely tonal. Shadows are warm (based on ink `#161615`, never pure black), whisper-thin, and rare. The 1px hairline does most of the separation work.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Footer band, full-bleed sections |
| `{rounded.xs}` | 4px | Preset buttons, redacted badges, micro-chips |
| `{rounded.sm}` | 8px | Inputs, buttons, small cards, code editors, PII feed |
| `{rounded.md}` | 12px | Primary cards, context cards, architecture columns, download cards |
| `{rounded.lg}` | 16px | Sandbox columns, bridge panel, Android frame |
| `{rounded.pill}` | 9999px | Status pills, queue badges, friction bar track, toggle switches |

### Geometry Principles
- Corners are gentle, not sharp. The warm Swiss editorial feel comes from 8–12px radii on most surfaces.
- Pills are reserved for status indicators and badges — never for primary buttons.
- The Android frame uses a 16px radius and a 2px ink border to visually frame the mobile companion.

## Components

### Side Panel (Chrome Extension, 360px)

**`side-panel`**: The root container. Canvas background, 16px horizontal padding, 12px gap between cards. Content stacks vertically: status header → PII scrubber feed → distilled context card → friction gauge → System 2 synthesis drawer (collapsed by default).

**`status-pill-system1`**: A Sage Olive pill showing "System 1 — On-Device" when Gemini Nano 4 is active. Background `{colors.system1-soft}`, text `{colors.system1}`, 1px Sage Olive border, 12px font, pill radius.

**`status-pill-system2`**: A Burnt Terracotta pill showing "System 2 — Cloud" when cloud reasoning is active. Background `{colors.system2-soft}`, text `{colors.system2}`, 1px Terracotta border.

**`status-pill-idle`**: A neutral pill showing "Idle" or "Waiting". Surface-raised background, ink-secondary text, hairline border.

### PII Scrubber

**`pii-feed`**: A monospace feed showing text as it passes through the local PII scrubber. Surface background, code typography (JetBrains Mono 12px), 8px radius, hairline border. Sensitive tokens are replaced inline with `{redacted-badge}`.

**`redacted-badge`**: A micro badge rendering `[REDACTED_PII]`. Terracotta text on terracotta-soft background, 4px radius, 1px terracotta border, 10px JetBrains Mono.

### Friction Gauge

**`friction-gauge`**: A card showing the current friction score (0.00–1.00) in metric-lg typography. Below the number, a `{friction-bar}` fills proportionally. When the score is below the Remote Config threshold (default 0.75), the bar is Sage Olive. When above, it turns Burnt Terracotta.

**`friction-bar`**: A 4px-tall pill-shaped track. Track colour is hairline, fill colour switches from system1 to system2 at the threshold. The fill width is `score × 100%`.

### Context Cards

**`context-card`**: The default card surface. Crisp Ivory, 12px radius, 16px padding, 1px hairline border, whisper-thin shadow. Used for distilled context packets, context node lists, and general content.

**`context-card-system1`**: A System 1 tinted card. Sage Olive soft background, deep sage text, 1px Sage Olive border. Used for the "Distilled Context Packet" card and local processing results.

**`context-card-system2`**: A System 2 tinted card. Terracotta soft background, deep terracotta text, 1px Terracotta border. Used for the "System 2 Synthesis" output and cloud reasoning results.

### Corpus Callosum Bridge

**`bridge-panel`**: The central panel in the Live Sandbox that shows the routing status. Surface-raised background, 16px radius, 24px padding, hairline border. Contains rows for Remote Config status, App Check verification, Firestore flow direction, and friction measurement.

**`bridge-row`**: A single status row inside the bridge panel. Ink-secondary text, 12px font, 8px vertical padding, 1px hairline bottom border. Left label, right value (in JetBrains Mono metric style).

### Live Sandbox

**`sandbox-column`**: One of the four sandbox columns. Surface background, 16px radius, 24px padding, hairline border, card shadow. Each column has a `sandbox-frame-chrome` label at top.

**`sandbox-frame-chrome`**: The header bar on each sandbox column. Canvas background, eyebrow typography, 8px radius, hairline border. Shows the column name ("Desktop Editor", "Chrome Side Panel", "Corpus Callosum", "Android Companion").

**`code-editor`**: The simulated code editor in sandbox column 1. Code background (`#F0EDE7`), code ink text, JetBrains Mono 12px, 8px radius, hairline border. Contains preset buttons (`button-preset`) for `[Inject Secret Key]`, `[Simulate Coding Block]`, and `[Reset Friction]`.

### Android Companion Frame

**`android-frame`**: A 360px-wide framed container simulating the Android app. Canvas background, 16px radius, 2px ink border. Contains capture buttons, `queue-badge` indicators, and synced `context-node` items.

**`queue-badge`**: An offline queue indicator. Terracotta-soft background, terracotta text, 10px JetBrains Mono, pill radius. Shows "N pending" when offline.

**`queue-badge-synced`**: A synced queue indicator. Sage Olive soft background, Sage Olive text. Shows "Synced" when the queue has flushed to Firestore.

**`context-node`**: A single synced context item. Surface-raised background, body typography, 8px radius, hairline border. Shows the node type, timestamp, and source device.

### Landing Page

**`hero-section`**: Canvas background, display-hero typography, 120px × 80px padding. Centered headline, lead subtitle, and a `button-primary` CTA. The hero never uses a gradient or image — the serif headline on warm alabaster is the statement.

**`architecture-column`**: One of the three "Split-Brain Architecture" columns. Surface background, 12px radius, 24px padding, hairline border. Left column is System 1 (Sage Olive accent), centre is the Corpus Callosum bridge (ink accent), right is System 2 (Terracotta accent).

**`download-card`**: A card for the Extension `.zip` and Android `.apk` download links. Surface background, 12px radius, 24px padding, hairline border. Contains the file name, size, and a `button-ghost` download link.

### Buttons

**`button-primary`**: The primary action (System 1). Sage Olive fill, white text, 8px radius, 36px height. Used for "Distill Context" and "Start Local Processing".

**`button-system2`**: The escalation action (System 2). Burnt Terracotta fill, white text, 8px radius, 36px height. Used for "Escalate to Cloud" and "Trigger Scan".

**`button-ghost`**: Secondary action. Transparent background, ink-secondary text, 1px hairline border, 8px radius. Used for "Reset", "Cancel", and download links.

**`button-preset`**: Sandbox preset button. Surface-raised background, ink text, 4px radius, 28px height, hairline border. Used for `[Inject Secret Key]`, `[Simulate Coding Block]`, `[Reset Friction]`.

**`button-toggle`**: Global control toggle. Transparent, pill radius, hairline border. Active state inverts to ink fill / canvas text. Used for `Force offline` and keyboard shortcut indicators.

### Navigation

**`nav-bar`**: 56px-tall canvas bar with 1px hairline bottom border. Contains the CHIASMA wordmark (Instrument Serif 18px), nav links, and a `button-primary`.

**`nav-link`**: Ink-secondary text, 12px font, 8px×12px padding. Active state switches to ink colour.

### Footer

**`site-footer`**: Charcoal Ink background (`#161615`), canvas text (`#F6F4F0`), 12px font, 80px×80px padding. The inverted footer closes the page with calm authority.

## Do's and Don'ts

### Do
- Use `{colors.system1}` (Sage Olive) for local, on-device, calm actions and statuses.
- Use `{colors.system2}` (Burnt Terracotta) for cloud, escalation, and PII warning actions.
- Set display headlines in Instrument Serif at weight 400. The serif's character is the brand.
- Use 1px `{colors.hairline}` borders to separate surfaces. Hairlines carry elevation.
- Render all telemetry, friction scores, and token counts in JetBrains Mono with `tabular-nums`.
- Keep shadows whisper-thin (4–8% ink opacity). Elevation is tonal, not shadowed.
- Use `{rounded.sm}` (8px) on buttons and `{rounded.md}` (12px) on cards. Gentle corners, not sharp.
- Map the Side Panel (360px) and the Sandbox columns to the same component vocabulary.

### Don't
- Don't use a dark terminal aesthetic. CHIASMA is warm paper, not a hacker screen.
- Don't use System 1 and System 2 colours interchangeably. Sage = local/calm, Terracotta = cloud/action.
- Don't push Instrument Serif beyond weight 400. Authority comes from the letterform.
- Don't use strong drop shadows. Surfaces separate by fill and hairline, not by shadow.
- Don't introduce status greens, alert reds, or generic blues. The only semantic colours are Sage Olive and Burnt Terracotta.
- Don't round buttons to pills. Pills are for status badges only.
- Don't render code in a dark theme. Code blocks use `{colors.code-bg}` (warm paper-tinted), not a black background.
- Don't place `{colors.ink}` text on `{colors.ink}` surfaces, or `{colors.canvas}` text on `{colors.canvas}`. Always check contrast.
