import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CONFIRM_EMAIL_COPY } from "@weaveui/ds";

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

export const CheckYourEmail: Story = {
  args: {
    confirmationEmail: "johndoe@example.com",
    loginHref: "/login",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("banner")).toBeInTheDocument();
    await expect(
      canvas.getByRole("heading", { name: CONFIRM_EMAIL_COPY.title }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("johndoe@example.com")).toBeInTheDocument();
    await expect(
      canvas.getByRole("link", { name: CONFIRM_EMAIL_COPY.backToLogin }),
    ).toHaveAttribute("href", "/login");
    await expect(
      canvas.getByRole("button", { name: CONFIRM_EMAIL_COPY.resend }),
    ).toBeInTheDocument();
  },
};
