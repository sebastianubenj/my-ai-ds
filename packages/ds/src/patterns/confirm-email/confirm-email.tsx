import * as React from "react";

import { Button, buttonVariants } from "#/components/ui/button";
import { FormAlert } from "#/components/ui/form-alert";
import { InlineFeedback } from "#/components/ui/inline-feedback";
import { PageHeader } from "#/components/ui/page-header";
import { cn } from "#/lib/utils";

import { CONFIRM_EMAIL_COPY } from "./confirm-email-copy";

export { CONFIRM_EMAIL_COPY } from "./confirm-email-copy";

export type ConfirmEmailWait = { type: "wait"; seconds?: number };
export type ConfirmEmailResendResult = "network" | "sent" | "wait" | ConfirmEmailWait;

export function confirmEmailErrorMessage(
  result: ConfirmEmailResendResult | void,
): string | undefined {
  if (result === "network") return CONFIRM_EMAIL_COPY.network;
  if (result === "wait") return CONFIRM_EMAIL_COPY.wait;
  if (typeof result === "object" && result?.type === "wait") {
    if (typeof result.seconds === "number") {
      const unit = result.seconds === 1 ? "second" : "seconds";
      return `Please wait ${result.seconds} ${unit} before resending.`;
    }
    return CONFIRM_EMAIL_COPY.waitHour;
  }
  return undefined;
}

export interface ConfirmEmailProps {
  className?: string;
  email: string;
  loginHref?: string;
  submitting?: boolean;
  formError?: string;
  onResend?: () => void;
}

export function ConfirmEmail({
  className,
  email,
  loginHref = "#",
  submitting = false,
  formError,
  onResend,
}: ConfirmEmailProps) {
  const formAlertId = `${React.useId()}-form-alert`;

  return (
    <div
      data-slot="confirm-email"
      className={cn(
        "flex w-full max-w-(--primitives-max-width-max-w-sm) flex-col items-center gap-(--primitives-spacing-10) md:max-w-(--primitives-max-width-max-w-md) md:gap-(--primitives-spacing-12)",
        className,
      )}
    >
      <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
        <PageHeader
          title={CONFIRM_EMAIL_COPY.title}
          description={
            <>
              {CONFIRM_EMAIL_COPY.descriptionBefore}
              <span className="underline">{email}</span>
              {CONFIRM_EMAIL_COPY.descriptionAfter}
            </>
          }
        />
        <InlineFeedback
          type="info"
          title={CONFIRM_EMAIL_COPY.tipTitle}
          description={CONFIRM_EMAIL_COPY.tipDescription}
        />
      </div>
      <div className="flex w-full flex-col items-start gap-(--primitives-spacing-6)">
        <a
          href={loginHref}
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
        >
          {CONFIRM_EMAIL_COPY.backToLogin}
        </a>
        <div className="flex w-full flex-col gap-(--primitives-spacing-1)">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            loading={submitting}
            onClick={() => {
              if (submitting) return;
              onResend?.();
            }}
          >
            {CONFIRM_EMAIL_COPY.resend}
          </Button>
          {formError ? <FormAlert id={formAlertId}>{formError}</FormAlert> : null}
        </div>
      </div>
    </div>
  );
}
