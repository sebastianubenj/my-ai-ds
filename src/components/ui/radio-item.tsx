import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { RadioToggle } from "@/components/ui/radio-toggle";

const radioItemVariants = cva(
  `inline-flex align-middle items-start gap-(--primitives-spacing-2) cursor-pointer
   has-disabled:opacity-(--primitives-opacity-opacity-45)
   has-disabled:cursor-default`,
  {
    variants: {
      variant: {
        default: "",
        card: `w-full p-(--primitives-spacing-3)
          border-solid border-(length:--primitives-border-width-border)
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
 * Keep the nested toggle at full opacity when the RadioItem is disabled.
 * Disabled appearance is applied once on the RadioItem root so Toggle's own
 * 0.45 / 0.15 opacities do not compound.
 */
const toggleDisabledVisualReset = `
  has-disabled:opacity-(--primitives-opacity-opacity-100)
  has-disabled:has-[:checked]:opacity-(--primitives-opacity-opacity-100)
`;

export type RadioItemVariant = NonNullable<VariantProps<typeof radioItemVariants>["variant"]>;

export interface RadioItemProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type" | "size"> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  variant?: RadioItemVariant;
  children?: React.ReactNode;
  description?: React.ReactNode;
}

export function RadioItem({
  className,
  checked,
  defaultChecked,
  disabled,
  invalid = false,
  variant = "default",
  children,
  description,
  ...props
}: RadioItemProps) {
  const descriptionId = React.useId();
  const { "aria-describedby": ariaDescribedBy, ...inputProps } = props;
  const showLabel = children != null && children !== false && children !== "";
  const showDescription = description != null && description !== false && description !== "";
  const describedBy =
    [ariaDescribedBy, showDescription ? descriptionId : undefined].filter(Boolean).join(" ") ||
    undefined;

  const isDefaultInvalid = variant === "default" && invalid;

  return (
    <label data-slot="radio-item" className={cn(radioItemVariants({ variant }), className)}>
      <span className="flex shrink-0 items-start pt-(--primitives-spacing-0-25)">
        <RadioToggle
          {...inputProps}
          className={toggleDisabledVisualReset}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          invalid={invalid}
          aria-describedby={describedBy}
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
