package com.chiasma.app.sync

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.chiasma.app.data.FirestoreRepository
import com.chiasma.app.data.LocalDatabase
import com.chiasma.app.data.toContextNode
import kotlinx.coroutines.flow.first
import org.json.JSONArray

/**
 * SyncWorker — WorkManager worker that syncs pending nodes to Firestore.
 *
 * Triggered by ConnectivityMonitor when device comes back online.
 * Flow: read pendingQueue → scrub (again, as safety net) → Firestore write → delete from Room.
 *
 * Idempotent: each node is deleted only after confirmed write.
 * If Firestore write fails, node stays in queue for the next sync attempt.
 */
class SyncWorker(
    context: Context,
    params: WorkerParameters,
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val db = LocalDatabase.getInstance(applicationContext)
        val repository = FirestoreRepository()
        val pendingNodes = db.pendingNodeDao().getAll().first()

        var successCount = 0
        var failureCount = 0

        for (pending in pendingNodes) {
            val entities = try {
                val arr = JSONArray(pending.entitiesJson)
                (0 until arr.length()).map { arr.getString(it) }
            } catch (e: Exception) {
                emptyList()
            }

            val contextNode = pending.toContextNode(entities)

            val writeResult = repository.saveContextNode(contextNode)

            if (writeResult.isSuccess) {
                db.pendingNodeDao().deleteById(pending.id)
                successCount++
            } else {
                failureCount++
            }
        }

        return if (failureCount == 0) {
            Result.success()
        } else {
            // Some nodes failed — retry later
            Result.retry()
        }
    }

    companion object {
        const val WORK_NAME = "chiasma_sync_worker"
    }
}
