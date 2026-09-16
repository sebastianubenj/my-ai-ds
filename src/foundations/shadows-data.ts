export interface ShadowPartRecord {
  /** Figma variable name. */
  figmaName: string;
  /** Canonical code path. */
  token: string;
  cssVar: string;
  px: number;
  rem: string;
  used: boolean;
  type: "dimension";
}

export interface ShadowScaleLayer {
  label: string;
  y: ShadowPartRecord;
  blur: ShadowPartRecord;
  spread: ShadowPartRecord;
}

export interface ShadowScaleStep {
  step: string;
  figmaName: string;
  layers: ShadowScaleLayer[];
  used: boolean;
}

export interface ShadowColorRecord {
  figmaName: string;
  token: string;
  cssVar: string;
  hex: string;
  used: boolean;
  type: "color";
}

export interface SemanticShadowPartRecord {
  figmaName: string;
  token: string;
  cssVar: string;
  type: "dimension" | "color";
  used: boolean;
  /** Alias target, or null when the Figma value is raw. */
  alias: string | null;
  generated: string;
}

export interface EffectShadowLayerRecord {
  figmaName: string;
  token: string;
  cssVar: string;
  cssValue: string;
  used: boolean;
  type: "custom-shadow";
}

/**
 * Used when the token is bound in Figma or is an alias target of a bound
 * semantic token. Codebase consumption is not the source.
 */
function remFromPx(px: number) {
  return px === 0 ? "0" : `${px / 16}rem`;
}

function primitivePart(path: string, px: number, used: boolean): ShadowPartRecord {
  return {
    figmaName: `shadows/${path}`,
    token: `primitives.shadows.${path.replaceAll("/", ".")}`,
    cssVar: `--primitives-shadows-${path.replaceAll("/", "-")}`,
    px,
    rem: remFromPx(px),
    used,
    type: "dimension",
  };
}

function layer(
  path: string,
  values: { y: number; blur: number; spread: number },
  used: boolean,
  label: string,
): ShadowScaleLayer {
  return {
    label,
    y: primitivePart(`${path}/y`, values.y, used),
    blur: primitivePart(`${path}/blur`, values.blur, used),
    spread: primitivePart(`${path}/spread`, values.spread, used),
  };
}

export const SHADOW_SCALE_X = primitivePart("scale/x", 0, true);

export const SHADOW_SCALE_COLOR_VAR = "--primitives-shadows-color-black-10";

export const SHADOW_SCALE: ShadowScaleStep[] = [
  {
    step: "none",
    figmaName: "shadows/scale/none",
    used: false,
    layers: [layer("scale/none", { y: 0, blur: 0, spread: 0 }, false, "")],
  },
  {
    step: "2xs",
    figmaName: "shadows/scale/2xs",
    used: false,
    layers: [layer("scale/2xs", { y: 1, blur: 0, spread: 0 }, false, "")],
  },
  {
    step: "xs",
    figmaName: "shadows/scale/xs",
    used: false,
    layers: [layer("scale/xs", { y: 1, blur: 2, spread: 0 }, false, "")],
  },
  {
    step: "sm",
    figmaName: "shadows/scale/sm",
    used: false,
    layers: [
      layer("scale/sm/layer-1", { y: 1, blur: 3, spread: 0 }, false, "layer-1"),
      layer("scale/sm/layer-2", { y: 1, blur: 2, spread: -1 }, false, "layer-2"),
    ],
  },
  {
    step: "md",
    figmaName: "shadows/scale/md",
    used: true,
    layers: [
      layer("scale/md/layer-1", { y: 4, blur: 6, spread: -1 }, true, "layer-1"),
      layer("scale/md/layer-2", { y: 2, blur: 4, spread: -2 }, true, "layer-2"),
    ],
  },
  {
    step: "lg",
    figmaName: "shadows/scale/lg",
    used: false,
    layers: [
      layer("scale/lg/layer-1", { y: 10, blur: 15, spread: -3 }, false, "layer-1"),
      layer("scale/lg/layer-2", { y: 4, blur: 6, spread: -4 }, false, "layer-2"),
    ],
  },
  {
    step: "xl",
    figmaName: "shadows/scale/xl",
    used: false,
    layers: [
      layer("scale/xl/layer-1", { y: 20, blur: 25, spread: -5 }, false, "layer-1"),
      layer("scale/xl/layer-2", { y: 8, blur: 10, spread: -6 }, false, "layer-2"),
    ],
  },
  {
    step: "2xl",
    figmaName: "shadows/scale/2xl",
    used: false,
    layers: [layer("scale/2xl", { y: 25, blur: 50, spread: -12 }, false, "")],
  },
];

export const SHADOW_COLORS: ShadowColorRecord[] = [
  {
    figmaName: "shadows/color/black-25",
    token: "primitives.shadows.color.black-25",
    cssVar: "--primitives-shadows-color-black-25",
    hex: "#00000040",
    used: false,
    type: "color",
  },
  {
    figmaName: "shadows/color/black-10",
    token: "primitives.shadows.color.black-10",
    cssVar: "--primitives-shadows-color-black-10",
    hex: "#0000001a",
    used: false,
    type: "color",
  },
  {
    figmaName: "shadows/color/black-5",
    token: "primitives.shadows.color.black-5",
    cssVar: "--primitives-shadows-color-black-5",
    hex: "#0000000d",
    used: false,
    type: "color",
  },
  {
    figmaName: "shadows/color/transparent",
    token: "primitives.shadows.color.transparent",
    cssVar: "--primitives-shadows-color-transparent",
    hex: "#00000000",
    used: false,
    type: "color",
  },
];

function semanticPart(
  path: string,
  type: "dimension" | "color",
  generated: string,
  alias: string | null,
): SemanticShadowPartRecord {
  return {
    figmaName: `shadow/${path}`,
    token: `semantics.shadow.${path.replaceAll("/", ".")}`,
    cssVar: `--semantics-shadow-${path.replaceAll("/", "-")}`,
    type,
    used: true,
    alias,
    generated,
  };
}

export const SEMANTIC_POPOVER_LAYERS: {
  label: string;
  parts: SemanticShadowPartRecord[];
}[] = [
  {
    label: "layer-1",
    parts: [
      semanticPart(
        "popover/layer-1/y",
        "dimension",
        "var(--primitives-shadows-scale-md-layer-1-y)",
        "primitives.shadows.scale.md.layer-1.y",
      ),
      semanticPart(
        "popover/layer-1/blur",
        "dimension",
        "var(--primitives-shadows-scale-md-layer-1-blur)",
        "primitives.shadows.scale.md.layer-1.blur",
      ),
      semanticPart(
        "popover/layer-1/spread",
        "dimension",
        "var(--primitives-shadows-scale-md-layer-1-spread)",
        "primitives.shadows.scale.md.layer-1.spread",
      ),
      semanticPart("popover/layer-1/color", "color", "#0000001a", null),
    ],
  },
  {
    label: "layer-2",
    parts: [
      semanticPart(
        "popover/layer-2/y",
        "dimension",
        "var(--primitives-shadows-scale-md-layer-2-y)",
        "primitives.shadows.scale.md.layer-2.y",
      ),
      semanticPart(
        "popover/layer-2/blur",
        "dimension",
        "var(--primitives-shadows-scale-md-layer-2-blur)",
        "primitives.shadows.scale.md.layer-2.blur",
      ),
      semanticPart(
        "popover/layer-2/spread",
        "dimension",
        "var(--primitives-shadows-scale-md-layer-2-spread)",
        "primitives.shadows.scale.md.layer-2.spread",
      ),
      semanticPart("popover/layer-2/color", "color", "#0000001a", null),
    ],
  },
];

export const POPOVER_EFFECT_LAYERS: EffectShadowLayerRecord[] = [
  {
    figmaName: "shadows/popover",
    token: "effect.shadows.popover.0",
    cssVar: "--effect-shadows-popover-0",
    cssValue: "0 0.25rem 0.375rem -0.0625rem #0000001a",
    used: true,
    type: "custom-shadow",
  },
  {
    figmaName: "shadows/popover",
    token: "effect.shadows.popover.1",
    cssVar: "--effect-shadows-popover-1",
    cssValue: "0 0.125rem 0.25rem -0.125rem #0000001a",
    used: true,
    type: "custom-shadow",
  },
];
