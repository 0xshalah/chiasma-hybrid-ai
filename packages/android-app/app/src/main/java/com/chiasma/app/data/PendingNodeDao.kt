package com.chiasma.app.data

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface PendingNodeDao {

    @Query("SELECT * FROM pending_nodes ORDER BY created_at ASC")
    fun getAll(): Flow<List<PendingContextNode>>

    @Query("SELECT COUNT(*) FROM pending_nodes")
    fun count(): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(node: PendingContextNode)

    @Delete
    suspend fun delete(node: PendingContextNode)

    @Query("DELETE FROM pending_nodes WHERE id = :id")
    suspend fun deleteById(id: String)
}
