import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { ExpiredLink, EXPIRED_LINK_COPY } from "./expired-link";

const meta = {
  title: "Views/Expired link",
  component: ExpiredLink,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ExpiredLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const request = canvas.getByRole("link", { name: EXPIRED_LINK_COPY.requestNewLink });

    await expect(canvas.getByRole("banner")).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Home" })).toBeInTheDocument();
    await expect(
      canvas.getByRole("heading", { name: EXPIRED_LINK_COPY.title }),
    ).toBeInTheDocument();
    await expect(canvas.getByText(EXPIRED_LINK_COPY.description)).toBeInTheDocument();
    await expect(request).toHaveAttribute("href", "#");
  },
};
