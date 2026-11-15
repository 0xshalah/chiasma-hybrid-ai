package com.chiasma.app.domain

import com.chiasma.app.data.ContextPacket

/**
 * ContextPacketBuilder — Kotlin port of packages/shared-core/src/context-packet.ts
 *
 * Distills raw text into a ContextPacket with tokenCount ≤ 300.
 * Uses the same heuristics as the TypeScript original (~4 chars per token).
 * Verified by unit test AND-02.
 */
object ContextPacketBuilder {

    const val MAX_PACKET_TOKENS = 300
    private const val CHARS_PER_TOKEN = 4

    /**
     * Estimate token count for a string (same 4 chars/token heuristic as TypeScript).
     */
    fun estimateTokens(text: String): Int = (text.length + CHARS_PER_TOKEN - 1) / CHARS_PER_TOKEN

    /**
     * Truncate text to fit within a token budget.
     * Tries to cut at a sentence or word boundary.
     */
    fun truncateToTokens(text: String, maxTokens: Int): String {
        val maxChars = maxTokens * CHARS_PER_TOKEN
        if (text.length <= maxChars) return text

        var truncated = text.substring(0, maxChars)

        // Try to cut at the last sentence boundary
        val lastSentence = truncated.lastIndexOf(". ")
        if (lastSentence > maxChars * 0.5) {
            truncated = truncated.substring(0, lastSentence + 1)
        } else {
            // Fall back to the last word boundary
            val lastSpace = truncated.lastIndexOf(' ')
            if (lastSpace > maxChars * 0.5) {
                truncated = truncated.substring(0, lastSpace)
            }
        }

        return "$truncated…"
    }

    /**
     * Extract simple entities (CamelCase, CONSTANT_CASE, snake_case identifiers).
     * Same heuristic as the TypeScript extractEntities().
     */
    fun extractEntities(text: String, maxEntities: Int = 10): List<String> {
        val entities = linkedSetOf<String>()

        // CamelCase identifiers (e.g., getUserById)
        Regex("""\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b""").findAll(text)
            .forEach { entities.add(it.value) }

        // CONSTANT_CASE (e.g., MAX_TOKENS)
        Regex("""\b[A-Z][A-Z_]{2,}\b""").findAll(text)
            .forEach { entities.add(it.value) }

        // snake_case (e.g., friction_score)
        Regex("""\b[a-z]+_[a-z_]+\b""").findAll(text)
            .forEach { entities.add(it.value) }

        return entities.take(maxEntities)
    }

    /**
     * Build a ContextPacket from raw text.
     *
     * @param rawText the active context (editor content, voice transcript)
     * @param source a reference to where the text came from
     * @param surface which surface created this packet
     */
    fun build(rawText: String, source: String, surface: String): ContextPacket {
        val entities = extractEntities(rawText)

        val summaryText = rawText.trim().split(Regex("""\n\n+""")).firstOrNull() ?: rawText.trim()
        val summary = truncateToTokens(summaryText, MAX_PACKET_TOKENS - 80)

        val packetText = "$summary ${entities.joinToString(" ")} $source"
        var tokenCount = estimateTokens(packetText)

        var finalSummary = summary
        if (tokenCount > MAX_PACKET_TOKENS) {
            val excessTokens = tokenCount - MAX_PACKET_TOKENS
            val excessChars = excessTokens * CHARS_PER_TOKEN
            finalSummary = truncateToTokens(
                summary,
                (summary.length - excessChars).coerceAtLeast(1),
            )
            tokenCount = estimateTokens("$finalSummary ${entities.joinToString(" ")} $source")
        }

        return ContextPacket(
            summary = finalSummary,
            entities = entities,
            source = source,
            surface = surface,
            tokenCount = tokenCount,
            timestamp = java.time.Instant.now().toString(),
        )
    }
}
