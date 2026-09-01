import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/icon";

const buttonVariants = cva(
  `inline-flex items-center justify-center shrink-0 whitespace-nowrap
   font-sans [font-weight:var(--button-font-weight)] tracking-(--button-tracking-normal)
   transition-colors outline-none
   disabled:pointer-events-none disabled:cursor-not-allowed
   aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed
   [&_svg]:pointer-events-none [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        primary: `bg-primary text-primary-foreground
          hover:[background-color:var(--button-primary-bg-hover)]
          focus-visible:[box-shadow:0_0_0_var(--ring-focus-width)_var(--ring)]
          disabled:opacity-25 aria-disabled:opacity-25`,
        secondary: `bg-secondary text-secondary-foreground
          hover:[background-color:var(--button-secondary-bg-hover)]
          focus-visible:[box-shadow:0_0_0_var(--ring-focus-width)_var(--ring)]
          disabled:[color:var(--button-secondary-fg-disabled)]
          aria-disabled:[color:var(--button-secondary-fg-disabled)]`,
        destructive: `bg-destructive text-destructive-foreground
          hover:[background-color:var(--button-destructive-bg-hover)]
          focus-visible:[box-shadow:0_0_0_var(--ring-focus-width)_var(--button-destructive-ring-focus)]
          disabled:opacity-25 aria-disabled:opacity-25`,
        outline: `bg-transparent text-secondary-foreground border border-border
          hover:bg-accent
          focus-visible:[box-shadow:0_0_0_var(--ring-focus-width)_var(--ring)]
          disabled:opacity-25 aria-disabled:opacity-25`,
        ghost: `bg-transparent text-secondary-foreground
          hover:bg-accent
          focus-visible:[box-shadow:0_0_0_var(--ring-focus-width)_var(--ring)]
          disabled:[color:var(--button-secondary-fg-disabled)]
          aria-disabled:[color:var(--button-secondary-fg-disabled)]`,
      },
      size: {
        lg: `h-(--control-height-lg) rounded-(--control-radius-lg)
          px-(--control-padding-inline-lg) gap-(--control-gap-lg)
          text-(length:--button-text-lg) leading-(--button-leading-lg)`,
        md: `h-(--control-height-md) rounded-(--control-radius-md)
          px-(--control-padding-inline-lg) gap-(--control-gap-lg)
          text-(length:--button-text-lg) leading-(--button-leading-lg)`,
        sm: `h-(--control-height-sm) rounded-(--control-radius-sm)
          px-(--control-padding-inline-md) gap-(--control-gap-sm)
          text-(length:--button-text-sm) leading-(--button-leading-sm)`,
        xs: `h-(--control-height-xs) rounded-(--control-radius-xs)
          px-(--control-padding-inline-sm) gap-(--control-gap-sm)
          text-(length:--button-text-xs) leading-(--button-leading-xs)`,
        "icon-lg": "h-(--control-height-lg) w-(--control-height-lg) rounded-(--control-radius-lg)",
        "icon-md": "h-(--control-height-md) w-(--control-height-md) rounded-(--control-radius-md)",
        "icon-sm": "h-(--control-height-sm) w-(--control-height-sm) rounded-(--control-radius-sm)",
        "icon-xs": "h-(--control-height-xs) w-(--control-height-xs) rounded-(--control-radius-xs)",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

/**
 * Pixel size passed to the `Icon` component per Button size tier. Mirrors
 * `semantics.controls.size.icon-lg.size` (20px) and
 * `semantics.controls.size.icon-sm.size` (16px) — `Icon`'s `size` prop is a
 * plain number, so it can't be sourced from a CSS variable at render time.
 */
const ICON_PIXEL_SIZE: Record<ButtonSize, number> = {
  lg: 20,
  md: 20,
  sm: 16,
  xs: 16,
  "icon-lg": 20,
  "icon-md": 20,
  "icon-sm": 16,
  "icon-xs": 16,
};

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  /** Icon rendered before the label. Ignored for icon-only sizes. */
  leadingIcon?: IconName;
  /** Icon rendered after the label. Ignored for icon-only sizes. */
  trailingIcon?: IconName;
  /** The icon to render for icon-only sizes (`icon-lg`, `icon-md`, `icon-sm`, `icon-xs`). */
  icon?: IconName;
}

export function Button({
  className,
  variant,
  size,
  leadingIcon,
  trailingIcon,
  icon,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const resolvedSize = size ?? "md";
  const isIconOnly = resolvedSize.startsWith("icon-");
  const iconSize = ICON_PIXEL_SIZE[resolvedSize];

  if (import.meta.env.DEV) {
    if (isIconOnly && !icon) {
      console.warn("Button: an `icon` prop is required when using an icon-only `size`.");
    }
    if (isIconOnly && !props["aria-label"] && !props["aria-labelledby"]) {
      console.warn(
        "Button: icon-only buttons must have an accessible name via `aria-label` or `aria-labelledby`.",
      );
    }
  }

  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size: resolvedSize }), className)}
      {...props}
    >
      {isIconOnly ? (
        icon && <Icon name={icon} size={iconSize} />
      ) : (
        <>
          {leadingIcon && <Icon name={leadingIcon} size={iconSize} />}
          {children}
          {trailingIcon && <Icon name={trailingIcon} size={iconSize} />}
        </>
      )}
    </button>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- shadcn convention: co-locate the CVA variants with their component.
export { buttonVariants };
