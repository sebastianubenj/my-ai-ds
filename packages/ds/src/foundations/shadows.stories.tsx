import type { Meta, StoryObj } from "@storybook/react-vite";

import { POPOVER_EFFECT_LAYERS, SEMANTIC_POPOVER_LAYERS } from "./shadows-data";
import { PopoverRecipeSpecimen, SemanticLayerSpecimen } from "./shadows-specimen";

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

export const SemanticParts: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-8)">
      {SEMANTIC_POPOVER_LAYERS.map((layer) => (
        <SemanticLayerSpecimen key={layer.label} label={layer.label} parts={layer.parts} />
      ))}
    </div>
  ),
};
