import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon, iconBox16 } from "@/components/icon";

const ICON_STROKE_WIDTH = 2;

export interface CheckboxToggleProps
  extends Omit<React.ComponentProps<"input">, "type" | "size"> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

export function CheckboxToggle({
  className,
  checked,
  defaultChecked,
  indeterminate = false,
  disabled,
  invalid = false,
  onChange,
  ref,
  ...props
}: CheckboxToggleProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, checked]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.currentTarget.indeterminate = indeterminate;
    onChange?.(event);
  }

  return (
    <span
      className={cn(
        `relative inline-flex shrink-0 items-center justify-center
         size-(--primitives-spacing-out-of-scale-4-5)
         has-disabled:opacity-(--primitives-opacity-opacity-45)
         has-disabled:has-[:checked]:opacity-(--primitives-opacity-opacity-15)
         has-disabled:has-[:indeterminate]:opacity-(--primitives-opacity-opacity-15)
         [&_svg]:pointer-events-none [&_svg]:shrink-0
         [&_svg]:[color:var(--semantics-colors-foreground-primary)]`,
        className,
      )}
    >
      <input
        {...props}
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        data-slot="checkbox-toggle"
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-invalid={invalid}
        onChange={handleChange}
        className={`peer absolute inset-0 m-0 cursor-pointer appearance-none
          rounded-(--primitives-radius-rounded-sm)
          [background-color:var(--semantics-colors-background-default)]
          border-solid border-(length:--primitives-stroke-width-stroke)
          [border-color:var(--semantics-colors-border-default)]
          outline-none
          focus-visible:[outline:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
          focus-visible:[outline-offset:var(--primitives-spacing-out-of-scale-0-75)]
          checked:[background-color:var(--semantics-colors-background-primary)]
          checked:border-0
          checked:p-(--primitives-spacing-out-of-scale-0-25)
          indeterminate:[background-color:var(--semantics-colors-background-primary)]
          indeterminate:border-0
          indeterminate:p-(--primitives-spacing-out-of-scale-0-25)
          aria-invalid:[border-color:var(--semantics-colors-border-destructive)]
          aria-invalid:checked:border-0
          aria-invalid:indeterminate:border-0
          aria-invalid:checked:[box-shadow:inset_0_0_0_var(--primitives-stroke-width-stroke)_var(--semantics-colors-border-destructive)]
          aria-invalid:indeterminate:[box-shadow:inset_0_0_0_var(--primitives-stroke-width-stroke)_var(--semantics-colors-border-destructive)]
          disabled:pointer-events-none disabled:cursor-default`}
      />
      <Icon
        name="check"
        size={iconBox16}
        strokeWidth={ICON_STROKE_WIDTH}
        aria-hidden="true"
        className="pointer-events-none relative z-10 hidden peer-checked:block peer-indeterminate:hidden"
      />
      <Icon
        name="minus"
        size={iconBox16}
        strokeWidth={ICON_STROKE_WIDTH}
        aria-hidden="true"
        className="pointer-events-none relative z-10 hidden peer-indeterminate:block"
      />
    </span>
  );
}
