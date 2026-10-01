import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon, iconBox16 } from "@/components/icon";

const focusRing = `relative outline-none
  after:pointer-events-none after:absolute after:content-[''] after:hidden
  after:[inset:calc(-1*(var(--primitives-spacing-0-75)+var(--primitives-ring-focus-width-ring-2)))]
  after:[border:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
  after:[border-radius:var(--primitives-radius-rounded-sm)]
  focus-visible:after:block`;

const linkClassName = `inline-flex h-(--primitives-spacing-8) shrink-0 items-center justify-center
  px-(--primitives-spacing-1) no-underline
  font-sans [font-weight:var(--primitives-typography-font-weight-regular)]
  text-(length:--semantics-typography-label-label-sm-font-size)
  leading-(--semantics-typography-label-label-sm-lh-snug)
  tracking-(--semantics-typography-label-label-sm-tracking-0-125)
  whitespace-nowrap [color:inherit] cursor-pointer
  hover:[color:var(--semantics-colors-interaction-navigation-link-hover)]
  ${focusRing}`;

const menuLinkClassName = `flex w-full items-center justify-start no-underline
  px-(--primitives-spacing-2) py-(--primitives-spacing-1-5)
  font-sans [font-weight:var(--semantics-typography-heading-font-weight)]
  text-(length:--semantics-typography-heading-heading-xl-font-size)
  leading-(--semantics-typography-heading-heading-xl-lh-tight)
  tracking-(--semantics-typography-heading-heading-xl-tracking-tight)
  whitespace-nowrap cursor-pointer
  [color:var(--semantics-colors-foreground-primary)]
  hover:[color:var(--semantics-colors-interaction-navigation-link-hover)]
  ${focusRing}`;

const iconButtonClassName = `box-border inline-flex shrink-0 items-center justify-center
  border-0 bg-transparent p-0 [color:inherit] cursor-pointer
  hover:[color:var(--semantics-colors-interaction-navigation-link-hover)]
  size-(--primitives-spacing-9)
  ${focusRing}`;

function NavigationMark() {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="size-(--primitives-spacing-3)"
      fill="currentColor"
    >
      <rect x="4" y="0" width="4" height="4" rx="2" />
      <rect x="4" y="4" width="4" height="4" rx="2" />
      <rect x="4" y="8" width="4" height="4" rx="2" />
      <path d="M0 4A4 4 0 0 1 4 0V6A2 2 0 0 1 2 8A2 2 0 0 1 0 6Z" />
      <path d="M8 6A2 2 0 0 1 10 4A2 2 0 0 1 12 6V8A4 4 0 0 1 8 12Z" />
      <path d="M4 8H2A2 2 0 0 0 2 12H4Z" />
      <path d="M8 0H10A2 2 0 0 1 12 2V2A2 2 0 0 1 10 4H8V0Z" />
    </svg>
  );
}

export function NavigationLink({ className, ref, ...props }: React.ComponentProps<"a">) {
  return <a data-slot="navigation-link" ref={ref} className={cn(linkClassName, className)} {...props} />;
}

export function NavigationMenuLink({ className, ref, ...props }: React.ComponentProps<"a">) {
  return (
    <a data-slot="navigation-menu-link" ref={ref} className={cn(menuLinkClassName, className)} {...props} />
  );
}

export function NavigationSection({
  heading,
  children,
  className,
}: {
  /** Section label. Omit it for the first mobile section, which has no heading. */
  heading?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-slot="navigation-section"
      className={cn(
        "flex w-full flex-col items-start gap-(--primitives-spacing-2) px-(--primitives-spacing-2) py-(--primitives-spacing-1) md:w-auto",
        className,
      )}
    >
      {heading ? (
        <h2
          data-slot="navigation-section-heading"
          className="px-(--primitives-spacing-2) font-sans
            [font-weight:var(--primitives-typography-font-weight-regular)]
            text-(length:--semantics-typography-label-label-sm-font-size)
            leading-(--semantics-typography-label-label-sm-lh-snug)
            tracking-(--semantics-typography-label-label-sm-tracking-0-125)
            [color:var(--semantics-colors-foreground-subtle-on-dark)]"
        >
          {heading}
        </h2>
      ) : null}
      <div className="flex w-full flex-col gap-(--primitives-spacing-2) py-(--primitives-spacing-2) md:w-auto">
        {children}
      </div>
    </section>
  );
}

export interface NavigationProps extends Omit<React.ComponentProps<"header">, "children"> {
  /** Primary links. Hidden below the `md` breakpoint. */
  children?: React.ReactNode;
  /** Shared open panel. One menu for the bar, not a submenu per link. */
  menu?: React.ReactNode;
  /** Controlled open state. Desktop has no extra trigger; mobile uses the menu button. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Destination of the mark. The mark is decorative; this link carries the name. */
  logoHref: string;
  /** Accessible name for the mark link. */
  logoLabel: string;
  /** Accessible name for the search button. */
  searchLabel: string;
  /** Accessible name for the menu button. Shown below the `md` breakpoint. */
  menuLabel: string;
  /** Accessible name for the close button shown while the menu is open on mobile. */
  closeLabel: string;
  /** Shows the back control on the left of the mobile close header. */
  onBack?: () => void;
  /** Accessible name for the back control. Required when `onBack` is set. */
  backLabel?: string;
  onSearch?: () => void;
  onMenu?: () => void;
}

export function Navigation({
  children,
  menu,
  open = false,
  onOpenChange,
  className,
  logoHref,
  logoLabel,
  searchLabel,
  menuLabel,
  closeLabel,
  onBack,
  backLabel,
  onSearch,
  onMenu,
  ref,
  ...props
}: NavigationProps) {
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const returnFocusToMenu = React.useRef(false);

  function requestOpen() {
    returnFocusToMenu.current = true;
    onMenu?.();
    onOpenChange?.(true);
  }

  function requestClose() {
    onOpenChange?.(false);
  }

  React.useEffect(() => {
    if (!open) {
      if (returnFocusToMenu.current) {
        menuButtonRef.current?.focus();
        returnFocusToMenu.current = false;
      }
      return;
    }

    if (returnFocusToMenu.current) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      onOpenChange?.(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const bar = (
    <header
      data-slot="navigation"
      ref={ref}
      className={cn(
        `flex w-full items-center justify-between
         [color:var(--semantics-colors-foreground-primary)]
         md:justify-center md:gap-(--primitives-spacing-10)
         px-(--primitives-spacing-2) py-(--primitives-spacing-1-5)
         md:px-(--primitives-spacing-6)`,
        open
          ? `max-md:[background-color:var(--semantics-colors-background-primary)]
             md:[background-color:var(--semantics-colors-background-primary-blur)]
             md:[backdrop-filter:blur(var(--semantics-glass-navigation-frost))]`
          : `[background-color:var(--semantics-colors-background-primary-blur)]
             [backdrop-filter:blur(var(--semantics-glass-navigation-frost))]`,
        className,
      )}
      {...props}
    >
      <a
        href={logoHref}
        aria-label={logoLabel}
        className={cn(
          iconButtonClassName,
          "md:h-(--primitives-spacing-8) md:w-auto md:px-(--primitives-spacing-1)",
          open && "max-md:hidden",
        )}
      >
        <span className="inline-flex size-(--primitives-spacing-4) items-center justify-center">
          <NavigationMark />
        </span>
      </a>
      <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-(--primitives-spacing-10)">
        {children}
      </nav>
      <div className={cn("flex items-center gap-(--primitives-spacing-4)", open && "max-md:hidden")}>
        <button
          type="button"
          aria-label={searchLabel}
          onClick={onSearch}
          className={cn(
            iconButtonClassName,
            "md:h-(--primitives-spacing-8) md:w-auto md:px-(--primitives-spacing-1)",
          )}
        >
          <Icon name="search" size={iconBox16} />
        </button>
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuLabel}
          aria-expanded={open}
          onClick={requestOpen}
          className={cn(iconButtonClassName, "md:hidden")}
        >
          <Icon name="menu" size={iconBox16} />
        </button>
      </div>
      {open ? (
        <div
          className={cn(
            "flex w-full items-center md:hidden",
            onBack ? "justify-between" : "justify-end",
          )}
        >
          {onBack ? (
            <button type="button" aria-label={backLabel} onClick={onBack} className={iconButtonClassName}>
              <Icon name="chevron-left" size={iconBox16} />
            </button>
          ) : null}
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={closeLabel}
            onClick={requestClose}
            className={iconButtonClassName}
          >
            <Icon name="x" size={iconBox16} />
          </button>
        </div>
      ) : null}
    </header>
  );

  if (!open) return bar;

  return (
    <div className="flex min-h-dvh flex-col">
      {bar}
      <nav
        data-slot="navigation-menu"
        aria-label={menuLabel}
        className="flex w-full flex-1 flex-col gap-(--primitives-spacing-12)
          [background-color:var(--semantics-colors-background-primary)]
          [color:var(--semantics-colors-foreground-primary)]
          md:flex-none md:flex-row md:justify-center md:gap-(--primitives-spacing-20)
          md:pt-(--primitives-spacing-10) md:pb-(--primitives-spacing-20)"
      >
        {menu}
      </nav>
      <div
        data-slot="navigation-scrim"
        aria-hidden="true"
        className="hidden w-full flex-1 md:block
          [background-color:var(--semantics-colors-background-primary-blur)]
          [backdrop-filter:blur(var(--semantics-background-blur-navigation))]"
      />
    </div>
  );
}
