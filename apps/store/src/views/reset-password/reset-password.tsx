import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FieldDescriptionOrRequirement } from "@/components/ui/field-description-or-requirement";
import { FormAlert } from "@/components/ui/form-alert";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { PageHeader } from "@/components/ui/page-header";
import { AuthLayout } from "@/views/auth-layout";

const PASSWORD_MIN_LENGTH = 15;

// eslint-disable-next-line react-refresh/only-export-components -- stories assert the same copy the view renders.
export const RESET_PASSWORD_COPY = {
  title: "Set a new password",
  description: "Enter and confirm your new password.",
  lengthRequirement: "At least 15 characters",
  leakedRequirement: "Not a commonly used or compromised password",
  leakedMessage:
    "This password has appeared in a data breach. Choose a different password.",
  leakedUnavailable: "We couldn’t check this password right now. Please try again.",
  confirmRequired: "Confirm your password.",
  confirmMismatch: "Passwords don’t match.",
  network: "Something went wrong. Please try again.",
  submit: "Update password",
  submitting: "Updating...",
  useDifferentEmail: "Use a different email",
  backToLogin: "Back to log in",
} as const;

export type CompromisedPasswordResult = "clear" | "compromised" | "unavailable";

export type CheckCompromisedPassword = (
  password: string,
) => Promise<CompromisedPasswordResult>;

export interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

export type ResetPasswordSubmitResult = "success" | "network";

export type ResetPasswordAppearance =
  | "initial"
  | "requirements-met"
  | "validation-errors"
  | "compromised"
  | "submitting"
  | "network";

export interface ResetPasswordProps {
  className?: string;
  defaultValues?: Partial<ResetPasswordValues>;
  /**
   * Story fixture. Seeds values and visual state for the Figma frames.
   * A product screen omits this and drives the form from user input.
   */
  appearance?: ResetPasswordAppearance;
  checkCompromisedPassword?: CheckCompromisedPassword;
  onSubmit?: (
    values: ResetPasswordValues,
  ) => Promise<ResetPasswordSubmitResult | void> | ResetPasswordSubmitResult | void;
  logoHref?: string;
  logoLabel?: string;
  loginHref?: string;
  forgotPasswordHref?: string;
}

function valuesForAppearance(
  appearance: ResetPasswordAppearance,
  defaults?: Partial<ResetPasswordValues>,
): ResetPasswordValues {
  const base: ResetPasswordValues = {
    password: defaults?.password ?? "",
    confirmPassword: defaults?.confirmPassword ?? "",
  };

  if (appearance === "requirements-met") {
    return { ...base, password: defaults?.password ?? "abcdefghijklmnop" };
  }

  if (appearance === "validation-errors") {
    return {
      password: defaults?.password ?? "shortpwd",
      confirmPassword: defaults?.confirmPassword ?? "",
    };
  }

  if (appearance === "compromised" || appearance === "submitting" || appearance === "network") {
    const password = defaults?.password ?? "abcdefghijklmnop";
    return {
      password,
      confirmPassword: defaults?.confirmPassword ?? password,
    };
  }

  return base;
}

function confirmError(
  password: string,
  confirmPassword: string,
  submitted: boolean,
): string | undefined {
  if (!confirmPassword) {
    return submitted ? RESET_PASSWORD_COPY.confirmRequired : undefined;
  }
  if (confirmPassword !== password) return RESET_PASSWORD_COPY.confirmMismatch;
  return undefined;
}

function PasswordVisibilityButton({
  visible,
  confirm,
  disabled,
  onToggle,
}: {
  visible: boolean;
  confirm?: boolean;
  disabled?: boolean;
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
      disabled={disabled}
      className="hover:[background-color:transparent] [&_svg]:![color:var(--semantics-colors-foreground-default)]"
      onClick={onToggle}
    />
  );
}

export function ResetPassword({
  className,
  defaultValues,
  appearance = "initial",
  checkCompromisedPassword,
  onSubmit,
  logoHref = "#",
  logoLabel = "Home",
  loginHref = "#",
  forgotPasswordHref = "#",
}: ResetPasswordProps) {
  const id = React.useId();
  const passwordId = `${id}-password`;
  const confirmId = `${id}-confirm`;

  const seeded = valuesForAppearance(appearance, defaultValues);
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
    appearance === "network" ? RESET_PASSWORD_COPY.network : undefined,
  );
  const [leakedResult, setLeakedResult] = React.useState<CompromisedPasswordResult | null>(
    appearance === "compromised"
      ? "compromised"
      : appearance === "submitting" || appearance === "network"
        ? "clear"
        : null,
  );
  const [errors, setErrors] = React.useState<{ confirm?: string }>(() => {
    if (appearance !== "validation-errors") return {};
    return {
      confirm: confirmError(seeded.password, seeded.confirmPassword, true),
    };
  });

  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmRef = React.useRef<HTMLInputElement>(null);
  const submitLock = React.useRef(false);

  const showChecklist = password.length > 0 || submitted;
  const lengthMet = password.length >= PASSWORD_MIN_LENGTH;
  const lengthInvalid = submitted && !lengthMet;
  const lengthState = lengthMet ? "met" : lengthInvalid ? "invalid" : "pending";
  const leakedState =
    leakedResult === "compromised" ? "invalid" : leakedResult === "clear" ? "met" : "pending";
  const passwordInvalid =
    (submitted && !lengthMet) || leakedResult === "compromised";

  const passwordDescribedBy = showChecklist ? `${passwordId}-description` : undefined;
  const confirmDescribedBy = errors.confirm ? `${confirmId}-description` : undefined;

  function focusFirstInvalid(next: { password?: boolean; confirm?: string }) {
    if (next.password) {
      passwordRef.current?.focus();
      return;
    }
    if (next.confirm) {
      confirmRef.current?.focus();
    }
  }

  function handleConfirmChange(value: string) {
    setConfirmPassword(value);
    setFormError(undefined);
    setErrors({
      confirm: confirmError(password, value, submitted || value.length > 0),
    });
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setFormError(undefined);
    setLeakedResult(null);
    setErrors({
      confirm: confirmError(value, confirmPassword, submitted || confirmPassword.length > 0),
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || submitting) return;

    setSubmitted(true);
    setFormError(undefined);

    const nextConfirm = confirmError(password, confirmPassword, true);
    const passwordBlocked = !lengthMet;

    setErrors({ confirm: nextConfirm });

    if (passwordBlocked || nextConfirm) {
      focusFirstInvalid({
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
      const result = await onSubmit?.({ password, confirmPassword });
      if (result === "network") {
        setFormError(RESET_PASSWORD_COPY.network);
      }
    } catch {
      setFormError(RESET_PASSWORD_COPY.network);
    } finally {
      setSubmitting(false);
      submitLock.current = false;
    }
  }

  return (
    <AuthLayout
      data-slot="reset-password"
      className={className}
      logoHref={logoHref}
      logoLabel={logoLabel}
    >
          <form
            noValidate
            className="flex w-full max-w-(--primitives-max-width-max-w-sm) flex-col items-center gap-(--primitives-spacing-10) md:max-w-(--primitives-max-width-max-w-md) md:gap-(--primitives-spacing-12)"
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
            <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
              <PageHeader
                title={RESET_PASSWORD_COPY.title}
                description={RESET_PASSWORD_COPY.description}
              />

              <Field
                label="Password"
                htmlFor={passwordId}
                description={
                  showChecklist ? (
                    <>
                      <FieldDescriptionOrRequirement state={lengthState}>
                        {RESET_PASSWORD_COPY.lengthRequirement}
                      </FieldDescriptionOrRequirement>
                      <FieldDescriptionOrRequirement
                        state={leakedState}
                        icon={leakedState === "pending" ? "circle" : undefined}
                      >
                        {RESET_PASSWORD_COPY.leakedRequirement}
                      </FieldDescriptionOrRequirement>
                      {leakedResult === "compromised" ? (
                        <FieldDescriptionOrRequirement showIcon={false} state="invalid">
                          {RESET_PASSWORD_COPY.leakedMessage}
                        </FieldDescriptionOrRequirement>
                      ) : null}
                      {leakedResult === "unavailable" ? (
                        <FieldDescriptionOrRequirement showIcon={false} state="pending">
                          {RESET_PASSWORD_COPY.leakedUnavailable}
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
                  disabled={submitting}
                  onChange={(event) => handlePasswordChange(event.target.value)}
                  trailing={
                    password ? (
                      <PasswordVisibilityButton
                        visible={passwordVisible}
                        disabled={submitting}
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
                  disabled={submitting}
                  onChange={(event) => handleConfirmChange(event.target.value)}
                  trailing={
                    confirmPassword ? (
                      <PasswordVisibilityButton
                        visible={confirmVisible}
                        confirm
                        disabled={submitting}
                        onToggle={() => setConfirmVisible((visible) => !visible)}
                      />
                    ) : undefined
                  }
                />
              </Field>

              {formError ? <FormAlert id={formAlertId}>{formError}</FormAlert> : null}
            </div>

            <div className="flex w-full flex-col items-start gap-(--primitives-spacing-6)">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={submitting}
              >
                {submitting ? RESET_PASSWORD_COPY.submitting : RESET_PASSWORD_COPY.submit}
              </Button>
              <a
                href={forgotPasswordHref}
                aria-disabled={submitting || undefined}
                tabIndex={submitting ? -1 : undefined}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full",
                  submitting && "pointer-events-none opacity-(--primitives-opacity-opacity-10)",
                )}
              >
                {RESET_PASSWORD_COPY.useDifferentEmail}
              </a>
              <p
                className={`m-0 flex w-full items-start justify-center
                  font-sans [font-weight:var(--semantics-typography-button-font-weight)]
                  text-(length:--semantics-typography-button-button-xl-font-size)
                  leading-(--semantics-typography-button-button-xl-lh-snug)
                  tracking-(--semantics-typography-button-tracking-normal)`}
              >
                <Link
                  href={loginHref}
                  className="[color:var(--semantics-colors-foreground-highlight)]"
                >
                  {RESET_PASSWORD_COPY.backToLogin}
                </Link>
              </p>
            </div>
          </form>
    </AuthLayout>
  );
}
