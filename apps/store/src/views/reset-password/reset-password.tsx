import {
  SetANewPasswordForm,
  type ResetPasswordProps as SetANewPasswordFormProps,
} from "@weaveui/ds";
import { AuthLayout } from "@/views/auth-layout";

export {
  RESET_PASSWORD_COPY,
  type CheckCompromisedPassword,
  type CompromisedPasswordResult,
  type ResetPasswordAppearance,
  type ResetPasswordSubmitResult,
  type ResetPasswordValues,
} from "@weaveui/ds";

export type ResetPasswordProps = SetANewPasswordFormProps & {
  logoHref?: string;
  logoLabel?: string;
};

export function ResetPassword({
  className,
  logoHref = "#",
  logoLabel = "Home",
  ...formProps
}: ResetPasswordProps) {
  return (
    <AuthLayout
      data-slot="reset-password"
      className={className}
      logoHref={logoHref}
      logoLabel={logoLabel}
    >
      <SetANewPasswordForm {...formProps} />
    </AuthLayout>
  );
}
