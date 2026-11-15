import type { ContextPacket } from "@chiasma/shared-core";
import { MAX_PACKET_TOKENS } from "@chiasma/shared-core";

export function ContextCard({ packet }: { packet: ContextPacket | null }) {
  if (!packet) {
    return (
      <div className="card">
        <div className="card-label">Context packet</div>
        <div className="card-empty">No packet yet.</div>
      </div>
    );
  }

  const pct = Math.min(100, (packet.tokenCount / MAX_PACKET_TOKENS) * 100);

  return (
    <div className="card">
      <div className="card-label">
        Context packet
        <span className="token-count">{packet.tokenCount}/{MAX_PACKET_TOKENS} tokens</span>
      </div>

      <div className="token-bar">
        <div className="token-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="packet-summary">{packet.summary}</div>

      {packet.entities.length > 0 && (
        <div className="packet-entities">
          {packet.entities.map((e, i) => (
            <span key={i} className="entity-chip">{e}</span>
          ))}
        </div>
      )}

      <div className="packet-source">{packet.source}</div>
    </div>
  );
}
