import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { HomeProducts } from "./home-products";

const meta = {
  title: "Patterns/Home Products",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

async function playHomeProducts(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole("heading", { name: "All products" }),
  ).toBeVisible();
  await expect(canvas.getAllByRole("article")).toHaveLength(10);
  await expect(canvas.getAllByRole("button", { name: "Add" })).toHaveLength(8);

  const add = canvas.getAllByRole("button", { name: "Add" })[0];
  await expect(add).toHaveAttribute("type", "button");
  await userEvent.click(add);
}

export const Desktop: Story = {
  render: () => <HomeProducts />,
  play: async ({ canvasElement }) => {
    await playHomeProducts(canvasElement);
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: () => <HomeProducts />,
  play: async ({ canvasElement }) => {
    await playHomeProducts(canvasElement);
  },
};
