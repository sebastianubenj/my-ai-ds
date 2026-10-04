import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { CheckboxToggle } from "@/components/ui/checkbox-toggle";

const checkboxVariants = cva(
  `inline-flex items-start gap-(--primitives-spacing-2) cursor-pointer
   has-disabled:opacity-(--primitives-opacity-opacity-45)
   has-disabled:cursor-default`,
  {
    variants: {
      variant: {
        default: "",
        card: `w-full p-(--primitives-spacing-3)
          border-solid border-(length:--primitives-stroke-width-border)
          [border-color:var(--semantics-colors-border-default)]
          rounded-(--primitives-radius-rounded-10)
          has-aria-invalid:[border-color:var(--semantics-colors-border-destructive)]
          has-disabled:[background-color:var(--semantics-colors-background-default)]`,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Keep the nested toggle at full opacity when the Checkbox is disabled.
 * Disabled appearance is applied once on the Checkbox root so Toggle's own
 * 0.45 / 0.15 opacities do not compound.
 */
const toggleDisabledVisualReset = `
  has-disabled:opacity-(--primitives-opacity-opacity-100)
  has-disabled:has-[:checked]:opacity-(--primitives-opacity-opacity-100)
  has-disabled:has-[:indeterminate]:opacity-(--primitives-opacity-opacity-100)
`;

export type CheckboxVariant = NonNullable<VariantProps<typeof checkboxVariants>["variant"]>;

export interface CheckboxProps
  extends Omit<React.ComponentProps<"input">, "type" | "size"> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  variant?: CheckboxVariant;
  children?: React.ReactNode;
  description?: React.ReactNode;
}

export function Checkbox({
  className,
  checked,
  defaultChecked,
  indeterminate = false,
  disabled,
  invalid = false,
  variant = "default",
  children,
  description,
  ref,
  ...props
}: CheckboxProps) {
  const descriptionId = React.useId();
  const { "aria-describedby": ariaDescribedBy, ...inputProps } = props;
  const showLabel = children != null && children !== false && children !== "";
  const showDescription = description != null && description !== false && description !== "";
  const describedBy =
    [ariaDescribedBy, showDescription ? descriptionId : undefined].filter(Boolean).join(" ") ||
    undefined;

  const isDefaultInvalid = variant === "default" && invalid;

  return (
    <label data-slot="checkbox" className={cn(checkboxVariants({ variant }), className)}>
      <span className="flex shrink-0 items-start pt-(--primitives-spacing-0-25)">
        <CheckboxToggle
          {...inputProps}
          className={toggleDisabledVisualReset}
          checked={checked}
          defaultChecked={defaultChecked}
          indeterminate={indeterminate}
          disabled={disabled}
          invalid={invalid}
          aria-describedby={describedBy}
          ref={ref}
        />
      </span>
      {showLabel || showDescription ? (
        <span className="flex min-w-0 flex-col gap-(--primitives-spacing-0-5)">
          {showLabel ? (
            <span
              className={cn(
                `font-sans [font-weight:var(--semantics-typography-label-font-weight)]
                 text-(length:--semantics-typography-label-label-md-font-size)
                 leading-(--semantics-typography-label-label-md-lh-snug)
                 tracking-(--semantics-typography-label-label-md-tracking-0-125)`,
                isDefaultInvalid
                  ? "[color:var(--semantics-colors-foreground-destructive)]"
                  : "text-foreground",
              )}
            >
              {children}
            </span>
          ) : null}
          {showDescription ? (
            <span
              id={descriptionId}
              className={cn(
                `font-sans [font-weight:var(--semantics-typography-body-font-weight)]
                 text-(length:--semantics-typography-body-body-md-font-size)
                 leading-(--semantics-typography-body-body-md-lh-normal)
                 tracking-(--semantics-typography-body-body-md-tracking-tight)`,
                isDefaultInvalid
                  ? "[color:var(--semantics-colors-foreground-destructive)]"
                  : "[color:var(--semantics-colors-foreground-subtle)]",
              )}
            >
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
