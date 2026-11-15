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
      <div className="card-label">Cloud synthesis</div>

      {loading && (
        <div className="synthesis-loading">
          <span className="spinner" /> Querying cloud model…
        </div>
      )}

      {error && !loading && (
        <div className="synthesis-error">{error}</div>
      )}

      {synthesis && !loading && !error && (
        <div className="synthesis-text">{synthesis}</div>
      )}

      {!synthesis && !loading && !error && (
        <div className="card-empty">
          {canEscalate
            ? "Friction exceeded threshold. Escalate to cloud for synthesis."
            : "Friction is below threshold. System 1 handles it locally ($0, <20ms)."}
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
    </div>
  );
}
