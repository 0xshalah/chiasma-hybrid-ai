# Design — CHIASMA Android App

**Status:** APPROVED (auto-approved per user directive 2026-11-15)
**Phase:** 5

---

## Open Questions Resolved

- **STT:** Android `SpeechRecognizer` (requires network). Offline voice capture queues the audio transcript as a placeholder until network is available. Future v2: ML Kit on-device STT.
- **Firestore schema:** Matches `ContextNode` from `packages/shared-core/src/types.ts` exactly. Android Kotlin data class mirrors the TypeScript type field-by-field.

---

## Architecture

```
packages/android-app/
├── build.gradle.kts                  ← project-level build
├── settings.gradle.kts
├── app/
│   ├── build.gradle.kts              ← app module (minSdk 34, Firebase, Room, AICore)
│   ├── google-services.json          ← (gitignored — user adds their own)
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/chiasma/app/
│       │   ├── MainActivity.kt        ← Compose entry point
│       │   ├── ui/
│       │   │   ├── MainScreen.kt      ← top-level composable, nav host
│       │   │   ├── HomeScreen.kt      ← friction bar + recent nodes + capture buttons
│       │   │   ├── components/
│       │   │   │   ├── StagePill.kt   ← same stage language as web-sandbox
│       │   │   │   ├── FrictionBar.kt ← scaleX animated bar + threshold marker
│       │   │   │   ├── ContextNodeCard.kt ← source badge + summary + token count
│       │   │   │   └── PendingBadge.kt    ← pending queue count
│       │   │   └── theme/
│       │   │       ├── Theme.kt       ← Warm Swiss Editorial colors in Material3
│       │   │       ├── Color.kt       ← CHIASMA design tokens as Color constants
│       │   │       └── Type.kt        ← Instrument Serif (headings), Plus Jakarta Sans (body)
│       │   ├── data/
│       │   │   ├── ContextNode.kt     ← Kotlin data class (mirrors shared-core ContextNode)
│       │   │   ├── LocalDatabase.kt   ← Room database (pending queue)
│       │   │   ├── PendingNodeDao.kt  ← Room DAO for offline queue
│       │   │   └── FirestoreRepository.kt ← read/write ContextNodes + friction score
│       │   ├── domain/
│       │   │   ├── PiiScrubber.kt     ← Kotlin port of pii-scrubber.ts (same 9 patterns)
│       │   │   ├── ContextPacketBuilder.kt ← Kotlin port of context-packet.ts
│       │   │   └── NanoAvailability.kt    ← checks Android AICore availability
│       │   ├── capture/
│       │   │   ├── VoiceCaptureManager.kt ← Android SpeechRecognizer wrapper
│       │   │   └── WhiteboardCaptureManager.kt ← Camera + ML Kit text recognition
│       │   └── sync/
│       │       ├── SyncWorker.kt      ← WorkManager worker: pendingQueue → Firestore
│       │       └── ConnectivityMonitor.kt ← NetworkCallback, triggers SyncWorker
│       └── res/
│           ├── values/strings.xml
│           └── values/colors.xml      ← fallback for XML-based views (not used in Compose)
```

---

## Component Interfaces

### Kotlin ContextNode (mirrors shared-core types.ts exactly)

```kotlin
// data/ContextNode.kt
data class ContextNode(
    val id: String,
    val userId: String,
    val packet: ContextPacket,
    val hemisphere: String,          // "system1" | "system2"
    val surface: String,             // "chrome-extension" | "android-app" | "web-sandbox"
    val pending: Boolean,
    val createdAt: String,           // ISO timestamp
    val syncedAt: String?            // null until synced
)

data class ContextPacket(
    val summary: String,
    val entities: List<String>,
    val source: String,
    val surface: String,
    val tokenCount: Int,
    val timestamp: String
)
```

### PiiScrubber (Kotlin port of pii-scrubber.ts)

Same 9 regex patterns, same `ScrubResult` output. Runs entirely on-device before any Firestore write.

```kotlin
data class ScrubResult(
    val redacted: String,
    val matches: List<PiiMatch>,
    val hasPii: Boolean
)

object PiiScrubber {
    fun scrub(text: String): ScrubResult
    fun containsPii(text: String): Boolean
}
```

### NanoAvailability

```kotlin
object NanoAvailability {
    // Returns true if Android AICore has Gemini Nano downloaded and ready
    suspend fun check(context: Context): Boolean
}
```

### FirestoreRepository

```kotlin
class FirestoreRepository(private val db: FirebaseFirestore) {
    // Write: always scrub first
    suspend fun saveContextNode(node: ContextNode): Result<Unit>

    // Read: last 5 nodes ordered by createdAt desc
    fun getRecentNodes(userId: String): Flow<List<ContextNode>>

    // Friction score from desktop session
    fun getFrictionScore(userId: String): Flow<FrictionScore?>
}
```

### Room PendingNodeDao

```kotlin
@Dao
interface PendingNodeDao {
    @Query("SELECT * FROM pending_nodes")
    fun getAll(): Flow<List<PendingContextNode>>

    @Insert(onConflict = REPLACE)
    suspend fun insert(node: PendingContextNode)

    @Delete
    suspend fun delete(node: PendingContextNode)

    @Query("SELECT COUNT(*) FROM pending_nodes")
    fun count(): Flow<Int>
}
```

---

## Screen Design

### HomeScreen layout

```
┌─────────────────────────────┐
│  CHIASMA          [StagePill]│  ← top bar
├─────────────────────────────┤
│  Friction: 0.42             │  ← FrictionBar (green, below threshold)
│  [████░░░░│░░░░░░░░░░░] 0.75│
│  Routed to System 1 — Local │
├─────────────────────────────┤
│  Recent context (5 nodes)   │
│  ┌────────────────────────┐ │
│  │ 🌐 GitHub — code.ts   │ │  ← ContextNodeCard (chrome-extension)
│  │ "function getUserById…"│ │
│  │ 28 tokens · 2m ago     │ │
│  └────────────────────────┘ │
├─────────────────────────────┤
│  [🎙 Capture Voice]         │  ← primary action
│  [📷 Scan Board]            │  ← secondary action
│            [🔄 3 pending]   │  ← PendingBadge
└─────────────────────────────┘
```

---

## Firestore Schema

Collection: `users/{userId}/contextNodes/{nodeId}`

```json
{
  "id": "uuid-v4",
  "userId": "firebase-auth-uid",
  "packet": {
    "summary": "...",
    "entities": ["...", "..."],
    "source": "MainActivity.kt",
    "surface": "android-app",
    "tokenCount": 42,
    "timestamp": "2026-11-15T07:00:00.000Z"
  },
  "hemisphere": "system1",
  "surface": "android-app",
  "pending": false,
  "createdAt": "2026-11-15T07:00:00.000Z",
  "syncedAt": "2026-11-15T07:00:01.000Z"
}
```

Collection: `users/{userId}/frictionScore` (single document, overwritten by desktop)

---

## Gradle Dependencies

```kotlin
// app/build.gradle.kts
dependencies {
    // Compose
    implementation("androidx.compose.ui:ui:1.7.5")
    implementation("androidx.compose.material3:material3:1.3.1")
    implementation("androidx.navigation:navigation-compose:2.8.3")

    // Firebase
    implementation(platform("com.google.firebase:firebase-bom:33.6.0"))
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-appcheck-playintegrity")

    // Room (offline queue)
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")

    // WorkManager (background sync)
    implementation("androidx.work:work-runtime-ktx:2.9.1")

    // Android AICore (Gemini Nano)
    implementation("com.google.android.gms:play-services-tasks:18.2.0")
    // Note: AICore API is accessed via com.google.ai.edge.aicore:aicore (preview)
    // Fallback: check availability only, no hard dependency

    // ML Kit text recognition (whiteboard OCR)
    implementation("com.google.mlkit:text-recognition:16.0.1")

    // Testing
    testImplementation("junit:junit:4.13.2")
    testImplementation("io.mockk:mockk:1.13.12")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
}
```

---

## Error Handling

| Error | User sees |
|---|---|
| Nano unavailable | Stage pill = "System 1 — Limited" (amber), skip local distillation |
| STT fails | "Voice capture failed — try again" snackbar, discard audio |
| Firestore write fails | Node stays in pendingQueue, badge increments |
| OCR returns no text | "No text detected — try better lighting" snackbar |
| App Check fails | Firestore write blocked, error logged, user sees "Sync unavailable" |

---

## Testing Strategy

### Unit tests (JUnit4 + MockK)

| ID | What |
|---|---|
| AND-01 | `PiiScrubber.scrub()` — 9 patterns, matches Kotlin output to TypeScript output |
| AND-02 | `ContextPacketBuilder.build()` — tokenCount ≤ 300, entity extraction |
| AND-03 | `SyncWorker` — pending nodes → Firestore write, then delete from Room |
| AND-04 | `PiiScrubber` runs before every `FirestoreRepository.saveContextNode()` call |

### Manual regression checklist
1. Install APK on Android 14+ device
2. Open app → Stage pill shows Nano status within 2s
3. Tap "Capture Voice" → record "my firebase project id is example123" → check Firestore: PII redacted
4. Turn off WiFi → capture voice → check pending badge increments
5. Turn WiFi back on → check nodes sync and badge clears

---

## Constraints

- min SDK 34 (Android 14), target SDK 35
- PiiScrubber must run before EVERY Firestore write — no exceptions
- NO raw PII in Firestore, Room, or logs
- APK size < 15MB (ML Kit model downloaded on demand)
- Compose-only UI, no XML layouts
