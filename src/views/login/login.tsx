import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { FieldDescriptionOrRequirement } from "@/components/ui/field-description-or-requirement";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { PageHeader } from "@/components/ui/page-header";

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
  logoHref?: string;
  logoLabel?: string;
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

function LoginMark() {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="size-(--primitives-spacing-3)"
      fill="currentColor"
    >
      <rect x="4" y="0" width="4" height="4" rx="2" />
      <rect x="4" y="4" width="4" height="4" rx="2" />
      <rect x="4" y="8" width="4" height="4" rx="2" />
      <path d="M0 4A4 4 0 0 1 4 0V6A2 2 0 0 1 2 8A2 2 0 0 1 0 6Z" />
      <path d="M8 6A2 2 0 0 1 10 4A2 2 0 0 1 12 6V8A4 4 0 0 1 8 12Z" />
      <path d="M4 8H2A2 2 0 0 0 2 12H4Z" />
      <path d="M8 0H10A2 2 0 0 1 12 2V2A2 2 0 0 1 10 4H8V0Z" />
    </svg>
  );
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

export function Login({
  className,
  defaultValues,
  appearance = "initial",
  onSubmit,
  logoHref = "#",
  logoLabel = "Home",
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
    <div
      data-slot="login"
      className={cn(
        "flex min-h-dvh w-full flex-col [background-color:var(--semantics-colors-background-page)]",
        className,
      )}
    >
      <header
        className={`sticky top-0 z-(--semantics-layer-navigation) flex w-full items-center
          [color:var(--semantics-colors-foreground-default)]
          [background-color:var(--semantics-colors-background-primary-blur)]
          [backdrop-filter:blur(var(--semantics-glass-navigation-frost))]
          px-(--primitives-spacing-2) py-(--primitives-spacing-out-of-scale-1-5)
          md:justify-center md:px-(--primitives-spacing-6)`}
      >
        <div className="flex w-full items-center md:max-w-(--primitives-max-width-max-w-2xl)">
          <a
            href={logoHref}
            aria-label={logoLabel}
            className={`relative inline-flex size-(--primitives-spacing-out-of-scale-9) shrink-0 items-center justify-center
              border-0 bg-transparent p-0 [color:inherit] outline-none
              md:h-(--primitives-spacing-8) md:w-auto md:px-(--primitives-spacing-1)
              after:pointer-events-none after:absolute after:hidden after:content-['']
              after:[inset:calc(-1*(var(--primitives-spacing-out-of-scale-0-75)+var(--primitives-ring-focus-width-ring-2)))]
              after:[border:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
              after:[border-radius:var(--primitives-radius-rounded-sm)]
              focus-visible:after:block`}
          >
            <span className="inline-flex size-(--primitives-spacing-4) items-center justify-center">
              <LoginMark />
            </span>
          </a>
        </div>
      </header>

      <div
        className={`flex w-full flex-1 flex-col items-center
          px-(--semantics-layout-mobile-grid-margin)
          md:px-(--primitives-spacing-8)`}
      >
        <div className="flex w-full max-w-(--semantics-layout-desktop-content-max-width) justify-center">
          <form
            noValidate
            className="flex w-full max-w-(--primitives-max-width-max-w-sm) flex-col items-center gap-(--primitives-spacing-10) md:max-w-(--primitives-max-width-max-w-md) md:gap-(--primitives-spacing-12)"
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

              {formError ? (
                <FieldDescriptionOrRequirement
                  id={formAlertId}
                  role="alert"
                  state="invalid"
                  showIcon={false}
                >
                  {formError}
                </FieldDescriptionOrRequirement>
              ) : null}
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
        </div>
      </div>
    </div>
  );
}
