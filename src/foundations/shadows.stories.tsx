import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  POPOVER_EFFECT_LAYERS,
  SEMANTIC_POPOVER_LAYERS,
  SHADOW_COLORS,
  SHADOW_SCALE,
  SHADOW_SCALE_X,
} from "./shadows-data";
import {
  PopoverRecipeSpecimen,
  PrimitiveScaleSpecimen,
  PrimitiveShadowColorSpecimen,
  SemanticLayerSpecimen,
  SharedXSpecimen,
} from "./shadows-specimen";

const meta = {
  title: "Foundations/Shadows",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const PopoverRecipe: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col">
      <PopoverRecipeSpecimen layers={POPOVER_EFFECT_LAYERS} />
    </div>
  ),
};

export const PrimitiveScale: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-8)">
      <SharedXSpecimen part={SHADOW_SCALE_X} />
      {SHADOW_SCALE.map((step) => (
        <PrimitiveScaleSpecimen key={step.step} step={step} />
      ))}
    </div>
  ),
};

export const PrimitiveColors: Story = {
  render: () => (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-(--primitives-spacing-6) sm:grid-cols-2">
      {SHADOW_COLORS.map((color) => (
        <PrimitiveShadowColorSpecimen key={color.token} color={color} />
      ))}
    </div>
  ),
};

export const SemanticParts: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-8)">
      {SEMANTIC_POPOVER_LAYERS.map((layer) => (
        <SemanticLayerSpecimen key={layer.label} label={layer.label} parts={layer.parts} />
      ))}
    </div>
  ),
};
