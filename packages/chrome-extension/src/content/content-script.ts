/**
 * Content script — watches the active editor element and sends TEXT_CHANGED
 * to the service worker when text changes.
 *
 * Supported editors:
 * - <textarea>
 * - <div contenteditable>
 * - CodeMirror (.cm-content)
 * - Monaco (editor text via .view-lines or .inputarea)
 *
 * Max text: 4000 chars (truncated to avoid performance issues).
 * Debounce: 300ms.
 */

const MAX_TEXT = 4000;
const DEBOUNCE_MS = 300;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function getEditorText(el: Element): string | null {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    return el.value;
  }
  if (el instanceof HTMLElement && el.contentEditable === "true") {
    return el.textContent ?? "";
  }
  return null;
}

function guessSource(): string {
  const title = document.title;
  const host = location.hostname;
  // Try to get filename from GitHub/VS Code for Web URL
  const pathMatch = location.pathname.match(/\/([^/]+\.[a-z]{1,6})(?:$|\?)/i);
  if (pathMatch) return pathMatch[1];
  if (title) return title.slice(0, 60);
  return host;
}

function sendText(text: string): void {
  const truncated = text.length > MAX_TEXT
    ? text.slice(0, MAX_TEXT) + " [TRUNCATED]"
    : text;
  chrome.runtime.sendMessage({
    type: "TEXT_CHANGED",
    text: truncated,
    source: guessSource(),
  }).catch(() => {
    // Service worker may be inactive — harmless
  });
}

function onInput(e: Event): void {
  const el = e.target as Element;
  const text = getEditorText(el);
  if (text === null) return;

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    sendText(text);
  }, DEBOUNCE_MS);
}

// Attach to document-level input events (captures all editors)
document.addEventListener("input", onInput, { passive: true });
document.addEventListener("keyup", onInput, { passive: true });

// Also observe DOM mutations to catch dynamically injected editors
const observer = new MutationObserver(() => {
  const active = document.activeElement;
  if (active && (
    active instanceof HTMLTextAreaElement ||
    active.classList.contains("cm-content") ||
    (active instanceof HTMLElement && active.contentEditable === "true")
  )) {
    const text = getEditorText(active);
    if (text) sendText(text);
  }
});

observer.observe(document.body, { childList: true, subtree: true });
