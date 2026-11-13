/**
 * SandboxGrid — the 4-column Live Ecosystem Sandbox.
 *
 * Column 1: Desktop Code Editor (with preset buttons)
 * Column 2: Chrome Side Panel (PII feed + context card)
 * Column 3: Corpus Callosum Bridge (routing + friction gauge)
 * Column 4: Android Companion (capture + offline queue)
 *
 * All 4 columns share state via SandboxProvider context.
 */

import { DesktopEditor } from "./DesktopEditor.tsx";
import { SidePanel } from "./SidePanel.tsx";
import { CorpusCallosumBridge } from "./CorpusCallosumBridge.tsx";
import { AndroidCompanion } from "./AndroidCompanion.tsx";

export function SandboxGrid() {
  return (
    <>
      {/* Global controls bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--sp-md)",
          marginBottom: "var(--sp-xl)",
        }}
      >
        <ForceOfflineToggle />
        <ManualTriggerButton />
      </div>

      {/* 4-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--sp-xl)",
        }}
      >
        <DesktopEditor />
        <SidePanel />
        <CorpusCallosumBridge />
        <AndroidCompanion />
      </div>
    </>
  );
}

import { useSandbox } from "./sandbox-context.tsx";

function ForceOfflineToggle() {
  const { state, dispatch } = useSandbox();
  return (
    <button
      className="btn btn-ghost"
      onClick={() => dispatch({ type: "TOGGLE_OFFLINE" })}
      style={
        state.isOffline
          ? {
              background: "var(--c-system2)",
              color: "var(--c-on-system2)",
              borderColor: "var(--c-system2)",
            }
          : undefined
      }
    >
      {state.isOffline ? "● Force offline: ON" : "Force offline: OFF"}
    </button>
  );
}

function ManualTriggerButton() {
  const { dispatch } = useSandbox();
  return (
    <button
      className="btn btn-system2"
      onClick={() => dispatch({ type: "MANUAL_TRIGGER" })}
    >
      ⚡ Alt + Shift + C
    </button>
  );
}
