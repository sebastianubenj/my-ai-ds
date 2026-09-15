import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface FieldProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  /** Visible field name. Omit to hide the label row. */
  label?: React.ReactNode;
  /** When true, shows an “(optional)” marker next to the label. */
  optional?: boolean;
  /** Supporting helper or error copy. Omit to hide the support line. */
  description?: React.ReactNode;
  /** Styles the description as an error. Does not set `error` on the child control. */
  error?: boolean;
  /** Associates the label with a control. Pass the same value as the control’s `id`. */
  htmlFor?: string;
}

export function Field({
  children,
  className,
  label,
  optional = false,
  description,
  error = false,
  htmlFor,
  ...props
}: FieldProps) {
  const descriptionId = description && htmlFor ? `${htmlFor}-description` : undefined;

  return (
    <div
      data-slot="field"
      className={cn("flex w-full flex-col items-start gap-(--primitives-spacing-1)", className)}
      {...props}
    >
      {label ? (
        <Label
          htmlFor={htmlFor}
          className="flex w-full items-center gap-(--primitives-spacing-0-5)"
        >
          {label}
          {optional ? (
            <span
              className={`shrink-0 font-sans [font-weight:var(--semantics-typography-body-font-weight)]
                 text-(length:--semantics-typography-body-body-sm-font-size)
                 leading-(--semantics-typography-body-body-sm-lh-normal)
                 tracking-(--semantics-typography-body-body-sm-tracking-tight)
                 [color:var(--semantics-colors-foreground-subtle)]`}
            >
              (optional)
            </span>
          ) : null}
        </Label>
      ) : null}
      {children}
      {description ? (
        <p
          id={descriptionId}
          className={cn(
            `m-0 w-full font-sans [font-weight:var(--semantics-typography-body-font-weight)]
             text-(length:--semantics-typography-body-body-sm-font-size)
             leading-(--semantics-typography-body-body-sm-lh-normal)
             tracking-(--semantics-typography-body-body-sm-tracking-tight)`,
            error
              ? "[color:var(--semantics-colors-foreground-destructive)]"
              : "[color:var(--semantics-colors-foreground-subtle)]",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
