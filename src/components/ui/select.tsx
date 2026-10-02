import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import "@/lib/focus-intent";
import { Icon, iconBox20, type IconName } from "@/components/icon";

const triggerClassName = `
  box-border flex w-full items-center gap-(--primitives-spacing-1-5)
  h-(--primitives-spacing-11) rounded-(--primitives-radius-rounded-14)
  border border-input bg-background px-(--primitives-spacing-2-5)
  text-left outline-none cursor-pointer group
  font-sans [font-weight:var(--semantics-typography-body-font-weight)]
  text-(length:--semantics-typography-body-body-lg-font-size)
  leading-(--semantics-typography-body-body-lg-lh-normal)
  tracking-(--semantics-typography-body-body-lg-tracking-tight)
  text-foreground
  data-placeholder:[color:var(--semantics-colors-foreground-subtle)]
  aria-invalid:[border-color:var(--semantics-colors-border-destructive)]
  aria-invalid:[color:var(--semantics-colors-foreground-destructive)]
  focus:border-(length:--primitives-border-width-border-2)
  focus:px-(--primitives-spacing-2-25)
  focus:[border-color:var(--semantics-colors-border-strong)]
  aria-invalid:focus:[border-color:var(--semantics-colors-border-destructive)]
  data-popup-open:border-(length:--primitives-border-width-border-2)
  data-popup-open:px-(--primitives-spacing-2-25)
  data-popup-open:[border-color:var(--semantics-colors-border-strong)]
  aria-invalid:data-popup-open:[border-color:var(--semantics-colors-border-destructive)]
  intent-keyboard:focus:[outline:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
  intent-keyboard:focus:[outline-offset:var(--primitives-spacing-0-75)]
  disabled:opacity-(--primitives-opacity-opacity-40)
  disabled:cursor-default
  [&_svg]:pointer-events-none [&_svg]:shrink-0
`;

const selectItemVariants = cva(
  `flex w-full items-center gap-(--primitives-spacing-1-5)
   h-(--primitives-spacing-11) rounded-(--primitives-radius-rounded-14)
   px-(--primitives-spacing-2) py-(--primitives-spacing-0)
   font-sans [font-weight:var(--semantics-typography-body-font-weight)]
   text-(length:--semantics-typography-body-body-lg-font-size)
   leading-(--semantics-typography-body-body-lg-lh-normal)
   tracking-(--semantics-typography-body-body-lg-tracking-tight)
   bg-background outline-none cursor-pointer select-none
   data-disabled:opacity-(--primitives-opacity-opacity-40)
   data-disabled:cursor-default
   data-disabled:[color:var(--semantics-colors-foreground-subtle)]
   [&_svg]:pointer-events-none [&_svg]:shrink-0`,
  {
    variants: {
      destructive: {
        false: `text-foreground
          data-highlighted:[background-color:var(--semantics-colors-background-accent)]`,
        true: `[color:var(--semantics-colors-foreground-destructive)]
          data-highlighted:[background-color:var(--semantics-colors-interaction-destructive-subtle-hover)]`,
      },
    },
    defaultVariants: {
      destructive: false,
    },
  },
);

type SelectItemRecord = { value: string; label: React.ReactNode };

function collectSelectItems(children: React.ReactNode): SelectItemRecord[] {
  const items: SelectItemRecord[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === SelectItem) {
      const props = child.props as SelectItemProps;
      if (props.value != null) {
        items.push({
          value: String(props.value),
          label: props.children ?? props.label,
        });
      }
      return;
    }

    const nested = (child.props as { children?: React.ReactNode }).children;
    if (nested != null) {
      items.push(...collectSelectItems(nested));
    }
  });

  return items;
}

type SelectRootProps = Omit<
  SelectPrimitive.Root.Props<string, false>,
  "multiple" | "children"
>;

export interface SelectProps
  extends SelectRootProps, Pick<React.ComponentProps<"button">, "ref"> {
  children?: React.ReactNode;
  /** Marks the select as invalid. Mirrored to `aria-invalid` on the trigger. */
  error?: boolean;
  /** Decorative icon displayed before the value/placeholder. */
  leadingIcon?: IconName;
  /** Placeholder shown when no value is selected. */
  placeholder?: React.ReactNode;
  /** Adds custom CSS classes to the trigger. */
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export function Select({
  children,
  className,
  disabled,
  error = false,
  leadingIcon,
  placeholder,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  items,
  ref,
  ...rootProps
}: SelectProps) {
  const collectedItems = collectSelectItems(children);
  const resolvedItems =
    items ?? (collectedItems.length > 0 ? collectedItems : undefined);

  return (
    <SelectPrimitive.Root
      disabled={disabled}
      id={id}
      items={resolvedItems}
      {...rootProps}
    >
      <SelectPrimitive.Trigger
        data-slot="select"
        disabled={disabled}
        aria-invalid={error}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={cn(triggerClassName, className)}
        ref={ref}
      >
        {leadingIcon ? (
          <Icon name={leadingIcon} size={iconBox20} aria-hidden="true" />
        ) : null}
        <SelectPrimitive.Value
          placeholder={placeholder}
          className="min-w-0 flex-1 truncate"
        />
        <SelectPrimitive.Icon className="relative flex size-(--primitives-spacing-5) shrink-0">
          <Icon
            name="chevron-down"
            size={iconBox20}
            aria-hidden="true"
            className="group-data-popup-open:invisible"
          />
          <Icon
            name="chevron-up"
            size={iconBox20}
            aria-hidden="true"
            className="absolute inset-0 invisible group-data-popup-open:visible"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      {children}
    </SelectPrimitive.Root>
  );
}

export interface SelectContentProps {
  children?: React.ReactNode;
  className?: string;
}

export function SelectContent({ className, children }: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side="bottom"
        sideOffset={4}
        align="start"
        alignItemWithTrigger={false}
        className="z-(--semantics-layer-popover) outline-none"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            `flex w-(--anchor-width) max-h-(--available-height) flex-col overflow-hidden
             rounded-(--primitives-radius-rounded-14) border border-input bg-background
             py-(--primitives-spacing-1) pr-(--primitives-spacing-1) pl-(--primitives-spacing-0-5)
             [box-shadow:var(--effect-shadows-popover-0),var(--effect-shadows-popover-1)]
             outline-none`,
            className,
          )}
        >
          <SelectPrimitive.List
            className={`min-h-0 flex-1 overflow-y-auto overscroll-contain
              px-(--primitives-spacing-1) py-(--primitives-spacing-0-5)
              [scrollbar-width:thin]
              [scrollbar-color:var(--semantics-colors-scrollbar-thumb)_transparent]
              [&::-webkit-scrollbar]:w-(--primitives-spacing-1)
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:[background-color:var(--semantics-colors-scrollbar-thumb)]`}
          >
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export interface SelectGroupProps extends Omit<
  SelectPrimitive.Group.Props,
  "className"
> {
  className?: string;
}

export function SelectGroup({ className, ...props }: SelectGroupProps) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

export interface SelectLabelProps extends Omit<
  SelectPrimitive.GroupLabel.Props,
  "className"
> {
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  className?: string;
}

export function SelectLabel({
  className,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: SelectLabelProps) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        `flex w-full items-center gap-(--primitives-spacing-1-5)
         h-(--primitives-spacing-11) rounded-(--primitives-radius-rounded-14)
         px-(--primitives-spacing-2) py-(--primitives-spacing-0)
         font-sans [font-weight:var(--semantics-typography-body-font-weight)]
         text-(length:--semantics-typography-body-body-lg-font-size)
         leading-(--semantics-typography-body-body-lg-lh-normal)
         tracking-(--semantics-typography-body-body-lg-tracking-tight)
         [color:var(--semantics-colors-foreground-subtle)]
         [&_svg]:pointer-events-none [&_svg]:shrink-0`,
        className,
      )}
      {...props}
    >
      {leadingIcon ? (
        <Icon name={leadingIcon} size={iconBox20} aria-hidden="true" />
      ) : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailingIcon ? (
        <Icon name={trailingIcon} size={iconBox20} aria-hidden="true" />
      ) : null}
    </SelectPrimitive.GroupLabel>
  );
}

export interface SelectItemProps extends Omit<
  SelectPrimitive.Item.Props,
  "className"
> {
  destructive?: boolean;
  leadingIcon?: IconName;
  className?: string;
}

export function SelectItem({
  className,
  destructive = false,
  leadingIcon,
  children,
  label,
  ...props
}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(selectItemVariants({ destructive }), className)}
      label={label ?? (typeof children === "string" ? children : undefined)}
      {...props}
    >
      {leadingIcon ? (
        <Icon name={leadingIcon} size={iconBox20} aria-hidden="true" />
      ) : null}
      <SelectPrimitive.ItemText className="min-w-0 flex-1 truncate">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="flex shrink-0">
        <Icon name="check" size={iconBox20} aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
