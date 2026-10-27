import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import {
  ResetPassword,
  RESET_PASSWORD_COPY,
  type CheckCompromisedPassword,
  type ResetPasswordSubmitResult,
  type ResetPasswordValues,
} from "./reset-password";

const clearChecker: CheckCompromisedPassword = async () => "clear";
const compromisedChecker: CheckCompromisedPassword = async () => "compromised";
const unavailableChecker: CheckCompromisedPassword = async () => "unavailable";

const validValues: ResetPasswordValues = {
  password: "abcdefghijklmnop",
  confirmPassword: "abcdefghijklmnop",
};

const meta = {
  title: "Views/Reset password",
  component: ResetPassword,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    checkCompromisedPassword: clearChecker,
    onSubmit: fn(async (): Promise<void | ResetPasswordSubmitResult> => undefined),
  },
} satisfies Meta<typeof ResetPassword>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByLabelText("Password");
    const confirmPassword = canvas.getByLabelText("Confirm your password");
    const submit = canvas.getByRole("button", { name: RESET_PASSWORD_COPY.submit });

    await expect(password).toHaveAttribute("type", "password");
    await expect(password).toHaveAttribute("autocomplete", "new-password");
    await expect(password).toHaveValue("");
    await expect(confirmPassword).toHaveAttribute("type", "password");
    await expect(confirmPassword).toHaveAttribute("autocomplete", "new-password");
    await expect(submit).toHaveAttribute("type", "submit");
    await expect(
      canvas.getByRole("link", { name: RESET_PASSWORD_COPY.useDifferentEmail }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("link", { name: RESET_PASSWORD_COPY.backToLogin }),
    ).toBeInTheDocument();
    await expect(canvas.queryByText(RESET_PASSWORD_COPY.lengthRequirement)).not.toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "Show password" })).not.toBeInTheDocument();

    await userEvent.type(password, "short");
    const lengthRow = await canvas.findByText(RESET_PASSWORD_COPY.lengthRequirement);
    const leakedRow = canvas.getByText(RESET_PASSWORD_COPY.leakedRequirement);

    await expect(lengthRow).toHaveAttribute("data-state", "pending");
    await expect(leakedRow).toHaveAttribute("data-state", "pending");

    const toggle = canvas.getByRole("button", { name: "Show password" });
    await expect(password).toHaveAttribute("type", "password");
    await userEvent.click(toggle);
    await expect(password).toHaveAttribute("type", "text");
    await userEvent.click(canvas.getByRole("button", { name: "Hide password" }));
    await expect(password).toHaveAttribute("type", "password");

    await userEvent.clear(password);
    await expect(password).toHaveValue("");
    await expect(canvas.queryByText(RESET_PASSWORD_COPY.lengthRequirement)).not.toBeInTheDocument();
    await expect(canvas.queryByText(RESET_PASSWORD_COPY.confirmRequired)).not.toBeInTheDocument();
  },
};

export const RequirementsMet: Story = {
  args: {
    appearance: "requirements-met",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(RESET_PASSWORD_COPY.lengthRequirement)).toHaveAttribute(
      "data-state",
      "met",
    );
    await expect(canvas.getByText(RESET_PASSWORD_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "pending",
    );
    await expect(canvas.queryByText(RESET_PASSWORD_COPY.leakedMessage)).not.toBeInTheDocument();
  },
};

export const ValidationErrors: Story = {
  args: {
    appearance: "validation-errors",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByLabelText("Password");
    const confirmPassword = canvas.getByLabelText("Confirm your password");

    await expect(canvas.getByText(RESET_PASSWORD_COPY.confirmRequired)).toBeInTheDocument();
    await expect(canvas.getByText(RESET_PASSWORD_COPY.lengthRequirement)).toHaveAttribute(
      "data-state",
      "invalid",
    );
    await expect(canvas.getByText(RESET_PASSWORD_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "pending",
    );
    await expect(password).toHaveAttribute("aria-invalid", "true");
    await expect(confirmPassword).toHaveAttribute("aria-invalid", "true");
    await expect(password).toHaveAttribute("aria-describedby", `${password.id}-description`);
    await expect(confirmPassword).toHaveAttribute(
      "aria-describedby",
      `${confirmPassword.id}-description`,
    );
  },
};

export const Compromised: Story = {
  args: {
    appearance: "compromised",
    checkCompromisedPassword: compromisedChecker,
    defaultValues: validValues,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByLabelText("Password");

    await expect(canvas.getByText(RESET_PASSWORD_COPY.lengthRequirement)).toHaveAttribute(
      "data-state",
      "met",
    );
    await expect(canvas.getByText(RESET_PASSWORD_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "invalid",
    );
    await expect(canvas.getByText(RESET_PASSWORD_COPY.leakedMessage)).toBeInTheDocument();
    await expect(password).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText(RESET_PASSWORD_COPY.leakedUnavailable)).not.toBeInTheDocument();
  },
};

export const Submitting: Story = {
  args: {
    appearance: "submitting",
    defaultValues: validValues,
    checkCompromisedPassword: clearChecker,
    onSubmit: fn(() => new Promise(() => undefined)),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: RESET_PASSWORD_COPY.submitting });
    const differentEmail = canvas.getByRole("link", {
      name: RESET_PASSWORD_COPY.useDifferentEmail,
    });

    await expect(submit).toBeDisabled();
    await expect(submit).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByLabelText("Password")).toBeDisabled();
    await expect(canvas.getByLabelText("Confirm your password")).toBeDisabled();
    await expect(differentEmail).toHaveAttribute("aria-disabled", "true");
    await expect(canvas.getByText(RESET_PASSWORD_COPY.lengthRequirement)).toHaveAttribute(
      "data-state",
      "met",
    );
    await expect(canvas.getByText(RESET_PASSWORD_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "met",
    );
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const Network: Story = {
  args: {
    appearance: "network",
    defaultValues: validValues,
    checkCompromisedPassword: clearChecker,
    onSubmit: fn(async () => "network" as const),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByLabelText("Password");
    const confirmPassword = canvas.getByLabelText("Confirm your password");

    await expect(canvas.getByRole("alert")).toHaveTextContent(RESET_PASSWORD_COPY.network);
    await expect(password).not.toHaveAttribute("aria-invalid", "true");
    await expect(confirmPassword).not.toHaveAttribute("aria-invalid", "true");
    await expect(
      canvas.getByRole("link", { name: RESET_PASSWORD_COPY.useDifferentEmail }),
    ).toHaveAttribute("href", "#");
    await expect(
      canvas.getByRole("link", { name: RESET_PASSWORD_COPY.backToLogin }),
    ).toHaveAttribute("href", "#");
    await expect(canvas.getByText(RESET_PASSWORD_COPY.lengthRequirement)).toHaveAttribute(
      "data-state",
      "met",
    );

    await userEvent.click(canvas.getByRole("button", { name: RESET_PASSWORD_COPY.submit }));
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalled());
    await expect(canvas.getByRole("alert")).toHaveTextContent(RESET_PASSWORD_COPY.network);
  },
};

export const UnavailableCheck: Story = {
  args: {
    defaultValues: validValues,
    checkCompromisedPassword: unavailableChecker,
    onSubmit: fn(async () => undefined),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByLabelText("Password");

    await userEvent.click(canvas.getByRole("button", { name: RESET_PASSWORD_COPY.submit }));
    await waitFor(() =>
      expect(canvas.getByText(RESET_PASSWORD_COPY.leakedUnavailable)).toBeInTheDocument(),
    );
    await expect(canvas.getByText(RESET_PASSWORD_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "pending",
    );
    await expect(canvas.queryByText(RESET_PASSWORD_COPY.leakedMessage)).not.toBeInTheDocument();
    await expect(password).toHaveFocus();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
