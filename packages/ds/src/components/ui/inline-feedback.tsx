import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { Icon, type IconName } from "#/components/icon";
import { cn } from "#/lib/utils";

const inlineFeedbackVariants = cva(
  `flex w-full items-center gap-(--primitives-spacing-1)
   rounded-(--primitives-radius-rounded-lg)
   border-solid border-(length:--primitives-stroke-width-stroke)
   px-(--primitives-spacing-2) py-(--primitives-spacing-1)`,
  {
    variants: {
      type: {
        info: `[background-color:var(--semantics-colors-background-subtlest)]
          [border-color:var(--semantics-colors-border-default)]
          [color:var(--semantics-colors-foreground-default)]`,
        invalid: `[background-color:var(--semantics-colors-background-destructive-op5)]
          [border-color:var(--semantics-colors-border-destructive)]
          [color:var(--semantics-colors-foreground-destructive)]`,
        success: `[background-color:var(--semantics-colors-background-success-op5)]
          [border-color:var(--semantics-colors-border-success)]
          [color:var(--semantics-colors-foreground-success)]`,
      },
    },
    defaultVariants: {
      type: "info",
    },
  },
);

const typeIcon: Record<
  NonNullable<VariantProps<typeof inlineFeedbackVariants>["type"]>,
  IconName
> = {
  info: "circle-alert",
  invalid: "triangle-alert",
  success: "circle-check",
};

const defaultRole: Record<
  NonNullable<VariantProps<typeof inlineFeedbackVariants>["type"]>,
  React.AriaRole
> = {
  info: "status",
  invalid: "alert",
  success: "status",
};

export type InlineFeedbackType = NonNullable<
  VariantProps<typeof inlineFeedbackVariants>["type"]
>;

export interface InlineFeedbackProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof inlineFeedbackVariants> {
  /** Primary line. Omit to hide. */
  title?: React.ReactNode;
  /** Supporting line. Omit to hide. */
  description?: React.ReactNode;
  /** When false, the type icon is hidden. Default is true. */
  showIcon?: boolean;
}

export function InlineFeedback({
  className,
  type = "info",
  title,
  description,
  showIcon = true,
  role,
  ref,
  ...props
}: InlineFeedbackProps) {
  const resolvedType = type ?? "info";

  return (
    <div
      data-slot="inline-feedback"
      data-type={resolvedType}
      role={role ?? defaultRole[resolvedType]}
      className={cn(inlineFeedbackVariants({ type: resolvedType }), className)}
      {...props}
      ref={ref}
    >
      {showIcon ? (
        <span className="flex shrink-0 self-stretch items-start pt-(--primitives-spacing-out-of-scale-0-75)">
          <Icon name={typeIcon[resolvedType]} aria-hidden="true" className="shrink-0" />
        </span>
      ) : null}
      {title != null || description != null ? (
        <div className="flex min-w-0 flex-1 flex-col items-start">
          {title != null ? (
            <p
              className={`m-0 w-full font-sans
                [font-weight:var(--semantics-typography-label-font-weight)]
                text-(length:--semantics-typography-label-label-lg-font-size)
                leading-(--semantics-typography-label-label-lg-lh-snug)
                tracking-(--semantics-typography-label-label-lg-tracking-0-125)`}
            >
              {title}
            </p>
          ) : null}
          {description != null ? (
            <p
              className={cn(
                `m-0 w-full font-sans
                 [font-weight:var(--semantics-typography-body-font-weight)]
                 text-(length:--semantics-typography-body-body-md-font-size)
                 leading-(--semantics-typography-body-body-md-lh-normal)
                 tracking-(--semantics-typography-body-body-md-tracking-tight)`,
                resolvedType === "info" &&
                  "[color:var(--semantics-colors-foreground-subtle-on-subtlest)]",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
