import * as React from "react";

import { cn } from "@/lib/utils";
import "@/lib/focus-intent";
import { Icon, type IconName } from "@/components/icon";

/**
 * Pixel size passed to the `Icon` component. Mirrors
 * `primitives.spacing.5` (20px) — `Icon`'s `size` prop is a
 * plain number, so it can't be sourced from a CSS variable at render time.
 */
const ICON_SIZE = 20;

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "type" | "size"> {
  /** Native input type. Both render identically except for browser masking behavior. */
  type?: "text" | "password";
  /** Marks the input as invalid. Mirrored to `aria-invalid` for styling and accessibility. */
  error?: boolean;
  /** Icon rendered before the value/placeholder. Purely decorative. */
  leadingIcon?: IconName;
  /** Icon rendered after the value/placeholder. Purely decorative. */
  trailingIcon?: IconName;
}

export function Input({
  className,
  type = "text",
  error = false,
  leadingIcon,
  trailingIcon,
  disabled,
  ref,
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        `flex w-full items-center gap-(--primitives-spacing-1-5)
         h-(--primitives-spacing-11) rounded-(--primitives-radius-rounded-14)
         border border-input bg-background px-(--primitives-spacing-2-5)
         has-aria-invalid:[border-color:var(--semantics-colors-border-destructive)]
         has-focus-within:border-(length:--primitives-border-width-border-2)
         has-focus-within:px-(--primitives-spacing-2-25)
         has-focus-within:[border-color:var(--semantics-colors-border-strong)]
         has-aria-invalid:has-focus-within:[border-color:var(--semantics-colors-border-destructive)]
         intent-keyboard:has-focus-within:[outline:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
         intent-keyboard:has-focus-within:[outline-offset:var(--primitives-spacing-0-75)]
         has-disabled:opacity-(--primitives-opacity-opacity-40)
         [&_svg]:pointer-events-none [&_svg]:shrink-0
         [&_svg]:[color:var(--semantics-colors-foreground-subtle)]
         has-aria-invalid:[&_svg]:text-destructive-foreground`,
        className,
      )}
    >
      {leadingIcon && <Icon name={leadingIcon} size={ICON_SIZE} aria-hidden="true" />}
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
      {trailingIcon && <Icon name={trailingIcon} size={ICON_SIZE} aria-hidden="true" />}
    </div>
  );
}
