import * as React from "react";

import { cn } from "@/lib/utils";
import "@/lib/focus-intent";
import { Icon, iconBox20, type IconName } from "@/components/icon";

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "type" | "size"> {
  /** Native input type. All types share the same chrome; native type behavior comes from the browser. */
  type?: "text" | "password" | "email";
  /** Marks the input as invalid. Mirrored to `aria-invalid` for styling and accessibility. */
  error?: boolean;
  /** Icon rendered before the value/placeholder. Purely decorative. */
  leadingIcon?: IconName;
  /** Icon rendered after the value/placeholder. Purely decorative. Ignored when `trailing` is set. */
  trailingIcon?: IconName;
  /** Interactive or custom content rendered after the value. The consumer owns the control. */
  trailing?: React.ReactNode;
}

export function Input({
  className,
  type = "text",
  error = false,
  leadingIcon,
  trailingIcon,
  trailing,
  disabled,
  ref,
  ...props
}: InputProps) {
  if (import.meta.env.DEV && trailing != null && trailingIcon) {
    console.warn("Input: `trailing` takes precedence over `trailingIcon`. Do not pass both.");
  }

  return (
    <div
      className={cn(
        `flex w-full items-center gap-(--primitives-spacing-1-5)
         h-(--primitives-spacing-11) rounded-(--primitives-radius-rounded-14)
         border border-input bg-background px-(--primitives-spacing-2-5)
         has-aria-invalid:[border-color:var(--semantics-colors-border-destructive)]
         has-[[data-slot=input]:focus]:border-(length:--primitives-stroke-width-border-2)
         has-[[data-slot=input]:focus]:px-(--primitives-spacing-2-25)
         has-[[data-slot=input]:focus]:[border-color:var(--semantics-colors-border-strong)]
         has-aria-invalid:has-[[data-slot=input]:focus]:[border-color:var(--semantics-colors-border-destructive)]
         intent-keyboard:has-[[data-slot=input]:focus]:[outline:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
         intent-keyboard:has-[[data-slot=input]:focus]:[outline-offset:var(--primitives-spacing-0-75)]
         has-disabled:opacity-(--primitives-opacity-opacity-40)
         [&_svg]:pointer-events-none [&_svg]:shrink-0
         [&_svg]:[color:var(--semantics-colors-foreground-subtle)]
         has-aria-invalid:[&_svg]:text-destructive-foreground`,
        className,
      )}
    >
      {leadingIcon && <Icon name={leadingIcon} size={iconBox20} aria-hidden="true" />}
      <input
        data-slot="input"
        type={type}
        disabled={disabled}
        aria-invalid={error}
        className={`flex-1 min-w-0 bg-transparent outline-none
          font-sans [font-weight:var(--semantics-typography-body-font-weight)]
          text-(length:--semantics-typography-body-body-lg-font-size)
          leading-(--semantics-typography-body-body-lg-lh-normal)
          tracking-(--semantics-typography-body-body-lg-tracking-tight)
          text-foreground placeholder:[color:var(--semantics-colors-foreground-subtle)]
          aria-invalid:text-destructive-foreground aria-invalid:placeholder:text-destructive-foreground
          disabled:cursor-default`}
        {...props}
        ref={ref}
      />
      {trailing ? (
        <span className={cn("flex shrink-0 items-center", disabled && "pointer-events-none")}>
          {trailing}
        </span>
      ) : (
        trailingIcon && <Icon name={trailingIcon} size={iconBox20} aria-hidden="true" />
      )}
    </div>
  );
}
