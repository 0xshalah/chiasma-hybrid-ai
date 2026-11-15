# Review Checklist — CHIASMA

Do not mark a task complete until ALL relevant checks pass.

## Basic

- [ ] Diff is focused on the requested task only
- [ ] No unrelated files rewritten
- [ ] No `.env`, API keys, or tokens committed
- [ ] TypeScript compiles: `npx tsc --noEmit` passes (or `pnpm build` passes)
- [ ] User-visible behavior verified in browser or device

## Per-Surface

### web-sandbox
- [ ] `pnpm build:sandbox` exits 0 (warnings OK, errors not OK)
- [ ] Base path in HTML is `/chiasma-hybrid-ai/assets/...` (not `/assets/...`)
- [ ] No console errors on first load
- [ ] Preloader runs and exits cleanly
- [ ] Hero scroll story shows 3 scenes
- [ ] Sandbox bento grid renders all 4 cells
- [ ] Architecture section SVG lines draw on scroll

### chrome-extension (Phase 4)
- [ ] `pnpm build:extension` exits 0
- [ ] Extension loads in Chrome via `chrome://extensions` (Developer mode, Load unpacked)
- [ ] Side panel opens at 360px
- [ ] PII scrubbing runs on selected text
- [ ] No remote scripts in manifest CSP
- [ ] Permissions are minimal (activeTab, sidePanel, storage only)

### android-app (Phase 5)
- [ ] Gradle build passes (`./gradlew assembleDebug`)
- [ ] App installs on API 34+ device/emulator
- [ ] Gemini Nano available check runs on startup
- [ ] Voice capture → ContextPacket built → stored to Firestore
- [ ] Offline queue works: items saved when offline, synced on reconnect

## Security

- [ ] All PII runs through `scrubPII()` before any network call
- [ ] No raw user text sent to Cloud Gemini — only scrubbed ≤300-token packet
- [ ] Chrome extension: no `eval`, no `unsafe-inline` in CSP
- [ ] Android: no PII in logcat output

## Spec Traceability

- [ ] Every implemented behavior maps to a FR-XXX in `requirements.md`
- [ ] No `[NEEDS CLARIFICATION]` left open
- [ ] `tasks.md` checkboxes updated to reflect actual completion
