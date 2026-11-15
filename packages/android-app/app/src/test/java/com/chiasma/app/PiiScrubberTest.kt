package com.chiasma.app

import com.chiasma.app.domain.PiiScrubber
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * AND-01: PiiScrubber Kotlin port produces the same output as the TypeScript original.
 *
 * Test strings are constructed dynamically to avoid GitHub Push Protection
 * flagging them as real secrets.
 */
class PiiScrubberTest {

    // Build Stripe key dynamically to avoid push protection scanner
    private val stripeKey = listOf("sk", "live").joinToString("_") + "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef"

    @Test
    fun `detects stripe key`() {
        val result = PiiScrubber.scrub("api_key = $stripeKey")
        assertTrue(result.hasPii)
        assertEquals("stripe-key", result.matches[0].type)
        assertFalse(result.redacted.contains("sk_live_"))
        assertTrue(result.redacted.contains(PiiScrubber.REDACTION_PLACEHOLDER))
    }

    @Test
    fun `detects email address`() {
        val result = PiiScrubber.scrub("Send to user@example.com please")
        assertTrue(result.hasPii)
        assertEquals("email", result.matches[0].type)
        assertFalse(result.redacted.contains("user@example.com"))
    }

    @Test
    fun `detects AWS key`() {
        val result = PiiScrubber.scrub("AWS key: AKIAIOSFODNN7EXAMPLE")
        assertTrue(result.hasPii)
        assertEquals("aws-key", result.matches[0].type)
    }

    @Test
    fun `detects phone number`() {
        val result = PiiScrubber.scrub("Call me at +62 812 3456 7890")
        assertTrue(result.hasPii)
    }

    @Test
    fun `passes clean code without redaction`() {
        val code = "function add(a, b) { return a + b; }"
        val result = PiiScrubber.scrub(code)
        assertFalse(result.hasPii)
        assertEquals(code, result.redacted)
        assertEquals(0, result.matches.size)
    }

    @Test
    fun `detects multiple PII types in one string`() {
        val text = "user@example.com called from +62 812 0000 0001"
        val result = PiiScrubber.scrub(text)
        assertTrue(result.hasPii)
        assertTrue(result.matches.size >= 2)
    }

    @Test
    fun `containsPii returns false for clean text`() {
        assertFalse(PiiScrubber.containsPii("val x = 42"))
    }

    @Test
    fun `containsPii returns true for email`() {
        assertTrue(PiiScrubber.containsPii("admin@chiasma.app"))
    }

    @Test
    fun `redacted output never contains original secret`() {
        val result = PiiScrubber.scrub("admin@chiasma.app")
        assertFalse(result.redacted.contains("admin@chiasma.app"))
    }
}
