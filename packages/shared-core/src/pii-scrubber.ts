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

/** Each PII type and its detection regex. */
const PATTERNS: Array<{ type: PIIPatternType; regex: RegExp }> = [
  // Stripe secret keys
  { type: "stripe-key", regex: /\b(?:sk|pk)_(?:live|test)_[A-Za-z0-9]{24,}\b/g },

  // AWS access key IDs (20 uppercase alphanumerics starting AKIA)
  { type: "aws-key", regex: /\bAKIA[0-9A-Z]{16}\b/g },

  // Google API keys (39 chars, AIza prefix)
  { type: "google-api-key", regex: /\bAIza[0-9A-Za-z\-_]{35}\b/g },

  // JWT tokens (three base64 segments separated by dots)
  { type: "jwt-token", regex: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },

  // Bearer tokens
  { type: "bearer-token", regex: /\bBearer\s+[A-Za-z0-9._\-+\/=]{20,}\b/gi },

  // PEM private key blocks
  { type: "private-key", regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g },

  // Email addresses
  { type: "email", regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g },

  // Credit card numbers (13-19 digits, optional spaces/dashes)
  { type: "credit-card", regex: /\b(?:\d[ -]?){13,19}\b/g },

  // Phone numbers (international format, 7-15 digits)
  { type: "phone", regex: /\+?\d{1,3}?[ .-]?\(?\d{1,4}\)?[ .-]?\d{3,5}[ .-]?\d{3,5}\b/g },
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

  // Collect all matches with their positions
  for (const { type, regex } of PATTERNS) {
    // Reset lastIndex for global regexes
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        type,
        matched: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });

      // Prevent infinite loop on zero-length matches
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
  for (const { regex } of PATTERNS) {
    regex.lastIndex = 0;
    if (regex.test(text)) {
      return true;
    }
  }
  return false;
}
