import * as React from "react";

import { cn } from "@/lib/utils";

export type LabelProps = React.ComponentPropsWithoutRef<"label">;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        `font-sans text-foreground [font-weight:var(--semantics-typography-label-font-weight)]
         text-(length:--semantics-typography-label-label-md-font-size)
         leading-(--semantics-typography-label-label-md-lh-snug)
         tracking-(--semantics-typography-label-label-md-tracking-0-125)`,
        className,
      )}
      {...props}
    />
  );
}
