/**
 * Native scrollbar: 2px wide with a fully rounded thumb. Chromium and Safari
 * ignore `::-webkit-scrollbar` once `scrollbar-width` or `scrollbar-color` is
 * set, so the standard properties apply only where the WebKit pseudo-elements
 * are unsupported (Firefox cannot set an exact width, so it uses `thin`).
 *
 * The scroll element does not own the gap to a rounded edge. Place it inside a
 * container with `overflow-hidden`, the same radius and padding, as Select does.
 */
export const scrollbarClassName = `supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-width:thin]
  supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-color:var(--semantics-colors-interaction-scrollbar-thumb)_transparent]
  [&::-webkit-scrollbar]:w-(--primitives-spacing-out-of-scale-0-5)
  [&::-webkit-scrollbar]:h-(--primitives-spacing-out-of-scale-0-5)
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:[background-color:var(--semantics-colors-interaction-scrollbar-thumb)]`;
