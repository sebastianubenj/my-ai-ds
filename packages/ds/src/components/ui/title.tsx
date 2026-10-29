import * as React from "react";

import { cn } from "@/lib/utils";

export type TitleLevel = "h1" | "h2" | "h3" | "h4";

export interface TitleProps extends React.ComponentProps<"h1"> {
  as?: TitleLevel;
}

export function Title({ as: Comp = "h1", className, ref, ...props }: TitleProps) {
  return (
    <Comp
      data-slot="title"
      className={cn(
        `m-0 w-full font-sans
         [font-weight:var(--semantics-typography-heading-font-weight)]
         text-(length:--semantics-typography-heading-heading-xl-font-size)
         leading-(--semantics-typography-heading-heading-xl-lh-tight)
         tracking-(--semantics-typography-heading-heading-xl-tracking-tight)
         md:[font-weight:var(--semantics-typography-display-font-weight)]
         md:text-(length:--semantics-typography-display-display-sm-font-size)
         md:leading-(--semantics-typography-display-display-sm-lh-tighter)
         md:tracking-(--semantics-typography-display-display-sm-tracking-tight)
         [color:var(--semantics-colors-foreground-default)]`,
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}
