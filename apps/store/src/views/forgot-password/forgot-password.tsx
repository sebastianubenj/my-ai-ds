import {
  ForgotPasswordForm,
  type ForgotPasswordProps as ForgotPasswordFormProps,
} from "@weaveui/ds";
import { AuthLayout } from "@/views/auth-layout";

export {
  FORGOT_PASSWORD_COPY,
  type ForgotPasswordAppearance,
  type ForgotPasswordStep,
  type ForgotPasswordSubmitResult,
  type ForgotPasswordValues,
} from "@weaveui/ds";

export type ForgotPasswordProps = ForgotPasswordFormProps & {
  logoHref?: string;
  logoLabel?: string;
};

export function ForgotPassword({
  className,
  logoHref = "#",
  logoLabel = "Home",
  ...formProps
}: ForgotPasswordProps) {
  return (
    <AuthLayout
      data-slot="forgot-password"
      className={className}
      logoHref={logoHref}
      logoLabel={logoLabel}
    >
      <ForgotPasswordForm {...formProps} />
    </AuthLayout>
  );
}
