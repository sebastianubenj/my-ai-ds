import type { Meta, StoryObj } from "@storybook/react-vite";

import { OPACITY_SCALE } from "./opacity-data";
import { OpacitySpecimen } from "./opacity-specimen";

const meta = {
  title: "Foundations/Opacity",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-6)">
      {OPACITY_SCALE.map((specimen) => (
        <OpacitySpecimen key={specimen.token} {...specimen} />
      ))}
    </div>
  ),
};
