import {
  ConfirmEmail,
  SignUpForm,
  type RegisterProps as SignUpFormProps,
} from "@weaveui/ds";
import { AuthLayout } from "@/views/auth-layout";

export {
  REGISTER_COPY,
  type CheckCompromisedPassword,
  type CompromisedPasswordResult,
  type RegisterAppearance,
  type RegisterSubmitResult,
  type RegisterValues,
} from "@weaveui/ds";

export type RegisterProps = SignUpFormProps & {
  logoHref?: string;
  logoLabel?: string;
  /** When set, the form is replaced by the confirmation message. */
  confirmationEmail?: string;
  confirmationSubmitting?: boolean;
  confirmationError?: string;
  onResendConfirmation?: () => void | Promise<void>;
};

export function Register({
  className,
  logoHref = "#",
  logoLabel = "Home",
  confirmationEmail,
  confirmationSubmitting,
  confirmationError,
  onResendConfirmation,
  loginHref,
  ...formProps
}: RegisterProps) {
  return (
    <AuthLayout
      data-slot="register"
      className={className}
      logoHref={logoHref}
      logoLabel={logoLabel}
    >
      {confirmationEmail ? (
        <ConfirmEmail
          email={confirmationEmail}
          loginHref={loginHref}
          submitting={confirmationSubmitting}
          formError={confirmationError}
          onResend={onResendConfirmation}
        />
      ) : (
        <SignUpForm loginHref={loginHref} {...formProps} />
      )}
    </AuthLayout>
  );
}
