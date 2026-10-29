import * as React from "react";

import { cn } from "@/lib/utils";

export type RadioGroupProps = React.ComponentProps<"div">;

export function RadioGroup({ className, ref, ...props }: RadioGroupProps) {
  return (
    <div
      data-slot="radio-group"
      className={cn("flex flex-col items-start gap-(--primitives-spacing-3)", className)}
      {...props}
      ref={ref}
    />
  );
}
