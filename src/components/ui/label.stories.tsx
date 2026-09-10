import type { Meta, StoryObj } from "@storybook/react-vite";

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