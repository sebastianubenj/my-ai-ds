import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function LoginWordmark() {
  return (
    <div className="h-(--primitives-spacing-10) w-auto md:h-(--primitives-spacing-12)">
      <svg
        width="154.697"
        height="48"
        viewBox="0 0 154.697 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="my ai ds"
        className="h-full w-auto [color:var(--semantics-colors-foreground-default)]"
      >
        <path
          d="M0 13.2644L2.86282 11.4513H3.8171V17.4155C5.63022 13.1213 8.44533 10.6879 12.0716 10.6879C15.8887 10.6879 18.5606 13.4553 19.3241 18.0358C21.0895 13.3598 24.0477 10.6879 27.8171 10.6879C32.3976 10.6879 35.3082 14.6481 35.3082 20.994V35.3082H31.4911V20.994C31.4911 16.7475 29.9165 14.3618 27.1491 14.3618C22.2346 14.3618 19.5626 21.8529 19.5626 35.3082H15.7455V20.994C15.7455 16.7475 14.171 14.3618 11.4036 14.3618C6.48907 14.3618 3.8171 21.8529 3.8171 35.3082H0V13.2644Z"
          fill="currentColor"
        />
        <path
          d="M57.7709 36.0239C57.7709 43.3718 53.7152 48 47.3693 48C41.7391 48 38.256 44.326 38.256 38.4573H42.0731C42.0731 42.2266 44.1725 44.326 47.6556 44.326C51.7589 44.326 53.9538 41.3678 53.9538 36.0239V27.9125C52.1407 32.2068 49.2301 35.1173 45.5084 35.1173C41.1188 35.1173 38.2083 31.1571 38.2083 24.8111V13.2644L41.0711 11.4513H42.0253V24.8111C42.0253 29.0577 43.5999 31.4433 46.2719 31.4433C51.2341 31.4433 53.9538 23.1889 53.9538 13.4076V13.2644L56.8166 11.4513H57.7709V36.0239Z"
          fill="currentColor"
        />
        <path
          d="M91.6681 21.4235V33.495L88.8053 35.3082H87.851V28.5328C85.7516 33.3519 82.2685 36.0716 77.688 36.0716C73.1552 36.0716 70.1969 33.3519 70.1969 29.1531C70.1969 22.8549 76.8769 18.8469 87.4693 18.7038C86.6105 15.9841 84.4156 14.505 81.362 14.505C78.69 14.505 76.5429 15.6501 74.8729 17.6541L72.0101 15.173C74.3957 12.4056 77.8789 10.6879 81.6482 10.6879C87.5647 10.6879 91.6681 14.839 91.6681 21.4235ZM74.014 28.8191C74.014 31.1093 75.5409 32.3976 78.1174 32.3976C82.4594 32.3976 85.4176 28.8668 86.849 22.33C78.5946 22.5686 74.014 24.8588 74.014 28.8191Z"
          fill="currentColor"
        />
        <path
          d="M94.6521 13.2644L97.5149 11.4513H98.4692V35.3082H94.6521V13.2644ZM96.5606 7.15706C95.0815 7.15706 93.9364 6.01193 93.9364 4.5328C93.9364 3.05368 95.0815 1.90855 96.5606 1.90855C98.0398 1.90855 99.1849 3.05368 99.1849 4.5328C99.1849 6.01193 98.0398 7.15706 96.5606 7.15706Z"
          fill="currentColor"
        />
        <path
          d="M129.751 1.81312L132.614 0H133.569V35.3082H129.751V28.9622C127.843 33.495 124.837 36.0716 121.163 36.0716C115.342 36.0716 112.097 29.6779 112.097 23.0457C112.097 15.5547 116.249 10.6879 122.499 10.6879C125.314 10.6879 127.843 11.6421 129.751 13.2644V1.81312ZM115.915 22.9503C115.915 27.5785 117.823 32.3976 121.783 32.3976C125.648 32.3976 128.368 27.7217 129.37 19.0855C128.368 16.4135 125.791 14.505 122.547 14.505C118.396 14.505 115.915 17.6541 115.915 22.9503Z"
          fill="currentColor"
        />
        <path
          d="M149.925 19.0855C149.925 15.841 147.921 14.0278 144.963 14.0278C141.957 14.0278 140.621 15.8887 140.621 17.3201C140.621 21.9483 154.697 20.326 154.697 28.5328C154.697 32.5408 151.309 36.0716 145.536 36.0716C139.715 36.0716 135.85 32.4453 135.85 26.672H139.667C139.667 30.5368 141.957 32.7316 145.583 32.7316C149.162 32.7316 150.88 30.6322 150.88 28.8191C150.88 23.6183 136.804 25.002 136.804 17.4155C136.804 13.8847 139.81 10.6879 145.011 10.6879C150.212 10.6879 153.743 13.9324 153.743 19.0855H149.925Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function LoginPattern() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center px-(--primitives-spacing-6) py-(--primitives-spacing-4) gap-(--primitives-spacing-10) md:p-(--primitives-spacing-6) md:gap-(--primitives-spacing-28-5) [background-color:var(--semantics-colors-background-default)]"
    >
      <LoginWordmark />

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
              <a
                href="#"
                className={`shrink-0 text-right underline font-sans
                  [font-weight:var(--semantics-typography-label-font-weight)]
                  text-(length:--semantics-typography-label-label-md-font-size)
                  leading-(--semantics-typography-label-label-md-lh-snug)
                  tracking-(--semantics-typography-label-label-md-tracking-0-125)
                  [color:var(--semantics-colors-foreground-default)]`}
              >
                Forgot password?
              </a>
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
            <a href="#" className="underline">
              Sign up
            </a>
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
