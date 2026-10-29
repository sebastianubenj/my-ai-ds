import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Register } from "./register";

const meta = {
  title: "Views/Register",
  component: Register,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Register>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("banner")).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Home" })).toBeInTheDocument();
  },
};
