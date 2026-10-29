import * as React from "react";

import { cn } from "#/lib/utils";

export type FormAlertProps = React.ComponentProps<"p">;

export function FormAlert({ className, ref, role = "alert", ...props }: FormAlertProps) {
  return (
    <p
      data-slot="form-alert"
      role={role}
      className={cn(
        `m-0 w-full font-sans
         [font-weight:var(--semantics-typography-body-font-weight)]
         text-(length:--semantics-typography-body-body-lg-font-size)
         leading-(--semantics-typography-body-body-lg-lh-normal)
         tracking-(--semantics-typography-body-body-lg-tracking-tight)
         [color:var(--semantics-colors-foreground-destructive)]`,
        className,
      )}
      {...props}
      ref={ref}
    />
  );
}
