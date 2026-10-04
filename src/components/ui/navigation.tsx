import * as React from "react";
import { NavigationMenu } from "@base-ui/react/navigation-menu";

import { cn } from "@/lib/utils";
import { scrollbarClassName } from "@/lib/scrollbar";
import { Icon, iconBox16, iconBox20 } from "@/components/icon";

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
  px-(--primitives-spacing-8) py-(--primitives-spacing-1-5) md:px-(--primitives-spacing-2)
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

const chevronClassName = `absolute top-0 left-[calc(100%-var(--primitives-spacing-1)+var(--primitives-spacing-1-5))]
  box-border inline-flex h-(--primitives-spacing-8) w-(--primitives-spacing-3) items-center justify-center
  pt-(--primitives-spacing-1)
  border-0 bg-transparent [color:inherit] cursor-pointer
  pointer-events-none opacity-0
  group-has-[:focus-visible]/item:pointer-events-auto group-has-[:focus-visible]/item:opacity-100
  hover:[color:var(--semantics-colors-interaction-navigation-link-hover)]`;

const SEARCH_VALUE = "search";
const DESKTOP_QUERY = "(min-width: 48rem)";

const searchFieldClassName = `box-border flex w-full items-center
  gap-(--primitives-spacing-2-5) py-(--primitives-spacing-1-5)
  [color:var(--semantics-colors-foreground-primary)]`;

const searchInputClassName = `min-w-0 flex-1 border-0 bg-transparent p-0 outline-none font-sans
  [font-weight:var(--semantics-typography-heading-font-weight)]
  text-(length:--semantics-typography-heading-heading-xl-font-size)
  leading-(--semantics-typography-heading-heading-xl-lh-tight)
  tracking-(--semantics-typography-heading-heading-xl-tracking-tight)
  [color:var(--semantics-colors-foreground-primary)]
  placeholder:[color:var(--semantics-colors-foreground-subtle-on-dark)]
  [&::-webkit-search-cancel-button]:hidden`;

function useIsDesktop() {
  return React.useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(DESKTOP_QUERY);
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

const TRIGGER_SELECTOR =
  "[data-slot=navigation-link-menu-trigger],[data-slot=navigation-search-trigger]";

interface NavigationContextValue {
  openFromHover: (value: string | null) => void;
  cancelPendingOpen: () => void;
  /** Opens the panel of a link on its first touch. Returns false when it is already open. */
  openFromTouch: (value: string) => boolean;
}

interface MobileLevelContextValue {
  push: (content: React.ReactNode) => void;
}

const MobileLevelContext = React.createContext<MobileLevelContextValue | null>(
  null,
);

const NavigationContext = React.createContext<NavigationContextValue | null>(
  null,
);

/*
 * Motion follows the Apple global nav (apple.com) and uses the `semantics.motion` tokens:
 * 320ms for the panel, 240ms for items and levels, 200ms for items leaving, 120ms for the menu
 * icon, 30ms and 40ms for the blink between links, `delay-reveal` and `stagger` for the item entrance.
 */
// Transitions read the motion tokens through CSS. Web Animations and timers cannot, so they
// read the same custom properties at the moment they run.
function motionToken(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--semantics-motion-${name}`)
    .trim();
}

function motionMs(name: string) {
  const value = Number.parseFloat(motionToken(name));
  return Number.isFinite(value) ? value : 0;
}

const ease = "ease-(--semantics-motion-easing-standard)";

// Opening and closing reveal the panel with `clip-path`, because Base UI hands the popup `auto`
// or `0px` heights at those moments and a height transition cannot start from them. Height
// changes while switching links are animated by `useAnimatedHeight`.
const panelMotionClassName = `[transition-property:clip-path] duration-(--semantics-motion-duration-320) ${ease}
  [clip-path:inset(0_0_0_0)]
  data-starting-style:[clip-path:inset(0_0_100%_0)]
  data-ending-style:[clip-path:inset(0_0_100%_0)]
  motion-reduce:transition-none`;

// The popup carries `data-switch` only while it is already open and changes link. The texts
// then blink: the outgoing content disappears and the incoming one appears in 30ms and 40ms.
const panelContentClassName = `flex w-full justify-center gap-(--primitives-spacing-20)
  pt-(--primitives-spacing-10) pb-(--primitives-spacing-20)
  motion-reduce:transition-none
  group-data-[switch]/popup:[transition-property:opacity]
  group-data-[switch]/popup:duration-(--semantics-motion-duration-40)
  group-data-[switch]/popup:ease-(--semantics-motion-easing-standard)
  group-data-[switch]/popup:[transition-delay:var(--semantics-motion-duration-30)]
  group-data-[switch]/popup:data-starting-style:opacity-0
  group-data-[switch]/popup:data-ending-style:opacity-0
  group-data-[switch]/popup:data-ending-style:duration-(--semantics-motion-duration-30)
  group-data-[switch]/popup:data-ending-style:[transition-delay:0ms]`;

// Items fade and drop in below an ancestor `group/popup` carrying `data-starting-style` and
// `data-ending-style`, which Base UI sets on the desktop popup and `usePresence` sets on mobile.
const itemMotionClassName = `[transition-property:opacity,translate] duration-(--semantics-motion-duration-240) ${ease}
  [transition-delay:calc(var(--semantics-motion-delay-reveal)+var(--semantics-motion-stagger)*min(var(--nav-group,0)*8+var(--nav-index,0),12))]
  md:[transition-delay:calc(var(--semantics-motion-delay-reveal)+var(--semantics-motion-stagger)*var(--nav-index,0))]
  group-data-starting-style/popup:opacity-0
  group-data-starting-style/popup:-translate-y-(--primitives-spacing-2)
  group-data-ending-style/popup:opacity-0
  group-data-ending-style/popup:-translate-y-(--primitives-spacing-2)
  group-data-ending-style/popup:duration-(--semantics-motion-duration-200)
  group-data-ending-style/popup:[transition-delay:0ms]
  motion-reduce:transition-none`;

// Sections take a group position from their place in the panel, and the items of a section take
// theirs from their order inside it. It is done in CSS so links wrapped in components still
// count. Mobile adds both, capped at 12 steps (240ms), so a long menu never waits long to
// settle. Desktop animates all sections together and only uses the item position, capped at 7.
const groupIndexClassName = `[&:nth-child(1)]:[--nav-group:0] [&:nth-child(2)]:[--nav-group:1]
  [&:nth-child(3)]:[--nav-group:2] [&:nth-child(n+4)]:[--nav-group:3]`;

const itemIndexClassName = `[&>:nth-child(1)]:[--nav-index:0] [&>:nth-child(2)]:[--nav-index:1]
  [&>:nth-child(3)]:[--nav-index:2] [&>:nth-child(4)]:[--nav-index:3]
  [&>:nth-child(5)]:[--nav-index:4] [&>:nth-child(6)]:[--nav-index:5]
  [&>:nth-child(7)]:[--nav-index:6] [&>:nth-child(n+8)]:[--nav-index:7]`;

// Animates the popup height when its content changes size while it is open. Base UI sizes the
// popup through CSS variables, but it only animates that for triggers it activates itself.
function useAnimatedHeight(
  popup: HTMLElement | null,
  viewport: HTMLElement | null,
) {
  React.useEffect(() => {
    if (!popup || !viewport) return;

    let previous = viewport.offsetHeight;
    let animation: Animation | null = null;

    // A mutation observer rather than a resize observer: animating the popup from a resize
    // callback changes sizes Base UI observes and raises a resize loop error.
    const observer = new MutationObserver(() => {
      const next = viewport.offsetHeight;
      if (next === previous) return;

      const settled =
        !popup.hasAttribute("data-starting-style") &&
        !popup.hasAttribute("data-ending-style");
      const from =
        animation?.playState === "running"
          ? popup.getBoundingClientRect().height
          : previous;
      animation?.cancel();
      animation = null;

      if (
        settled &&
        from > 0 &&
        next > 0 &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        animation = popup.animate(
          [{ height: `${from}px` }, { height: `${next}px` }],
          {
            duration: motionMs("duration-320"),
            easing: motionToken("easing-standard"),
          },
        );
      }
      previous = next;
    });

    observer.observe(viewport, { childList: true });
    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, [popup, viewport]);
}

type PresencePhase = "closed" | "starting" | "open" | "ending";

// Keeps a conditionally rendered panel mounted while it animates out, and exposes the
// `starting` and `ending` phases as the same data attributes Base UI uses.
function usePresence(present: boolean, exitToken: string) {
  const [phase, setPhase] = React.useState<PresencePhase>(
    present ? "open" : "closed",
  );
  const [previous, setPrevious] = React.useState(present);

  if (previous !== present) {
    setPrevious(present);
    setPhase(present ? "starting" : "ending");
  }

  React.useEffect(() => {
    if (phase === "starting") {
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setPhase("open"));
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
      };
    }
    if (phase === "ending") {
      const timer = window.setTimeout(
        () => setPhase("closed"),
        motionMs(exitToken),
      );
      return () => window.clearTimeout(timer);
    }
  }, [phase, exitToken]);

  return {
    mounted: phase !== "closed",
    attributes: {
      "data-starting-style": phase === "starting" ? "" : undefined,
      "data-ending-style": phase === "ending" ? "" : undefined,
    },
  };
}

// Mobile levels slide sideways while they cross-fade, as on apple.com: going forward the
// current level leaves to the left and the next one arrives from the right, and going back
// does the opposite. Everything uses the same duration.
const levelMotion = `duration-(--semantics-motion-duration-240) ${ease} motion-reduce:animate-none`;
const levelEnter = {
  forward: `animate-in fade-in slide-in-from-right-[length:var(--primitives-spacing-6)] ${levelMotion}`,
  back: `animate-in fade-in slide-in-from-left-[length:var(--primitives-spacing-6)] ${levelMotion}`,
};
const levelExit = {
  forward: `animate-out fade-out fill-mode-forwards slide-out-to-left-[length:var(--primitives-spacing-6)] ${levelMotion} motion-reduce:hidden`,
  back: `animate-out fade-out fill-mode-forwards slide-out-to-right-[length:var(--primitives-spacing-6)] ${levelMotion} motion-reduce:hidden`,
};

function MobileLevelView({
  level,
  menu,
  context,
}: {
  level: React.ReactNode;
  menu: React.ReactNode;
  context: MobileLevelContextValue;
}) {
  const [current, setCurrent] = React.useState(level);
  const [direction, setDirection] = React.useState<"forward" | "back" | null>(
    null,
  );
  const [leaving, setLeaving] = React.useState<React.ReactNode | undefined>(
    undefined,
  );

  if (current !== level) {
    setDirection(level === null ? "back" : "forward");
    setLeaving(current);
    setCurrent(level);
  }

  React.useEffect(() => {
    if (leaving === undefined) return;
    const timer = window.setTimeout(
      () => setLeaving(undefined),
      motionMs("duration-240"),
    );
    return () => window.clearTimeout(timer);
  }, [leaving]);

  const layerClassName =
    "flex min-h-[calc(100dvh-var(--navigation-bar-height,var(--primitives-spacing-12)))] flex-col gap-(--primitives-spacing-12)";
  // The first block of the second level has no heading.
  const levelClassName = "[&>section:first-child>h2]:hidden";

  return (
    <div className="relative">
      {leaving !== undefined && direction ? (
        <div
          key="leaving"
          inert
          aria-hidden="true"
          className={cn(
            layerClassName,
            "pointer-events-none absolute inset-x-0 top-0",
            leaving !== null && levelClassName,
            levelExit[direction],
          )}
        >
          <MobileLevelContext.Provider value={context}>
            {leaving ?? menu}
          </MobileLevelContext.Provider>
        </div>
      ) : null}
      <div
        key={current === null ? "root" : "level"}
        className={cn(
          layerClassName,
          current !== null && levelClassName,
          direction && levelEnter[direction],
        )}
      >
        <MobileLevelContext.Provider value={context}>
          {current ?? menu}
        </MobileLevelContext.Provider>
      </div>
    </div>
  );
}

function NavigationMenuIcon({ open }: { open: boolean }) {
  const rotate = `[transform-box:view-box] [transform-origin:8px_8px] motion-reduce:[transition:none]`;
  const slide = `motion-reduce:[transition:none]`;

  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      data-state={open ? "open" : "closed"}
      className="group/menu-icon size-(--primitives-spacing-4) fill-none stroke-current [stroke-width:var(--primitives-stroke-width-border-1-33)]"
      strokeLinecap="round"
    >
      <g
        className={cn(
          rotate,
          "[transition:rotate_var(--semantics-motion-duration-120)_var(--semantics-motion-easing-in)_0ms]",
          "group-data-[state=open]/menu-icon:rotate-45",
          "group-data-[state=open]/menu-icon:[transition:rotate_var(--semantics-motion-duration-120)_var(--semantics-motion-easing-out)_var(--semantics-motion-duration-120)]",
        )}
      >
        <line
          x1="2.67"
          y1="5.5"
          x2="13.33"
          y2="5.5"
          className={cn(
            slide,
            "[transition:translate_var(--semantics-motion-duration-120)_var(--semantics-motion-easing-out)_var(--semantics-motion-duration-120)]",
            "group-data-[state=open]/menu-icon:translate-y-[2.5px]",
            "group-data-[state=open]/menu-icon:[transition:translate_var(--semantics-motion-duration-120)_var(--semantics-motion-easing-in)_0ms]",
          )}
        />
      </g>
      <g
        className={cn(
          rotate,
          "[transition:rotate_var(--semantics-motion-duration-120)_var(--semantics-motion-easing-in)_0ms]",
          "group-data-[state=open]/menu-icon:-rotate-45",
          "group-data-[state=open]/menu-icon:[transition:rotate_var(--semantics-motion-duration-120)_var(--semantics-motion-easing-out)_var(--semantics-motion-duration-120)]",
        )}
      >
        <line
          x1="2.67"
          y1="10.5"
          x2="13.33"
          y2="10.5"
          className={cn(
            slide,
            "[transition:translate_var(--semantics-motion-duration-120)_var(--semantics-motion-easing-out)_var(--semantics-motion-duration-120)]",
            "group-data-[state=open]/menu-icon:-translate-y-[2.5px]",
            "group-data-[state=open]/menu-icon:[transition:translate_var(--semantics-motion-duration-120)_var(--semantics-motion-easing-in)_0ms]",
          )}
        />
      </g>
    </svg>
  );
}

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

interface NavigationLinkBaseProps extends React.ComponentProps<"a"> {
  /** Identifies the link in `Navigation` `value` and `defaultValue`. Generated when omitted. */
  value?: string;
}

export type NavigationLinkProps = NavigationLinkBaseProps &
  (
    | {
        menu?: undefined;
        menuLabel?: never;
      }
    | {
        /**
         * Panel content for this link, usually `NavigationSection` elements. Hovering the link
         * opens the panel under the bar. Clicking or pressing Enter on the link follows `href`.
         */
        menu: React.ReactNode;
        /**
         * Accessible name of the chevron button that appears next to the link on keyboard focus.
         * Pressing Enter on that button opens the panel.
         */
        menuLabel: string;
      }
  );

export function NavigationLink({
  menu,
  menuLabel,
  value,
  className,
  children,
  ref,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onClick,
  ...props
}: NavigationLinkProps) {
  const navigation = React.useContext(NavigationContext);
  const generatedValue = React.useId();
  const itemValue = value ?? generatedValue;
  const hasMenu = menu != null;
  const pointerType = React.useRef("");

  const anchor = (
    <a
      data-slot="navigation-link"
      ref={ref}
      className={cn(linkClassName, "pointer-events-auto", className)}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.pointerType === "mouse")
          navigation?.openFromHover(hasMenu ? itemValue : null);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        navigation?.cancelPendingOpen();
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        pointerType.current = event.pointerType;
      }}
      onClick={(event) => {
        onClick?.(event);
        const touched =
          pointerType.current !== "mouse" && pointerType.current !== "";
        pointerType.current = "";
        // A first touch opens the panel, since touch has no hover. A second one follows the link.
        if (hasMenu && touched && navigation?.openFromTouch(itemValue)) {
          event.preventDefault();
        }
      }}
      {...props}
    >
      {children}
    </a>
  );

  if (!hasMenu) {
    return (
      <NavigationMenu.Item value={itemValue} className="relative">
        {anchor}
      </NavigationMenu.Item>
    );
  }

  return (
    <NavigationMenu.Item value={itemValue} className="group/item relative">
      {anchor}
      <NavigationMenu.Trigger
        data-slot="navigation-link-menu-trigger"
        aria-label={menuLabel}
        className={cn(focusRing, chevronClassName)}
      >
        <Icon name="chevron-down" size="var(--primitives-spacing-3)" />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content className={panelContentClassName}>
        {menu}
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

export interface NavigationMenuLinkProps extends React.ComponentProps<"a"> {
  /**
   * Second-level content, usually `NavigationSection` elements. Below the `md` breakpoint the
   * link opens it in the mobile menu instead of navigating. In the desktop panel the link
   * always navigates to `href`.
   */
  submenu?: React.ReactNode;
}

export function NavigationMenuLink({
  submenu,
  className,
  onClick,
  ref,
  ...props
}: NavigationMenuLinkProps) {
  const level = React.useContext(MobileLevelContext);

  return (
    <a
      data-slot="navigation-menu-link"
      ref={ref}
      className={cn(menuLinkClassName, itemMotionClassName, className)}
      onClick={(event) => {
        onClick?.(event);
        if (submenu == null || !level) return;
        event.preventDefault();
        level.push(submenu);
      }}
      {...props}
    />
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
        groupIndexClassName,
        className,
      )}
    >
      {heading ? (
        <h2
          data-slot="navigation-section-heading"
          className={`${itemMotionClassName} px-(--primitives-spacing-2) font-sans
            [font-weight:var(--primitives-typography-font-weight-regular)]
            text-(length:--semantics-typography-label-label-sm-font-size)
            leading-(--semantics-typography-label-label-sm-lh-snug)
            tracking-(--semantics-typography-label-label-sm-tracking-0-125)
            [color:var(--semantics-colors-foreground-subtle-on-dark)]`}
        >
          {heading}
        </h2>
      ) : null}
      <div
        className={cn(
          "flex w-full flex-col gap-(--primitives-spacing-2) py-(--primitives-spacing-2) md:w-auto",
          itemIndexClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

export interface NavigationSearchProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "onSubmit" | "type" | "placeholder" | "aria-label"
> {
  /** Accessible name and placeholder of the field. */
  label: string;
  /** Accessible name of the clear button shown once the field has text. */
  clearLabel: string;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export function NavigationSearch({
  label,
  clearLabel,
  value,
  onValueChange,
  onSubmit,
  className,
  autoFocus,
  ref,
  ...props
}: NavigationSearchProps) {
  const inputElement = React.useRef<HTMLInputElement | null>(null);

  // Native autofocus scrolls the clipped panel to reveal the field while it is still growing,
  // which makes the field jump when the scroll settles back.
  React.useEffect(() => {
    if (autoFocus) inputElement.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  const filled = value !== "";

  const setRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputElement.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <form
      role="search"
      data-slot="navigation-search"
      data-state={filled ? "filled" : "default"}
      className={cn(searchFieldClassName, className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <Icon
        name="search"
        size={iconBox20}
        aria-hidden="true"
        className="shrink-0 [color:var(--semantics-colors-foreground-subtle-on-dark)]"
      />
      <input
        {...props}
        ref={setRef}
        type="search"
        aria-label={label}
        placeholder={label}
        autoComplete="off"
        enterKeyHint="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={searchInputClassName}
      />
      {filled ? (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => {
            onValueChange("");
            inputElement.current?.focus();
          }}
          className={cn(
            "box-border inline-flex size-(--primitives-spacing-5) shrink-0 items-center justify-center",
            "border-0 bg-transparent p-0 [color:inherit] cursor-pointer",
            "hover:[color:var(--semantics-colors-interaction-navigation-link-hover)]",
            focusRing,
          )}
        >
          <Icon name="x" size={iconBox20} />
        </button>
      ) : null}
    </form>
  );
}

export interface NavigationProps extends Omit<
  React.ComponentProps<"header">,
  "children" | "defaultValue"
> {
  /** `NavigationLink` items. Hidden below the `md` breakpoint. */
  children?: React.ReactNode;
  /** Mobile panel, opened by the menu button. Desktop uses the `menu` of each `NavigationLink`. */
  menu?: React.ReactNode;
  /** Controlled open state of the mobile panel. Uncontrolled when omitted. */
  open?: boolean;
  /** Initially open mobile panel when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Controlled `value` of the `NavigationLink` whose desktop panel is open, or `null`. */
  value?: string | null;
  /** Initially open desktop panel when uncontrolled. */
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Destination of the mark. The mark is decorative; this link carries the name. */
  logoHref: string;
  /** Accessible name for the mark link. */
  logoLabel: string;
  /** Accessible name for the search button, and the name and placeholder of the search field. */
  searchLabel: string;
  /** Accessible name for the button that clears the search field. */
  clearSearchLabel: string;
  /** Search text. Controlled when set. */
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  /** Called with the text when the search form is submitted. */
  onSearchSubmit?: (value: string) => void;
  /** Accessible name for the menu button. Shown below the `md` breakpoint. */
  menuLabel: string;
  /** Accessible name for the close button shown while the menu is open on mobile. */
  closeLabel: string;
  /** Shows the back control on the left of the mobile close header. */
  onBack?: () => void;
  /** Accessible name for the back control shown on the second level of the mobile menu. */
  backLabel: string;
  /** Called when the search button is pressed, before the search panel opens. */
  onSearch?: () => void;
  onMenu?: () => void;
}

export function Navigation({
  children,
  menu,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  value,
  defaultValue = null,
  onValueChange,
  className,
  logoHref,
  logoLabel,
  searchLabel,
  clearSearchLabel,
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
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
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const returnFocusToMenu = React.useRef(false);
  const returnFocusToSearch = React.useRef(false);
  const backButtonRef = React.useRef<HTMLButtonElement>(null);
  const returnFocusToClose = React.useRef(false);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [level, setLevel] = React.useState<React.ReactNode>(null);
  const open = openProp !== undefined ? openProp : uncontrolledOpen;
  const isDesktop = useIsDesktop();
  const [barElement, setBarElement] = React.useState<HTMLElement | null>(null);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | null
  >(defaultValue);
  const [uncontrolledSearch, setUncontrolledSearch] = React.useState("");
  const activeValue = value !== undefined ? value : uncontrolledValue;
  const search = searchValue !== undefined ? searchValue : uncontrolledSearch;
  const searching = activeValue === SEARCH_VALUE;
  const mobileMode: "menu" | "search" | null = open
    ? "menu"
    : searching && !isDesktop
      ? "search"
      : null;
  const expanded = mobileMode !== null;
  const [lastMobileMode, setLastMobileMode] = React.useState(mobileMode);
  if (mobileMode !== null && mobileMode !== lastMobileMode) {
    setLastMobileMode(mobileMode);
  }
  const shownMobileMode = mobileMode ?? lastMobileMode;
  const mobilePanel = usePresence(expanded, "duration-320");
  const mobilePanelId = React.useId();
  const mobileMenuRef = React.useRef<HTMLElement | null>(null);
  const showBack = mobileMode === "menu" && (level !== null || !!onBack);
  const backPresence = usePresence(showBack, "duration-240");

  // The panel scrolls on its own, so the page behind it must not move.
  React.useEffect(() => {
    if (!mobilePanel.mounted || isDesktop) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [mobilePanel.mounted, isDesktop]);

  React.useEffect(() => {
    mobileMenuRef.current?.scrollTo({ top: 0 });
  }, [level]);

  function changeSearch(next: string) {
    if (searchValue === undefined) setUncontrolledSearch(next);
    onSearchValueChange?.(next);
  }

  const setBarRef = React.useCallback(
    (node: HTMLElement | null) => {
      setBarElement(node);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const [switching, setSwitching] = React.useState(false);
  const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(
    null,
  );
  const [viewportElement, setViewportElement] =
    React.useState<HTMLElement | null>(null);
  useAnimatedHeight(popupElement, viewportElement);
  const [wrapperElement, setWrapperElement] =
    React.useState<HTMLDivElement | null>(null);
  const [positionerElement, setPositionerElement] =
    React.useState<HTMLElement | null>(null);
  const activeValueRef = React.useRef(activeValue);
  const changeValueRef = React.useRef<(next: string | null) => void>(() => {});
  const openTimer = React.useRef<number | undefined>(undefined);
  const suppressTriggerFocus = React.useRef(false);

  // Base UI returns focus to the trigger when a panel closes. After a pointer-only close that
  // would show the chevron and its focus ring, so that focus move is undone.
  React.useEffect(() => {
    function onFocusIn(event: FocusEvent) {
      const target = event.target as HTMLElement;
      if (suppressTriggerFocus.current && target.matches(TRIGGER_SELECTOR)) {
        target.blur();
      }
    }
    function reset() {
      suppressTriggerFocus.current = false;
    }

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", reset, true);
    document.addEventListener("pointerdown", reset, true);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", reset, true);
      document.removeEventListener("pointerdown", reset, true);
    };
  }, []);

  function closeByPointer() {
    const active = document.activeElement;
    suppressTriggerFocus.current = !(
      active && active.matches(TRIGGER_SELECTOR)
    );
    changeValueRef.current(null);
  }

  function changeValue(next: string | null) {
    const current = activeValueRef.current;
    setSwitching(current !== null && next !== null && current !== next);
    if (value === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  }

  React.useEffect(() => {
    activeValueRef.current = activeValue;
    changeValueRef.current = changeValue;
  });

  const navigationContext = React.useMemo<NavigationContextValue>(
    () => ({
      openFromHover(next) {
        window.clearTimeout(openTimer.current);
        if (next === null && activeValueRef.current === SEARCH_VALUE) return;
        if (next === activeValueRef.current) return;
        if (next === null) {
          closeByPointer();
          return;
        }
        if (activeValueRef.current !== null) {
          changeValueRef.current(next);
          return;
        }
        openTimer.current = window.setTimeout(
          () => changeValueRef.current(next),
          motionMs("delay-hover-open"),
        );
      },
      cancelPendingOpen() {
        window.clearTimeout(openTimer.current);
      },
      openFromTouch(next) {
        if (next === activeValueRef.current) return false;
        changeValueRef.current(next);
        return true;
      },
    }),
    [],
  );

  // The panel stays open while the pointer is anywhere over the bar or the panel, and closes
  // once it leaves both. Hover never opens or closes through Base UI; see `onValueChange`.
  // The search panel is opened by press only, but it closes the same way once the pointer leaves.
  React.useEffect(() => {
    if (!barElement || !isDesktop) return;

    const regions = [barElement, positionerElement].filter(
      (node): node is HTMLElement => node !== null,
    );
    const inside = new Set<HTMLElement>();
    let closeTimer: number | undefined;

    function onEnter(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      window.clearTimeout(closeTimer);
      inside.add(event.currentTarget as HTMLElement);
    }

    function onLeave(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      inside.delete(event.currentTarget as HTMLElement);
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        if (inside.size > 0) return;
        window.clearTimeout(openTimer.current);
        if (activeValueRef.current !== null) closeByPointer();
      }, motionMs("delay-hover-close"));
    }

    for (const node of regions) {
      node.addEventListener("pointerenter", onEnter);
      node.addEventListener("pointerleave", onLeave);
    }

    return () => {
      window.clearTimeout(closeTimer);
      for (const node of regions) {
        node.removeEventListener("pointerenter", onEnter);
        node.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [barElement, positionerElement, isDesktop]);

  // The bar height is shared with the mobile panel, and the content width (mark to search
  // button) with the desktop search field, which is portaled. Both depend on the items of the
  // bar, so the bar and the items that size its content are observed.
  React.useLayoutEffect(() => {
    if (!barElement || !wrapperElement) return;
    const bar = barElement;
    const wrapper = wrapperElement;

    function measure() {
      wrapper.style.setProperty(
        "--navigation-bar-height",
        `${bar.getBoundingClientRect().height}px`,
      );
      const first = bar.firstElementChild;
      const last = bar.querySelector("[data-slot=navigation-search-trigger]");
      if (first && last && positionerElement) {
        const width =
          last.getBoundingClientRect().right -
          first.getBoundingClientRect().left;
        positionerElement.style.setProperty(
          "--navigation-content-width",
          `${width}px`,
        );
      }
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    for (const node of bar.querySelectorAll(
      ":scope > a, [data-slot=navigation-list], [data-slot=navigation-search-trigger]",
    )) {
      observer.observe(node);
    }
    return () => observer.disconnect();
  }, [barElement, wrapperElement, positionerElement, isDesktop, children]);

  function setOpen(next: boolean) {
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  function requestOpen() {
    returnFocusToMenu.current = true;
    setLevel(null);
    onMenu?.();
    setOpen(true);
  }

  function requestClose() {
    setOpen(false);
  }

  const mobileLevelContext = React.useMemo<MobileLevelContextValue>(
    () => ({ push: setLevel }),
    [],
  );

  function goBack() {
    returnFocusToClose.current = true;
    setLevel(null);
    onBack?.();
  }

  React.useEffect(() => {
    if (level !== null) backButtonRef.current?.focus();
    else if (returnFocusToClose.current) {
      menuButtonRef.current?.focus();
      returnFocusToClose.current = false;
    }
  }, [level]);

  function requestSearch() {
    returnFocusToSearch.current = true;
    onSearch?.();
    changeValue(SEARCH_VALUE);
  }

  function closeMobile() {
    if (mobileMode === "search") changeValue(null);
    else requestClose();
  }

  React.useEffect(() => {
    if (mobileMode === null) {
      if (returnFocusToMenu.current) {
        menuButtonRef.current?.focus();
        returnFocusToMenu.current = false;
      }
      if (returnFocusToSearch.current) {
        searchButtonRef.current?.focus();
        returnFocusToSearch.current = false;
      }
      return;
    }
  }, [mobileMode]);

  React.useEffect(() => {
    if (mobileMode === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (mobileMode === "search") changeValueRef.current(null);
      else {
        if (openProp === undefined) setUncontrolledOpen(false);
        onOpenChange?.(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMode, onOpenChange, openProp]);

  const iconBarButtonClassName = cn(
    iconButtonClassName,
    "md:h-(--primitives-spacing-8) md:w-auto md:px-(--primitives-spacing-1)",
  );

  const searchField = (autoFocus: boolean) => (
    <NavigationSearch
      label={searchLabel}
      clearLabel={clearSearchLabel}
      value={search}
      onValueChange={changeSearch}
      onSubmit={onSearchSubmit}
      autoFocus={autoFocus}
    />
  );

  const bar = (
    <header
      data-slot="navigation"
      ref={setBarRef}
      className={cn(
        `sticky top-0 z-(--semantics-layer-navigation) flex w-full items-center justify-between
         [color:var(--semantics-colors-foreground-primary)]
         [transition-property:background-color] duration-(--semantics-motion-duration-320) ${ease}
         motion-reduce:transition-none
         md:justify-center md:gap-(--primitives-spacing-12)
         px-(--primitives-spacing-2) py-(--primitives-spacing-1-5)
         md:px-(--primitives-spacing-6)`,
        expanded
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
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse")
            navigationContext.openFromHover(null);
        }}
        className={cn(
          iconButtonClassName,
          "md:h-(--primitives-spacing-8) md:w-auto md:px-(--primitives-spacing-1)",
          expanded && "max-md:hidden",
        )}
      >
        <span className="inline-flex size-(--primitives-spacing-4) items-center justify-center">
          <NavigationMark />
        </span>
      </a>
      {/* The back control fades out when going back, but leaves at once when the menu closes, so it never shows next to the mark of the closed bar. */}
      {backPresence.mounted && mobileMode !== null ? (
        <button
          ref={backButtonRef}
          {...backPresence.attributes}
          inert={!showBack}
          type="button"
          aria-label={backLabel}
          onClick={level !== null ? goBack : onBack}
          className={cn(
            iconButtonClassName,
            `[transition-property:opacity] duration-(--semantics-motion-duration-240) ${ease} motion-reduce:transition-none
            data-starting-style:opacity-0 data-ending-style:opacity-0 md:hidden`,
          )}
        >
          <Icon name="chevron-left" size={iconBox16} />
        </button>
      ) : null}
      <NavigationContext.Provider value={navigationContext}>
        <NavigationMenu.Root
          aria-label="Primary"
          value={activeValue}
          onValueChange={(next, details) => {
            if (details.reason === "trigger-hover") return;
            changeValue(next as string | null);
          }}
          className="contents"
        >
          <NavigationMenu.List
            data-slot="navigation-list"
            className="m-0 hidden list-none items-center gap-(--primitives-spacing-12) p-0 md:flex"
          >
            {children}
          </NavigationMenu.List>
          <div
            className={cn(
              "flex items-center gap-(--primitives-spacing-4) max-md:ml-auto",
            )}
          >
            {isDesktop ? (
              <NavigationMenu.List className="m-0 flex list-none p-0">
                <NavigationMenu.Item value={SEARCH_VALUE}>
                  <NavigationMenu.Trigger
                    data-slot="navigation-search-trigger"
                    aria-label={searchLabel}
                    onClick={() => onSearch?.()}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse")
                        navigationContext.openFromHover(null);
                    }}
                    className={cn(
                      iconBarButtonClassName,
                      "pointer-events-auto",
                      mobileMode === "menu" && "max-md:hidden",
                    )}
                  >
                    <Icon name="search" size={iconBox16} />
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content
                    className={cn(
                      panelContentClassName,
                      "pb-(--primitives-spacing-32)",
                    )}
                  >
                    <div
                      className={cn(
                        "w-[min(100%,var(--navigation-content-width,100%))]",
                        itemMotionClassName,
                      )}
                    >
                      {searchField(true)}
                    </div>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            ) : (
              <button
                ref={searchButtonRef}
                type="button"
                aria-label={searchLabel}
                onClick={requestSearch}
                className={cn(iconBarButtonClassName, expanded && "hidden")}
              >
                <Icon name="search" size={iconBox16} />
              </button>
            )}
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={expanded ? closeLabel : menuLabel}
              aria-expanded={
                mobileMode === "search" ? undefined : mobileMode === "menu"
              }
              aria-controls={mobilePanel.mounted ? mobilePanelId : undefined}
              onClick={expanded ? closeMobile : requestOpen}
              className={cn(iconButtonClassName, "md:hidden")}
            >
              <NavigationMenuIcon open={expanded} />
            </button>
          </div>
          <NavigationMenu.Portal>
            <NavigationMenu.Backdrop
              data-slot="navigation-scrim"
              className="fixed inset-0 z-(--semantics-layer-scrim) max-md:hidden
              [background-color:var(--semantics-colors-background-primary-blur)]
              [backdrop-filter:blur(var(--semantics-background-blur-navigation))]
              transition-opacity duration-(--semantics-motion-duration-320) delay-(--semantics-motion-delay-scrim) ease-(--semantics-motion-easing-standard)
              motion-reduce:transition-none
              data-starting-style:opacity-0 data-ending-style:opacity-0"
            />
            <NavigationMenu.Positioner
              ref={setPositionerElement}
              anchor={barElement}
              positionMethod="fixed"
              side="bottom"
              align="start"
              sideOffset={0}
              collisionAvoidance={{ side: "none" }}
              collisionPadding={0}
              className="z-(--semantics-layer-panel) w-(--anchor-width) max-md:hidden"
            >
              <NavigationMenu.Popup
                ref={setPopupElement}
                data-slot="navigation-panel"
                data-switch={switching ? "" : undefined}
                onClick={(event) => {
                  if ((event.target as Element).closest("a")) changeValue(null);
                }}
                className={`group/popup h-(--popup-height) w-full overflow-hidden
                [background-color:var(--semantics-colors-background-primary)]
                [color:var(--semantics-colors-foreground-primary)]
                ${panelMotionClassName}`}
              >
                <NavigationMenu.Viewport ref={setViewportElement} />
              </NavigationMenu.Popup>
            </NavigationMenu.Positioner>
          </NavigationMenu.Portal>
        </NavigationMenu.Root>
      </NavigationContext.Provider>
    </header>
  );

  return (
    <div ref={setWrapperElement} className="contents">
      {bar}
      {mobilePanel.mounted ? (
        <div
          id={mobilePanelId}
          data-slot="navigation-mobile-panel"
          {...mobilePanel.attributes}
          className="group/popup fixed inset-x-0 top-(--navigation-bar-height) bottom-0 z-(--semantics-layer-panel) grid grid-rows-[1fr] md:hidden
          [transition-property:grid-template-rows] duration-(--semantics-motion-duration-320) ease-(--semantics-motion-easing-standard)
          motion-reduce:transition-none
          data-starting-style:grid-rows-[0fr] data-ending-style:grid-rows-[0fr]"
        >
          {shownMobileMode === "menu" ? (
            <nav
              ref={mobileMenuRef}
              data-slot="navigation-menu"
              aria-label={menuLabel}
              className={cn(
                "min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain [background-color:var(--semantics-colors-background-primary)] [color:var(--semantics-colors-foreground-primary)]",
                scrollbarClassName,
              )}
            >
              <MobileLevelView
                level={level}
                menu={menu}
                context={mobileLevelContext}
              />
            </nav>
          ) : (
            <div
              data-slot="navigation-search-panel"
              className={cn(
                "min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain [background-color:var(--semantics-colors-background-primary)] [color:var(--semantics-colors-foreground-primary)]",
                scrollbarClassName,
              )}
            >
              <div
                className={cn(
                  "flex min-h-[calc(100dvh-var(--navigation-bar-height,var(--primitives-spacing-12)))] flex-col items-center px-(--primitives-spacing-8) pt-(--primitives-spacing-4) pb-(--primitives-spacing-20)",
                  itemMotionClassName,
                )}
              >
                {searchField(true)}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
