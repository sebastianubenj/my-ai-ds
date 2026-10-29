import {
  PasswordUpdated as PasswordUpdatedPattern,
  PASSWORD_UPDATED_COPY,
  type PasswordUpdatedProps as PasswordUpdatedPatternProps,
} from "@weaveui/ds";
import { AuthLayout } from "@/views/auth-layout";

export { PASSWORD_UPDATED_COPY };

export type PasswordUpdatedProps = PasswordUpdatedPatternProps & {
  logoHref?: string;
  logoLabel?: string;
  loginHref?: string;
};

export function PasswordUpdated({
  className,
  logoHref = "#",
  logoLabel = "Home",
  loginHref = "#",
  actionHref,
  ...patternProps
}: PasswordUpdatedProps) {
  return (
    <AuthLayout
      data-slot="password-updated"
      className={className}
      logoHref={logoHref}
      logoLabel={logoLabel}
    >
      <PasswordUpdatedPattern
        {...patternProps}
        actionHref={actionHref ?? loginHref}
      />
    </AuthLayout>
  );
}
