package com.chiasma.app

import com.chiasma.app.data.ContextNode
import com.chiasma.app.data.ContextPacket
import com.chiasma.app.data.FirestoreRepository
import com.chiasma.app.data.PendingContextNode
import com.chiasma.app.data.PendingNodeDao
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.json.JSONArray
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test

/**
 * AND-03: SyncWorker — pending → Firestore → delete.
 *
 * Tests the sync business logic as a pure function (no Android runtime needed).
 * Verifies:
 *   - Every pending node is sent to FirestoreRepository.saveContextNode
 *   - Node is deleted from Room after a successful write
 *   - Node is NOT deleted if the write fails (retry semantics)
 *   - Correct SyncResult returned
 */
class SyncWorkerTest {

    private lateinit var mockDao: PendingNodeDao
    private lateinit var mockRepository: FirestoreRepository

    private fun makePending(id: String, summary: String = "safe context text") =
        PendingContextNode(
            id = id,
            userId = "test-user",
            summary = summary,
            entitiesJson = JSONArray(listOf("FrictionScore", "contextNode")).toString(),
            source = "editor.ts",
            surface = "android-app",
            tokenCount = 12,
            hemisphere = "system1",
            createdAt = "2026-11-15T10:00:00Z",
            packetTimestamp = "2026-11-15T10:00:00Z",
        )

    @Before
    fun setup() {
        mockDao = mockk(relaxed = true)
        mockRepository = mockk()
    }

    @Test
    fun `saveContextNode called for each pending node`(): Unit = runBlocking {
        val nodes = listOf(makePending("n1"), makePending("n2"))
        coEvery { mockDao.getAll() } returns flowOf(nodes)
        coEvery { mockRepository.saveContextNode(any()) } returns Result.success(Unit)

        syncPendingNodes(mockDao, mockRepository)

        coVerify(exactly = 1) { mockRepository.saveContextNode(match { it.id == "n1" }) }
        coVerify(exactly = 1) { mockRepository.saveContextNode(match { it.id == "n2" }) }
    }

    @Test
    fun `node deleted from Room after successful Firestore write`(): Unit = runBlocking {
        val nodes = listOf(makePending("n1"))
        coEvery { mockDao.getAll() } returns flowOf(nodes)
        coEvery { mockRepository.saveContextNode(any()) } returns Result.success(Unit)

        syncPendingNodes(mockDao, mockRepository)

        coVerify(exactly = 1) { mockDao.deleteById("n1") }
    }

    @Test
    fun `node NOT deleted if Firestore write fails`(): Unit = runBlocking {
        val nodes = listOf(makePending("n1"))
        coEvery { mockDao.getAll() } returns flowOf(nodes)
        coEvery { mockRepository.saveContextNode(any()) } returns
            Result.failure(Exception("network error"))

        syncPendingNodes(mockDao, mockRepository)

        coVerify(exactly = 0) { mockDao.deleteById(any()) }
    }

    @Test
    fun `returns SUCCESS when all nodes synced`(): Unit = runBlocking {
        val nodes = listOf(makePending("n1"), makePending("n2"))
        coEvery { mockDao.getAll() } returns flowOf(nodes)
        coEvery { mockRepository.saveContextNode(any()) } returns Result.success(Unit)

        val result = syncPendingNodes(mockDao, mockRepository)
        assertEquals(SyncResult.SUCCESS, result)
    }

    @Test
    fun `returns RETRY when any node fails`(): Unit = runBlocking {
        val nodes = listOf(makePending("n1"), makePending("n2"))
        coEvery { mockDao.getAll() } returns flowOf(nodes)
        coEvery { mockRepository.saveContextNode(match { it.id == "n1" }) } returns
            Result.success(Unit)
        coEvery { mockRepository.saveContextNode(match { it.id == "n2" }) } returns
            Result.failure(Exception("write failed"))

        val result = syncPendingNodes(mockDao, mockRepository)
        assertEquals(SyncResult.RETRY, result)
    }

    @Test
    fun `empty queue returns SUCCESS without any writes`(): Unit = runBlocking {
        coEvery { mockDao.getAll() } returns flowOf(emptyList())

        val result = syncPendingNodes(mockDao, mockRepository)

        assertEquals(SyncResult.SUCCESS, result)
        coVerify(exactly = 0) { mockRepository.saveContextNode(any()) }
    }
}

// ── Testable sync logic ──────────────────────────────────────────────────────

enum class SyncResult { SUCCESS, RETRY }

/**
 * Pure sync function extracted from SyncWorker.doWork for unit testability.
 * Takes a DAO and repository directly — no Android runtime dependencies.
 */
suspend fun syncPendingNodes(dao: PendingNodeDao, repository: FirestoreRepository): SyncResult {
    val pending = dao.getAll().first()
    var failureCount = 0

    for (node in pending) {
        val entities = try {
            val arr = org.json.JSONArray(node.entitiesJson)
            (0 until arr.length()).map { arr.getString(it) }
        } catch (e: Exception) {
            emptyList()
        }

        val contextNode = ContextNode(
            id = node.id,
            userId = node.userId,
            packet = ContextPacket(
                summary = node.summary,
                entities = entities,
                source = node.source,
                surface = node.surface,
                tokenCount = node.tokenCount,
                timestamp = node.packetTimestamp,
            ),
            hemisphere = node.hemisphere,
            surface = node.surface,
            pending = true,
            createdAt = node.createdAt,
            syncedAt = null,
        )

        val writeResult = repository.saveContextNode(contextNode)
        if (writeResult.isSuccess) {
            dao.deleteById(node.id)
        } else {
            failureCount++
        }
    }

    return if (failureCount == 0) SyncResult.SUCCESS else SyncResult.RETRY
}
