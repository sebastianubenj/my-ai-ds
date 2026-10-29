import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Description } from "./description";

const meta = {
  title: "Components/Description",
  component: Description,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Supporting copy under a Title.",
    },
  },
} satisfies Meta<typeof Description>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: "Description.",
  },
};

export const ForwardsRef: Story = {
  args: {
    children: "Description.",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLParagraphElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <Description {...args} ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const text = within(canvasElement).getByText("Description.");

    await expect(text.tagName).toBe("P");
    await expect(text).toHaveAttribute("data-slot", "description");
    await expect(text).toHaveAttribute("data-ref-tag", "P");
  },
};
