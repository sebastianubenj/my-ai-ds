import * as React from "react";

import { cn } from "@/lib/utils";

export interface LinkProps extends React.ComponentProps<"a"> {
  /**
   * Destructive visual intent. Does not represent form validation.
   * Disabled wins over destructive color.
   */
  destructive?: boolean;

  /** Prevents navigation and interaction. Exposed as `aria-disabled`. */
  disabled?: boolean;
}

export function Link({
  className,
  destructive = false,
  disabled = false,
  href,
  onClick,
  children,
  ref,
  tabIndex,
  ...props
}: LinkProps) {
  return (
    <a
      data-slot="link"
      href={href}
      {...props}
      ref={ref}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : tabIndex}
      className={cn(
        `inline cursor-pointer [font:inherit] [color:inherit]
         underline decoration-from-font [text-underline-position:from-font]
         rounded-(--primitives-radius-rounded-sm) outline-none
         hover:no-underline
         active:underline
         focus-visible:[outline:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
         focus-visible:[outline-offset:var(--primitives-spacing-0-75)]
         aria-disabled:pointer-events-none aria-disabled:cursor-default
         aria-disabled:underline
         aria-disabled:[color:var(--semantics-colors-foreground-subtle)]
         aria-disabled:opacity-(--primitives-opacity-opacity-50)`,
        destructive &&
          `[color:var(--semantics-colors-foreground-destructive)]
           aria-disabled:[color:var(--semantics-colors-foreground-subtle)]`,
        className,
      )}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
