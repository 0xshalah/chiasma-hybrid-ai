/**
 * PII Scrubber — local, on-device sensitive data detection and redaction.
 *
 * Runs entirely in-memory on System 1 (Gemini Nano 4) before any text
 * touches the network layer. Replaces detected secrets with [REDACTED_PII].
 *
 * This is the TypeScript reference implementation. The Android app ports
 * these same regex patterns to Kotlin.
 */

import type { PIIMatch, PIIPatternType, ScrubResult } from "./types.js";

/** Pattern definitions — stored as source strings, NOT compiled RegExp objects.
 *  A new RegExp is created on every scrubPII call to avoid shared `lastIndex`
 *  state corruption when the function is called rapidly (e.g. on every keystroke).
 */
const PATTERN_DEFS: Array<{ type: PIIPatternType; source: string; flags: string }> = [
  // Stripe secret keys
  { type: "stripe-key", source: String.raw`\b(?:sk|pk)_(?:live|test)_[A-Za-z0-9]{24,}\b`, flags: "g" },

  // AWS access key IDs (20 uppercase alphanumerics starting AKIA)
  { type: "aws-key", source: String.raw`\bAKIA[0-9A-Z]{16}\b`, flags: "g" },

  // Google API keys (39 chars, AIza prefix)
  { type: "google-api-key", source: String.raw`\bAIza[0-9A-Za-z\-_]{35}\b`, flags: "g" },

  // JWT tokens (three base64 segments separated by dots)
  { type: "jwt-token", source: String.raw`\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b`, flags: "g" },

  // Bearer tokens
  { type: "bearer-token", source: String.raw`\bBearer\s+[A-Za-z0-9._\-+\/=]{20,}\b`, flags: "gi" },

  // PEM private key blocks
  { type: "private-key", source: String.raw`-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----`, flags: "g" },

  // Email addresses
  { type: "email", source: String.raw`\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b`, flags: "g" },

  // Credit card numbers (13-19 digits, optional spaces/dashes)
  { type: "credit-card", source: String.raw`\b(?:\d[ -]?){13,19}\b`, flags: "g" },

  // Phone numbers (international format, 7-15 digits)
  { type: "phone", source: String.raw`\+?\d{1,3}?[ .-]?\(?\d{1,4}\)?[ .-]?\d{3,5}[ .-]?\d{3,5}\b`, flags: "g" },
];

/** The replacement text for all redacted content. */
export const REDACTION_PLACEHOLDER = "[REDACTED_PII]";

/**
 * Scrub text for PII. Returns redacted text + list of matches.
 *
 * @example
 * const result = scrubPII("My API key is sk_live_abc123def456...");
 * // result.redacted === "My API key is [REDACTED_PII]..."
 * // result.matches[0].type === "stripe-key"
 * // result.hasPII === true
 */
export function scrubPII(text: string): ScrubResult {
  const matches: PIIMatch[] = [];

  // Build fresh RegExp objects each call — avoids shared lastIndex corruption
  for (const { type, source, flags } of PATTERN_DEFS) {
    const regex = new RegExp(source, flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        type,
        matched: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });

      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }
  }

  // Sort matches by start position descending so we replace from the end
  // (this keeps earlier indices valid as we replace)
  matches.sort((a, b) => b.start - a.start);

  // Build the redacted string by replacing from the end backwards
  let redacted = text;
  for (const match of matches) {
    redacted =
      redacted.slice(0, match.start) +
      REDACTION_PLACEHOLDER +
      redacted.slice(match.end);
  }

  // Re-sort matches by start position for the returned array
  matches.sort((a, b) => a.start - b.start);

  return {
    redacted,
    matches,
    hasPII: matches.length > 0,
  };
}

/**
 * Quick check: does the text contain any PII?
 * Faster than scrubPII when you only need a boolean.
 */
export function containsPII(text: string): boolean {
  for (const { source, flags } of PATTERN_DEFS) {
    const regex = new RegExp(source, flags);
    if (regex.test(text)) {
      return true;
    }
  }
  return false;
}
