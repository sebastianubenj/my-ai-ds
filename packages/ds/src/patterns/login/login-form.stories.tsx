import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import {
  LOGIN_COPY,
  LoginForm,
  type LoginSubmitResult,
  type LoginValues,
} from "./login-form";

const validValues: LoginValues = {
  email: "johndoe@example.com",
  password: "abcdefghijklmnop",
  rememberMe: false,
};

const meta = {
  title: "Patterns/Log in",
  component: LoginForm,
  parameters: {
    layout: "centered",
  },
  args: {
    onSubmit: fn(async (): Promise<void | LoginSubmitResult> => undefined),
  },
} satisfies Meta<typeof LoginForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Email");
    const password = canvas.getByLabelText("Password");
    const submit = canvas.getByRole("button", { name: LOGIN_COPY.submit });

    await expect(email).toHaveAttribute("type", "email");
    await expect(email).toHaveAttribute("autocomplete", "email");
    await expect(password).toHaveAttribute("type", "password");
    await expect(password).toHaveAttribute("autocomplete", "current-password");
    await expect(submit).toHaveAttribute("type", "submit");
    await expect(canvas.getByLabelText("Remember me")).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "Show password" })).not.toBeInTheDocument();
    await expect(canvas.queryByText(LOGIN_COPY.emailRequired)).not.toBeInTheDocument();
    await expect(canvas.queryByText(LOGIN_COPY.passwordRequired)).not.toBeInTheDocument();

    await userEvent.click(password);
    await userEvent.type(password, "secret");
    const toggle = canvas.getByRole("button", { name: "Show password" });

    await expect(toggle).toHaveAttribute("type", "button");
    await expect(password).toHaveAttribute("type", "password");
    await userEvent.click(toggle);
    await expect(password).toHaveAttribute("type", "text");
    await userEvent.click(canvas.getByRole("button", { name: "Hide password" }));
    await expect(password).toHaveAttribute("type", "password");

    await userEvent.clear(password);
    await userEvent.click(submit);
    await expect(email).toHaveFocus();
    await expect(canvas.getByText(LOGIN_COPY.emailRequired)).toBeInTheDocument();
    await expect(canvas.getByText(LOGIN_COPY.passwordRequired)).toBeInTheDocument();
  },
};

export const InvalidEmail: Story = {
  args: {
    appearance: "invalid-email",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Email");

    await expect(canvas.getByText(LOGIN_COPY.emailInvalid)).toBeInTheDocument();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAttribute("aria-describedby", `${email.id}-description`);
    await expect(email).toHaveValue("sebastian@");

    await userEvent.type(email, "example.com");
    await expect(canvas.queryByText(LOGIN_COPY.emailInvalid)).not.toBeInTheDocument();
    await expect(email).not.toHaveAttribute("aria-invalid", "true");
  },
};

export const RequiredFields: Story = {
  args: {
    appearance: "required-fields",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Email");
    const password = canvas.getByLabelText("Password");

    await expect(canvas.getByText(LOGIN_COPY.emailRequired)).toBeInTheDocument();
    await expect(canvas.getByText(LOGIN_COPY.passwordRequired)).toBeInTheDocument();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(password).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAttribute("aria-describedby", `${email.id}-description`);
    await expect(password).toHaveAttribute("aria-describedby", `${password.id}-description`);
  },
};

export const InvalidCredentials: Story = {
  args: {
    appearance: "invalid-credentials",
    defaultValues: validValues,
    onSubmit: fn(async () => "invalid-credentials" as const),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Email");
    const password = canvas.getByLabelText("Password");

    await expect(canvas.getByRole("alert")).toHaveTextContent(LOGIN_COPY.invalidCredentials);
    await expect(email).not.toHaveAttribute("aria-invalid", "true");
    await expect(password).not.toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveValue(validValues.email);

    await userEvent.type(email, "x");
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: LOGIN_COPY.submit }));
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(LOGIN_COPY.invalidCredentials),
    );
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const Submitting: Story = {
  args: {
    appearance: "submitting",
    defaultValues: validValues,
    onSubmit: fn(() => new Promise(() => undefined)),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole("button", { name: LOGIN_COPY.submitting });

    await expect(submit).toBeDisabled();
    await expect(submit).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByLabelText("Email")).toHaveValue(validValues.email);
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const NetworkError: Story = {
  args: {
    defaultValues: validValues,
    onSubmit: fn(async () => "network" as const),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: LOGIN_COPY.submit }));
    await waitFor(() => expect(canvas.getByRole("alert")).toHaveTextContent(LOGIN_COPY.network));
    await expect(args.onSubmit).toHaveBeenCalled();
    await expect(canvas.getByLabelText("Email")).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByLabelText("Password")).not.toHaveAttribute("aria-invalid", "true");
  },
};
