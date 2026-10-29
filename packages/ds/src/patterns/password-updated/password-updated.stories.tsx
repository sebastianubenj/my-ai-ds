import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { PASSWORD_UPDATED_COPY, PasswordUpdated } from "./password-updated";

const meta = {
  title: "Patterns/Password updated",
  component: PasswordUpdated,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof PasswordUpdated>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const login = canvas.getByRole("link", { name: PASSWORD_UPDATED_COPY.login });

    await expect(
      canvas.getByRole("heading", { name: PASSWORD_UPDATED_COPY.title }),
    ).toBeInTheDocument();
    await expect(canvas.getByText(PASSWORD_UPDATED_COPY.description)).toBeInTheDocument();
    await expect(login).toHaveAttribute("href", "#");
  },
};
