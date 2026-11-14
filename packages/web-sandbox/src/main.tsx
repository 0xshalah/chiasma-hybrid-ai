import { StrictMode, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { LenisProvider } from "./components/LenisProvider.tsx";
import { CustomCursor } from "./components/CustomCursor.tsx";
import { Preloader } from "./components/Preloader.tsx";
import "./styles/global.css";

function Root() {
  const [loaded, setLoaded] = useState(false);
  const onDone = useCallback(() => setLoaded(true), []);

  return (
    <>
      <Preloader onDone={onDone} />
      {/* App renders immediately but is invisible until preloader finishes */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: loaded ? "auto" : "none",
        }}
      >
        <LenisProvider>
          <CustomCursor />
          <App />
        </LenisProvider>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
