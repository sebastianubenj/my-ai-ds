export interface SpacingTokenRecord {
  /** Figma variable name, including comma decimals. */
  figmaName: string;
  /** Canonical code path. */
  token: string;
  cssVar: string;
  px: number;
  rem: string;
  used: boolean;
}

/** Steps currently consumed by UI components. Stories/foundations-only use is not counted. */
const USED_STEPS = new Set([
  "0",
  "0,25",
  "0,5",
  "0,75",
  "1",
  "1,5",
  "1,75",
  "2",
  "2,25",
  "2,5",
  "3",
  "4,5",
  "5",
  "8",
  "10",
  "11",
  "12",
  "22",
  "35",
]);

/** Steps outside the default scale. Figma groups them as `spacing/out-of-scale/*`. */
const OUT_OF_SCALE_STEPS = new Set([
  "0,25",
  "0,5",
  "0,75",
  "1,25",
  "1,5",
  "1,75",
  "2,25",
  "2,5",
  "3,5",
  "4,5",
  "5",
  "7",
  "9",
  "11",
  "14",
  "22",
  "28",
  "28,5",
  "30",
  "35",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
]);

const SCALE: { step: string; px: number }[] = [
  { step: "0", px: 0 },
  { step: "0,25", px: 1 },
  { step: "0,5", px: 2 },
  { step: "0,75", px: 3 },
  { step: "1", px: 4 },
  { step: "1,25", px: 5 },
  { step: "1,5", px: 6 },
  { step: "1,75", px: 7 },
  { step: "2", px: 8 },
  { step: "2,25", px: 9 },
  { step: "2,5", px: 10 },
  { step: "3", px: 12 },
  { step: "3,5", px: 14 },
  { step: "4", px: 16 },
  { step: "4,5", px: 18 },
  { step: "5", px: 20 },
  { step: "6", px: 24 },
  { step: "7", px: 28 },
  { step: "8", px: 32 },
  { step: "9", px: 36 },
  { step: "10", px: 40 },
  { step: "11", px: 44 },
  { step: "12", px: 48 },
  { step: "14", px: 56 },
  { step: "16", px: 64 },
  { step: "20", px: 80 },
  { step: "22", px: 88 },
  { step: "24", px: 96 },
  { step: "28", px: 112 },
  { step: "28,5", px: 114 },
  { step: "30", px: 120 },
  { step: "32", px: 128 },
  { step: "35", px: 140 },
  { step: "36", px: 144 },
  { step: "40", px: 160 },
  { step: "44", px: 176 },
  { step: "48", px: 192 },
  { step: "52", px: 208 },
  { step: "56", px: 224 },
  { step: "60", px: 240 },
  { step: "64", px: 256 },
  { step: "72", px: 288 },
  { step: "80", px: 320 },
  { step: "96", px: 384 },
];

function remFromPx(px: number) {
  return px === 0 ? "0" : `${px / 16}rem`;
}

export const SPACING_SCALE: SpacingTokenRecord[] = SCALE.map(({ step, px }) => {
  const group = OUT_OF_SCALE_STEPS.has(step) ? "out-of-scale/" : "";
  return {
    figmaName: `spacing/${group}${step}`,
    token: `primitives.spacing.${group.replace("/", ".")}${step}`,
    cssVar: `--primitives-spacing-${group.replace("/", "-")}${step.replaceAll(",", "-")}`,
    px,
    rem: remFromPx(px),
    used: USED_STEPS.has(step),
  };
});
