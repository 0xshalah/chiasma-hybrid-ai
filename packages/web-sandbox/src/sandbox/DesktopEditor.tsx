/**
 * Column 1 — Desktop Code Editor.
 * Shows the active code/text and preset buttons that simulate
 * real coding scenarios (injecting secrets, getting stuck).
 */

import { useSandbox } from "./sandbox-context.tsx";

export function DesktopEditor() {
  const { state, dispatch } = useSandbox();

  return (
    <div
      style={{
        background: "var(--c-surface)",
        border: "1px solid var(--c-hairline)",
        borderRadius: "var(--r-lg)",
        padding: "var(--sp-xl)",
        boxShadow: "var(--shadow-card)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-md)",
        minHeight: "420px",
      }}
    >
      {/* Frame chrome */}
      <div className="frame-chrome">
        Desktop Code Editor
      </div>

      {/* Editor */}
      <textarea
        value={state.editorText}
        onChange={(e) => dispatch({ type: "SET_EDITOR_TEXT", text: e.target.value })}
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
          resize: "vertical",
          minHeight: "180px",
          outline: "none",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      />

      {/* Preset buttons */}
      <div style={{ display: "flex", gap: "var(--sp-xs)", flexWrap: "wrap" }}>
        <button
          className="btn-preset"
          onClick={() => dispatch({ type: "INJECT_SECRET" })}
        >
          [Inject Secret Key]
        </button>
        <button
          className="btn-preset"
          onClick={() => dispatch({ type: "SIMULATE_CODING" })}
        >
          [Simulate Coding Block]
        </button>
        <button
          className="btn-preset"
          onClick={() => dispatch({ type: "RESET_FRICTION" })}
        >
          [Reset Friction]
        </button>
      </div>
    </div>
  );
}
