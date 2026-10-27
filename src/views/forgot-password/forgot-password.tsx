import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FieldDescriptionOrRequirement } from "@/components/ui/field-description-or-requirement";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { PageHeader } from "@/components/ui/page-header";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// eslint-disable-next-line react-refresh/only-export-components -- stories assert the same copy the view renders.
export const FORGOT_PASSWORD_COPY = {
  title: "Forgot password?",
  description: "Enter your email and we'll send you a reset link.",
  emailRequired: "Enter your email address.",
  emailInvalid: "Enter a valid email address.",
  submit: "Send reset link",
  submitting: "Sending...",
  sentTitle: "Check your email",
  sentDescriptionBefore: "If an account exists for ",
  sentDescriptionAfter: ", we sent a reset link. It expires in 15 minutes.",
  wait: "Please wait before requesting another link.",
  network: "Something went wrong. Please try again.",
  resend: "Resend email",
  useDifferentEmail: "Use a different email",
  backToLogin: "Back to log in",
} as const;

export type ForgotPasswordSubmitResult = "success" | "network" | "wait";

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
  logoHref?: string;
  logoLabel?: string;
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

function BrandMark() {
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

function formErrorForResult(result: ForgotPasswordSubmitResult | void) {
  if (result === "wait") return FORGOT_PASSWORD_COPY.wait;
  if (result === "network") return FORGOT_PASSWORD_COPY.network;
  return undefined;
}

export function ForgotPassword({
  className,
  defaultValues,
  appearance = "initial",
  onSubmit,
  onResend,
  logoHref = "#",
  logoLabel = "Home",
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

  async function submitEmail(
    event: React.FormEvent<HTMLFormElement>,
    action: "request" | "resend",
  ) {
    event.preventDefault();
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
        if (result === "network") {
          setFormError(FORGOT_PASSWORD_COPY.network);
        } else if (result === "wait") {
          setStep("sent");
          setFormError(FORGOT_PASSWORD_COPY.wait);
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

  return (
    <div
      data-slot="forgot-password"
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
              <BrandMark />
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
              void submitEmail(event, step === "sent" ? "resend" : "request");
            }}
          >
            <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
              {step === "sent" ? (
                <PageHeader
                  title={FORGOT_PASSWORD_COPY.sentTitle}
                  description={
                    <>
                      {FORGOT_PASSWORD_COPY.sentDescriptionBefore}
                      <span className="underline">{email}</span>
                      {FORGOT_PASSWORD_COPY.sentDescriptionAfter}
                    </>
                  }
                />
              ) : (
                <PageHeader
                  title={FORGOT_PASSWORD_COPY.title}
                  description={FORGOT_PASSWORD_COPY.description}
                />
              )}

              {step === "request" ? (
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
              ) : null}

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

            {step === "request" ? (
              <div className="flex w-full flex-col items-center gap-(--primitives-spacing-6)">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={submitting}
                >
                  {submitting ? FORGOT_PASSWORD_COPY.submitting : FORGOT_PASSWORD_COPY.submit}
                </Button>
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
            ) : (
              <div className="flex w-full flex-col items-start gap-(--primitives-spacing-6)">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={submitting}
                >
                  {FORGOT_PASSWORD_COPY.resend}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                  onClick={handleUseDifferentEmail}
                >
                  {FORGOT_PASSWORD_COPY.useDifferentEmail}
                </Button>
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
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
