import type { Meta, StoryObj } from "@storybook/react-vite";

import { BORDER_WIDTH_TOKENS, RING_FOCUS_WIDTH_TOKENS } from "./borders-data";
import { BorderWidthSpecimen, FocusRingSpecimen } from "./borders-specimen";

const meta = {
  title: "Foundations/Borders",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const StrokeWidths: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-6)">
      {BORDER_WIDTH_TOKENS.map((specimen) => (
        <BorderWidthSpecimen key={specimen.token} {...specimen} />
      ))}
    </div>
  ),
};

export const FocusRingWidths: Story = {
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-(--primitives-spacing-6)">
      {RING_FOCUS_WIDTH_TOKENS.map((specimen) => (
        <FocusRingSpecimen key={specimen.token} {...specimen} />
      ))}
    </div>
  ),
};
