package com.chiasma.app

import com.chiasma.app.domain.ContextPacketBuilder
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * AND-02: ContextPacketBuilder produces tokenCount ≤ 300 and correct entity extraction.
 */
class ContextPacketBuilderTest {

    @Test
    fun `tokenCount is never above 300`() {
        val longText = "A".repeat(5000)
        val packet = ContextPacketBuilder.build(longText, "test.kt", "android-app")
        assertTrue(
            "tokenCount ${packet.tokenCount} should be ≤ 300",
            packet.tokenCount <= 300,
        )
    }

    @Test
    fun `short text tokenCount is accurate`() {
        val text = "Hello world"
        val packet = ContextPacketBuilder.build(text, "source.kt", "android-app")
        assertTrue(packet.tokenCount > 0)
        assertTrue(packet.tokenCount <= 300)
    }

    @Test
    fun `surface field matches parameter`() {
        val packet = ContextPacketBuilder.build("some code", "file.kt", "android-app")
        assertEquals("android-app", packet.surface)
    }

    @Test
    fun `source field matches parameter`() {
        val packet = ContextPacketBuilder.build("some code", "MainActivity.kt", "android-app")
        assertEquals("MainActivity.kt", packet.source)
    }

    @Test
    fun `extracts CamelCase entities`() {
        val text = "Call getUserById to get the FirebaseAuth instance"
        val packet = ContextPacketBuilder.build(text, "source.kt", "android-app")
        assertTrue(
            "Expected getUserById or FirebaseAuth in entities: ${packet.entities}",
            packet.entities.any { it == "getUserById" || it == "FirebaseAuth" },
        )
    }

    @Test
    fun `summary is not empty for non-empty input`() {
        val packet = ContextPacketBuilder.build("val x = 42", "test.kt", "android-app")
        assertTrue(packet.summary.isNotEmpty())
    }

    @Test
    fun `estimateTokens is proportional to string length`() {
        val short = ContextPacketBuilder.estimateTokens("hi")
        val long = ContextPacketBuilder.estimateTokens("hi".repeat(100))
        assertTrue(long > short)
    }
}
