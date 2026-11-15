package com.chiasma.app.data

import com.chiasma.app.domain.PiiScrubber
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.tasks.await

/**
 * FirestoreRepository — reads and writes ContextNodes to Firestore.
 *
 * IMPORTANT: scrubPII() MUST be called before every write. This is enforced
 * in saveContextNode(). Never bypass this check — it is NFR-05.
 *
 * Requires google-services.json in app/ and Firebase dependencies in build.gradle.
 */
class FirestoreRepository(
    private val db: FirebaseFirestore = FirebaseFirestore.getInstance(),
) {

    private fun nodesCollection(userId: String) = "users/$userId/contextNodes"
    private fun frictionDoc(userId: String) = "users/$userId/frictionScore"

    /**
     * Write a ContextNode to Firestore.
     * ALWAYS runs scrubPII on the packet summary before writing (NFR-05).
     */
    suspend fun saveContextNode(node: ContextNode): Result<Unit> {
        // NFR-05: PII scrub before EVERY Firestore write
        val scrubResult = PiiScrubber.scrub(node.packet.summary)
        val safeNode = node.copy(packet = node.packet.copy(summary = scrubResult.redacted))

        // Safety net: block write if PII still detected after scrubbing
        if (PiiScrubber.containsPii(safeNode.packet.summary)) {
            return Result.failure(
                SecurityException("PII detected after scrubbing — write blocked"),
            )
        }

        return try {
            db.collection(nodesCollection(safeNode.userId))
                .document(safeNode.id)
                .set(safeNode)
                .await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Stream the last 5 ContextNodes from Firestore ordered by createdAt descending.
     */
    fun getRecentNodes(userId: String): Flow<List<ContextNode>> = callbackFlow {
        val listener = db.collection(nodesCollection(userId))
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .limit(5)
            .addSnapshotListener { snapshot, error ->
                if (error != null || snapshot == null) return@addSnapshotListener
                val nodes = snapshot.toObjects(ContextNode::class.java)
                trySend(nodes)
            }
        awaitClose { listener.remove() }
    }

    /**
     * Stream the current friction score written by the desktop Chrome extension.
     */
    fun getFrictionScore(userId: String): Flow<FrictionScore?> = callbackFlow {
        val listener = db.document(frictionDoc(userId))
            .addSnapshotListener { snapshot, _ ->
                val score = snapshot?.toObject(FrictionScore::class.java)
                trySend(score)
            }
        awaitClose { listener.remove() }
    }
}
