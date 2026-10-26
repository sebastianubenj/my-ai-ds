import type { Meta, StoryObj } from "@storybook/react-vite";

import { Register } from "@/views/register/register";

const meta = {
  title: "Patterns/Register",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Register />,
};
