import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { PasswordUpdated } from "./password-updated";

const meta = {
  title: "Views/Password updated",
  component: PasswordUpdated,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PasswordUpdated>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("banner")).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Home" })).toBeInTheDocument();
  },
};
