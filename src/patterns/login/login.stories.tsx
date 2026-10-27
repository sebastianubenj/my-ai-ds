import type { Meta, StoryObj } from "@storybook/react-vite";

import { Login } from "@/views/login/login";

const meta = {
  title: "Patterns/Login",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Login />,
};
