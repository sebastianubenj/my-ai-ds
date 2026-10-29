export interface RadiusTokenRecord {
  /** Figma variable name. */
  figmaName: string;
  /** Canonical code path. */
  token: string;
  cssVar: string;
  px: number;
  rem: string;
  used: boolean;
}

/**
 * Used/Unused follows the Figma audit of primitive bindings.
 * Codebase consumption is not the source for this classification.
 */
const USED_STEPS = new Set([
  "rounded-none",
  "rounded-sm",
  "rounded-lg",
  "rounded-xl",
  "rounded-2xl",
  "rounded-full",
  "rounded-10",
  "rounded-14",
  "rounded-18",
  "rounded-20",
]);

/** Ordered by numeric radius value, ascending. */
const SCALE: { step: string; px: number }[] = [
  { step: "rounded-none", px: 0 },
  { step: "rounded-xs", px: 2 },
  { step: "rounded-sm", px: 4 },
  { step: "rounded-5", px: 5 },
  { step: "rounded-md", px: 6 },
  { step: "rounded-lg", px: 8 },
  { step: "rounded-10", px: 10 },
  { step: "rounded-xl", px: 12 },
  { step: "rounded-14", px: 14 },
  { step: "rounded-2xl", px: 16 },
  { step: "rounded-18", px: 18 },
  { step: "rounded-20", px: 20 },
  { step: "rounded-3xl", px: 24 },
  { step: "rounded-full", px: 9999 },
];

function remFromPx(px: number) {
  return px === 0 ? "0" : `${px / 16}rem`;
}

export const RADIUS_SCALE: RadiusTokenRecord[] = SCALE.map(({ step, px }) => ({
  figmaName: `radius/${step}`,
  token: `primitives.radius.${step}`,
  cssVar: `--primitives-radius-${step}`,
  px,
  rem: remFromPx(px),
  used: USED_STEPS.has(step),
}));
