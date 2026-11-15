/**
 * ErrorBoundary — impeccable H9 (Error Recovery).
 * Wraps the whole app; catches render-time JS errors and shows a recovery UI
 * instead of a blank white screen.
 */

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, send to your error-tracking service here
    console.error("[CHIASMA] Render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--sp-3xl)",
            background: "var(--c-canvas)",
            fontFamily: "var(--font-sans)",
            textAlign: "center",
          }}
        >
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "32px", marginBottom: "var(--sp-lg)" }}>
            CHIASMA
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--fs-display-md)",
              fontWeight: 400,
              color: "var(--c-ink)",
              marginBottom: "var(--sp-md)",
            }}
          >
            Something went wrong.
          </h2>
          <p
            style={{
              fontSize: "var(--fs-body)",
              color: "var(--c-ink-secondary)",
              maxWidth: "480px",
              lineHeight: "var(--lh-body)",
              marginBottom: "var(--sp-2xl)",
            }}
          >
            The sandbox encountered an unexpected error. Your data was not sent anywhere — CHIASMA keeps everything on your device.
          </p>
          <div
            style={{
              background: "var(--c-surface)",
              borderRadius: "var(--r-sm)",
              padding: "var(--sp-md)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-code)",
              color: "var(--c-system2)",
              marginBottom: "var(--sp-2xl)",
              maxWidth: "560px",
              width: "100%",
              textAlign: "left",
              border: "1px solid var(--c-system2)",
              overflowWrap: "break-word",
            }}
          >
            {this.state.error.message}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
          >
            Reload sandbox
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
