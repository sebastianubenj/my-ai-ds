import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { FORGOT_PASSWORD_COPY } from "#/patterns/forgot-password/forgot-password-copy";

import { CheckYourEmail } from "./check-your-email";

const meta = {
  title: "Patterns/Check your email",
  component: CheckYourEmail,
  parameters: {
    layout: "centered",
  },
  args: {
    email: "johndoe@example.com",
    onResend: fn(),
    onUseDifferentEmail: fn(),
  },
} satisfies Meta<typeof CheckYourEmail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { name: FORGOT_PASSWORD_COPY.sentTitle }),
    ).toBeInTheDocument();
    await expect(canvas.getByText(args.email)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: FORGOT_PASSWORD_COPY.resend }));
    await expect(args.onResend).toHaveBeenCalled();

    await userEvent.click(
      canvas.getByRole("button", { name: FORGOT_PASSWORD_COPY.useDifferentEmail }),
    );
    await expect(args.onUseDifferentEmail).toHaveBeenCalled();
  },
};
