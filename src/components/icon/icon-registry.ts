import type { LucideIcon } from "lucide-react";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  File,
  Loader,
  Minus,
  Search,
  Upload,
  createLucideIcon,
} from "lucide-react";

/**
 * Figma `Lucide Icons / Resize Thumb` (node 55:5282) is not published as a
 * named lucide-react icon. The source is a 16×16 filled path; Lucide icons
 * use a 24×24 viewBox, so the path is scaled 1.5× to fill the icon grid.
 */
const ResizeThumb = createLucideIcon("resize-thumb", [
  [
    "path",
    {
      d: "M14.0467 8.44624C14.2419 8.25121 14.5585 8.25106 14.7537 8.44624C14.9487 8.64143 14.9487 8.95804 14.7537 9.15327L9.1531 14.7539C8.95785 14.9487 8.64122 14.9489 8.44606 14.7539C8.25092 14.5587 8.25115 14.2421 8.44606 14.0468L14.0467 8.44624ZM14.0183 11.6181C14.2136 11.423 14.5301 11.4229 14.7254 11.6181C14.9205 11.8133 14.9205 12.1299 14.7254 12.3251L12.3152 14.7353C12.12 14.9305 11.8034 14.9305 11.6082 14.7353C11.4129 14.5401 11.413 14.2235 11.6082 14.0283L14.0183 11.6181Z",
      fill: "currentColor",
      stroke: "none",
      transform: "scale(1.5)",
      key: "resize-thumb",
    },
  ],
]);

/**
 * Phase 1 icon registry: a hand-maintained, curated subset of the Figma
 * icon library (see node 55:2221) mapped to their lucide-react implementations.
 *
 * Grow this incrementally: add a named import above and an entry below
 * whenever a new icon is actually needed. Do not bulk-add unused icons.
 */
export const iconRegistry = {
  activity: Activity,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  eye: Eye,
  "eye-off": EyeOff,
  file: File,
  loader: Loader,
  minus: Minus,
  "resize-thumb": ResizeThumb,
  search: Search,
  upload: Upload,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;