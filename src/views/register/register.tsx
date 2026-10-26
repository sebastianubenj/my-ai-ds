import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FieldDescriptionOrRequirement } from "@/components/ui/field-description-or-requirement";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";

const NAME_MAX_LENGTH = 100;
const PASSWORD_MIN_LENGTH = 15;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// eslint-disable-next-line react-refresh/only-export-components -- stories assert the same copy the view renders.
export const REGISTER_COPY = {
  nameRequired: "Enter your full name.",
  emailRequired: "Enter your email address.",
  emailInvalid: "Enter a valid email address.",
  lengthRequirement: "At least 15 characters",
  leakedRequirement: "Not a commonly used or compromised password",
  leakedMessage:
    "This password has appeared in a data breach. Choose a different password.",
  leakedUnavailable: "We couldn’t check this password right now. Please try again.",
  confirmRequired: "Confirm your password.",
  confirmMismatch: "Passwords don’t match.",
  submit: "Create account",
  submitting: "Creating account…",
} as const;

export type CompromisedPasswordResult = "clear" | "compromised" | "unavailable";

export type CheckCompromisedPassword = (
  password: string,
) => Promise<CompromisedPasswordResult>;

export interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type RegisterAppearance =
  | "initial"
  | "requirements-met"
  | "validation-errors"
  | "compromised"
  | "submitting";

export interface RegisterProps {
  className?: string;
  defaultValues?: Partial<RegisterValues>;
  /**
   * Story fixture. Seeds values and visual state for the five Figma frames.
   * A product screen omits this and drives the form from user input.
   */
  appearance?: RegisterAppearance;
  checkCompromisedPassword?: CheckCompromisedPassword;
  onSubmit?: (values: RegisterValues) => Promise<void> | void;
  logoHref?: string;
  logoLabel?: string;
  loginHref?: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  confirm?: string;
}

function valuesForAppearance(
  appearance: RegisterAppearance,
  defaults?: Partial<RegisterValues>,
): RegisterValues {
  const base: RegisterValues = {
    name: defaults?.name ?? "",
    email: defaults?.email ?? "",
    password: defaults?.password ?? "",
    confirmPassword: defaults?.confirmPassword ?? "",
  };

  if (appearance === "requirements-met") {
    return { ...base, password: defaults?.password ?? "abcdefghijklmnop" };
  }

  if (appearance === "validation-errors") {
    return {
      name: defaults?.name ?? "",
      email: defaults?.email ?? "name@",
      password: defaults?.password ?? "shortpwd",
      confirmPassword: defaults?.confirmPassword ?? "",
    };
  }

  if (appearance === "compromised" || appearance === "submitting") {
    const password = defaults?.password ?? "abcdefghijklmnop";
    return {
      name: defaults?.name ?? "John Doe",
      email: defaults?.email ?? "example@example.com",
      password,
      confirmPassword: defaults?.confirmPassword ?? password,
    };
  }

  return base;
}

function nameError(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return REGISTER_COPY.nameRequired;
  if (name.length > NAME_MAX_LENGTH) return REGISTER_COPY.nameRequired;
  return undefined;
}

function emailError(email: string, emptyMessage: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return emptyMessage;
  if (!EMAIL_PATTERN.test(trimmed)) return REGISTER_COPY.emailInvalid;
  return undefined;
}

function confirmError(
  password: string,
  confirmPassword: string,
  submitted: boolean,
): string | undefined {
  if (!confirmPassword) {
    return submitted ? REGISTER_COPY.confirmRequired : undefined;
  }
  if (confirmPassword !== password) return REGISTER_COPY.confirmMismatch;
  return undefined;
}

function RegisterMark() {
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
  confirm,
  onToggle,
}: {
  visible: boolean;
  confirm?: boolean;
  onToggle: () => void;
}) {
  const hide = confirm ? "Hide confirm password" : "Hide password";
  const show = confirm ? "Show confirm password" : "Show password";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      icon={visible ? "eye-off" : "eye"}
      aria-label={visible ? hide : show}
      className="hover:[background-color:transparent] [&_svg]:![color:var(--semantics-colors-foreground-default)]"
      onClick={onToggle}
    />
  );
}

export function Register({
  className,
  defaultValues,
  appearance = "initial",
  checkCompromisedPassword,
  onSubmit,
  logoHref = "#",
  logoLabel = "Home",
  loginHref = "#",
}: RegisterProps) {
  const id = React.useId();
  const nameId = `${id}-name`;
  const emailId = `${id}-email`;
  const passwordId = `${id}-password`;
  const confirmId = `${id}-confirm`;

  const seeded = valuesForAppearance(appearance, defaultValues);
  const [name, setName] = React.useState(seeded.name);
  const [email, setEmail] = React.useState(seeded.email);
  const [password, setPassword] = React.useState(seeded.password);
  const [confirmPassword, setConfirmPassword] = React.useState(seeded.confirmPassword);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(
    appearance === "validation-errors" ||
      appearance === "compromised" ||
      appearance === "submitting",
  );
  const [submitting, setSubmitting] = React.useState(appearance === "submitting");
  const [leakedResult, setLeakedResult] = React.useState<CompromisedPasswordResult | null>(
    appearance === "compromised"
      ? "compromised"
      : appearance === "submitting"
        ? "clear"
        : null,
  );
  const [errors, setErrors] = React.useState<FieldErrors>(() => {
    if (appearance !== "validation-errors") return {};
    return {
      name: nameError(seeded.name),
      email: emailError(seeded.email, REGISTER_COPY.emailInvalid),
      confirm: confirmError(seeded.password, seeded.confirmPassword, true),
    };
  });

  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmRef = React.useRef<HTMLInputElement>(null);
  const submitLock = React.useRef(false);

  const showChecklist = password.length > 0;
  const lengthMet = password.length >= PASSWORD_MIN_LENGTH;
  const lengthInvalid = submitted && password.length > 0 && !lengthMet;
  const lengthState = lengthMet ? "met" : lengthInvalid ? "invalid" : "pending";
  const leakedState =
    leakedResult === "compromised" ? "invalid" : leakedResult === "clear" ? "met" : "pending";
  const passwordInvalid =
    (submitted && !lengthMet) || leakedResult === "compromised";

  const nameDescribedBy = errors.name ? `${nameId}-description` : undefined;
  const emailDescribedBy = errors.email ? `${emailId}-description` : undefined;
  const passwordDescribedBy = showChecklist ? `${passwordId}-description` : undefined;
  const confirmDescribedBy = errors.confirm ? `${confirmId}-description` : undefined;

  function focusFirstInvalid(next: {
    name?: string;
    email?: string;
    password?: boolean;
    confirm?: string;
  }) {
    if (next.name) {
      nameRef.current?.focus();
      return;
    }
    if (next.email) {
      emailRef.current?.focus();
      return;
    }
    if (next.password) {
      passwordRef.current?.focus();
      return;
    }
    if (next.confirm) {
      confirmRef.current?.focus();
    }
  }

  function handleNameBlur() {
    const next = nameError(name);
    setErrors((current) => ({ ...current, name: next }));
  }

  function handleEmailBlur() {
    const next = emailError(email, REGISTER_COPY.emailRequired);
    setErrors((current) => ({ ...current, email: next }));
  }

  function handleConfirmChange(value: string) {
    setConfirmPassword(value);
    setErrors((current) => ({
      ...current,
      confirm: confirmError(password, value, submitted || value.length > 0),
    }));
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setLeakedResult(null);
    setErrors((current) => ({
      ...current,
      confirm: confirmError(value, confirmPassword, submitted || confirmPassword.length > 0),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || submitting) return;

    setSubmitted(true);

    const nextName = nameError(name);
    const nextEmail = emailError(email, REGISTER_COPY.emailRequired);
    const nextConfirm = confirmError(password, confirmPassword, true);
    const passwordBlocked = !lengthMet;

    setErrors({ name: nextName, email: nextEmail, confirm: nextConfirm });

    if (nextName || nextEmail || passwordBlocked || nextConfirm) {
      focusFirstInvalid({
        name: nextName,
        email: nextEmail,
        password: passwordBlocked,
        confirm: nextConfirm,
      });
      return;
    }

    submitLock.current = true;

    if (checkCompromisedPassword) {
      try {
        const result = await checkCompromisedPassword(password);
        setLeakedResult(result);
        if (result !== "clear") {
          submitLock.current = false;
          passwordRef.current?.focus();
          return;
        }
      } catch {
        setLeakedResult("unavailable");
        submitLock.current = false;
        passwordRef.current?.focus();
        return;
      }
    }

    setSubmitting(true);

    try {
      await onSubmit?.({ name, email, password, confirmPassword });
    } finally {
      setSubmitting(false);
      submitLock.current = false;
    }
  }

  return (
    <div
      data-slot="register"
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
              <RegisterMark />
            </span>
          </a>
        </div>
      </header>

      <div
        className={`flex w-full flex-1 flex-col items-center
          px-(--primitives-spacing-6) py-(--primitives-spacing-4)
          md:px-(--primitives-spacing-16) md:pt-(--primitives-spacing-4)`}
      >
        <form
          noValidate
          className="flex w-full max-w-sm flex-col items-center gap-(--primitives-spacing-10) md:gap-(--primitives-spacing-12)"
          onSubmit={(event) => {
            void handleSubmit(event);
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

            <Field
              label="Full name"
              htmlFor={nameId}
              error={Boolean(errors.name)}
              description={errors.name}
            >
              <Input
                id={nameId}
                ref={nameRef}
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={name}
                error={Boolean(errors.name)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={nameDescribedBy}
                onChange={(event) => {
                  const value = event.target.value;
                  setName(value);
                  setErrors((current) =>
                    current.name !== undefined || submitted
                      ? { ...current, name: nameError(value) }
                      : current,
                  );
                }}
                onBlur={handleNameBlur}
              />
            </Field>

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
                onChange={(event) => {
                  const value = event.target.value;
                  setEmail(value);
                  setErrors((current) => ({
                    ...current,
                    email: current.email ? emailError(value, REGISTER_COPY.emailRequired) : undefined,
                  }));
                }}
                onBlur={handleEmailBlur}
              />
            </Field>

            <Field
              label="Password"
              htmlFor={passwordId}
              description={
                showChecklist ? (
                  <>
                    <FieldDescriptionOrRequirement state={lengthState}>
                      {REGISTER_COPY.lengthRequirement}
                    </FieldDescriptionOrRequirement>
                    <FieldDescriptionOrRequirement
                      state={leakedState}
                      icon={leakedState === "pending" ? "circle" : undefined}
                    >
                      {REGISTER_COPY.leakedRequirement}
                    </FieldDescriptionOrRequirement>
                    {leakedResult === "compromised" ? (
                      <FieldDescriptionOrRequirement showIcon={false} state="invalid">
                        {REGISTER_COPY.leakedMessage}
                      </FieldDescriptionOrRequirement>
                    ) : null}
                    {leakedResult === "unavailable" ? (
                      <FieldDescriptionOrRequirement showIcon={false} state="pending">
                        {REGISTER_COPY.leakedUnavailable}
                      </FieldDescriptionOrRequirement>
                    ) : null}
                  </>
                ) : undefined
              }
            >
              <Input
                id={passwordId}
                ref={passwordRef}
                type={passwordVisible ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                error={passwordInvalid}
                aria-invalid={passwordInvalid}
                aria-describedby={passwordDescribedBy}
                onChange={(event) => handlePasswordChange(event.target.value)}
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

            <Field
              label="Confirm your password"
              htmlFor={confirmId}
              error={Boolean(errors.confirm)}
              description={errors.confirm}
            >
              <Input
                id={confirmId}
                ref={confirmRef}
                type={confirmVisible ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                error={Boolean(errors.confirm)}
                aria-invalid={Boolean(errors.confirm)}
                aria-describedby={confirmDescribedBy}
                onChange={(event) => handleConfirmChange(event.target.value)}
                trailing={
                  confirmPassword ? (
                    <PasswordVisibilityButton
                      visible={confirmVisible}
                      confirm
                      onToggle={() => setConfirmVisible((visible) => !visible)}
                    />
                  ) : undefined
                }
              />
            </Field>
          </div>

          <div className="flex w-full flex-col items-center gap-(--primitives-spacing-6)">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={submitting}
            >
              {submitting ? REGISTER_COPY.submitting : REGISTER_COPY.submit}
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
                href={loginHref}
                className="[color:var(--semantics-colors-foreground-highlight)]"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
