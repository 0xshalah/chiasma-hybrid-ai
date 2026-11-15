package com.chiasma.app.domain

/**
 * PII Scrubber — Kotlin port of packages/shared-core/src/pii-scrubber.ts
 *
 * Same 9 patterns, same REDACTION_PLACEHOLDER, same ScrubResult structure.
 * Must produce identical output to the TypeScript original for the same input.
 * Verified by unit test AND-01.
 *
 * Runs entirely on-device before any Firestore write (NFR-05).
 */
object PiiScrubber {

    const val REDACTION_PLACEHOLDER = "[REDACTED_PII]"

    private data class Pattern(val type: String, val regex: Regex)

    // Same 9 patterns as pii-scrubber.ts, translated to Kotlin regex syntax
    private val PATTERNS = listOf(
        // Stripe secret/public keys
        Pattern("stripe-key", Regex("""(?:sk|pk)_(?:live|test)_[A-Za-z0-9]{24,}""")),

        // AWS access key IDs
        Pattern("aws-key", Regex("""AKIA[0-9A-Z]{16}""")),

        // Google API keys (39 chars, AIza prefix)
        Pattern("google-api-key", Regex("""AIza[0-9A-Za-z\-_]{35}""")),

        // JWT tokens (three base64url segments)
        Pattern("jwt-token", Regex("""eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}""")),

        // Bearer tokens
        Pattern("bearer-token", Regex("""(?i)Bearer\s+[A-Za-z0-9._\-+/=]{20,}""")),

        // PEM private key blocks
        Pattern(
            "private-key",
            Regex("""-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----"""),
        ),

        // Email addresses
        Pattern("email", Regex("""[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}""")),

        // Credit card numbers (13-19 digits)
        Pattern("credit-card", Regex("""(?:\d[ -]?){13,19}""")),

        // Phone numbers
        Pattern("phone", Regex("""\+?\d{1,3}?[ .-]?\(?\d{1,4}\)?[ .-]?\d{3,5}[ .-]?\d{3,5}""")),
    )

    data class PiiMatch(
        val type: String,
        val matched: String,
        val start: Int,
        val end: Int,
    )

    data class ScrubResult(
        val redacted: String,
        val matches: List<PiiMatch>,
        val hasPii: Boolean,
    )

    fun scrub(text: String): ScrubResult {
        val allMatches = mutableListOf<PiiMatch>()

        for (pattern in PATTERNS) {
            for (matchResult in pattern.regex.findAll(text)) {
                allMatches.add(
                    PiiMatch(
                        type = pattern.type,
                        matched = matchResult.value,
                        start = matchResult.range.first,
                        end = matchResult.range.last + 1,
                    ),
                )
            }
        }

        // Sort descending by start to replace from end (keeps earlier indices valid)
        allMatches.sortByDescending { it.start }

        var redacted = text
        for (match in allMatches) {
            redacted = redacted.substring(0, match.start) +
                REDACTION_PLACEHOLDER +
                redacted.substring(match.end)
        }

        // Re-sort ascending for the returned list
        allMatches.sortBy { it.start }

        return ScrubResult(
            redacted = redacted,
            matches = allMatches,
            hasPii = allMatches.isNotEmpty(),
        )
    }

    fun containsPii(text: String): Boolean {
        return PATTERNS.any { pattern -> pattern.regex.containsMatchIn(text) }
    }
}
