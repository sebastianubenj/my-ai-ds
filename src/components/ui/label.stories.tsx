import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Label } from "./label";

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    htmlFor: {
      control: "text",
      description: "Associates the label with a form control by id.",
    },
    children: {
      control: "text",
      description: "The label's text content.",
    },
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

/* -------------------------------------------------------------------------- */
/* Basic                                                                       */
/* -------------------------------------------------------------------------- */

export const Basic: Story = {
  args: {
    children: "Label",
  },
};

/* -------------------------------------------------------------------------- */
/* Ref                                                                         */
/* -------------------------------------------------------------------------- */

export const ForwardsRef: Story = {
  args: {
    children: "Label",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLLabelElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <Label {...args} ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const label = within(canvasElement).getByText("Label");

    await expect(label.tagName).toBe("LABEL");
    await expect(label).toHaveAttribute("data-ref-tag", "LABEL");
  },
};