import {
  PasswordUpdated,
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
};

export function Register({
  className,
  logoHref = "#",
  logoLabel = "Home",
  confirmationEmail,
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
        <PasswordUpdated
          title="Check your email"
          description={`We sent a confirmation link to ${confirmationEmail}. It expires in 1 hour.`}
          actionHref={loginHref}
          actionLabel="Log in"
        />
      ) : (
        <SignUpForm loginHref={loginHref} {...formProps} />
      )}
    </AuthLayout>
  );
}
