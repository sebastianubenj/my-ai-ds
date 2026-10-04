export interface BorderTokenRecord {
  /** Figma variable name, including comma decimals. */
  figmaName: string;
  /** Canonical code path. */
  token: string;
  cssVar: string;
  px: number;
  rem: string;
  used: boolean;
  /** Figma-binding status, including usage role when the audit recorded one. */
  status: string;
}

/**
 * Used/Unused follows the Figma audit of primitive bindings.
 * Codebase consumption is not the source for this classification.
 */
const BORDER_WIDTH_SCALE: Omit<BorderTokenRecord, "figmaName" | "token" | "cssVar">[] = [
  { px: 0.5, rem: "0.03125rem", used: false, status: "Unused" },
  { px: 1, rem: "0.0625rem", used: true, status: "Used" },
  { px: 1.33, rem: "0.083125rem", used: true, status: "Used — icon strokes" },
  { px: 1.5, rem: "0.09375rem", used: true, status: "Used — icon strokes" },
  { px: 1.66, rem: "0.10375rem", used: true, status: "Used — icon strokes" },
  { px: 2, rem: "0.125rem", used: true, status: "Used — stronger UI stroke" },
];

const BORDER_WIDTH_STEPS = [
  "border-0,5",
  "border",
  "border-1,33",
  "border-1,5",
  "border-1,66",
  "border-2",
] as const;

const RING_FOCUS_WIDTH_SCALE: Omit<BorderTokenRecord, "figmaName" | "token" | "cssVar">[] = [
  { px: 0, rem: "0", used: false, status: "Unused" },
  { px: 1, rem: "0.0625rem", used: false, status: "Unused" },
  { px: 2, rem: "0.125rem", used: true, status: "Used — Focus Visible" },
  { px: 3, rem: "0.1875rem", used: false, status: "Unused" },
];

const RING_FOCUS_WIDTH_STEPS = ["ring-0", "ring-1", "ring-2", "ring-3"] as const;

function cssVarFromStep(group: string, step: string) {
  return `--primitives-${group}-${step.replaceAll(",", "-")}`;
}

export const BORDER_WIDTH_TOKENS: BorderTokenRecord[] = BORDER_WIDTH_STEPS.map((step, index) => ({
  figmaName: `stroke-width/${step}`,
  token: `primitives.stroke-width.${step}`,
  cssVar: cssVarFromStep("stroke-width", step),
  ...BORDER_WIDTH_SCALE[index],
}));

export const RING_FOCUS_WIDTH_TOKENS: BorderTokenRecord[] = RING_FOCUS_WIDTH_STEPS.map(
  (step, index) => ({
    figmaName: `ring-focus-width/${step}`,
    token: `primitives.ring-focus-width.${step}`,
    cssVar: cssVarFromStep("ring-focus-width", step),
    ...RING_FOCUS_WIDTH_SCALE[index],
  }),
);
