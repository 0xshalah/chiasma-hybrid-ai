/**
 * Column 4 — Android Companion Frame (360px).
 * Simulates the mobile capture experience: voice memos and whiteboard
 * scans, with an offline pending queue and Firestore sync.
 */

import { useSandbox } from "./sandbox-context.tsx";

export function AndroidCompanion({
  captureVoiceRef,
}: {
  captureVoiceRef?: React.RefObject<HTMLButtonElement | null>;
}) {
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
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <DotIcon color="var(--c-system2)" /> OFFLINE
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
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <DotIcon color="var(--c-system1)" /> ONLINE
          </span>
        )}
      </div>

      {/* Capture buttons */}
      <div style={{ display: "flex", gap: "var(--sp-sm)" }}>
        <button
          ref={captureVoiceRef}
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={() => dispatch({ type: "CAPTURE_VOICE" })}
        >
          <MicIcon /> Capture Voice
        </button>
        <button
          className="btn btn-ghost"
          style={{ flex: 1 }}
          onClick={() => dispatch({ type: "SCAN_WHITEBOARD" })}
        >
          <CameraIcon /> Scan Board
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
                fontSize: "var(--fs-ui-sm)",
                fontWeight: 600,
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
                <QueueIcon /> {node.packet.source} · {new Date(node.createdAt).toLocaleTimeString()}
              </div>
            ))}
          </div>
          <button
            className="btn btn-system2"
            style={{ width: "100%", marginTop: "var(--sp-sm)", height: "36px", fontSize: "var(--fs-ui-sm)" }}
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
            fontSize: "var(--fs-ui-sm)",
            fontWeight: 600,
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
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  <SyncCheckIcon /> synced
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

/* ── Inline SVG icons — consistent 1.5px stroke ── */

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "inline-block", verticalAlign: "-2px" }} aria-hidden="true">
      <rect x="5" y="1" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 6V7A4.5 4.5 0 0 0 11.5 7V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 11.5V13M5 13H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "inline-block", verticalAlign: "-2px" }} aria-hidden="true">
      <rect x="1.5" y="4" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 4L5.5 2H8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DotIcon({ color }: { color: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <circle cx="4" cy="4" r="3" fill={color} />
    </svg>
  );
}

function QueueIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: "inline-block", verticalAlign: "-1px", marginRight: "2px" }} aria-hidden="true">
      <rect x="1.5" y="2.5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 5H10.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SyncCheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
