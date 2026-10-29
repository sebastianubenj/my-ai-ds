export interface OpacityTokenRecord {
  /** Figma variable name. */
  figmaName: string;
  /** Canonical code path. */
  token: string;
  cssVar: string;
  /** Figma FLOAT percentage (0–100). */
  percent: number;
  /** Generated CSS unitless value (`value / 100`). */
  cssValue: string;
  used: boolean;
}

/**
 * Used/Unused follows the Figma audit of primitive bindings.
 * Codebase consumption is not the source for this classification.
 */
const USED_STEPS = new Set([
  "opacity-15",
  "opacity-25",
  "opacity-35",
  "opacity-45",
  "opacity-55",
]);

/** Ordered by numeric opacity value, ascending. */
const SCALE: { step: string; percent: number }[] = [
  { step: "opacity-0", percent: 0 },
  { step: "opacity-5", percent: 5 },
  { step: "opacity-10", percent: 10 },
  { step: "opacity-15", percent: 15 },
  { step: "opacity-20", percent: 20 },
  { step: "opacity-25", percent: 25 },
  { step: "opacity-30", percent: 30 },
  { step: "opacity-35", percent: 35 },
  { step: "opacity-40", percent: 40 },
  { step: "opacity-45", percent: 45 },
  { step: "opacity-50", percent: 50 },
  { step: "opacity-55", percent: 55 },
  { step: "opacity-60", percent: 60 },
  { step: "opacity-70", percent: 70 },
  { step: "opacity-80", percent: 80 },
  { step: "opacity-90", percent: 90 },
  { step: "opacity-95", percent: 95 },
  { step: "opacity-100", percent: 100 },
];

function unitlessFromPercent(percent: number) {
  return `${percent / 100}`;
}

export const OPACITY_SCALE: OpacityTokenRecord[] = SCALE.map(({ step, percent }) => ({
  figmaName: `opacity/${step}`,
  token: `primitives.opacity.${step}`,
  cssVar: `--primitives-opacity-${step}`,
  percent,
  cssValue: unitlessFromPercent(percent),
  used: USED_STEPS.has(step),
}));
