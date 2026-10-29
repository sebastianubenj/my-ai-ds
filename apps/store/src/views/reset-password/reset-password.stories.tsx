import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { ResetPassword } from "./reset-password";

const meta = {
  title: "Views/Reset password",
  component: ResetPassword,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ResetPassword>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("banner")).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Home" })).toBeInTheDocument();
  },
};
