export interface SemanticColorRecord {
  name: string;
  token: string;
  cssVar: string;
  generated: string;
  alias: string;
}

export interface PrimitiveColorRecord {
  name: string;
  token: string;
  cssVar: string;
  hex: string;
}

const SCALE = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;

export const SEMANTIC_BACKGROUND: SemanticColorRecord[] = [
  {
    name: "Default",
    token: "semantics.colors.background.default",
    cssVar: "--semantics-colors-background-default",
    generated: "var(--primitives-colors-white)",
    alias: "primitives.colors.white",
  },
  {
    name: "Primary",
    token: "semantics.colors.background.primary",
    cssVar: "--semantics-colors-background-primary",
    generated: "var(--primitives-colors-neutral-900)",
    alias: "primitives.colors.neutral.900",
  },
  {
    name: "Secondary",
    token: "semantics.colors.background.secondary",
    cssVar: "--semantics-colors-background-secondary",
    generated: "var(--primitives-colors-neutral-200)",
    alias: "primitives.colors.neutral.200",
  },
  {
    name: "Accent",
    token: "semantics.colors.background.accent",
    cssVar: "--semantics-colors-background-accent",
    generated: "var(--primitives-colors-neutral-100)",
    alias: "primitives.colors.neutral.100",
  },
  {
    name: "Destructive",
    token: "semantics.colors.background.destructive",
    cssVar: "--semantics-colors-background-destructive",
    generated: "#d600001a",
    alias: "primitives.colors.red.500 @ 10%",
  },
  {
    name: "Success",
    token: "semantics.colors.background.success",
    cssVar: "--semantics-colors-background-success",
    generated: "var(--primitives-colors-emerald-600)",
    alias: "primitives.colors.emerald.600",
  },
  {
    name: "Warning",
    token: "semantics.colors.background.warning",
    cssVar: "--semantics-colors-background-warning",
    generated: "var(--primitives-colors-amber-600)",
    alias: "primitives.colors.amber.600",
  },
  {
    name: "Info",
    token: "semantics.colors.background.info",
    cssVar: "--semantics-colors-background-info",
    generated: "var(--primitives-colors-sky-600)",
    alias: "primitives.colors.sky.600",
  },
];

export const SEMANTIC_FOREGROUND: SemanticColorRecord[] = [
  {
    name: "Default",
    token: "semantics.colors.foreground.default",
    cssVar: "--semantics-colors-foreground-default",
    generated: "var(--primitives-colors-neutral-900)",
    alias: "primitives.colors.neutral.900",
  },
  {
    name: "Primary",
    token: "semantics.colors.foreground.primary",
    cssVar: "--semantics-colors-foreground-primary",
    generated: "var(--primitives-colors-white)",
    alias: "primitives.colors.white",
  },
  {
    name: "Subtle",
    token: "semantics.colors.foreground.subtle",
    cssVar: "--semantics-colors-foreground-subtle",
    generated: "var(--primitives-colors-neutral-500)",
    alias: "primitives.colors.neutral.500",
  },
  {
    name: "Destructive",
    token: "semantics.colors.foreground.destructive",
    cssVar: "--semantics-colors-foreground-destructive",
    generated: "var(--primitives-colors-red-600)",
    alias: "primitives.colors.red.600",
  },
];

export const SEMANTIC_BORDER: SemanticColorRecord[] = [
  {
    name: "Default",
    token: "semantics.colors.border.default",
    cssVar: "--semantics-colors-border-default",
    generated: "var(--primitives-colors-neutral-200)",
    alias: "primitives.colors.neutral.200",
  },
  {
    name: "Strong",
    token: "semantics.colors.border.strong",
    cssVar: "--semantics-colors-border-strong",
    generated: "var(--primitives-colors-neutral-900)",
    alias: "primitives.colors.neutral.900",
  },
  {
    name: "Destructive",
    token: "semantics.colors.border.destructive",
    cssVar: "--semantics-colors-border-destructive",
    generated: "var(--primitives-colors-red-500)",
    alias: "primitives.colors.red.500",
  },
  {
    name: "Ring focus",
    token: "semantics.colors.border.ring-focus",
    cssVar: "--semantics-colors-border-ring-focus",
    generated: "var(--primitives-colors-blue-500)",
    alias: "primitives.colors.blue.500",
  },
];

export const SEMANTIC_INTERACTION: SemanticColorRecord[] = [
  {
    name: "Primary / Hover",
    token: "semantics.colors.interaction.primary.hover",
    cssVar: "--semantics-colors-interaction-primary-hover",
    generated: "#171717e6",
    alias: "primitives.colors.neutral.900 @ 90%",
  },
  {
    name: "Secondary / Hover",
    token: "semantics.colors.interaction.secondary.hover",
    cssVar: "--semantics-colors-interaction-secondary-hover",
    generated: "#f5f5f5ff",
    alias: "primitives.colors.neutral.100 @ 100%",
  },
  {
    name: "Destructive / Hover",
    token: "semantics.colors.interaction.destructive.hover",
    cssVar: "--semantics-colors-interaction-destructive-hover",
    generated: "#d6000033",
    alias: "primitives.colors.red.500 @ 20%",
  },
  {
    name: "Destructive / Subtle hover",
    token: "semantics.colors.interaction.destructive.subtle-hover",
    cssVar: "--semantics-colors-interaction-destructive-subtle-hover",
    generated: "#d600001a",
    alias: "primitives.colors.red.500 @ 10%",
  },
  {
    name: "File upload / Drag over",
    token: "semantics.colors.interaction.file-upload.drag-over",
    cssVar: "--semantics-colors-interaction-file-upload-drag-over",
    generated: "#0071e31a",
    alias: "primitives.colors.blue.500 @ 10%",
  },
];

export const SEMANTIC_OTHER: SemanticColorRecord[] = [
  {
    name: "Interaction / Scrollbar / Thumb",
    token: "semantics.colors.interaction.scrollbar.thumb",
    cssVar: "--semantics-colors-interaction-scrollbar-thumb",
    generated: "var(--primitives-colors-neutral-300)",
    alias: "primitives.colors.neutral.300",
  },
];

export const ALL_SEMANTIC_COLORS: SemanticColorRecord[] = [
  ...SEMANTIC_BACKGROUND,
  ...SEMANTIC_FOREGROUND,
  ...SEMANTIC_BORDER,
  ...SEMANTIC_INTERACTION,
  ...SEMANTIC_OTHER,
];

const NEUTRAL_HEX: Record<(typeof SCALE)[number], string> = {
  "50": "#fafafaff",
  "100": "#f5f5f5ff",
  "200": "#e5e5e5ff",
  "300": "#d4d4d4ff",
  "400": "#a3a3a3ff",
  "500": "#767676ff",
  "600": "#525252ff",
  "700": "#404040ff",
  "800": "#262626ff",
  "900": "#171717ff",
  "950": "#0a0a0aff",
};

const RED_HEX: Record<(typeof SCALE)[number], string> = {
  "50": "#ffe5e7ff",
  "100": "#ffcacdff",
  "200": "#ff939bff",
  "300": "#ff5b69ff",
  "400": "#ff0031ff",
  "500": "#d60000ff",
  "600": "#ca0000ff",
  "700": "#980000ff",
  "800": "#650000ff",
  "900": "#330000ff",
  "950": "#1a0001ff",
};

const AMBER_HEX: Record<(typeof SCALE)[number], string> = {
  "50": "#fffbebff",
  "100": "#fef3c7ff",
  "200": "#fde68aff",
  "300": "#fcd34dff",
  "400": "#fbbf24ff",
  "500": "#f59e0bff",
  "600": "#d97706ff",
  "700": "#b45309ff",
  "800": "#92400eff",
  "900": "#78350fff",
  "950": "#451a03ff",
};

const EMERALD_HEX: Record<(typeof SCALE)[number], string> = {
  "50": "#ecfdf5ff",
  "100": "#d1fae5ff",
  "200": "#a7f3d0ff",
  "300": "#6ee7b7ff",
  "400": "#34d399ff",
  "500": "#10b981ff",
  "600": "#059669ff",
  "700": "#047857ff",
  "800": "#065f46ff",
  "900": "#064e3bff",
  "950": "#022c22ff",
};

const SKY_HEX: Record<(typeof SCALE)[number], string> = {
  "50": "#f0f9ffff",
  "100": "#e0f2feff",
  "200": "#bae6fdff",
  "300": "#7dd3fcff",
  "400": "#38bdf8ff",
  "500": "#0ea5e9ff",
  "600": "#0284c7ff",
  "700": "#0369a1ff",
  "800": "#075985ff",
  "900": "#0c4a6eff",
  "950": "#082f49ff",
};

function hueScale(
  hue: string,
  hexByStep: Record<(typeof SCALE)[number], string>,
): PrimitiveColorRecord[] {
  return SCALE.map((step) => ({
    name: `${capitalize(hue)} / ${step}`,
    token: `primitives.colors.${hue}.${step}`,
    cssVar: `--primitives-colors-${hue}-${step}`,
    hex: hexByStep[step],
  }));
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const PRIMITIVE_NEUTRAL: PrimitiveColorRecord[] = [
  {
    name: "White",
    token: "primitives.colors.white",
    cssVar: "--primitives-colors-white",
    hex: "#ffffffff",
  },
  {
    name: "Black",
    token: "primitives.colors.black",
    cssVar: "--primitives-colors-black",
    hex: "#000000ff",
  },
  ...hueScale("neutral", NEUTRAL_HEX),
];

export const PRIMITIVE_RED = hueScale("red", RED_HEX);
export const PRIMITIVE_AMBER = hueScale("amber", AMBER_HEX);
export const PRIMITIVE_EMERALD = hueScale("emerald", EMERALD_HEX);
export const PRIMITIVE_SKY = hueScale("sky", SKY_HEX);

export const PRIMITIVE_BLUE: PrimitiveColorRecord[] = [
  {
    name: "Blue / 500",
    token: "primitives.colors.blue.500",
    cssVar: "--primitives-colors-blue-500",
    hex: "#0071e3ff",
  },
];

export function referencedPrimitiveTokens(
  semantics: SemanticColorRecord[] = ALL_SEMANTIC_COLORS,
): Set<string> {
  return new Set(semantics.map((color) => color.alias.split(" @")[0]));
}
