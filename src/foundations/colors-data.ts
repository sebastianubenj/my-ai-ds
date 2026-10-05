export interface SemanticColorRecord {
  name: string;
  token: string;
  cssVar: string;
  generated: string;
  alias: string;
  darkGenerated: string;
  darkAlias: string;
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

function semantic(
  record: Omit<SemanticColorRecord, "darkGenerated" | "darkAlias"> &
    Partial<Pick<SemanticColorRecord, "darkGenerated" | "darkAlias">>,
): SemanticColorRecord {
  return {
    ...record,
    darkGenerated: record.darkGenerated ?? record.generated,
    darkAlias: record.darkAlias ?? record.alias,
  };
}

export const SEMANTIC_BACKGROUND: SemanticColorRecord[] = [
  semantic({
    name: "Default",
    token: "semantics.colors.background.default",
    cssVar: "--semantics-colors-background-default",
    generated: "var(--primitives-colors-white)",
    alias: "primitives.colors.white",
    darkGenerated: "var(--primitives-colors-neutral-950)",
    darkAlias: "primitives.colors.neutral.950",
  }),
  semantic({
    name: "Page",
    token: "semantics.colors.background.page",
    cssVar: "--semantics-colors-background-page",
    generated: "var(--primitives-colors-white)",
    alias: "primitives.colors.white",
    darkGenerated: "var(--primitives-colors-black)",
    darkAlias: "primitives.colors.black",
  }),
  semantic({
    name: "Primary",
    token: "semantics.colors.background.primary",
    cssVar: "--semantics-colors-background-primary",
    generated: "var(--primitives-colors-neutral-900)",
    alias: "primitives.colors.neutral.900",
    darkGenerated: "var(--primitives-colors-white)",
    darkAlias: "primitives.colors.white",
  }),
  semantic({
    name: "Primary blur",
    token: "semantics.colors.background.primary-blur",
    cssVar: "--semantics-colors-background-primary-blur",
    generated: "#171717cc",
    alias: "primitives.colors.neutral.900 @ 80%",
    darkGenerated: "#ffffffcc",
    darkAlias: "primitives.colors.white @ 80%",
  }),
  semantic({
    name: "Secondary",
    token: "semantics.colors.background.secondary",
    cssVar: "--semantics-colors-background-secondary",
    generated: "var(--primitives-colors-neutral-200)",
    alias: "primitives.colors.neutral.200",
    darkGenerated: "var(--primitives-colors-neutral-800)",
    darkAlias: "primitives.colors.neutral.800",
  }),
  semantic({
    name: "Accent",
    token: "semantics.colors.background.accent",
    cssVar: "--semantics-colors-background-accent",
    generated: "var(--primitives-colors-neutral-100)",
    alias: "primitives.colors.neutral.100",
    darkGenerated: "var(--primitives-colors-neutral-900)",
    darkAlias: "primitives.colors.neutral.900",
  }),
  semantic({
    name: "Destructive",
    token: "semantics.colors.background.destructive",
    cssVar: "--semantics-colors-background-destructive",
    generated: "#d600001a",
    alias: "primitives.colors.red.500 @ 10%",
  }),
  semantic({
    name: "Success",
    token: "semantics.colors.background.success",
    cssVar: "--semantics-colors-background-success",
    generated: "var(--primitives-colors-emerald-500)",
    alias: "primitives.colors.emerald.500",
  }),
  semantic({
    name: "Warning",
    token: "semantics.colors.background.warning",
    cssVar: "--semantics-colors-background-warning",
    generated: "var(--primitives-colors-amber-500)",
    alias: "primitives.colors.amber.500",
  }),
  semantic({
    name: "Info",
    token: "semantics.colors.background.info",
    cssVar: "--semantics-colors-background-info",
    generated: "var(--primitives-colors-blue-500)",
    alias: "primitives.colors.blue.500",
  }),
];

export const SEMANTIC_FOREGROUND: SemanticColorRecord[] = [
  semantic({
    name: "Default",
    token: "semantics.colors.foreground.default",
    cssVar: "--semantics-colors-foreground-default",
    generated: "var(--primitives-colors-neutral-900)",
    alias: "primitives.colors.neutral.900",
    darkGenerated: "var(--primitives-colors-white)",
    darkAlias: "primitives.colors.white",
  }),
  semantic({
    name: "Primary",
    token: "semantics.colors.foreground.primary",
    cssVar: "--semantics-colors-foreground-primary",
    generated: "var(--primitives-colors-white)",
    alias: "primitives.colors.white",
    darkGenerated: "var(--primitives-colors-black)",
    darkAlias: "primitives.colors.black",
  }),
  semantic({
    name: "Primary subtle",
    token: "semantics.colors.foreground.primary-subtle",
    cssVar: "--semantics-colors-foreground-primary-subtle",
    generated: "var(--primitives-colors-neutral-400)",
    alias: "primitives.colors.neutral.400",
    darkGenerated: "var(--primitives-colors-neutral-500)",
    darkAlias: "primitives.colors.neutral.500",
  }),
  semantic({
    name: "Primary highlight",
    token: "semantics.colors.foreground.primary-highlight",
    cssVar: "--semantics-colors-foreground-primary-highlight",
    generated: "var(--primitives-colors-cyan-300)",
    alias: "primitives.colors.cyan.300",
    darkGenerated: "var(--primitives-colors-cyan-700)",
    darkAlias: "primitives.colors.cyan.700",
  }),
  semantic({
    name: "Subtle",
    token: "semantics.colors.foreground.subtle",
    cssVar: "--semantics-colors-foreground-subtle",
    generated: "var(--primitives-colors-neutral-500)",
    alias: "primitives.colors.neutral.500",
    darkGenerated: "var(--primitives-colors-gray-500)",
    darkAlias: "primitives.colors.gray.500",
  }),
  semantic({
    name: "Highlight",
    token: "semantics.colors.foreground.highlight",
    cssVar: "--semantics-colors-foreground-highlight",
    generated: "var(--primitives-colors-cyan-600)",
    alias: "primitives.colors.cyan.600",
    darkGenerated: "var(--primitives-colors-cyan-500)",
    darkAlias: "primitives.colors.cyan.500",
  }),
  semantic({
    name: "Destructive",
    token: "semantics.colors.foreground.destructive",
    cssVar: "--semantics-colors-foreground-destructive",
    generated: "var(--primitives-colors-red-600)",
    alias: "primitives.colors.red.600",
  }),
];

export const SEMANTIC_BORDER: SemanticColorRecord[] = [
  semantic({
    name: "Default",
    token: "semantics.colors.border.default",
    cssVar: "--semantics-colors-border-default",
    generated: "var(--primitives-colors-neutral-200)",
    alias: "primitives.colors.neutral.200",
    darkGenerated: "var(--primitives-colors-neutral-700)",
    darkAlias: "primitives.colors.neutral.700",
  }),
  semantic({
    name: "Strong",
    token: "semantics.colors.border.strong",
    cssVar: "--semantics-colors-border-strong",
    generated: "var(--primitives-colors-neutral-900)",
    alias: "primitives.colors.neutral.900",
    darkGenerated: "var(--primitives-colors-neutral-400)",
    darkAlias: "primitives.colors.neutral.400",
  }),
  semantic({
    name: "Destructive",
    token: "semantics.colors.border.destructive",
    cssVar: "--semantics-colors-border-destructive",
    generated: "var(--primitives-colors-red-500)",
    alias: "primitives.colors.red.500",
  }),
  semantic({
    name: "Ring focus",
    token: "semantics.colors.border.ring-focus",
    cssVar: "--semantics-colors-border-ring-focus",
    generated: "var(--primitives-colors-blue-500)",
    alias: "primitives.colors.blue.500",
  }),
];

export const SEMANTIC_INTERACTION: SemanticColorRecord[] = [
  semantic({
    name: "Primary / Hover",
    token: "semantics.colors.interaction.primary.hover",
    cssVar: "--semantics-colors-interaction-primary-hover",
    generated: "#171717e6",
    alias: "primitives.colors.neutral.900 @ 90%",
    darkGenerated: "#f5f5f5e6",
    darkAlias: "primitives.colors.neutral.100 @ 90%",
  }),
  semantic({
    name: "Primary / On primary / Hover",
    token: "semantics.colors.interaction.primary.on-primary.hover",
    cssVar: "--semantics-colors-interaction-primary-on-primary-hover",
    generated: "#f5f5f5e6",
    alias: "primitives.colors.neutral.100 @ 90%",
    darkGenerated: "#171717e6",
    darkAlias: "primitives.colors.neutral.900 @ 90%",
  }),
  semantic({
    name: "Secondary / Hover",
    token: "semantics.colors.interaction.secondary.hover",
    cssVar: "--semantics-colors-interaction-secondary-hover",
    generated: "#f5f5f5ff",
    alias: "primitives.colors.neutral.100 @ 100%",
    darkGenerated: "#171717ff",
    darkAlias: "primitives.colors.neutral.900 @ 100%",
  }),
  semantic({
    name: "Destructive / Hover",
    token: "semantics.colors.interaction.destructive.hover",
    cssVar: "--semantics-colors-interaction-destructive-hover",
    generated: "#d6000033",
    alias: "primitives.colors.red.500 @ 20%",
  }),
  semantic({
    name: "Destructive / Subtle hover",
    token: "semantics.colors.interaction.destructive.subtle-hover",
    cssVar: "--semantics-colors-interaction-destructive-subtle-hover",
    generated: "#d600001a",
    alias: "primitives.colors.red.500 @ 10%",
  }),
  semantic({
    name: "File upload / Drag over",
    token: "semantics.colors.interaction.file-upload.drag-over",
    cssVar: "--semantics-colors-interaction-file-upload-drag-over",
    generated: "#0074e81a",
    alias: "primitives.colors.blue.500 @ 10%",
  }),
];

export const SEMANTIC_OTHER: SemanticColorRecord[] = [
  semantic({
    name: "Interaction / Scrollbar / Thumb",
    token: "semantics.colors.interaction.scrollbar.thumb",
    cssVar: "--semantics-colors-interaction-scrollbar-thumb",
    generated: "var(--primitives-colors-neutral-400)",
    alias: "primitives.colors.neutral.400",
  }),
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

export const PRIMITIVE_CYAN: PrimitiveColorRecord[] = [
  { name: "Cyan / 100", token: "primitives.colors.cyan.100", cssVar: "--primitives-colors-cyan-100", hex: "#ccfff9ff" },
  { name: "Cyan / 200", token: "primitives.colors.cyan.200", cssVar: "--primitives-colors-cyan-200", hex: "#99fff3ff" },
  { name: "Cyan / 300", token: "primitives.colors.cyan.300", cssVar: "--primitives-colors-cyan-300", hex: "#66ffedff" },
  { name: "Cyan / 400", token: "primitives.colors.cyan.400", cssVar: "--primitives-colors-cyan-400", hex: "#33ffe7ff" },
  { name: "Cyan / 500", token: "primitives.colors.cyan.500", cssVar: "--primitives-colors-cyan-500", hex: "#00ffe1ff" },
  { name: "Cyan / 600", token: "primitives.colors.cyan.600", cssVar: "--primitives-colors-cyan-600", hex: "#00b8a3ff" },
  { name: "Cyan / 700", token: "primitives.colors.cyan.700", cssVar: "--primitives-colors-cyan-700", hex: "#009987ff" },
];

export const PRIMITIVE_GRAY: PrimitiveColorRecord[] = [
  { name: "Gray / 500", token: "primitives.colors.gray.500", cssVar: "--primitives-colors-gray-500", hex: "#6b7280ff" },
];

export const PRIMITIVE_BLUE: PrimitiveColorRecord[] = [
  {
    name: "Blue / 500",
    token: "primitives.colors.blue.500",
    cssVar: "--primitives-colors-blue-500",
    hex: "#0074e8ff",
  },
];

export function referencedPrimitiveTokens(
  semantics: SemanticColorRecord[] = ALL_SEMANTIC_COLORS,
): Set<string> {
  return new Set(
    semantics.flatMap((color) => [
      color.alias.split(" @")[0],
      color.darkAlias.split(" @")[0],
    ]),
  );
}
