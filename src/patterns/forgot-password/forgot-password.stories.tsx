import type { Meta, StoryObj } from "@storybook/react-vite";

import { ForgotPassword } from "@/views/forgot-password/forgot-password";

const meta = {
  title: "Patterns/Forgot password",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ForgotPassword />,
};
