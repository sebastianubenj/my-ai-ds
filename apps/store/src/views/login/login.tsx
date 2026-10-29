import {
  LoginForm,
  type LoginProps as LoginFormProps,
} from "@weaveui/ds";
import { AuthLayout } from "@/views/auth-layout";

export {
  LOGIN_COPY,
  type LoginAppearance,
  type LoginSubmitResult,
  type LoginValues,
} from "@weaveui/ds";

export type LoginProps = LoginFormProps & {
  logoHref?: string;
  logoLabel?: string;
};

export function Login({
  className,
  logoHref = "#",
  logoLabel = "Home",
  ...formProps
}: LoginProps) {
  return (
    <AuthLayout
      data-slot="login"
      className={className}
      logoHref={logoHref}
      logoLabel={logoLabel}
    >
      <LoginForm {...formProps} />
    </AuthLayout>
  );
}
