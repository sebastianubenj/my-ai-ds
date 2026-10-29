import * as React from "react";

/** Matches Tailwind `md` and `--primitives-max-width-max-w-screen-md` (48rem). */
export const DESKTOP_QUERY = "(min-width: 48rem)";

export function useIsDesktop() {
  return React.useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(DESKTOP_QUERY);
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}
