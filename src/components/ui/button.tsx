import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Icon, type IconName } from "@/components/icon";

const buttonVariants = cva(
  `inline-flex items-center justify-center shrink-0 whitespace-nowrap
   font-sans [font-weight:var(--semantics-typography-button-font-weight)] tracking-(--semantics-typography-button-tracking-normal)
   transition-colors outline-none cursor-pointer
   focus-visible:[outline:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
   focus-visible:[outline-offset:var(--primitives-spacing-0-75)]
   disabled:pointer-events-none disabled:cursor-default
   aria-disabled:pointer-events-none aria-disabled:cursor-default
   disabled:data-[loading]:opacity-(--primitives-opacity-opacity-100)
   aria-disabled:data-[loading]:opacity-(--primitives-opacity-opacity-100)
   [&_svg]:pointer-events-none [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        primary: `[background-color:var(--semantics-colors-background-primary)]
          [color:var(--semantics-colors-foreground-primary)]
          hover:[background-color:var(--semantics-colors-interaction-primary-hover)]
          active:[background-color:var(--semantics-colors-background-primary)]
          disabled:opacity-(--primitives-opacity-opacity-10)
          aria-disabled:opacity-(--primitives-opacity-opacity-10)`,

        secondary: `[background-color:var(--semantics-colors-background-secondary)]
          [color:var(--semantics-colors-foreground-default)]
          hover:[background-color:var(--semantics-colors-interaction-secondary-hover)]
          active:[background-color:var(--semantics-colors-background-secondary)]
          disabled:[color:var(--semantics-colors-foreground-subtle)]
          aria-disabled:[color:var(--semantics-colors-foreground-subtle)]
          disabled:opacity-(--primitives-opacity-opacity-50)
          aria-disabled:opacity-(--primitives-opacity-opacity-50)
          disabled:data-[loading]:[color:var(--semantics-colors-foreground-default)]
          aria-disabled:data-[loading]:[color:var(--semantics-colors-foreground-default)]`,

        destructive: `[background-color:var(--semantics-colors-background-destructive)]
          [color:var(--semantics-colors-foreground-destructive)]
          hover:[background-color:var(--semantics-colors-interaction-destructive-hover)]
          active:[background-color:var(--semantics-colors-background-destructive)]
          disabled:opacity-(--primitives-opacity-opacity-25)
          aria-disabled:opacity-(--primitives-opacity-opacity-25)`,

        outline: `bg-transparent [color:var(--semantics-colors-foreground-default)]
          border-solid border-(length:--primitives-border-width-border)
          [border-color:var(--semantics-colors-border-strong)]
          hover:[background-color:var(--semantics-colors-background-accent)]
          active:bg-transparent
          disabled:opacity-(--primitives-opacity-opacity-10)
          aria-disabled:opacity-(--primitives-opacity-opacity-10)`,

        ghost: `bg-transparent [color:var(--semantics-colors-foreground-default)]
          hover:[background-color:var(--semantics-colors-background-accent)]
          active:bg-transparent
          disabled:[color:var(--semantics-colors-foreground-subtle)]
          aria-disabled:[color:var(--semantics-colors-foreground-subtle)]
          disabled:opacity-(--primitives-opacity-opacity-50)
          aria-disabled:opacity-(--primitives-opacity-opacity-50)
          disabled:data-[loading]:[color:var(--semantics-colors-foreground-default)]
          aria-disabled:data-[loading]:[color:var(--semantics-colors-foreground-default)]`,
      },

      size: {
        lg: `h-(--primitives-spacing-12) rounded-(--primitives-radius-rounded-2xl)
          px-(--primitives-spacing-2-5) gap-(--primitives-spacing-1)
          text-(length:--semantics-typography-button-button-xl-font-size)
          leading-(--semantics-typography-button-button-xl-lh-snug)`,

        md: `h-(--primitives-spacing-11) rounded-(--primitives-radius-rounded-14)
          px-(--primitives-spacing-2) gap-(--primitives-spacing-1)
          text-(length:--semantics-typography-button-button-xl-font-size)
          leading-(--semantics-typography-button-button-xl-lh-snug)`,

        sm: `h-(--primitives-spacing-10) rounded-(--primitives-radius-rounded-xl)
          px-(--primitives-spacing-1-5) gap-(--primitives-spacing-0-5)
          text-(length:--semantics-typography-button-button-lg-font-size)
          leading-(--semantics-typography-button-button-lg-lh-snug)`,

        xs: `h-(--primitives-spacing-8) rounded-(--primitives-radius-rounded-10)
          px-(--primitives-spacing-1) gap-(--primitives-spacing-0-5)
          text-(length:--semantics-typography-button-button-md-font-size)
          leading-(--semantics-typography-button-button-md-lh-snug)`,

        "icon-lg":
          "h-(--primitives-spacing-12) w-(--primitives-spacing-12) rounded-(--primitives-radius-rounded-2xl)",

        "icon-md":
          "h-(--primitives-spacing-11) w-(--primitives-spacing-11) rounded-(--primitives-radius-rounded-14)",

        "icon-sm":
          "h-(--primitives-spacing-10) w-(--primitives-spacing-10) rounded-(--primitives-radius-rounded-xl)",

        "icon-xs":
          "h-(--primitives-spacing-8) w-(--primitives-spacing-8) rounded-(--primitives-radius-rounded-10)",
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
 * `primitives.spacing.5` (20px) and `primitives.spacing.4` (16px) — `Icon`'s
 * `size` prop is a plain number, so it can't be sourced from a CSS variable
 * at render time.
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
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  /** Icon rendered before the label. Ignored for icon-only sizes. */
  leadingIcon?: IconName;

  /** Icon rendered after the label. Ignored for icon-only sizes. */
  trailingIcon?: IconName;

  /** The icon to render for icon-only sizes (`icon-lg`, `icon-md`, `icon-sm`, `icon-xs`). */
  icon?: IconName;

  /**
   * Shows a leading loader indicator and prevents interaction.
   * Does not change the visual variant. An explicit `disabled` prop wins visually.
   */
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  leadingIcon,
  trailingIcon,
  icon,
  loading = false,
  disabled,
  type = "button",
  children,
  ref,
  ...props
}: ButtonProps) {
  const resolvedSize = size ?? "md";
  const isIconOnly = resolvedSize.startsWith("icon-");
  const iconSize = ICON_PIXEL_SIZE[resolvedSize];
  const showLoadingVisuals = loading && !disabled;
  const loader = <Icon name="loader" size={iconSize} className="animate-spin" />;

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
      disabled={disabled || loading}
      aria-busy={loading ? true : undefined}
      data-loading={showLoadingVisuals ? true : undefined}
      ref={ref}
    >
      {isIconOnly ? (
        loading ? loader : icon && <Icon name={icon} size={iconSize} />
      ) : (
        <>
          {loading ? loader : leadingIcon && <Icon name={leadingIcon} size={iconSize} />}
          {children}
          {trailingIcon && <Icon name={trailingIcon} size={iconSize} />}
        </>
      )}
    </button>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- shadcn convention: co-locate the CVA variants with their component.
export { buttonVariants };