import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  PrimitiveColorSpecimen,
  SemanticColorSpecimen,
} from "./color-specimen";
import {
  PRIMITIVE_AMBER,
  PRIMITIVE_BLUE,
  PRIMITIVE_EMERALD,
  PRIMITIVE_NEUTRAL,
  PRIMITIVE_RED,
  PRIMITIVE_CYAN,
  PRIMITIVE_GRAY,
  SEMANTIC_BACKGROUND,
  SEMANTIC_BORDER,
  SEMANTIC_FOREGROUND,
  SEMANTIC_INTERACTION,
  SEMANTIC_OTHER,
  referencedPrimitiveTokens,
  type PrimitiveColorRecord,
  type SemanticColorRecord,
} from "./colors-data";

const referenced = referencedPrimitiveTokens();

function semanticGrid(colors: SemanticColorRecord[]) {
  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-(--primitives-spacing-6) sm:grid-cols-2">
      {colors.map((color) => (
        <SemanticColorSpecimen key={color.token} {...color} />
      ))}
    </div>
  );
}

function primitiveGrid(colors: PrimitiveColorRecord[]) {
  return (
    <div className="grid w-full max-w-5xl grid-cols-2 gap-(--primitives-spacing-6) sm:grid-cols-3 md:grid-cols-4">
      {colors.map((color) => (
        <PrimitiveColorSpecimen
          key={color.token}
          {...color}
          referenced={referenced.has(color.token)}
        />
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Background: Story = {
  render: () => semanticGrid(SEMANTIC_BACKGROUND),
};

export const Foreground: Story = {
  render: () => semanticGrid(SEMANTIC_FOREGROUND),
};

export const Border: Story = {
  render: () => semanticGrid(SEMANTIC_BORDER),
};

export const Interaction: Story = {
  render: () => semanticGrid(SEMANTIC_INTERACTION),
};

export const Other: Story = {
  render: () => semanticGrid(SEMANTIC_OTHER),
};

export const Neutral: Story = {
  render: () => primitiveGrid(PRIMITIVE_NEUTRAL),
};

export const Red: Story = {
  render: () => primitiveGrid(PRIMITIVE_RED),
};

export const Amber: Story = {
  render: () => primitiveGrid(PRIMITIVE_AMBER),
};

export const Emerald: Story = {
  render: () => primitiveGrid(PRIMITIVE_EMERALD),
};

export const Cyan: Story = {
  render: () => primitiveGrid(PRIMITIVE_CYAN),
};

export const Gray: Story = {
  render: () => primitiveGrid(PRIMITIVE_GRAY),
};

export const Blue: Story = {
  render: () => primitiveGrid(PRIMITIVE_BLUE),
};
