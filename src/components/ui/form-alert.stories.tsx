import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { FormAlert } from "./form-alert";

const meta = {
  title: "Components/FormAlert",
  component: FormAlert,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Form-level error copy.",
    },
  },
} satisfies Meta<typeof FormAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: "Something went wrong. Please try again.",
  },
};

export const ForwardsRef: Story = {
  args: {
    children: "Something went wrong. Please try again.",
  },
  render: function ForwardsRefRender(args) {
    const ref = React.useRef<HTMLParagraphElement>(null);

    React.useLayoutEffect(() => {
      if (ref.current) {
        ref.current.setAttribute("data-ref-tag", ref.current.tagName);
      }
    }, []);

    return <FormAlert {...args} ref={ref} />;
  },
  play: async ({ canvasElement }) => {
    const text = within(canvasElement).getByRole("alert");

    await expect(text.tagName).toBe("P");
    await expect(text).toHaveAttribute("data-slot", "form-alert");
    await expect(text).toHaveAttribute("data-ref-tag", "P");
  },
};
