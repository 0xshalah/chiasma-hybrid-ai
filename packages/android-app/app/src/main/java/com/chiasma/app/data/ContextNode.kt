package com.chiasma.app.data

import androidx.room.ColumnInfo
import androidx.room.Embedded
import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Kotlin mirror of shared-core ContextNode and ContextPacket types.
 *
 * Field names and types must match packages/shared-core/src/types.ts exactly
 * so that Firestore serialization produces identical JSON on both platforms.
 */

// ── ContextPacket ─────────────────────────────────────────────────────────────

data class ContextPacket(
    val summary: String = "",
    val entities: List<String> = emptyList(),
    val source: String = "",
    val surface: String = "",          // "chrome-extension" | "android-app" | "web-sandbox"
    val tokenCount: Int = 0,
    val timestamp: String = "",        // ISO 8601
)

// ── ContextNode ───────────────────────────────────────────────────────────────

data class ContextNode(
    val id: String = "",
    val userId: String = "",
    val packet: ContextPacket = ContextPacket(),
    val hemisphere: String = "system1", // "system1" | "system2"
    val surface: String = "android-app",
    val pending: Boolean = false,
    val createdAt: String = "",         // ISO 8601
    val syncedAt: String? = null,
)

// ── FrictionScore (from desktop session via Firestore) ────────────────────────

data class FrictionScore(
    val value: Float = 0f,             // 0.00 – 1.00
    val trigger: String = "manual",    // "text-revision" | "idle-pause" | "context-switch" | "manual"
    val timestamp: String = "",        // ISO 8601
)

// ── Room entity for offline queue ────────────────────────────────────────────

@Entity(tableName = "pending_nodes")
data class PendingContextNode(
    @PrimaryKey
    val id: String,

    @ColumnInfo(name = "user_id")
    val userId: String,

    @ColumnInfo(name = "summary")
    val summary: String,

    @ColumnInfo(name = "entities")
    val entitiesJson: String,          // JSON-serialized List<String>

    @ColumnInfo(name = "source")
    val source: String,

    @ColumnInfo(name = "surface")
    val surface: String,

    @ColumnInfo(name = "token_count")
    val tokenCount: Int,

    @ColumnInfo(name = "hemisphere")
    val hemisphere: String,

    @ColumnInfo(name = "created_at")
    val createdAt: String,

    @ColumnInfo(name = "packet_timestamp")
    val packetTimestamp: String,
)

/** Convert PendingContextNode back to ContextNode for Firestore sync. */
fun PendingContextNode.toContextNode(entitiesList: List<String>): ContextNode =
    ContextNode(
        id = id,
        userId = userId,
        packet = ContextPacket(
            summary = summary,
            entities = entitiesList,
            source = source,
            surface = surface,
            tokenCount = tokenCount,
            timestamp = packetTimestamp,
        ),
        hemisphere = hemisphere,
        surface = surface,
        pending = true,
        createdAt = createdAt,
        syncedAt = null,
    )
