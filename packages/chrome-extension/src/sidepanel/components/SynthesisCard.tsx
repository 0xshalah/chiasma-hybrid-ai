/**
 * SynthesisCard — cloud synthesis result + escalate button.
 * Dark-first: escalate button uses dark surface + orange glow on hover.
 * Pattern: Raycast "single white CTA" adapted to dark surface with glow.
 */

export function SynthesisCard({
  synthesis,
  loading,
  error,
  onEscalate,
  routing,
}: {
  synthesis: string | null;
  loading: boolean;
  error: string | null;
  onEscalate: () => void;
  routing: { hemisphere: string } | null;
}) {
  const canEscalate = routing?.hemisphere === "system2";

  return (
    <div className="card">
      <div className="card-label">
        Cloud synthesis
        {canEscalate && (
          <span
            style={{
              fontSize: "9px",
              background: "var(--c-system2-soft)",
              color: "var(--c-system2-ink)",
              padding: "2px 6px",
              borderRadius: "var(--r-pill)",
              border: "1px solid rgba(249, 115, 22, 0.25)",
              fontWeight: 600,
            }}
          >
            threshold exceeded
          </span>
        )}
      </div>

      {loading && (
        <div className="synthesis-loading">
          <span className="spinner" aria-hidden="true" /> Querying cloud model…
        </div>
      )}

      {error && !loading && (
        <div className="synthesis-error" role="alert">{error}</div>
      )}

      {synthesis && !loading && !error && (
        <div className="synthesis-text">{synthesis}</div>
      )}

      {!synthesis && !loading && !error && (
        <div className="card-empty" style={{ marginBottom: "10px" }}>
          {canEscalate
            ? "Friction exceeded threshold. Escalate to cloud for deeper synthesis."
            : "Friction below threshold. System 1 handles it locally ($0, <20ms)."}
        </div>
      )}

      <button
        className="escalate-btn"
        onClick={onEscalate}
        disabled={loading}
        aria-label="Escalate to cloud reasoning"
      >
        {loading ? "Querying…" : "Escalate to Cloud"}
      </button>

      <p
        style={{
          fontSize: "9px",
          color: "var(--c-ink-muted)",
          textAlign: "center",
          marginTop: "6px",
        }}
      >
        Only the sanitized ≤300-token packet is sent.
      </p>
    </div>
  );
}
