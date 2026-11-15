import type { ScrubResult } from "@chiasma/shared-core";

const TYPE_LABELS: Record<string, string> = {
  "stripe-key": "Stripe key",
  "aws-key": "AWS key",
  "google-api-key": "Google API key",
  "jwt-token": "JWT token",
  "bearer-token": "Bearer token",
  "private-key": "Private key",
  "email": "Email",
  "credit-card": "Credit card",
  "phone": "Phone",
};

export function PIIFeed({ scrubResult }: { scrubResult: ScrubResult | null }) {
  if (!scrubResult) {
    return (
      <div className="card">
        <div className="card-label">PII feed</div>
        <div className="card-empty">Start typing in any editor to see scrubbed output.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-label">
        PII feed
        {scrubResult.hasPII && (
          <span className="pii-badge">{scrubResult.matches.length} redacted</span>
        )}
      </div>

      {scrubResult.matches.length > 0 && (
        <div className="pii-types">
          {scrubResult.matches.map((m, i) => (
            <span key={i} className="pii-type-chip">
              {TYPE_LABELS[m.type] ?? m.type}
            </span>
          ))}
        </div>
      )}

      <div className="pii-text">
        {scrubResult.redacted.split(/(\[REDACTED_PII\])/).map((part, i) =>
          part === "[REDACTED_PII]" ? (
            <span key={i} className="pii-redacted">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </div>
    </div>
  );
}
