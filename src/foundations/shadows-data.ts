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
      semanticPart("popover/layer-1/y", "dimension", "0.25rem", null),
      semanticPart("popover/layer-1/blur", "dimension", "0.375rem", null),
      semanticPart("popover/layer-1/spread", "dimension", "-0.0625rem", null),
      semanticPart("popover/layer-1/color", "color", "#0000001a", null),
    ],
  },
  {
    label: "layer-2",
    parts: [
      semanticPart("popover/layer-2/y", "dimension", "0.125rem", null),
      semanticPart("popover/layer-2/blur", "dimension", "0.25rem", null),
      semanticPart("popover/layer-2/spread", "dimension", "-0.125rem", null),
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
