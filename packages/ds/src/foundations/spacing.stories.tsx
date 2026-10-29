import type { Meta, StoryObj } from "@storybook/react-vite";

import { SPACING_SCALE } from "./spacing-data";
import { SpacingSpecimen } from "./spacing-specimen";

const meta = {
  title: "Foundations/Spacing",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-6)">
      {SPACING_SCALE.map((specimen) => (
        <SpacingSpecimen key={specimen.token} {...specimen} />
      ))}
    </div>
  ),
};
