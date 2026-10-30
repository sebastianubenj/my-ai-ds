import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import {
  FORGOT_PASSWORD_COPY,
  ForgotPasswordForm,
  type ForgotPasswordSubmitResult,
} from "./forgot-password-form";

const validEmail = "johndoe@example.com";

const meta = {
  title: "Patterns/Forgot password",
  component: ForgotPasswordForm,
  parameters: {
    layout: "centered",
  },
  args: {
    onSubmit: fn(async (): Promise<void | ForgotPasswordSubmitResult> => undefined),
  },
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Email");
    const submit = canvas.getByRole("button", { name: FORGOT_PASSWORD_COPY.submit });

    await expect(email).toHaveAttribute("type", "email");
    await expect(email).toHaveAttribute("autocomplete", "email");
    await expect(email).toHaveValue("");
    await expect(submit).toHaveAttribute("type", "submit");
    await expect(canvas.getByRole("link", { name: FORGOT_PASSWORD_COPY.backToLogin })).toBeInTheDocument();
    await expect(canvas.queryByText(FORGOT_PASSWORD_COPY.emailRequired)).not.toBeInTheDocument();
    await expect(canvas.queryByText(FORGOT_PASSWORD_COPY.emailInvalid)).not.toBeInTheDocument();
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
  },
};

export const Wait: Story = {
  args: {
    onSubmit: fn(async () => ({ type: "wait" }) as const),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Email"), validEmail);
    await userEvent.click(canvas.getByRole("button", { name: FORGOT_PASSWORD_COPY.submit }));

    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(FORGOT_PASSWORD_COPY.waitHour),
    );
    await expect(canvas.getByRole("heading", { name: FORGOT_PASSWORD_COPY.title })).toBeInTheDocument();
    await expect(canvas.getByLabelText("Email")).toHaveValue(validEmail);
    await expect(
      canvas.queryByRole("heading", { name: FORGOT_PASSWORD_COPY.sentTitle }),
    ).not.toBeInTheDocument();
  },
};

export const WaitSeconds: Story = {
  args: {
    onSubmit: fn(async () => ({ type: "wait", seconds: 42 }) as const),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Email"), validEmail);
    await userEvent.click(canvas.getByRole("button", { name: FORGOT_PASSWORD_COPY.submit }));

    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(
        "Please wait 42 seconds before requesting another link.",
      ),
    );
    await expect(canvas.getByRole("heading", { name: FORGOT_PASSWORD_COPY.title })).toBeInTheDocument();
  },
};

export const InvalidEmail: Story = {
  args: {
    appearance: "invalid-email",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Email");

    await expect(canvas.getByText(FORGOT_PASSWORD_COPY.emailInvalid)).toBeInTheDocument();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAttribute("aria-describedby", `${email.id}-description`);
    await expect(email).toHaveValue("johndoe@");

    await userEvent.type(email, "example.com");
    await expect(canvas.queryByText(FORGOT_PASSWORD_COPY.emailInvalid)).not.toBeInTheDocument();
    await expect(email).not.toHaveAttribute("aria-invalid", "true");
  },
};

export const Required: Story = {
  args: {
    appearance: "required",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Email");

    await expect(canvas.getByText(FORGOT_PASSWORD_COPY.emailRequired)).toBeInTheDocument();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAttribute("aria-describedby", `${email.id}-description`);
    await expect(email).toHaveValue("");
  },
};

export const Submitting: Story = {
  args: {
    appearance: "submitting",
    onSubmit: fn(() => new Promise(() => undefined)),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: FORGOT_PASSWORD_COPY.submitting });

    await expect(submit).toBeDisabled();
    await expect(submit).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByLabelText("Email")).toHaveValue(validEmail);
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Sent: Story = {
  args: {
    appearance: "sent",
    onResend: fn(async (): Promise<void | ForgotPasswordSubmitResult> => undefined),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { name: FORGOT_PASSWORD_COPY.sentTitle })).toBeInTheDocument();
    await expect(canvas.getByText(validEmail)).toBeInTheDocument();
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    await expect(canvas.queryByLabelText("Email")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: FORGOT_PASSWORD_COPY.resend }));
    await waitFor(() => expect(args.onResend).toHaveBeenCalled());
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: FORGOT_PASSWORD_COPY.useDifferentEmail }));
    await expect(canvas.getByLabelText("Email")).toHaveValue(validEmail);
    await expect(canvas.getByRole("heading", { name: FORGOT_PASSWORD_COPY.title })).toBeInTheDocument();
  },
};

export const SentWait: Story = {
  args: {
    appearance: "sent-wait",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("alert")).toHaveTextContent(FORGOT_PASSWORD_COPY.wait);
    await expect(canvas.getByText(validEmail)).toBeInTheDocument();
  },
};

export const SentNetwork: Story = {
  args: {
    appearance: "sent-network",
    onResend: fn(async () => "network" as const),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("alert")).toHaveTextContent(FORGOT_PASSWORD_COPY.network);

    await userEvent.click(canvas.getByRole("button", { name: FORGOT_PASSWORD_COPY.resend }));
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(FORGOT_PASSWORD_COPY.network),
    );
    await expect(args.onResend).toHaveBeenCalled();
  },
};
