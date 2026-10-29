import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Home } from "./home";

const meta = {
  title: "Views/Home",
  component: Home,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof meta>;

async function playHome(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const body = within(document.body);

  await expect(
    canvas.getByRole("heading", { name: "All products" }),
  ).toBeVisible();
  await expect(canvas.getAllByRole("article")).toHaveLength(10);
  await expect(canvas.getAllByRole("button", { name: "Add" })).toHaveLength(10);
  await expect(canvas.getByRole("button", { name: "Bag" })).toBeVisible();

  await userEvent.click(canvas.getAllByRole("button", { name: "Add" })[0]);
  await expect(canvas.getByRole("button", { name: "Bag, 1 item" })).toBeVisible();
  await userEvent.click(canvas.getByRole("button", { name: "Bag, 1 item" }));

  await waitFor(() =>
    expect(body.getByRole("heading", { name: "Bag" })).toBeVisible(),
  );
  await expect(body.getAllByText("TP-7 aluminum").length).toBeGreaterThan(1);

  await userEvent.keyboard("{Escape}");
  await waitFor(() =>
    expect(body.queryByRole("heading", { name: "Bag" })).toBeNull(),
  );
}

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    await playHome(canvasElement);
  },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { name: "All products" }),
    ).toBeVisible();
    await expect(canvas.getAllByRole("article")).toHaveLength(10);
    await expect(canvas.getAllByRole("button", { name: "Add" })).toHaveLength(10);

    await userEvent.click(canvas.getAllByRole("button", { name: "Add" })[0]);
    await expect(
      canvas.getByRole("button", { name: "Bag, 1 item" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Bag, 1 item" }));

    await waitFor(() =>
      expect(canvas.getByRole("heading", { name: "Bag" })).toBeVisible(),
    );
    await expect(canvas.getAllByText("TP-7 aluminum").length).toBeGreaterThan(1);

    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(canvas.queryByRole("heading", { name: "Bag" })).toBeNull(),
    );
  },
};
