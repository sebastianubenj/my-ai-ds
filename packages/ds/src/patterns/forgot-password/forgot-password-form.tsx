import * as React from "react";

import { Button } from "#/components/ui/button";
import { Field } from "#/components/ui/field";
import { FormAlert } from "#/components/ui/form-alert";
import { Input } from "#/components/ui/input";
import { Link } from "#/components/ui/link";
import { PageHeader } from "#/components/ui/page-header";
import { cn } from "#/lib/utils";
import { CheckYourEmail } from "#/patterns/check-your-email/check-your-email";
import { FORGOT_PASSWORD_COPY } from "./forgot-password-copy";

export { FORGOT_PASSWORD_COPY };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ForgotPasswordWait = {
  type: "wait";
  /** Seconds until another email can be requested, when Supabase includes them. */
  seconds?: number;
};

export type ForgotPasswordSubmitResult = "success" | "network" | "wait" | ForgotPasswordWait;

export interface ForgotPasswordValues {
  email: string;
}

export type ForgotPasswordAppearance =
  | "initial"
  | "invalid-email"
  | "required"
  | "submitting"
  | "sent"
  | "sent-wait"
  | "sent-network";

export type ForgotPasswordStep = "request" | "sent";

export interface ForgotPasswordProps {
  className?: string;
  defaultValues?: Partial<ForgotPasswordValues>;
  /**
   * Story fixture. Seeds values and visual state for the Figma frames.
   * A product screen omits this and drives the form from user input.
   */
  appearance?: ForgotPasswordAppearance;
  onSubmit?: (
    values: ForgotPasswordValues,
  ) => Promise<ForgotPasswordSubmitResult | void> | ForgotPasswordSubmitResult | void;
  onResend?: (
    values: ForgotPasswordValues,
  ) => Promise<ForgotPasswordSubmitResult | void> | ForgotPasswordSubmitResult | void;
  loginHref?: string;
}

function valuesForAppearance(
  appearance: ForgotPasswordAppearance,
  defaults?: Partial<ForgotPasswordValues>,
): ForgotPasswordValues {
  if (appearance === "invalid-email") {
    return { email: defaults?.email ?? "johndoe@" };
  }

  if (
    appearance === "submitting" ||
    appearance === "sent" ||
    appearance === "sent-wait" ||
    appearance === "sent-network"
  ) {
    return { email: defaults?.email ?? "johndoe@example.com" };
  }

  return { email: defaults?.email ?? "" };
}

function emailError(email: string, emptyMessage: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return emptyMessage;
  if (!EMAIL_PATTERN.test(trimmed)) return FORGOT_PASSWORD_COPY.emailInvalid;
  return undefined;
}

function isSentAppearance(appearance: ForgotPasswordAppearance) {
  return appearance === "sent" || appearance === "sent-wait" || appearance === "sent-network";
}

function isWait(
  result: ForgotPasswordSubmitResult | void,
): result is "wait" | ForgotPasswordWait {
  return result === "wait" || (typeof result === "object" && result?.type === "wait");
}

function waitMessage(result: "wait" | ForgotPasswordWait) {
  const seconds = result === "wait" ? undefined : result.seconds;
  if (typeof seconds === "number") {
    const unit = seconds === 1 ? "second" : "seconds";
    return `Please wait ${seconds} ${unit} before resending.`;
  }
  if (result !== "wait") return FORGOT_PASSWORD_COPY.waitHour;
  return FORGOT_PASSWORD_COPY.wait;
}

function formErrorForResult(result: ForgotPasswordSubmitResult | void) {
  if (isWait(result)) return waitMessage(result);
  if (result === "network") return FORGOT_PASSWORD_COPY.network;
  return undefined;
}

export function ForgotPasswordForm({
  className,
  defaultValues,
  appearance = "initial",
  onSubmit,
  onResend,
  loginHref = "#",
}: ForgotPasswordProps) {
  const id = React.useId();
  const emailId = `${id}-email`;
  const formAlertId = `${id}-form-alert`;

  const seeded = valuesForAppearance(appearance, defaultValues);
  const [email, setEmail] = React.useState(seeded.email);
  const [step, setStep] = React.useState<ForgotPasswordStep>(
    isSentAppearance(appearance) ? "sent" : "request",
  );
  const [submitting, setSubmitting] = React.useState(appearance === "submitting");
  const [formError, setFormError] = React.useState<string | undefined>(() => {
    if (appearance === "sent-wait") return FORGOT_PASSWORD_COPY.wait;
    if (appearance === "sent-network") return FORGOT_PASSWORD_COPY.network;
    return undefined;
  });
  const [errors, setErrors] = React.useState<{ email?: string }>(() => {
    if (appearance === "invalid-email") {
      return { email: emailError(seeded.email, FORGOT_PASSWORD_COPY.emailInvalid) };
    }
    if (appearance === "required") {
      return { email: emailError(seeded.email, FORGOT_PASSWORD_COPY.emailRequired) };
    }
    return {};
  });

  const emailRef = React.useRef<HTMLInputElement>(null);
  const submitLock = React.useRef(false);

  const emailDescribedBy = errors.email ? `${emailId}-description` : undefined;
  const sendReset = onResend ?? onSubmit;

  function handleEmailBlur() {
    setErrors({ email: emailError(email, FORGOT_PASSWORD_COPY.emailRequired) });
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    setFormError(undefined);
    setErrors((current) => ({
      email: current.email ? emailError(value, FORGOT_PASSWORD_COPY.emailRequired) : undefined,
    }));
  }

  async function submitEmail(action: "request" | "resend") {
    if (submitLock.current || submitting) return;

    setFormError(undefined);

    if (action === "request") {
      const nextEmail = emailError(email, FORGOT_PASSWORD_COPY.emailRequired);
      setErrors({ email: nextEmail });
      if (nextEmail) {
        emailRef.current?.focus();
        return;
      }
    }

    submitLock.current = true;
    setSubmitting(true);

    try {
      const result = await (action === "resend" ? sendReset : onSubmit)?.({ email });
      if (action === "request") {
        if (result === "network" || isWait(result)) {
          setFormError(formErrorForResult(result));
        } else {
          setStep("sent");
          setFormError(undefined);
        }
      } else {
        setFormError(formErrorForResult(result));
      }
    } catch {
      setFormError(FORGOT_PASSWORD_COPY.network);
    } finally {
      setSubmitting(false);
      submitLock.current = false;
    }
  }

  function handleUseDifferentEmail() {
    setStep("request");
    setFormError(undefined);
    setSubmitting(false);
    setErrors({});
  }

  if (step === "sent") {
    return (
      <CheckYourEmail
        className={className}
        email={email}
        loginHref={loginHref}
        submitting={submitting}
        formError={formError}
        onResend={() => {
          void submitEmail("resend");
        }}
        onUseDifferentEmail={handleUseDifferentEmail}
      />
    );
  }

  return (
          <form
            data-slot="forgot-password-form"
            noValidate
            className={cn(
              "flex w-full max-w-(--primitives-max-width-max-w-sm) flex-col items-center gap-(--primitives-spacing-10) md:max-w-(--primitives-max-width-max-w-md) md:gap-(--primitives-spacing-12)",
              className,
            )}
            onSubmit={(event) => {
              event.preventDefault();
              void submitEmail("request");
            }}
          >
            <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
                <PageHeader
                  title={FORGOT_PASSWORD_COPY.title}
                  description={FORGOT_PASSWORD_COPY.description}
                />
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
                    disabled={submitting}
                    onChange={(event) => handleEmailChange(event.target.value)}
                    onBlur={handleEmailBlur}
                  />
                </Field>
            </div>
              <div className="flex w-full flex-col items-center gap-(--primitives-spacing-6)">
                <div className="flex w-full flex-col gap-(--primitives-spacing-1)">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={submitting}
                  >
                    {submitting ? FORGOT_PASSWORD_COPY.submitting : FORGOT_PASSWORD_COPY.submit}
                  </Button>
                  {formError ? <FormAlert id={formAlertId}>{formError}</FormAlert> : null}
                </div>
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
                    {FORGOT_PASSWORD_COPY.backToLogin}
                  </Link>
                </p>
              </div>
          </form>
  );
}
