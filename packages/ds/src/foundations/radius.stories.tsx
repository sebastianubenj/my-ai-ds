import type { Meta, StoryObj } from "@storybook/react-vite";

import { RADIUS_SCALE } from "./radius-data";
import { RadiusSpecimen } from "./radius-specimen";

const meta = {
  title: "Foundations/Radius",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-6)">
      {RADIUS_SCALE.map((specimen) => (
        <RadiusSpecimen key={specimen.token} {...specimen} />
      ))}
    </div>
  ),
};
