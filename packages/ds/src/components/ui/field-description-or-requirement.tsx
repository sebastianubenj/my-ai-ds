import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#/lib/utils";
import { Icon, type IconName } from "#/components/icon";

const fieldDescriptionOrRequirementVariants = cva(
  `m-0 flex w-full min-w-0 items-center gap-(--primitives-spacing-1)
   font-sans [font-weight:var(--semantics-typography-body-font-weight)]
   text-(length:--semantics-typography-body-body-sm-font-size)
   leading-(--semantics-typography-body-body-sm-lh-normal)
   tracking-(--semantics-typography-body-body-sm-tracking-tight)`,
  {
    variants: {
      state: {
        pending: "[color:var(--semantics-colors-foreground-subtle)]",
        met: "[color:var(--semantics-colors-foreground-success)]",
        invalid: "[color:var(--semantics-colors-foreground-destructive)]",
      },
    },
    defaultVariants: {
      state: "pending",
    },
  },
);

const stateIcon: Record<
  NonNullable<VariantProps<typeof fieldDescriptionOrRequirementVariants>["state"]>,
  IconName
> = {
  pending: "circle-dashed",
  met: "circle-check",
  invalid: "circle-x",
};

/** 12px box next to body-sm. Local to this row; not a public icon size. */
const iconBox12 = "var(--primitives-spacing-3)";

export type FieldDescriptionOrRequirementState = NonNullable<
  VariantProps<typeof fieldDescriptionOrRequirementVariants>["state"]
>;

export interface FieldDescriptionOrRequirementProps extends React.ComponentProps<"p"> {
  /** Visual and icon state of this supporting line. */
  state?: FieldDescriptionOrRequirementState;
  /** When false, only the copy is shown. Default is true. */
  showIcon?: boolean;
  /** Replaces the default icon for `state`. Ignored when `showIcon` is false. */
  icon?: IconName;
}

export function FieldDescriptionOrRequirement({
  className,
  state = "pending",
  showIcon = true,
  icon,
  children,
  ref,
  ...props
}: FieldDescriptionOrRequirementProps) {
  return (
    <p
      data-slot="field-description-or-requirement"
      data-state={state}
      className={cn(fieldDescriptionOrRequirementVariants({ state }), className)}
      {...props}
      ref={ref}
    >
      {showIcon ? (
        <Icon
          name={icon ?? stateIcon[state]}
          size={iconBox12}
          aria-hidden="true"
          className="shrink-0"
        />
      ) : null}
      {children}
    </p>
  );
}
