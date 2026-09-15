import * as React from "react";

import { cn } from "@/lib/utils";

export interface RadioToggleProps
  extends Omit<React.ComponentProps<"input">, "type" | "size"> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

export function RadioToggle({
  className,
  checked,
  defaultChecked,
  disabled,
  invalid = false,
  ref,
  ...props
}: RadioToggleProps) {
  return (
    <span
      className={cn(
        `relative inline-flex align-middle shrink-0 items-center justify-center
         size-(--primitives-spacing-4-5)
         has-disabled:opacity-(--primitives-opacity-opacity-45)
         has-disabled:has-[:checked]:opacity-(--primitives-opacity-opacity-15)`,
        className,
      )}
    >
      <input
        {...props}
        data-slot="radio"
        type="radio"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-invalid={invalid}
        className={`peer absolute inset-0 m-0 cursor-pointer appearance-none
          [border-radius:var(--primitives-radius-rounded-full)]
          [background-color:var(--semantics-colors-background-default)]
          border-solid border-(length:--primitives-border-width-border)
          [border-color:var(--semantics-colors-border-default)]
          outline-none
          focus-visible:[outline:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
          focus-visible:[outline-offset:var(--primitives-spacing-0-75)]
          checked:[border-color:var(--semantics-colors-border-strong)]
          aria-invalid:[border-color:var(--semantics-colors-border-destructive)]
          aria-invalid:checked:[border-color:var(--semantics-colors-border-destructive)]
          disabled:pointer-events-none disabled:cursor-default`}
        ref={ref}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none relative z-10 hidden size-[var(--primitives-spacing-2-5)] shrink-0
          [border-radius:var(--primitives-radius-rounded-full)]
          [background-color:var(--semantics-colors-background-primary)]
          peer-checked:block
          peer-aria-invalid:[background-color:var(--semantics-colors-foreground-destructive)]`}
      />
    </span>
  );
}
