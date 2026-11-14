/**
 * Column 1 — Desktop Code Editor.
 *
 * Techniques:
 * - useTypewriter: constant-speed char reveal on preset actions (gsap-choreography pattern)
 * - Blinking caret while typing
 * - User can still type freely in textarea; typewriter runs only on preset buttons
 */

import { useState, useEffect, useRef } from "react";
import { useSandbox } from "./sandbox-context.tsx";
import { useTypewriter } from "./hooks.ts";

// Tracks the last-dispatched preset text so we know when to trigger typewriter
const SECRET_TEXT = `// User profile config
const config = {
  email: "admin@chiasma.dev",
  phone: "+1-555-867-5309",
  card: "4111-1111-1111-1111",
  backup: "billing@chiasma.dev",
};`;

const CODING_TEXT = `function calculateFrictionScore(revisions, idleTime, contextSwitches) {
  const revisionWeight = 0.4;
  const idleWeight = 0.35;
  const switchWeight = 0.25;
  return Math.min(1,
    revisions * revisionWeight +
    idleTime * idleWeight +
    contextSwitches * switchWeight
  );
}

// TODO: figure out why the score keeps hitting 0.82
// I've revised this 7 times and I'm stuck…`;

export function DesktopEditor({
  injectSecretRef,
  simulateCodingRef,
}: {
  injectSecretRef?: React.RefObject<HTMLButtonElement | null>;
  simulateCodingRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const { state, dispatch } = useSandbox();

  // typewriterTarget: text to animate; null = no animation (user typing or reset)
  const [typewriterTarget, setTypewriterTarget] = useState<string | null>(null);

  const { displayed, showCaret } = useTypewriter({
    text: typewriterTarget ?? "",
    charsPerSecond: 55,
    delay: 80,
    onDone: () => {
      // After typewriter finishes, dispatch the preset so state updates
      if (typewriterTarget === SECRET_TEXT) {
        dispatch({ type: "INJECT_SECRET" });
      } else if (typewriterTarget === CODING_TEXT) {
        dispatch({ type: "SIMULATE_CODING" });
      }
    },
  });

  // The displayed text in the textarea: typewriter output while animating, state.editorText otherwise
  const isAnimating = typewriterTarget !== null && displayed !== typewriterTarget;
  const textareaValue = isAnimating ? displayed : state.editorText;

  // When typewriter completes, clear target
  useEffect(() => {
    if (typewriterTarget !== null && displayed === typewriterTarget) {
      setTypewriterTarget(null);
    }
  }, [displayed, typewriterTarget]);

  return (
    <div
      style={{
        background: "var(--c-surface)",
        borderRadius: "var(--r-lg)",
        padding: "var(--sp-xl)",
        boxShadow: "var(--shadow-raised)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-md)",
        height: "100%",
        minHeight: "380px",
      }}
    >
      <div className="frame-chrome" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>Desktop Code Editor</span>
        {showCaret && (
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "14px",
              background: "var(--c-system2)",
              borderRadius: "1px",
              animation: "caret-blink 0.7s step-end infinite",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      <textarea
        aria-label="Code editor — type here or use the preset buttons below"
        value={textareaValue}
        onChange={(e) => {
          if (!isAnimating) {
            dispatch({ type: "SET_EDITOR_TEXT", text: e.target.value });
          }
        }}
        readOnly={isAnimating}
        spellCheck={false}
        style={{
          flex: 1,
          background: "var(--c-code-bg)",
          color: "var(--c-code-ink)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-code)",
          lineHeight: 1.5,
          border: "1px solid var(--c-hairline)",
          borderRadius: "var(--r-sm)",
          padding: "var(--sp-md)",
          resize: "none",
          minHeight: "180px",
          outline: "none",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          transition: "opacity 0.2s ease",
          opacity: isAnimating ? 0.9 : 1,
        }}
      />

      <div style={{ display: "flex", gap: "var(--sp-xs)", flexWrap: "wrap" }}>
        <button
          ref={injectSecretRef}
          className="btn-preset"
          disabled={isAnimating}
          onClick={() => setTypewriterTarget(SECRET_TEXT)}
        >
          Inject Secret Key
        </button>
        <button
          ref={simulateCodingRef}
          className="btn-preset"
          disabled={isAnimating}
          onClick={() => setTypewriterTarget(CODING_TEXT)}
        >
          Simulate Coding Block
        </button>
        <button
          className="btn-preset"
          disabled={isAnimating}
          onClick={() => {
            setTypewriterTarget(null);
            dispatch({ type: "RESET_FRICTION" });
          }}
        >
          Reset Friction
        </button>
      </div>
    </div>
  );
}
