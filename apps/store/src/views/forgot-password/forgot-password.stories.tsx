import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { ForgotPassword } from "./forgot-password";

const meta = {
  title: "Views/Forgot password",
  component: ForgotPassword,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ForgotPassword>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("banner")).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Home" })).toBeInTheDocument();
  },
};
