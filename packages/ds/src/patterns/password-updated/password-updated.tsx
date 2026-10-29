import { cn } from "#/lib/utils";
import { buttonVariants } from "#/components/ui/button";
import { PageHeader } from "#/components/ui/page-header";

// eslint-disable-next-line react-refresh/only-export-components -- stories assert the same copy the view renders.
export const PASSWORD_UPDATED_COPY = {
  title: "Password updated",
  description: "You can log in with your new password.",
  login: "Log in",
} as const;

export interface PasswordUpdatedProps {
  className?: string;
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function PasswordUpdated({
  className,
  title = PASSWORD_UPDATED_COPY.title,
  description = PASSWORD_UPDATED_COPY.description,
  actionHref = "#",
  actionLabel = PASSWORD_UPDATED_COPY.login,
}: PasswordUpdatedProps) {
  return (
    <div
      data-slot="password-updated"
      className={cn(
        "flex w-full max-w-(--primitives-max-width-max-w-sm) flex-col items-center gap-(--primitives-spacing-10) md:max-w-(--primitives-max-width-max-w-md) md:gap-(--primitives-spacing-12)",
        className,
      )}
    >
      <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
        <PageHeader title={title} description={description} />
      </div>
      <div className="flex w-full flex-col items-start gap-(--primitives-spacing-6)">
        <a
          href={actionHref}
          className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
        >
          {actionLabel}
        </a>
      </div>
    </div>
  );
}
