# AGENTS.md — CHIASMA

> Read this before writing any code. Contains only what you CANNOT infer from the repo.

## Project

- **What this is:** A hybrid AI co-pilot that runs Gemini Nano 4 on-device for PII scrubbing + context distillation, escalating to Cloud Gemini only when friction exceeds 0.75.
- **Who it is for:** Developers and knowledge workers on Android + Chrome who want zero-token-waste, zero-secret-leak AI assistance.
- **Kiroween 2026 submission** — deadline Dec 4 2026. Separate GitHub repo, same GitHub account (0xshalah).

## Commands

```bash
# Install (pnpm workspace)
pnpm install

# Build
pnpm build:sandbox        # builds packages/web-sandbox → dist/
pnpm build:extension      # builds packages/chrome-extension → dist/ (3 vite builds + post-build.cjs)

# Dev
pnpm dev:sandbox          # web-sandbox on localhost:5173
pnpm dev:extension        # chrome-extension watch mode (sidepanel only)

# Deploy to GitHub Pages (Git Data API, no workflow scope needed)
node deploy-pages.js

# TypeScript check
cd packages/web-sandbox && npx tsc --noEmit
```

## Architecture

```
chiasma-hybrid-ai/
├── packages/
│   ├── shared-core/      ← PII Scrubber, Corpus Callosum, ContextPacket (pure TS)
│   ├── web-sandbox/      ← Vite+React landing page + 4-col sandbox (DONE, LIVE)
│   ├── chrome-extension/ ← Phase 4 (DONE, build 158.7KB)
│   └── android-app/      ← Phase 5 (NOT YET)
├── .kiro/specs/          ← Kiro spec files per feature (requirements → design → tasks)
├── AGENTS.md             ← This file
├── MEMORY.md             ← Current progress
└── REVIEW-CHECKLIST.md   ← Pre-commit checklist
```

## Read first

- Product scope: `C:\Users\Shalahuddin AlAyyubi\.kiro\crew\uploads\0471f0a702044cc9ae9b8e1ee8ff5dd9_PRD_CHIASMA.md`
- Phase 4 spec: `.kiro/specs/chrome-extension/requirements.md` → `design.md` → `tasks.md`
- Phase 5 spec: `.kiro/specs/android-app/requirements.md` → `design.md` → `tasks.md`
- Design system: `DESIGN.md` (Warm Swiss Editorial tokens)

## Gotchas

- **shared-core is pure TypeScript, not compiled.** web-sandbox resolves it via vite alias `@chiasma/shared-core → packages/shared-core/src/index.ts`. Chrome extension and Android app must do the same (or compile first).
- **GitHub token lacks `workflow` scope.** Cannot push `.github/workflows/` via API or git push. GitHub Pages deploy uses `deploy-pages.js` (Git Data API to `gh-pages` branch directly).
- **`git push origin main` blocked** by Kiro Crew policy. Use GitHub API (`deploy-pages.js` pattern) or push to feature branch + merge via API.
- **pnpm v12** — workspace config is in `pnpm-workspace.yaml`, not `package.json`.
- **Windows paths** — use `Set-Location` not `cmd /c "cd /d..."` for git commands in PowerShell to avoid brace-expansion policy block.
- **Three.js + GSAP** already in web-sandbox deps. Chrome extension should NOT bundle Three.js (too heavy for extension).
- **VITE_BASE must be `/chiasma-hybrid-ai/`** when building for GitHub Pages. Set via `$env:VITE_BASE` before `pnpm build:sandbox`.
- **Chrome extension build = 3 vite passes.** IIFE format doesn't support multiple Rollup inputs, so background, content, and sidepanel are built separately (`vite.background.config.ts`, `vite.content.config.ts`, `vite.config.ts`). `post-build.cjs` copies manifest.json + icons + moves HTML to dist root.

## Protected areas

- Never commit `.env` or any real API keys.
- Keep `deploy-pages.js` out of commits (it's a local utility, not source code). It's already in `.gitignore`.
- Never push to `main` via `git push origin main` — use GitHub API instead.
- Chrome extension manifest: use `content_security_policy` to prevent remote script injection.

## AI features

- **Model can see:** user's active code editor text (scrubbed), whiteboard scans, voice memos
- **Never send:** raw PII — always run through `scrubPII()` before any network call
- **AI can do:** distill context (read), suggest (draft), escalate to cloud (write, with friction gate)
- **Needs approval:** manual cloud escalation (Alt+Shift+C), data sync to Firestore
- **Fallback:** if Gemini Nano unavailable → `hasNano: false` → route() returns `system2` with reason `nano-unavailable`

## Done means

For each task in `tasks.md`:
1. TypeScript compiles (`tsc --noEmit` passes)
2. Build succeeds (`pnpm build:sandbox` or equivalent)
3. User-visible behavior verified in browser/device
4. No `[NEEDS CLARIFICATION]` left open in spec

Report: files changed, commands run, build result, any remaining open items.
