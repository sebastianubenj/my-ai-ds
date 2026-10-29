import {
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
};

export function Register({
  className,
  logoHref = "#",
  logoLabel = "Home",
  ...formProps
}: RegisterProps) {
  return (
    <AuthLayout
      data-slot="register"
      className={className}
      logoHref={logoHref}
      logoLabel={logoLabel}
    >
      <SignUpForm {...formProps} />
    </AuthLayout>
  );
}
