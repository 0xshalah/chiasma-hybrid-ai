import { useState, useEffect, useCallback, useRef } from "react";
import {
  STORAGE_KEY,
  DEFAULT_STATE,
  type ExtensionState,
} from "../../shared/messages";

async function fetchState(): Promise<ExtensionState> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as ExtensionState) ?? DEFAULT_STATE;
}

export function useSandboxState() {
  const [state, setState] = useState<ExtensionState>(DEFAULT_STATE);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Load immediately on mount
    fetchState().then(setState);

    // Poll every 500ms — most reliable way to sync side panel with SW state
    intervalRef.current = setInterval(() => {
      fetchState().then(setState);
    }, 500);

    // Also react to storage changes instantly (Chrome fires this synchronously)
    const storageListener = (
      changes: Record<string, chrome.storage.StorageChange>,
    ) => {
      if (changes[STORAGE_KEY]?.newValue) {
        setState(changes[STORAGE_KEY].newValue as ExtensionState);
      }
    };
    chrome.storage.onChanged.addListener(storageListener);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      chrome.storage.onChanged.removeListener(storageListener);
    };
  }, []);

  const escalate = useCallback(() => {
    chrome.runtime.sendMessage({ type: "ESCALATE_REQUEST" }).catch(() => {});
  }, []);

  return { state, escalate };
}
