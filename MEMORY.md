# Memory — CHIASMA

Update after major decisions, phase completions, or bugs future agents need to know.

## Current State

- **Current task:** Phase 4 — Chrome Extension DONE, ready for manual Chrome testing
- **Current phase:** Post-build (T1-T6 complete, bundle verified 158.7KB)
- **Next step:** Load `dist/` in Chrome Developer mode, test PII scrubbing + escalation. Then Phase 5 (Android) or commit to main.
- **Blocked by:** None

## Decisions

- 2026-11-14 — Chose Vite+React for web-sandbox (not Next.js) because static export to GitHub Pages is simpler
- 2026-11-14 — GitHub Pages deploy via Git Data API (`deploy-pages.js`) because token lacks `workflow` scope
- 2026-11-14 — shared-core stays pure TypeScript (no compile step) — aliased in Vite config
- 2026-11-14 — Chrome extension will NOT bundle Three.js — too heavy (514KB). Use CSS animations only.
- 2026-11-14 — Android app uses Kotlin + Jetpack Compose + Android AICore (Gemini Nano on-device API)
- 2026-11-14 — Kiro Spec workflow adopted: requirements.md → design.md → tasks.md, human approval gate between phases

## Known Issues

- GitHub main branch missing `.github/workflows/deploy.yml` (blocked by token scope). Pages still deploys via `gh-pages` branch through `deploy-pages.js`.
- `awwwards-upgrade` branch on GitHub has clean source code. main branch was updated via Git Data API commit.

## Completed

- [x] DESIGN.md (Warm Swiss Editorial design system)
- [x] shared-core package (PII Scrubber 9 patterns, Corpus Callosum router, ContextPacket ≤300 token)
- [x] web-sandbox package (Vite+React, 4-col sandbox, Awwwards upgrade)
- [x] Hero: preloader curtain, GPU particle field (10k), pinned scroll-story 3 scene, SplitText char reveal
- [x] Hero: magnetic CTA, custom cursor + glow trail, velocity marquee
- [x] Sandbox: bento grid, rotateX entrance, animated counters, choreographed fake cursor, tab switcher, typewriter
- [x] Architecture: split screen pinned (400vh), SVG path draw, animated counters per node
- [x] impeccable critique: contrast fixes, touch targets, aria-label, flow indicators
- [x] GitHub Pages live: https://0xshalah.github.io/chiasma-hybrid-ai/
- [x] Source committed to main via Git Data API
- [x] Phase 4 — Chrome Extension (T1-T6 complete, build 158.7KB, tsc pass)
- [ ] Phase 5 — Android App (spec in progress)
- [ ] Devpost submission
