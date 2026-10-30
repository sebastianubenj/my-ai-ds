import {
  FormAlert,
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
  /** Shown above the form. Used when the account still needs email confirmation. */
  notice?: string;
};

export function Login({
  className,
  logoHref = "#",
  logoLabel = "Home",
  notice,
  ...formProps
}: LoginProps) {
  return (
    <AuthLayout
      data-slot="login"
      className={className}
      logoHref={logoHref}
      logoLabel={logoLabel}
    >
      <div className="flex w-full flex-col items-center gap-(--primitives-spacing-4)">
        {notice ? (
          <FormAlert className="max-w-(--primitives-max-width-max-w-sm) md:max-w-(--primitives-max-width-max-w-md)">
            {notice}
          </FormAlert>
        ) : null}
        <LoginForm {...formProps} />
      </div>
    </AuthLayout>
  );
}
