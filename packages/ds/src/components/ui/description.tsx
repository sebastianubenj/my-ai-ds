import * as React from "react";

import { cn } from "#/lib/utils";

export type DescriptionProps = React.ComponentProps<"p">;

export function Description({ className, ref, ...props }: DescriptionProps) {
  return (
    <p
      data-slot="description"
      className={cn(
        `m-0 w-full font-sans
         [font-weight:var(--semantics-typography-body-font-weight)]
         text-(length:--semantics-typography-body-body-lg-font-size)
         leading-(--semantics-typography-body-body-lg-lh-normal)
         tracking-(--semantics-typography-body-body-lg-tracking-tight)
         [color:var(--semantics-colors-foreground-subtle)]`,
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}
