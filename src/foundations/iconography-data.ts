import { iconBox16, iconBox20, type IconName } from "@/components/icon";

export interface IconLibraryRecord {
  name: string;
  /** Whether React currently ships this family through `Icon`. */
  production: boolean;
}

export interface IconSizeRecord {
  /** Width and height at a 16px root. The rendered box is `box`. */
  px: number;
  /** CSS length passed to `Icon` `size`. A spacing variable, not an icon-size token. */
  box: string;
  spacingNote: string;
  uses: string[];
}

export interface IconColorExampleRecord {
  label: string;
  token: string;
  cssVar: string;
}

export interface IconMappingRecord {
  figmaName: string;
  reactName: IconName;
  note?: string;
}

/** Production family. Alternate Figma swaps are not React implementations. */
export const ICON_FAMILY = {
  production: "Lucide",
  figmaPage: "Icons",
  figmaGrid: "Lucide Icons / {kebab-name}",
  figmaMasterSize: 16,
  figmaComponentCount: 1531,
  reactRegistryCount: 17,
  package: "lucide-react",
} as const;

export const FIGMA_PLACEHOLDER_LIBRARIES: IconLibraryRecord[] = [
  { name: "Lucide", production: true },
  { name: "Huge", production: false },
  { name: "Tabler", production: false },
  { name: "Phosphor", production: false },
  { name: "Remix", production: false },
];

/**
 * Small representative set for specimens. Not the Icon registry and not the
 * Figma catalog.
 */
export const REPRESENTATIVE_ICONS: IconName[] = [
  "arrow-left",
  "check",
  "chevron-down",
  "file",
  "upload",
];

/** Observed React and Figma control sizes. Not an icon-size token scale. */
export const ICON_SIZES: IconSizeRecord[] = [
  {
    px: 16,
    box: iconBox16,
    spacingNote: "primitives.spacing.4",
    uses: [
      "Figma Lucide masters",
      "Checkbox icons",
      "Button small / extra-small icons",
    ],
  },
  {
    px: 20,
    box: iconBox20,
    spacingNote: "primitives.spacing.5",
    uses: [
      "Input",
      "Select",
      "File Upload",
      "Textarea resize thumb",
      "Button medium / large icons",
    ],
  },
];

/** Figma-only utility wrapper. Not an established React Icon size. */
export const FIGMA_UTILITY_ICON_SIZE = 24;

/**
 * Stroke relationship. `border-1,33` belongs to Borders; it is not an
 * icon-specific token.
 */
export const ICON_STROKE = {
  figmaName: "border-width/border-1,33",
  token: "primitives.border-width.border-1,33",
  cssVar: "--primitives-border-width-border-1-33",
  figmaPx: 1.33,
  reactStrokeWidth: 2,
  lucideViewBox: 24,
  at16: "2 × 16 / 24 ≈ 1.33px",
  at20: "2 × 20 / 24 ≈ 1.67px",
  filledException: "resize-thumb",
} as const;

export const ICON_COLOR = {
  figmaName: "colors/foreground/default",
  token: "semantics.colors.foreground.default",
  cssVar: "--semantics-colors-foreground-default",
  react: "currentColor",
} as const;

/** Semantic colors actually used around icons. Not an icon-color scale. */
export const ICON_COLOR_EXAMPLES: IconColorExampleRecord[] = [
  {
    label: "Default",
    token: "semantics.colors.foreground.default",
    cssVar: "--semantics-colors-foreground-default",
  },
  {
    label: "Subtle",
    token: "semantics.colors.foreground.subtle",
    cssVar: "--semantics-colors-foreground-subtle",
  },
  {
    label: "Destructive",
    token: "semantics.colors.foreground.destructive",
    cssVar: "--semantics-colors-foreground-destructive",
  },
];

export const ICON_MAPPINGS: IconMappingRecord[] = [
  { figmaName: "Lucide Icons / arrow-left", reactName: "arrow-left" },
  { figmaName: "Lucide Icons / check", reactName: "check" },
  { figmaName: "Lucide Icons / chevron-down", reactName: "chevron-down" },
  {
    figmaName: "Lucide Icons / Resize Thumb",
    reactName: "resize-thumb",
    note: "Project-specific filled glyph. Not a published lucide-react name.",
  },
];

export const ICON_LIBRARY_BOOLEANS = [
  {
    figmaName: "icon-library/lucide",
    token: "semantics.icon-library.lucide",
    value: "true",
  },
  {
    figmaName: "icon-library/remix",
    token: "semantics.icon-library.remix",
    value: "false",
  },
  {
    figmaName: "icon-library/phosphor",
    token: "semantics.icon-library.phosphor",
    value: "false",
  },
  {
    figmaName: "icon-library/tabler",
    token: "semantics.icon-library.tabler",
    value: "false",
  },
  {
    figmaName: "icon-library/huge",
    token: "semantics.icon-library.huge",
    value: "false",
  },
] as const;
