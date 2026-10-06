import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";

function LoginPattern() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center justify-center px-(--primitives-spacing-6) py-(--primitives-spacing-4) md:px-(--primitives-spacing-16) md:py-0 [background-color:var(--semantics-colors-background-page)]"
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
              Welcome back
            </h1>
            <p
              className={`m-0 w-full font-sans
                [font-weight:var(--semantics-typography-heading-font-weight)]
                text-(length:--semantics-typography-heading-heading-xl-font-size)
                leading-(--semantics-typography-heading-heading-xl-lh-tight)
                tracking-(--semantics-typography-heading-heading-xl-tracking-tight)`}
            >
              Sign in to your account
            </p>
          </div>

          <Field label="Email" htmlFor="login-email">
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>

          <div className="flex w-full flex-col items-start gap-(--primitives-spacing-2)">
            <Field label="Password" htmlFor="login-password">
              <Input
                id="login-password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
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

            <div className="flex w-full items-center justify-between">
              <Checkbox>Remember me</Checkbox>
              <span
                className={`shrink-0 text-right font-sans
                  [font-weight:var(--semantics-typography-label-font-weight)]
                  text-(length:--semantics-typography-label-label-md-font-size)
                  leading-(--semantics-typography-label-label-md-lh-snug)
                  tracking-(--semantics-typography-label-label-md-tracking-0-125)
                  [color:var(--semantics-colors-foreground-default)]`}
              >
                <Link
                  href="#"
                  className="[color:var(--semantics-colors-foreground-highlight)]"
                >
                  Forgot password?
                </Link>
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-(--primitives-spacing-6)">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Log in
          </Button>
          <p
            className={`m-0 flex w-full items-start justify-center gap-(--primitives-spacing-1)
              font-sans [font-weight:var(--semantics-typography-button-font-weight)]
              text-(length:--semantics-typography-button-button-xl-font-size)
              leading-(--semantics-typography-button-button-xl-lh-snug)
              tracking-(--semantics-typography-button-tracking-normal)
              [color:var(--semantics-colors-foreground-default)]`}
          >
            <span>Don’t have an account?</span>
            <Link
              href="#"
              className="[color:var(--semantics-colors-foreground-highlight)]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

const meta = {
  title: "Patterns/Login",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <LoginPattern />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Email");
    const password = canvas.getByLabelText("Password");
    const submit = canvas.getByRole("button", { name: "Log in" });

    await expect(email).toHaveAttribute("type", "email");
    await expect(email).toHaveAttribute("autocomplete", "email");
    await expect(password).toHaveAttribute("type", "password");
    await expect(password).toHaveAttribute("autocomplete", "current-password");
    await expect(submit).toHaveAttribute("type", "submit");
    await expect(canvas.queryByRole("button", { name: "Show password" })).not.toBeInTheDocument();

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
  },
};
