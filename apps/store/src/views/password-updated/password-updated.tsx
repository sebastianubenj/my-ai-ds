import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { AuthLayout } from "@/views/auth-layout";

// eslint-disable-next-line react-refresh/only-export-components -- stories assert the same copy the view renders.
export const PASSWORD_UPDATED_COPY = {
  title: "Password updated",
  description: "You can log in with your new password.",
  login: "Log in",
} as const;

export interface PasswordUpdatedProps {
  className?: string;
  logoHref?: string;
  logoLabel?: string;
  loginHref?: string;
}

export function PasswordUpdated({
  className,
  logoHref = "#",
  logoLabel = "Home",
  loginHref = "#",
}: PasswordUpdatedProps) {
  return (
    <AuthLayout
      data-slot="password-updated"
      className={className}
      logoHref={logoHref}
      logoLabel={logoLabel}
    >
      <div className="flex w-full max-w-(--primitives-max-width-max-w-sm) flex-col items-center gap-(--primitives-spacing-10) md:max-w-(--primitives-max-width-max-w-md) md:gap-(--primitives-spacing-12)">
        <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
          <PageHeader
            title={PASSWORD_UPDATED_COPY.title}
            description={PASSWORD_UPDATED_COPY.description}
          />
        </div>
        <div className="flex w-full flex-col items-start gap-(--primitives-spacing-6)">
          <a
            href={loginHref}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
          >
            {PASSWORD_UPDATED_COPY.login}
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
