import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { CONFIRM_EMAIL_COPY, ConfirmEmail } from "./confirm-email";

const meta = {
  title: "Patterns/Confirm email",
  component: ConfirmEmail,
  parameters: {
    layout: "centered",
  },
  args: {
    email: "johndoe@example.com",
    loginHref: "/login",
    onResend: fn(),
  },
} satisfies Meta<typeof ConfirmEmail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { name: CONFIRM_EMAIL_COPY.title }),
    ).toBeInTheDocument();
    await expect(canvas.getByText(args.email)).toBeInTheDocument();
    await expect(canvas.getByText(CONFIRM_EMAIL_COPY.tipTitle)).toBeInTheDocument();
    await expect(canvas.getByRole("status")).toBeInTheDocument();

    const login = canvas.getByRole("link", { name: CONFIRM_EMAIL_COPY.backToLogin });
    await expect(login).toHaveAttribute("href", "/login");

    await userEvent.click(
      canvas.getByRole("button", { name: CONFIRM_EMAIL_COPY.resend }),
    );
    await expect(args.onResend).toHaveBeenCalled();
  },
};

export const ResendError: Story = {
  args: {
    formError: CONFIRM_EMAIL_COPY.network,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(CONFIRM_EMAIL_COPY.network);
  },
};

export const Resending: Story = {
  args: {
    submitting: true,
  },
};
