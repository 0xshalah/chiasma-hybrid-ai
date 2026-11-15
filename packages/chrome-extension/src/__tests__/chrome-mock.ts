/**
 * Minimal chrome.* API mock for integration tests.
 *
 * Covers only what CHIASMA extension uses:
 * - chrome.storage.local (get, set, onChanged)
 * - chrome.runtime.sendMessage / onMessage
 * - chrome.sidePanel.setPanelBehavior
 * - chrome.runtime.onInstalled
 */

type StorageChangeListener = (
  changes: Record<string, { oldValue?: unknown; newValue?: unknown }>,
  areaName: string,
) => void;

type MessageListener = (
  message: unknown,
  sender: unknown,
  sendResponse: (response?: unknown) => void,
) => void | boolean;

const store: Record<string, unknown> = {};
const storageListeners: StorageChangeListener[] = [];
const messageListeners: MessageListener[] = [];
const installedListeners: Array<() => void> = [];

export const chromeMock = {
  storage: {
    local: {
      get: vi.fn(async (key: string | string[]) => {
        if (typeof key === "string") return { [key]: store[key] };
        return Object.fromEntries((key as string[]).map((k) => [k, store[k]]));
      }),
      set: vi.fn(async (items: Record<string, unknown>) => {
        const changes: Record<string, { oldValue: unknown; newValue: unknown }> = {};
        for (const [k, v] of Object.entries(items)) {
          changes[k] = { oldValue: store[k], newValue: v };
          store[k] = v;
        }
        storageListeners.forEach((l) => l(changes, "local"));
      }),
    },
    onChanged: {
      addListener: vi.fn((l: StorageChangeListener) => storageListeners.push(l)),
      removeListener: vi.fn((l: StorageChangeListener) => {
        const i = storageListeners.indexOf(l);
        if (i >= 0) storageListeners.splice(i, 1);
      }),
    },
  },
  runtime: {
    sendMessage: vi.fn(async (msg: unknown) => {
      messageListeners.forEach((l) => l(msg, {}, () => {}));
    }),
    onMessage: {
      addListener: vi.fn((l: MessageListener) => messageListeners.push(l)),
      removeListener: vi.fn((l: MessageListener) => {
        const i = messageListeners.indexOf(l);
        if (i >= 0) messageListeners.splice(i, 1);
      }),
    },
    onInstalled: {
      addListener: vi.fn((l: () => void) => installedListeners.push(l)),
    },
  },
  sidePanel: {
    setPanelBehavior: vi.fn(async () => {}),
  },
};

export function resetChromeMock() {
  for (const key of Object.keys(store)) delete store[key];
  storageListeners.length = 0;
  messageListeners.length = 0;
  installedListeners.length = 0;
}

// Install mock globally
(globalThis as Record<string, unknown>).chrome = chromeMock;
