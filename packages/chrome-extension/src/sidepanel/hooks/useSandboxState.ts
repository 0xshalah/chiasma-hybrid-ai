import { useState, useEffect, useCallback } from "react";
import {
  STORAGE_KEY,
  DEFAULT_STATE,
  type ExtensionState,
  type ExtensionStage,
} from "../../shared/messages";
import type {
  ScrubResult,
  ContextPacket,
  FrictionScore,
  RoutingDecision,
} from "@chiasma/shared-core";

export function useSandboxState() {
  const [state, setState] = useState<ExtensionState>(DEFAULT_STATE);

  useEffect(() => {
    // Read initial state from storage
    chrome.storage.local.get(STORAGE_KEY).then((result) => {
      const stored = result[STORAGE_KEY] as ExtensionState | undefined;
      if (stored) setState(stored);
    });

    // Listen for live updates from service worker
    const listener = (msg: Record<string, unknown>) => {
      setState((prev) => {
        const next = { ...prev };
        switch (msg.type) {
          case "SCRUB_RESULT":
            next.scrubResult = msg.result as ScrubResult;
            break;
          case "CONTEXT_PACKET":
            next.contextPacket = msg.packet as ContextPacket;
            break;
          case "FRICTION_UPDATE":
            next.friction = msg.friction as FrictionScore;
            break;
          case "ROUTING_DECISION":
            next.routing = msg.routing as RoutingDecision;
            break;
          case "SYNTHESIS_RESULT":
            next.synthesis = msg.synthesis as string;
            next.synthesisLoading = false;
            break;
          case "SYNTHESIS_ERROR":
            next.synthesisError = msg.error as string;
            next.synthesisLoading = false;
            break;
          case "STAGE_UPDATE":
            next.stage = msg.stage as ExtensionStage;
            break;
        }
        return next;
      });
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  // Listen for storage changes too (in case side panel is reopened)
  useEffect(() => {
    const listener = (changes: Record<string, chrome.storage.StorageChange>) => {
      if (changes[STORAGE_KEY]?.newValue) {
        setState(changes[STORAGE_KEY].newValue as ExtensionState);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const escalate = useCallback(() => {
    chrome.runtime.sendMessage({ type: "ESCALATE_REQUEST" }).catch(() => {});
  }, []);

  return { state, escalate };
}
