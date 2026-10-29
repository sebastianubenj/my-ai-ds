import * as React from "react";

import { cn } from "@/lib/utils";
import { FieldDescriptionOrRequirement } from "@/components/ui/field-description-or-requirement";
import { Label } from "@/components/ui/label";

export interface FieldProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  /** Visible field name. Omit to hide the label row. */
  label?: React.ReactNode;
  /** When true, shows an “(optional)” marker next to the label. */
  optional?: boolean;
  /**
   * Supporting slot. A string is helper or error copy (no icon). A node is
   * rendered as-is, typically `FieldDescriptionOrRequirement` rows.
   */
  description?: React.ReactNode;
  /**
   * String shortcut: wraps `description` as `invalid`. Not a Figma variant.
   * Does not set `error` on the child control.
   */
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
  ref,
  ...props
}: FieldProps) {
  const descriptionId = description && htmlFor ? `${htmlFor}-description` : undefined;

  return (
    <div
      data-slot="field"
      className={cn("flex w-full flex-col items-start gap-(--primitives-spacing-1)", className)}
      {...props}
      ref={ref}
    >
      {label ? (
        <Label
          htmlFor={htmlFor}
          className="flex w-full items-center gap-(--primitives-spacing-out-of-scale-0-5)"
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
        <div
          id={descriptionId}
          className="flex w-full flex-col gap-(--primitives-spacing-1)"
        >
          {typeof description === "string" || typeof description === "number" ? (
            <FieldDescriptionOrRequirement
              showIcon={false}
              state={error ? "invalid" : "pending"}
            >
              {description}
            </FieldDescriptionOrRequirement>
          ) : (
            description
          )}
        </div>
      ) : null}
    </div>
  );
}
