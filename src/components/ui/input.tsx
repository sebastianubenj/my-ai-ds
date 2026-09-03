import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/icon";

/**
 * Pixel size passed to the `Icon` component. Mirrors
 * `semantics.controls.size.icon-lg.size` (20px) — `Icon`'s `size` prop is a
 * plain number, so it can't be sourced from a CSS variable at render time.
 */
const ICON_SIZE = 20;

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type" | "size"> {
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
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        `flex w-full items-center gap-(--control-gap-lg)
         h-(--control-height-md) rounded-(--control-radius-md)
         border border-input bg-background px-(--control-padding-inline-lg)
         has-disabled:bg-muted
         has-aria-invalid:[border-color:var(--semantics-colors-controls-border-destructive)]
         has-disabled:has-aria-invalid:border-input
         has-focus:[box-shadow:var(--effect-focus-default)]
         has-aria-invalid:has-focus:[box-shadow:var(--effect-focus-destructive)]
         [&_svg]:pointer-events-none [&_svg]:shrink-0
         [&_svg]:text-muted-foreground has-aria-invalid:[&_svg]:text-destructive-foreground
         has-disabled:[&_svg]:[color:var(--semantics-colors-controls-fg-disabled)]`,
        className,
      )}
    >
      {leadingIcon && <Icon name={leadingIcon} size={ICON_SIZE} aria-hidden="true" />}
      <input
        type={type}
        disabled={disabled}
        aria-invalid={error}
        className={`flex-1 min-w-0 bg-transparent outline-none
          font-sans [font-weight:var(--semantics-typography-body-font-weight)]
          text-(length:--semantics-typography-body-body-lg-font-size)
          leading-(--semantics-typography-body-body-lg-lh-normal)
          tracking-(--semantics-typography-body-body-lg-tracking-tight)
          text-foreground placeholder:text-muted-foreground
          aria-invalid:text-destructive-foreground aria-invalid:placeholder:text-destructive-foreground
          disabled:cursor-not-allowed disabled:[color:var(--semantics-colors-controls-fg-disabled)]
          disabled:placeholder:[color:var(--semantics-colors-controls-fg-disabled)]
          disabled:aria-invalid:[color:var(--semantics-colors-controls-fg-disabled)]
          disabled:aria-invalid:placeholder:[color:var(--semantics-colors-controls-fg-disabled)]`}
        {...props}
      />
      {trailingIcon && <Icon name={trailingIcon} size={ICON_SIZE} aria-hidden="true" />}
    </div>
  );
}
