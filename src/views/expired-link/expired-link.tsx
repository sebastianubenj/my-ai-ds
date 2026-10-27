import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { AuthLayout } from "@/views/auth-layout";

// eslint-disable-next-line react-refresh/only-export-components -- stories assert the same copy the view renders.
export const EXPIRED_LINK_COPY = {
  title: "This link is not valid",
  description: "It may have expired or already been used.",
  requestNewLink: "Request a new link",
} as const;

export interface ExpiredLinkProps {
  className?: string;
  logoHref?: string;
  logoLabel?: string;
  forgotPasswordHref?: string;
}

export function ExpiredLink({
  className,
  logoHref = "#",
  logoLabel = "Home",
  forgotPasswordHref = "#",
}: ExpiredLinkProps) {
  return (
    <AuthLayout
      data-slot="expired-link"
      className={className}
      logoHref={logoHref}
      logoLabel={logoLabel}
    >
      <div className="flex w-full max-w-(--primitives-max-width-max-w-sm) flex-col items-center gap-(--primitives-spacing-10) md:max-w-(--primitives-max-width-max-w-md) md:gap-(--primitives-spacing-12)">
        <div className="flex w-full flex-col items-start gap-(--primitives-spacing-4)">
          <PageHeader
            title={EXPIRED_LINK_COPY.title}
            description={EXPIRED_LINK_COPY.description}
          />
        </div>
        <div className="flex w-full flex-col items-start gap-(--primitives-spacing-6)">
          <a
            href={forgotPasswordHref}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}
          >
            {EXPIRED_LINK_COPY.requestNewLink}
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
