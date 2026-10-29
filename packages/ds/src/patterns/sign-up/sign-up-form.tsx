import * as React from "react";

import { Button } from "#/components/ui/button";
import { Field } from "#/components/ui/field";
import { FieldDescriptionOrRequirement } from "#/components/ui/field-description-or-requirement";
import { FormAlert } from "#/components/ui/form-alert";
import { Input } from "#/components/ui/input";
import { Link } from "#/components/ui/link";
import { PageHeader } from "#/components/ui/page-header";
import { cn } from "#/lib/utils";

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
  network: "Something went wrong. Please try again.",
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

export type RegisterSubmitResult = "success" | "network";

export type RegisterAppearance =
  | "initial"
  | "requirements-met"
  | "validation-errors"
  | "compromised"
  | "submitting"
  | "network";

export interface RegisterProps {
  className?: string;
  defaultValues?: Partial<RegisterValues>;
  /**
   * Story fixture. Seeds values and visual state for the Figma frames.
   * A product screen omits this and drives the form from user input.
   */
  appearance?: RegisterAppearance;
  checkCompromisedPassword?: CheckCompromisedPassword;
  onSubmit?: (
    values: RegisterValues,
  ) => Promise<RegisterSubmitResult | void> | RegisterSubmitResult | void;
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

  if (
    appearance === "compromised" ||
    appearance === "submitting" ||
    appearance === "network"
  ) {
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

export function SignUpForm({
  className,
  defaultValues,
  appearance = "initial",
  checkCompromisedPassword,
  onSubmit,
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
  const formAlertId = `${id}-form-alert`;
  const [submitted, setSubmitted] = React.useState(
    appearance === "validation-errors" ||
      appearance === "compromised" ||
      appearance === "submitting" ||
      appearance === "network",
  );
  const [submitting, setSubmitting] = React.useState(appearance === "submitting");
  const [formError, setFormError] = React.useState<string | undefined>(
    appearance === "network" ? REGISTER_COPY.network : undefined,
  );
  const [leakedResult, setLeakedResult] = React.useState<CompromisedPasswordResult | null>(
    appearance === "compromised"
      ? "compromised"
      : appearance === "submitting" || appearance === "network"
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
    setFormError(undefined);
    setErrors((current) => ({
      ...current,
      confirm: confirmError(password, value, submitted || value.length > 0),
    }));
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setFormError(undefined);
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
    setFormError(undefined);

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
      const result = await onSubmit?.({ name, email, password, confirmPassword });
      if (result === "network") {
        setFormError(REGISTER_COPY.network);
      }
    } catch {
      setFormError(REGISTER_COPY.network);
    } finally {
      setSubmitting(false);
      submitLock.current = false;
    }
  }

  return (
          <form
            data-slot="sign-up-form"
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
            <PageHeader title="Create your account" description="Get started with your account." />

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
                  setFormError(undefined);
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
                  setFormError(undefined);
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
  );
}
