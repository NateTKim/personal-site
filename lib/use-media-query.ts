"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query. `serverValue` is used for the server render
 * and hydration, so the first client render always matches the HTML.
 */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

const noop = () => () => {};

/**
 * False in the server HTML and during hydration, true once the client has taken over, so
 * the server HTML never carries client-only state and hydration always matches it.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** "⌘K" on Apple devices, "Ctrl K" elsewhere ("⌘K" during SSR). */
export function useShortcutLabel(): string {
  return useSyncExternalStore(
    noop,
    () => (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘K" : "Ctrl K"),
    () => "⌘K",
  );
}
