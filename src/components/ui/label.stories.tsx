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
/* Associated with a form control                                             */
/* -------------------------------------------------------------------------- */

export const WithFormControl: Story = {
  args: {
    children: "Email",
    htmlFor: "email",
  },
  render: (args) => (
    <div className="flex flex-col gap-(--control-gap-sm)">
      <Label {...args} />
      <input
        id="email"
        type="email"
        placeholder="you@example.com"
        className="h-(--control-height-md) rounded-(--control-radius-md) border border-border
          px-(--control-padding-inline-md) text-(length:--semantics-typography-label-label-md-font-size)
          outline-none focus-visible:[box-shadow:var(--effect-focus-default)]"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Email");
    const input = canvas.getByPlaceholderText("you@example.com");

    await expect(label).toHaveAttribute("for", "email");
    await expect(input).toHaveAttribute("id", "email");
  },
};
