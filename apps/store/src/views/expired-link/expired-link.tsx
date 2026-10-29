import { PasswordUpdated } from "@weaveui/ds";
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
      <PasswordUpdated
        title={EXPIRED_LINK_COPY.title}
        description={EXPIRED_LINK_COPY.description}
        actionHref={forgotPasswordHref}
        actionLabel={EXPIRED_LINK_COPY.requestNewLink}
      />
    </AuthLayout>
  );
}
