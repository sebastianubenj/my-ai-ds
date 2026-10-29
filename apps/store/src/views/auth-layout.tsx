import * as React from "react";

import { cn } from "@weaveui/ds";
import { Navigation } from "@/components/ui/navigation";

export interface AuthLayoutProps extends React.ComponentProps<"div"> {
  logoHref?: string;
  logoLabel?: string;
}

export function AuthLayout({
  children,
  className,
  logoHref = "#",
  logoLabel = "Home",
  ...props
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-dvh w-full flex-col [background-color:var(--semantics-colors-background-page)]",
        className,
      )}
      {...props}
    >
      <Navigation appearance="empty" logoHref={logoHref} logoLabel={logoLabel} />
      <div
        className={`flex w-full flex-1 flex-col items-center
          px-(--semantics-layout-mobile-grid-margin)
          md:px-(--primitives-spacing-8)`}
      >
        <div className="flex w-full max-w-(--semantics-layout-desktop-content-max-width) justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
