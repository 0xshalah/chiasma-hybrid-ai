/**
 * Column 4 — Android Companion Frame (360px).
 * Simulates the mobile capture experience: voice memos and whiteboard
 * scans, with an offline pending queue and Firestore sync.
 */

import { useSandbox } from "./sandbox-context.tsx";

export function AndroidCompanion() {
  const { state, dispatch } = useSandbox();
  const pendingCount = state.pendingQueue.length;
  const syncedCount = state.syncedNodes.length;

  return (
    <div
      style={{
        background: "var(--c-canvas)",
        border: "2px solid var(--c-ink)",
        borderRadius: "var(--r-lg)",
        padding: "var(--panel-pad)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--panel-gap)",
        minHeight: "420px",
      }}
    >
      {/* Frame chrome */}
      <div className="frame-chrome">
        Android Companion · 360px
      </div>

      {/* Status row */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-sm)" }}>
        <span className="pill pill-system1">System 1 — Nano</span>
        {state.isOffline ? (
          <span
            style={{
              fontSize: "var(--fs-micro)",
              fontFamily: "var(--font-mono)",
              background: "var(--c-system2-soft)",
              color: "var(--c-system2)",
              borderRadius: "var(--r-pill)",
              padding: "2px 8px",
              border: "1px solid var(--c-system2)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ● OFFLINE
          </span>
        ) : (
          <span
            style={{
              fontSize: "var(--fs-micro)",
              fontFamily: "var(--font-mono)",
              background: "var(--c-system1-soft)",
              color: "var(--c-system1)",
              borderRadius: "var(--r-pill)",
              padding: "2px 8px",
              border: "1px solid var(--c-system1)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ● ONLINE
          </span>
        )}
      </div>

      {/* Capture buttons */}
      <div style={{ display: "flex", gap: "var(--sp-sm)" }}>
        <button
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={() => dispatch({ type: "CAPTURE_VOICE" })}
        >
          🎙 Capture Voice
        </button>
        <button
          className="btn btn-ghost"
          style={{ flex: 1 }}
          onClick={() => dispatch({ type: "SCAN_WHITEBOARD" })}
        >
          📷 Scan Board
        </button>
      </div>

      {/* Pending Queue */}
      {pendingCount > 0 && (
        <div
          style={{
            background: "var(--c-system2-soft)",
            border: "1px solid var(--c-system2)",
            borderRadius: "var(--r-md)",
            padding: "var(--sp-md)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--sp-sm)",
            }}
          >
            <span
              style={{
                fontSize: "var(--fs-eyebrow)",
                fontWeight: 600,
                letterSpacing: "var(--ls-eyebrow)",
                textTransform: "uppercase",
                color: "var(--c-system2)",
              }}
            >
              pendingQueue
            </span>
            <span
              style={{
                fontSize: "var(--fs-micro)",
                fontFamily: "var(--font-mono)",
                color: "var(--c-system2)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {pendingCount} pending
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-xxs)" }}>
            {state.pendingQueue.map((node) => (
              <div
                key={node.id}
                style={{
                  fontSize: "var(--fs-micro)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--c-system2-ink)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                ⊟ {node.packet.source} · {new Date(node.createdAt).toLocaleTimeString()}
              </div>
            ))}
          </div>
          <button
            className="btn btn-system2"
            style={{ width: "100%", marginTop: "var(--sp-sm)", height: "28px", fontSize: "var(--fs-ui-sm)" }}
            onClick={() => dispatch({ type: "SYNC_QUEUE" })}
          >
            Sync Now ({pendingCount})
          </button>
        </div>
      )}

      {/* Synced Nodes */}
      <div style={{ flex: 1, minHeight: "80px" }}>
        <div
          style={{
            fontSize: "var(--fs-eyebrow)",
            fontWeight: 600,
            letterSpacing: "var(--ls-eyebrow)",
            textTransform: "uppercase",
            color: "var(--c-ink-muted)",
            marginBottom: "var(--sp-xs)",
          }}
        >
          Synced Context Nodes {syncedCount > 0 && `(${syncedCount})`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-xxs)", maxHeight: "160px", overflow: "auto" }}>
          {state.syncedNodes.length === 0 ? (
            <div
              style={{
                fontSize: "var(--fs-code)",
                fontFamily: "var(--font-mono)",
                color: "var(--c-ink-muted)",
                padding: "var(--sp-sm)",
              }}
            >
              No nodes synced yet. Capture a voice memo or scan a whiteboard to create one.
            </div>
          ) : (
            state.syncedNodes.map((node) => (
              <div
                key={node.id}
                style={{
                  background: "var(--c-surface-raised)",
                  border: "1px solid var(--c-hairline)",
                  borderRadius: "var(--r-sm)",
                  padding: "var(--sp-sm) var(--sp-md)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--sp-sm)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--fs-micro)",
                    fontFamily: "var(--font-mono)",
                    background: "var(--c-system1-soft)",
                    color: "var(--c-system1)",
                    borderRadius: "var(--r-pill)",
                    padding: "1px 6px",
                    border: "1px solid var(--c-system1)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ✓ synced
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "var(--fs-ui-sm)", color: "var(--c-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {node.packet.summary.slice(0, 60)}…
                  </div>
                  <div style={{ fontSize: "var(--fs-micro)", fontFamily: "var(--font-mono)", color: "var(--c-ink-muted)", fontVariantNumeric: "tabular-nums" }}>
                    {node.packet.source} · {node.packet.tokenCount} tok · {new Date(node.syncedAt || node.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
