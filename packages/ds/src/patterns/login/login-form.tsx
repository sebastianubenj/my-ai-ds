import * as React from "react";

import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { Field } from "#/components/ui/field";
import { FormAlert } from "#/components/ui/form-alert";
import { Input } from "#/components/ui/input";
import { Link } from "#/components/ui/link";
import { PageHeader } from "#/components/ui/page-header";
import { cn } from "#/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// eslint-disable-next-line react-refresh/only-export-components -- stories assert the same copy the view renders.
export const LOGIN_COPY = {
  emailRequired: "Enter your email address.",
  emailInvalid: "Enter a valid email address.",
  passwordRequired: "Enter your password.",
  invalidCredentials: "Invalid email or password. Please try again.",
  network: "Something went wrong. Please try again.",
  submit: "Log in",
  submitting: "Logging in…",
} as const;

export type LoginSubmitResult = "success" | "invalid-credentials" | "network";

export interface LoginValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type LoginAppearance =
  | "initial"
  | "invalid-email"
  | "required-fields"
  | "invalid-credentials"
  | "submitting";

export interface LoginProps {
  className?: string;
  defaultValues?: Partial<LoginValues>;
  /**
   * Story fixture. Seeds values and visual state for the Figma frames.
   * A product screen omits this and drives the form from user input.
   */
  appearance?: LoginAppearance;
  onSubmit?: (
    values: LoginValues,
  ) => Promise<LoginSubmitResult | void> | LoginSubmitResult | void;
  forgotPasswordHref?: string;
  signUpHref?: string;
}

interface FieldErrors {
  email?: string;
  password?: string;
}

function valuesForAppearance(
  appearance: LoginAppearance,
  defaults?: Partial<LoginValues>,
): LoginValues {
  const base: LoginValues = {
    email: defaults?.email ?? "",
    password: defaults?.password ?? "",
    rememberMe: defaults?.rememberMe ?? false,
  };

  if (appearance === "invalid-email") {
    return { ...base, email: defaults?.email ?? "sebastian@" };
  }

  if (appearance === "invalid-credentials" || appearance === "submitting") {
    return {
      email: defaults?.email ?? "johndoe@example.com",
      password: defaults?.password ?? "abcdefghijklmnop",
      rememberMe: defaults?.rememberMe ?? false,
    };
  }

  return base;
}

function emailError(email: string, emptyMessage: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return emptyMessage;
  if (!EMAIL_PATTERN.test(trimmed)) return LOGIN_COPY.emailInvalid;
  return undefined;
}

function passwordError(password: string): string | undefined {
  if (!password) return LOGIN_COPY.passwordRequired;
  return undefined;
}

function PasswordVisibilityButton({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      icon={visible ? "eye-off" : "eye"}
      aria-label={visible ? "Hide password" : "Show password"}
      className="hover:[background-color:transparent] [&_svg]:![color:var(--semantics-colors-foreground-default)]"
      onClick={onToggle}
    />
  );
}

export function LoginForm({
  className,
  defaultValues,
  appearance = "initial",
  onSubmit,
  forgotPasswordHref = "#",
  signUpHref = "#",
}: LoginProps) {
  const id = React.useId();
  const emailId = `${id}-email`;
  const passwordId = `${id}-password`;
  const formAlertId = `${id}-form-alert`;

  const seeded = valuesForAppearance(appearance, defaultValues);
  const [email, setEmail] = React.useState(seeded.email);
  const [password, setPassword] = React.useState(seeded.password);
  const [rememberMe, setRememberMe] = React.useState(seeded.rememberMe);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(
    appearance === "invalid-email" ||
      appearance === "required-fields" ||
      appearance === "invalid-credentials" ||
      appearance === "submitting",
  );
  const [submitting, setSubmitting] = React.useState(appearance === "submitting");
  const [formError, setFormError] = React.useState<string | undefined>(
    appearance === "invalid-credentials" ? LOGIN_COPY.invalidCredentials : undefined,
  );
  const [errors, setErrors] = React.useState<FieldErrors>(() => {
    if (appearance === "invalid-email") {
      return { email: emailError(seeded.email, LOGIN_COPY.emailInvalid) };
    }
    if (appearance === "required-fields") {
      return {
        email: emailError(seeded.email, LOGIN_COPY.emailRequired),
        password: passwordError(seeded.password),
      };
    }
    return {};
  });

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const submitLock = React.useRef(false);

  const emailDescribedBy = errors.email ? `${emailId}-description` : undefined;
  const passwordDescribedBy = errors.password ? `${passwordId}-description` : undefined;

  function focusFirstInvalid(next: FieldErrors) {
    if (next.email) {
      emailRef.current?.focus();
      return;
    }
    if (next.password) {
      passwordRef.current?.focus();
    }
  }

  function handleEmailBlur() {
    const next = emailError(email, LOGIN_COPY.emailRequired);
    setErrors((current) => ({ ...current, email: next }));
  }

  function handlePasswordBlur() {
    const next = passwordError(password);
    setErrors((current) => ({ ...current, password: next }));
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    setFormError(undefined);
    setErrors((current) => ({
      ...current,
      email: current.email ? emailError(value, LOGIN_COPY.emailRequired) : undefined,
    }));
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setFormError(undefined);
    setErrors((current) => ({
      ...current,
      password: current.password || submitted ? passwordError(value) : undefined,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || submitting) return;

    setSubmitted(true);
    setFormError(undefined);

    const nextEmail = emailError(email, LOGIN_COPY.emailRequired);
    const nextPassword = passwordError(password);
    const nextErrors = { email: nextEmail, password: nextPassword };

    setErrors(nextErrors);

    if (nextEmail || nextPassword) {
      focusFirstInvalid(nextErrors);
      return;
    }

    submitLock.current = true;
    setSubmitting(true);

    try {
      const result = await onSubmit?.({ email, password, rememberMe });
      if (result === "invalid-credentials") {
        setFormError(LOGIN_COPY.invalidCredentials);
      } else if (result === "network") {
        setFormError(LOGIN_COPY.network);
      }
    } catch {
      setFormError(LOGIN_COPY.network);
    } finally {
      setSubmitting(false);
      submitLock.current = false;
    }
  }

  return (
          <form
            data-slot="login-form"
            noValidate
            className={cn(
              "flex w-full max-w-(--primitives-max-width-max-w-sm) flex-col items-center gap-(--primitives-spacing-10) md:max-w-(--primitives-max-width-max-w-md) md:gap-(--primitives-spacing-12)",
              className,
            )}
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
            <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
              <PageHeader title="Welcome back" description="Sign in to your account." />

              <Field
                label="Email"
                htmlFor={emailId}
                error={Boolean(errors.email)}
                description={errors.email}
              >
                <Input
                  id={emailId}
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  error={Boolean(errors.email)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={emailDescribedBy}
                  onChange={(event) => handleEmailChange(event.target.value)}
                  onBlur={handleEmailBlur}
                />
              </Field>

              <div className="flex w-full flex-col items-start gap-(--primitives-spacing-2)">
                <Field
                  label="Password"
                  htmlFor={passwordId}
                  error={Boolean(errors.password)}
                  description={errors.password}
                >
                  <Input
                    id={passwordId}
                    ref={passwordRef}
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    error={Boolean(errors.password)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={passwordDescribedBy}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    onBlur={handlePasswordBlur}
                    trailing={
                      password ? (
                        <PasswordVisibilityButton
                          visible={passwordVisible}
                          onToggle={() => setPasswordVisible((visible) => !visible)}
                        />
                      ) : undefined
                    }
                  />
                </Field>

                <div className="flex w-full items-center justify-between">
                  <Checkbox
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  >
                    Remember me
                  </Checkbox>
                  <span
                    className={`shrink-0 text-right font-sans
                      [font-weight:var(--semantics-typography-label-font-weight)]
                      text-(length:--semantics-typography-label-label-md-font-size)
                      leading-(--semantics-typography-label-label-md-lh-snug)
                      tracking-(--semantics-typography-label-label-md-tracking-0-125)
                      [color:var(--semantics-colors-foreground-default)]`}
                  >
                    <Link
                      href={forgotPasswordHref}
                      className="[color:var(--semantics-colors-foreground-highlight)]"
                    >
                      Forgot password?
                    </Link>
                  </span>
                </div>
              </div>

              {formError ? <FormAlert id={formAlertId}>{formError}</FormAlert> : null}
            </div>

            <div className="flex w-full flex-col items-center gap-(--primitives-spacing-6)">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={submitting}
              >
                {submitting ? LOGIN_COPY.submitting : LOGIN_COPY.submit}
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
                  href={signUpHref}
                  className="[color:var(--semantics-colors-foreground-highlight)]"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
  );
}
