import type { LucideIcon } from "lucide-react";
import { Activity, ArrowRight, Search } from "lucide-react";

/**
 * Phase 1 icon registry: a hand-maintained, curated subset of the Figma
 * icon library (see node 55:2221) mapped to their lucide-react implementations.
 *
 * Grow this incrementally: add a named import above and an entry below
 * whenever a new icon is actually needed. Do not bulk-add unused icons.
 */
export const iconRegistry = {
  activity: Activity,
  "arrow-right": ArrowRight,
  search: Search,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;
