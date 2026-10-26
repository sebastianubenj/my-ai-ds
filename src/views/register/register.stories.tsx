import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import {
  Register,
  REGISTER_COPY,
  type CheckCompromisedPassword,
  type RegisterValues,
} from "./register";

const clearChecker: CheckCompromisedPassword = async () => "clear";
const compromisedChecker: CheckCompromisedPassword = async () => "compromised";
const unavailableChecker: CheckCompromisedPassword = async () => "unavailable";

const validValues: RegisterValues = {
  name: "John Doe",
  email: "example@example.com",
  password: "abcdefghijklmnop",
  confirmPassword: "abcdefghijklmnop",
};

const meta = {
  title: "Views/Register",
  component: Register,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    checkCompromisedPassword: clearChecker,
    onSubmit: fn(async () => undefined),
  },
} satisfies Meta<typeof Register>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByLabelText("Full name");
    const email = canvas.getByLabelText("Email");
    const password = canvas.getByLabelText("Password");
    const confirmPassword = canvas.getByLabelText("Confirm your password");
    const submit = canvas.getByRole("button", { name: REGISTER_COPY.submit });

    await expect(name).toHaveAttribute("type", "text");
    await expect(name).toHaveAttribute("autocomplete", "name");
    await expect(email).toHaveAttribute("type", "email");
    await expect(email).toHaveAttribute("autocomplete", "email");
    await expect(password).toHaveAttribute("type", "password");
    await expect(password).toHaveAttribute("autocomplete", "new-password");
    await expect(confirmPassword).toHaveAttribute("type", "password");
    await expect(confirmPassword).toHaveAttribute("autocomplete", "new-password");
    await expect(submit).toHaveAttribute("type", "submit");
    await expect(canvas.queryByText(REGISTER_COPY.lengthRequirement)).not.toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "Show password" })).not.toBeInTheDocument();

    await userEvent.type(password, "short");
    const lengthRow = canvas.getByText(REGISTER_COPY.lengthRequirement);
    const leakedRow = canvas.getByText(REGISTER_COPY.leakedRequirement);

    await expect(lengthRow).toHaveAttribute("data-state", "pending");
    await expect(leakedRow).toHaveAttribute("data-state", "pending");

    await userEvent.type(password, "password12");
    await expect(canvas.getByText(REGISTER_COPY.lengthRequirement)).toHaveAttribute(
      "data-state",
      "met",
    );
    await expect(canvas.getByText(REGISTER_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "pending",
    );

    const toggle = canvas.getByRole("button", { name: "Show password" });
    await expect(password).toHaveAttribute("type", "password");
    await userEvent.click(toggle);
    await expect(password).toHaveAttribute("type", "text");
    await userEvent.click(canvas.getByRole("button", { name: "Hide password" }));
    await expect(password).toHaveAttribute("type", "password");

    await userEvent.click(submit);
    await expect(name).toHaveFocus();
    await expect(canvas.getByText(REGISTER_COPY.nameRequired)).toBeInTheDocument();
    await expect(canvas.getByText(REGISTER_COPY.emailRequired)).toBeInTheDocument();
    await expect(canvas.getByText(REGISTER_COPY.confirmRequired)).toBeInTheDocument();
  },
};

export const RequirementsMet: Story = {
  args: {
    appearance: "requirements-met",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(REGISTER_COPY.lengthRequirement)).toHaveAttribute(
      "data-state",
      "met",
    );
    await expect(canvas.getByText(REGISTER_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "pending",
    );
    await expect(canvas.queryByText(REGISTER_COPY.leakedMessage)).not.toBeInTheDocument();
  },
};

export const ValidationErrors: Story = {
  args: {
    appearance: "validation-errors",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByLabelText("Full name");
    const email = canvas.getByLabelText("Email");
    const password = canvas.getByLabelText("Password");
    const confirmPassword = canvas.getByLabelText("Confirm your password");

    await expect(canvas.getByText(REGISTER_COPY.nameRequired)).toBeInTheDocument();
    await expect(canvas.getByText(REGISTER_COPY.emailInvalid)).toBeInTheDocument();
    await expect(canvas.getByText(REGISTER_COPY.confirmRequired)).toBeInTheDocument();
    await expect(canvas.getByText(REGISTER_COPY.lengthRequirement)).toHaveAttribute(
      "data-state",
      "invalid",
    );
    await expect(canvas.getByText(REGISTER_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "pending",
    );
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(password).toHaveAttribute("aria-invalid", "true");
    await expect(confirmPassword).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAttribute("aria-describedby", `${name.id}-description`);
    await expect(email).toHaveAttribute("aria-describedby", `${email.id}-description`);
    await expect(password).toHaveAttribute("aria-describedby", `${password.id}-description`);
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

    await expect(canvas.getByText(REGISTER_COPY.lengthRequirement)).toHaveAttribute(
      "data-state",
      "met",
    );
    await expect(canvas.getByText(REGISTER_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "invalid",
    );
    await expect(canvas.getByText(REGISTER_COPY.leakedMessage)).toBeInTheDocument();
    await expect(password).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText(REGISTER_COPY.leakedUnavailable)).not.toBeInTheDocument();
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
    const submit = canvas.getByRole("button", { name: REGISTER_COPY.submitting });

    await expect(submit).toBeDisabled();
    await expect(submit).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByText(REGISTER_COPY.lengthRequirement)).toHaveAttribute(
      "data-state",
      "met",
    );
    await expect(canvas.getByText(REGISTER_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "met",
    );
    await expect(args.onSubmit).not.toHaveBeenCalled();
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

    await userEvent.click(canvas.getByRole("button", { name: REGISTER_COPY.submit }));
    await waitFor(() =>
      expect(canvas.getByText(REGISTER_COPY.leakedUnavailable)).toBeInTheDocument(),
    );
    await expect(canvas.getByText(REGISTER_COPY.leakedRequirement)).toHaveAttribute(
      "data-state",
      "pending",
    );
    await expect(canvas.queryByText(REGISTER_COPY.leakedMessage)).not.toBeInTheDocument();
    await expect(password).toHaveFocus();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
