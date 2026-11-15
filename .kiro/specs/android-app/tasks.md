# Tasks — CHIASMA Android App

**Status:** APPROVED — ready to implement
**Phase:** 5

---

## Task List

### T1 — Project scaffold
- [ ] Create `packages/android-app/` directory
- [ ] Create `settings.gradle.kts` with project name + app module
- [ ] Create root `build.gradle.kts` (Kotlin 2.0, AGP 8.7, KSP)
- [ ] Create `app/build.gradle.kts` (applicationId, minSdk 34, targetSdk 35, all deps)
- [ ] Create `app/src/main/AndroidManifest.xml` (INTERNET, RECORD_AUDIO, CAMERA permissions)
- [ ] Create `app/src/main/res/values/strings.xml`
- [ ] Create `.gitignore` for android-app (google-services.json, build/, .gradle/)
- **Deliverable:** `./gradlew assembleDebug` exits 0 (or at least compiles with no source errors)
- **Maps to:** NFR-01 (minSdk 34)

### T2 — Design system (Compose theme)
- [ ] Create `ui/theme/Color.kt` — CHIASMA tokens as Color constants
- [ ] Create `ui/theme/Type.kt` — Instrument Serif (serif), Plus Jakarta Sans (sans), JetBrains Mono (mono)
- [ ] Create `ui/theme/Theme.kt` — Material3 ColorScheme with CHIASMA palette, light only
- **Deliverable:** Theme compiles, can be wrapped around any composable
- **Maps to:** DESIGN.md (Warm Swiss Editorial)

### T3 — Data layer
- [ ] Create `data/ContextNode.kt` — Kotlin data class mirroring shared-core types.ts
- [ ] Create `data/LocalDatabase.kt` — Room database with `PendingContextNode` entity
- [ ] Create `data/PendingNodeDao.kt` — insert, delete, getAll, count
- [ ] Create `data/FirestoreRepository.kt` — saveContextNode (always scrub first), getRecentNodes, getFrictionScore
- **Deliverable:** Room DB initializes without crash; FirestoreRepository compiles
- **Maps to:** NFR-04 (Room), NFR-05 (PII before Firestore)

### T4 — Domain layer (PII scrubber + context packet)
- [ ] Create `domain/PiiScrubber.kt` — Kotlin port of pii-scrubber.ts (9 patterns, same output)
- [ ] Create `domain/ContextPacketBuilder.kt` — Kotlin port of context-packet.ts (≤300 tokens)
- [ ] Create `domain/NanoAvailability.kt` — checks Android AICore via try/catch
- **Deliverable:** `PiiScrubber.scrub("sk_live_<24+chars>").hasPii == true`
- **Maps to:** NFR-05, FR-02 (US-02 scrubbing)

### T5 — Capture layer
- [ ] Create `capture/VoiceCaptureManager.kt` — SpeechRecognizer wrapper, calls `scrubPII` on transcript
- [ ] Create `capture/WhiteboardCaptureManager.kt` — ML Kit text recognition on camera photo
- **Deliverable:** VoiceCaptureManager builds; WhiteboardCaptureManager builds
- **Maps to:** FR-02 (US-02 voice), FR-03 (US-03 whiteboard)

### T6 — Sync layer
- [ ] Create `sync/ConnectivityMonitor.kt` — NetworkCallback, Flow<Boolean>
- [ ] Create `sync/SyncWorker.kt` — WorkManager: reads pendingQueue → Firestore write → delete from Room
- **Deliverable:** SyncWorker builds, can be enqueued via WorkManager
- **Maps to:** FR-04 (US-04 offline queue), NFR-04

### T7 — UI layer
- [ ] Create `ui/components/StagePill.kt` — idle/scrubbing/distilling/routing/cloud pastel pills
- [ ] Create `ui/components/FrictionBar.kt` — animated fill + threshold marker at 0.75
- [ ] Create `ui/components/ContextNodeCard.kt` — surface badge + summary + token count + time
- [ ] Create `ui/components/PendingBadge.kt` — count badge, hidden when 0
- [ ] Create `ui/HomeScreen.kt` — friction bar + recent nodes list + capture buttons
- [ ] Create `ui/MainScreen.kt` — navigation host, scaffold
- [ ] Create `MainActivity.kt` — Compose entry, WorkManager setup, Firestore listener
- **Deliverable:** UI compiles; HomeScreen renders in preview mode
- **Maps to:** FR-01 (US-01), FR-05 (US-05), FR-06 (US-06)

### T8 — Unit tests
- [x] Create `PiiScrubberTest.kt` — AND-01: 9 PII patterns
- [x] Create `ContextPacketBuilderTest.kt` — AND-02: tokenCount ≤ 300
- [x] Create `SyncWorkerTest.kt` — AND-03: pending → Firestore → delete
- [x] Create `FirestoreRepositoryTest.kt` — AND-04: PiiScrubber called before every save
- **Deliverable:** `./gradlew test` passes all tests
- **Maps to:** design.md Testing Strategy AND-01..AND-04

---

## Implementation Order

T1 → T2 + T3 (parallel) → T4 → T5 + T6 (parallel) → T7 → T8

T3 depends on T1. T4 is standalone (pure Kotlin, no Android deps). T5+T6 depend on T4. T7 depends on T2+T3+T5+T6.

---

## Notes

- `google-services.json` is gitignored — user must add their own Firebase project file
- Kotlin ports of `pii-scrubber.ts` and `context-packet.ts` must produce identical results to the TypeScript originals for the same input (verified by AND-01, AND-02)
- Android AICore / Gemini Nano API is accessed via try/catch — if unavailable, `NanoAvailability.check()` returns false and all processing continues without Nano
- SpeechRecognizer requires network — offline voice capture stores transcript as "[voice memo pending transcription]" in pendingQueue
