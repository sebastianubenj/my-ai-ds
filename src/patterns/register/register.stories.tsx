import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";

function RegisterPattern() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);

  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center justify-center px-(--primitives-spacing-6) py-(--primitives-spacing-4) md:p-(--primitives-spacing-6) [background-color:var(--semantics-colors-background-page)]"
    >
      <form
        className="flex w-full max-w-sm flex-col items-center gap-(--primitives-spacing-10) md:gap-(--primitives-spacing-12)"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
          <div
            className="flex w-full flex-col items-start gap-(--primitives-spacing-6) md:gap-(--primitives-spacing-8) [color:var(--semantics-colors-foreground-default)]"
          >
            <h1
              className={`m-0 w-full text-center font-sans
                [font-weight:var(--semantics-typography-display-font-weight)]
                text-(length:--semantics-typography-display-display-sm-font-size)
                leading-(--semantics-typography-display-display-sm-lh-tighter)
                tracking-(--semantics-typography-display-display-sm-tracking-tight)`}
            >
              Create your account
            </h1>
            <p
              className={`m-0 w-full font-sans
                [font-weight:var(--semantics-typography-heading-font-weight)]
                text-(length:--semantics-typography-heading-heading-xl-font-size)
                leading-(--semantics-typography-heading-heading-xl-lh-tight)
                tracking-(--semantics-typography-heading-heading-xl-tracking-tight)`}
            >
              Get started with your account
            </p>
          </div>

          <Field label="Full name" htmlFor="register-name">
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Field label="Email" htmlFor="register-email">
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>

          <Field label="Password" htmlFor="register-password">
            <Input
              id="register-password"
              type={passwordVisible ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              trailing={
                password ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    icon={passwordVisible ? "eye-off" : "eye"}
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                    className="hover:[background-color:transparent] [&_svg]:![color:var(--semantics-colors-foreground-default)]"
                    onClick={() => setPasswordVisible((visible) => !visible)}
                  />
                ) : undefined
              }
            />
          </Field>

          <Field label="Confirm your password" htmlFor="register-confirm-password">
            <Input
              id="register-confirm-password"
              type={confirmPasswordVisible ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              trailing={
                confirmPassword ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    icon={confirmPasswordVisible ? "eye-off" : "eye"}
                    aria-label={
                      confirmPasswordVisible
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="hover:[background-color:transparent] [&_svg]:![color:var(--semantics-colors-foreground-default)]"
                    onClick={() =>
                      setConfirmPasswordVisible((visible) => !visible)
                    }
                  />
                ) : undefined
              }
            />
          </Field>
        </div>

        <div className="flex w-full flex-col items-center gap-(--primitives-spacing-6)">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Create account
          </Button>
          <p
            className={`m-0 flex w-full items-start justify-center gap-(--primitives-spacing-1)
              font-sans [font-weight:var(--semantics-typography-button-font-weight)]
              text-(length:--semantics-typography-button-button-xl-font-size)
              leading-(--semantics-typography-button-button-xl-lh-snug)
              tracking-(--semantics-typography-button-tracking-normal)
              [color:var(--semantics-colors-foreground-default)]`}
          >
            <span>Already have an account?</span>
            <Link
              href="#"
              className="[color:var(--semantics-colors-foreground-highlight)]"
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

const meta = {
  title: "Patterns/Register",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <RegisterPattern />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByLabelText("Full name");
    const email = canvas.getByLabelText("Email");
    const password = canvas.getByLabelText("Password");
    const confirmPassword = canvas.getByLabelText("Confirm your password");
    const submit = canvas.getByRole("button", { name: "Create account" });

    await expect(name).toHaveAttribute("type", "text");
    await expect(name).toHaveAttribute("autocomplete", "name");
    await expect(email).toHaveAttribute("type", "email");
    await expect(email).toHaveAttribute("autocomplete", "email");
    await expect(password).toHaveAttribute("type", "password");
    await expect(password).toHaveAttribute("autocomplete", "new-password");
    await expect(confirmPassword).toHaveAttribute("type", "password");
    await expect(confirmPassword).toHaveAttribute("autocomplete", "new-password");
    await expect(submit).toHaveAttribute("type", "submit");
    await expect(canvas.queryByRole("button", { name: "Show password" })).not.toBeInTheDocument();
    await expect(
      canvas.queryByRole("button", { name: "Show confirm password" }),
    ).not.toBeInTheDocument();

    await userEvent.click(password);
    await userEvent.type(password, "secret");
    const toggle = canvas.getByRole("button", { name: "Show password" });

    await expect(toggle).toHaveAttribute("type", "button");
    await expect(password).toHaveAttribute("type", "password");

    await userEvent.click(toggle);
    await expect(password).toHaveAttribute("type", "text");
    await expect(canvas.getByRole("button", { name: "Hide password" })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Hide password" }));
    await expect(password).toHaveAttribute("type", "password");
    await expect(canvas.getByRole("button", { name: "Show password" })).toBeInTheDocument();

    await userEvent.click(confirmPassword);
    await userEvent.type(confirmPassword, "secret");
    const confirmToggle = canvas.getByRole("button", {
      name: "Show confirm password",
    });

    await expect(confirmToggle).toHaveAttribute("type", "button");
    await userEvent.click(confirmToggle);
    await expect(confirmPassword).toHaveAttribute("type", "text");
    await expect(
      canvas.getByRole("button", { name: "Hide confirm password" }),
    ).toBeInTheDocument();
  },
};
