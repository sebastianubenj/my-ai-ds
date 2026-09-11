import * as React from "react";

import { cn } from "@/lib/utils";

export type CheckboxGroupProps = React.ComponentPropsWithoutRef<"div">;

export function CheckboxGroup({ className, ...props }: CheckboxGroupProps) {
  return (
    <div
      data-slot="checkbox-group"
      className={cn("flex flex-col items-start gap-(--primitives-spacing-3)", className)}
      {...props}
    />
  );
}
