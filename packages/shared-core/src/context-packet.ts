/**
 * Context Packet builder — distills active context into a ≤300 token
 * structured JSON packet on System 1 (Gemini Nano 4).
 *
 * The packet is the bridge between System 1 and System 2: System 1
 * compresses context, System 2 receives the compressed packet plus
 * the last 5 Context Nodes from Firestore for cross-device synthesis.
 */

import type { ContextPacket, Surface } from "./types.js";

/** Maximum tokens allowed in a Context Packet. */
export const MAX_PACKET_TOKENS = 300;

/**
 * Estimate token count for a string.
 * Approximation: ~4 characters per token (works well for mixed English/code).
 * This is a rough heuristic — the actual Gemini tokenizer may differ,
 * but it's sufficient for the "keep under 300 tokens" guard.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Truncate text to fit within a token budget.
 * Tries to cut at a sentence or word boundary.
 */
export function truncateToTokens(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;

  let truncated = text.slice(0, maxChars);

  // Try to cut at the last sentence boundary
  const lastSentence = truncated.lastIndexOf(". ");
  if (lastSentence > maxChars * 0.5) {
    truncated = truncated.slice(0, lastSentence + 1);
  } else {
    // Fall back to the last word boundary
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > maxChars * 0.5) {
      truncated = truncated.slice(0, lastSpace);
    }
  }

  return truncated + "…";
}

/**
 * Extract simple entities from text (capitalized words and code identifiers).
 * This is a heuristic stand-in for Gemini Nano 4's NER capability.
 * In production, System 1 replaces this with a Nano 4 inference call.
 */
export function extractEntities(text: string, maxEntities = 10): string[] {
  const entities = new Set<string>();

  // Match CamelCase identifiers (e.g., getUserById, FirebaseAuth)
  const camelCase = text.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b/g);
  if (camelCase) camelCase.forEach((e) => entities.add(e));

  // Match CONSTANT_CASE identifiers (e.g., MAX_TOKENS, API_KEY)
  const constCase = text.match(/\b[A-Z][A-Z_]{2,}\b/g);
  if (constCase) constCase.forEach((e) => entities.add(e));

  // Match snake_case identifiers (e.g., friction_score, pending_queue)
  const snakeCase = text.match(/\b[a-z]+_[a-z_]+\b/g);
  if (snakeCase) snakeCase.forEach((e) => entities.add(e));

  return Array.from(entities).slice(0, maxEntities);
}

/**
 * Build a Context Packet from raw text.
 *
 * @param rawText — the active context (editor content, page text, voice memo transcript)
 * @param source — a reference to where the text came from (file name, URL, memo title)
 * @param surface — which surface created this packet
 *
 * @returns A ContextPacket with tokenCount ≤ MAX_PACKET_TOKENS
 */
export function buildContextPacket(
  rawText: string,
  source: string,
  surface: Surface,
): ContextPacket {
  // Extract entities first (before truncation, to catch all of them)
  const entities = extractEntities(rawText);

  // Build a simple summary: first meaningful paragraph, truncated
  const summaryText = rawText.trim().split(/\n\n+/)[0] || rawText.trim();
  const summary = truncateToTokens(summaryText, MAX_PACKET_TOKENS - 80);

  // Estimate the full packet's token count (summary + entities + metadata)
  const packetText = summary + " " + entities.join(" ") + " " + source;
  let tokenCount = estimateTokens(packetText);

  // If over budget, truncate the summary further
  let finalSummary = summary;
  if (tokenCount > MAX_PACKET_TOKENS) {
    const excessTokens = tokenCount - MAX_PACKET_TOKENS;
    const excessChars = excessTokens * 4;
    finalSummary = truncateToTokens(summary, summary.length - excessChars);
    tokenCount = estimateTokens(finalSummary + " " + entities.join(" ") + " " + source);
  }

  return {
    summary: finalSummary,
    entities,
    source,
    surface,
    tokenCount,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Serialize a ContextPacket to JSON for Firestore storage or
 * System 2 cloud inference input.
 */
export function serializePacket(packet: ContextPacket): string {
  return JSON.stringify(packet);
}

/**
 * Deserialize a ContextPacket from JSON.
 */
export function deserializePacket(json: string): ContextPacket {
  return JSON.parse(json) as ContextPacket;
}
