# Tasks — CHIASMA Chrome Extension

**Status:** COMPLETE — T1-T6 done, build verified
**Phase:** 4

---

## Task List

### T1 — Package scaffold ✅
- [x] Create `packages/chrome-extension/` directory
- [x] Create `package.json` with `@chiasma/shared-core` workspace dep + vite + react
- [x] Create `vite.config.ts` with multi-entry (3 separate configs: background, content, sidepanel)
- [x] Create `manifest.json` (MV3, activeTab + sidePanel + storage permissions)
- [x] Create `src/shared/messages.ts` (typed message bus)
- [x] Update root `pnpm-workspace.yaml` to include `packages/chrome-extension` (already covered by `packages/*`)
- **Deliverable:** `pnpm install` succeeds, `packages/chrome-extension` appears in workspace
- **Maps to:** NFR-01 (bundle), NFR-04 (MV3), NFR-05 (permissions)

### T2 — Content script ✅
- [x] Create `src/content/content-script.ts`
- [x] Watch `document.activeElement` for textarea + contenteditable + `.cm-content`
- [x] Debounce 300ms, truncate at 4000 chars
- [x] Send `TEXT_CHANGED` via `chrome.runtime.sendMessage`
- **Deliverable:** Console.log shows TEXT_CHANGED firing when typing in a textarea on any page
- **Maps to:** FR-02 (US-02 scrubbing), FR-03 (US-03 context)

### T3 — Service worker ✅
- [x] Create `src/background/service-worker.ts`
- [x] Handle `TEXT_CHANGED` → run scrubPII → buildContextPacket → updateFriction → route
- [x] Write all results to `chrome.storage.local`
- [x] Broadcast results to side panel via `chrome.runtime.sendMessage`
- [x] Handle `ESCALATE_REQUEST` → fetch Gemini API → store synthesis (with no-config fallback)
- [x] Friction decay timer (30s interval)
- **Deliverable:** `chrome.storage.local` contains typed state after typing in a tab
- **Maps to:** FR-02, FR-03, FR-04 (US-04 escalation), FR-05 (US-05 friction)

### T4 — Side panel UI ✅
- [x] Create `src/sidepanel/index.html` + `main.tsx`
- [x] Create `useSandboxState` hook (storage read + runtime message listener)
- [x] Create `StagePill.tsx` (idle/scrubbing/distilling/routing/cloud/done)
- [x] Create `PIIFeed.tsx` (renders redacted text with [REDACTED_PII] badges)
- [x] Create `ContextCard.tsx` (summary + entities + token count / 300 bar)
- [x] Create `FrictionBar.tsx` (scaleX transform, threshold marker)
- [x] Create `SynthesisCard.tsx` (cloud result, loading state, error state)
- [x] Create `App.tsx` (compose all components, escalate button)
- [x] Apply DESIGN.md tokens via CSS variables (Warm Swiss Editorial)
- **Deliverable:** Side panel opens at 360px, shows live PII feed and context card
- **Maps to:** FR-01 (US-01), FR-02, FR-03, FR-05, FR-06 (US-06 stage pill)

### T5 — Build verification ✅
- [x] `pnpm build:extension` exits 0
- [x] Total bundle size < 500KB → 158.7 KB (9 files)
- [x] TypeScript: `tsc --noEmit` passes with 0 errors
- [ ] Load extension in Chrome (Developer mode → Load unpacked → `dist/`) — manual test
- [ ] Side panel opens when clicking toolbar icon — manual test
- [ ] Type `api_key = "sk_live_test123"` in any textarea → PII badge appears — manual test
- [ ] Click "Escalate to Cloud" → synthesis card shows (or error if no Firebase config) — manual test
- **Deliverable:** Extension works end-to-end in Chrome
- **Maps to:** NFR-01 (size), NFR-04 (MV3), review-checklist chrome-extension section

### T6 — Add build script to workspace ✅
- [x] Add `"build:extension": "pnpm --filter chrome-extension build"` to root `package.json`
- [x] Add `"dev:extension": "pnpm --filter chrome-extension dev"` to root `package.json`
- **Deliverable:** `pnpm build:extension` works from repo root
- **Maps to:** AGENTS.md Commands section

---

## Implementation Order

T1 → T2 → T3 → T4 → T5 → T6

T2 and T3 can be built in parallel after T1. T4 requires T3 (needs to know state shape). T5 requires T4.

## Notes

- IIFE format doesn't support multiple Rollup inputs, so 3 separate vite config files were created: `vite.background.config.ts`, `vite.content.config.ts`, `vite.config.ts` (sidepanel only).
- `post-build.cjs` copies manifest.json, icons, and moves HTML to dist root after all 3 builds.
- Firebase/Gemini API key is baked at build time via `vite define`. If not set, synthesis card shows a local fallback message.
- Placeholder icons (solid sage-green squares) generated via Node script. Replace with proper CHIASMA branding before Devpost submission.
