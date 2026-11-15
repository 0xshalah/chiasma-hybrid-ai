import { useSandboxState } from "./hooks/useSandboxState";
import { StagePill } from "./components/StagePill";
import { PIIFeed } from "./components/PIIFeed";
import { ContextCard } from "./components/ContextCard";
import { FrictionBar } from "./components/FrictionBar";
import { SynthesisCard } from "./components/SynthesisCard";

export function App() {
  const { state, escalate } = useSandboxState();

  return (
    <div className="chiasma-panel">
      <header className="panel-header">
        <div className="panel-logo">CHIASMA</div>
        <StagePill stage={state.stage} />
      </header>

      <main className="panel-body">
        <PIIFeed scrubResult={state.scrubResult} />
        <ContextCard packet={state.contextPacket} />
        <FrictionBar friction={state.friction} routing={state.routing} />
        <SynthesisCard
          synthesis={state.synthesis}
          loading={state.synthesisLoading}
          error={state.synthesisError}
          onEscalate={escalate}
          routing={state.routing}
        />
      </main>

      <footer className="panel-footer">
        Your secrets stay on your device. Always.
      </footer>
    </div>
  );
}
