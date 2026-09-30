import * as React from "react";

import { cn } from "@/lib/utils";
import "@/lib/focus-intent";
import { Icon, iconBox20 } from "@/components/icon";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** Marks the textarea as invalid. Mirrored to `aria-invalid` for styling and accessibility. */
  error?: boolean;
}

export function Textarea({ className, error = false, disabled, ref, ...props }: TextareaProps) {
  return (
    <div
      className={cn(
        `group relative w-full
         has-disabled:opacity-(--primitives-opacity-opacity-40)
         [&_svg]:pointer-events-none [&_svg]:shrink-0
         [&_svg]:[color:var(--semantics-colors-foreground-subtle)]
         has-aria-invalid:[&_svg]:text-destructive-foreground`,
        className,
      )}
    >
      <textarea
        {...props}
        data-slot="textarea"
        disabled={disabled}
        aria-invalid={error}
      className={`box-border block w-full resize-y bg-background outline-none
          h-[var(--primitives-spacing-22)] min-h-[var(--primitives-spacing-22)]
          rounded-(--primitives-radius-rounded-14)
          border border-input
          [padding:var(--primitives-spacing-2)_var(--primitives-spacing-1-5)_var(--primitives-spacing-1-5)_var(--primitives-spacing-2-5)]
          font-sans [font-weight:var(--semantics-typography-body-font-weight)]
          text-(length:--semantics-typography-body-body-lg-font-size)
          leading-(--semantics-typography-body-body-lg-lh-normal)
          tracking-(--semantics-typography-body-body-lg-tracking-tight)
          text-foreground placeholder:[color:var(--semantics-colors-foreground-subtle)]
          aria-invalid:[border-color:var(--semantics-colors-border-destructive)]
          aria-invalid:text-destructive-foreground
          aria-invalid:placeholder:text-destructive-foreground
          focus:[border-width:var(--primitives-border-width-border-2)]
          focus:[padding:var(--primitives-spacing-1-75)_var(--primitives-spacing-1-5)_var(--primitives-spacing-1-5)_var(--primitives-spacing-2-25)]
          focus:[border-color:var(--semantics-colors-border-strong)]
          aria-invalid:focus:[border-color:var(--semantics-colors-border-destructive)]
          intent-keyboard:focus:[outline:var(--primitives-ring-focus-width-ring-2)_solid_var(--semantics-colors-border-ring-focus)]
          intent-keyboard:focus:[outline-offset:var(--primitives-spacing-0-75)]
          disabled:cursor-default
          [&::-webkit-resizer]:opacity-0`}
        ref={ref}
      />
      <Icon
        name="resize-thumb"
        size={iconBox20}
        aria-hidden="true"
        className="pointer-events-none absolute [bottom:var(--primitives-spacing-1-5)] [right:var(--primitives-spacing-1-5)]"
      />
    </div>
  );
}
