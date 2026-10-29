import * as React from "react";

import { Button } from "#/components/ui/button";
import { FormAlert } from "#/components/ui/form-alert";
import { Link } from "#/components/ui/link";
import { PageHeader } from "#/components/ui/page-header";
import { cn } from "#/lib/utils";
import { FORGOT_PASSWORD_COPY } from "#/patterns/forgot-password/forgot-password-copy";

export interface CheckYourEmailProps {
  className?: string;
  email: string;
  loginHref?: string;
  submitting?: boolean;
  formError?: string;
  onResend?: () => void;
  onUseDifferentEmail?: () => void;
}

export function CheckYourEmail({
  className,
  email,
  loginHref = "#",
  submitting = false,
  formError,
  onResend,
  onUseDifferentEmail,
}: CheckYourEmailProps) {
  const formAlertId = `${React.useId()}-form-alert`;

  return (
    <form
      data-slot="check-your-email"
      noValidate
      className={cn(
        "flex w-full max-w-(--primitives-max-width-max-w-sm) flex-col items-center gap-(--primitives-spacing-10) md:max-w-(--primitives-max-width-max-w-md) md:gap-(--primitives-spacing-12)",
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault();
        if (submitting) return;
        onResend?.();
      }}
    >
      <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
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
          {FORGOT_PASSWORD_COPY.resend}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={submitting}
          onClick={onUseDifferentEmail}
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
    </form>
  );
}
