package com.chiasma.app.data

import com.chiasma.app.domain.PiiScrubber
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.flowOf

/**
 * FirestoreRepository — reads and writes ContextNodes to Firestore.
 *
 * IMPORTANT: scrubPII() MUST be called before every write. This is enforced
 * in saveContextNode(). Never bypass this check — it is NFR-05.
 *
 * Firebase SDK is commented out until google-services.json is added.
 * The interface is complete; callers can stub or mock it in tests.
 */
class FirestoreRepository(
    // private val db: FirebaseFirestore = FirebaseFirestore.getInstance()
) {

    // Collection path: users/{userId}/contextNodes/{nodeId}
    private fun nodesCollection(userId: String) = "users/$userId/contextNodes"

    // Document path: users/{userId}/frictionScore
    private fun frictionDoc(userId: String) = "users/$userId/frictionScore"

    /**
     * Write a ContextNode to Firestore.
     *
     * ALWAYS runs scrubPII on the packet summary before writing.
     * Returns Result.failure if PII is still present after scrubbing (should never happen,
     * but serves as a safety net).
     */
    suspend fun saveContextNode(node: ContextNode): Result<Unit> {
        // NFR-05: PII scrub before EVERY Firestore write
        val scrubResult = PiiScrubber.scrub(node.packet.summary)
        val safeSummary = scrubResult.redacted

        val safeNode = node.copy(
            packet = node.packet.copy(summary = safeSummary),
        )

        // Safety net: if scrubber missed something (should not happen), block write
        if (PiiScrubber.containsPii(safeNode.packet.summary)) {
            return Result.failure(
                SecurityException("PII detected in packet summary after scrubbing — write blocked"),
            )
        }

        return try {
            // TODO: uncomment when Firebase is configured
            // val collection = db.collection(nodesCollection(safeNode.userId))
            // collection.document(safeNode.id).set(safeNode).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Stream the last 5 ContextNodes from Firestore ordered by createdAt descending.
     * Emits an empty list while offline or while Firebase is not configured.
     */
    fun getRecentNodes(userId: String): Flow<List<ContextNode>> {
        // TODO: uncomment when Firebase is configured
        // return callbackFlow {
        //     val listener = db.collection(nodesCollection(userId))
        //         .orderBy("createdAt", Query.Direction.DESCENDING)
        //         .limit(5)
        //         .addSnapshotListener { snapshot, error ->
        //             if (error != null) return@addSnapshotListener
        //             val nodes = snapshot?.toObjects(ContextNode::class.java) ?: emptyList()
        //             trySend(nodes)
        //         }
        //     awaitClose { listener.remove() }
        // }
        return flowOf(emptyList())
    }

    /**
     * Stream the current friction score written by the desktop Chrome extension.
     */
    fun getFrictionScore(userId: String): Flow<FrictionScore?> {
        // TODO: uncomment when Firebase is configured
        // return callbackFlow {
        //     val listener = db.document(frictionDoc(userId))
        //         .addSnapshotListener { snapshot, _ ->
        //             val score = snapshot?.toObject(FrictionScore::class.java)
        //             trySend(score)
        //         }
        //     awaitClose { listener.remove() }
        // }
        return flowOf(null)
    }
}
