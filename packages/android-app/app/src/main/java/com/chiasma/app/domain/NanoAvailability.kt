package com.chiasma.app.domain

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * NanoAvailability — checks if Gemini Nano (Android AICore) is available on this device.
 *
 * Android AICore API (com.google.ai.edge.aicore) requires Android 14+ and
 * the Gemini Nano model to be downloaded via Play Store. We wrap the check
 * in a try/catch so the app works gracefully on devices without AICore.
 *
 * Returns false → all processing continues without Nano (stage pill shows "System 1 — Limited").
 * Returns true → Nano is ready for on-device inference.
 */
object NanoAvailability {

    /**
     * Check whether Gemini Nano is available on this device.
     *
     * Currently returns false (scaffold) until AICore API is integrated.
     * Integration steps:
     * 1. Add `com.google.ai.edge.aicore:aicore` dependency when stable
     * 2. Call AICore.getGenerativeModel() and check the result
     * 3. If successful, return true; if exception, return false
     */
    suspend fun check(context: Context): Boolean = withContext(Dispatchers.IO) {
        try {
            // TODO: replace with actual AICore availability check
            // val aiCore = GenerativeModel.getInstance(context)
            // return@withContext aiCore.isAvailable()
            false // Scaffold: return false until AICore dependency is added
        } catch (e: Exception) {
            false
        }
    }
}
