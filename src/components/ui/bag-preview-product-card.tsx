import * as React from "react";

import { cn } from "@/lib/utils";

const DEVICE = {
  desktop: {
    thumb: "size-(--primitives-spacing-16)",
    infoGap: "gap-(--primitives-spacing-out-of-scale-0-5)",
  },
  mobile: {
    thumb: "size-(--primitives-spacing-12)",
    infoGap: "gap-0",
  },
} as const;

export type BagPreviewProductCardDevice = keyof typeof DEVICE;

const nameClassName = `m-0 w-full overflow-hidden text-ellipsis whitespace-nowrap font-sans
  [font-weight:var(--semantics-typography-label-font-weight)]
  text-(length:--semantics-typography-label-label-md-font-size)
  leading-(--semantics-typography-label-label-md-lh-snug)
  tracking-(--semantics-typography-label-label-md-tracking-0-125)
  [color:var(--semantics-colors-foreground-primary)]`;

const quantityClassName = `m-0 w-full overflow-hidden text-ellipsis whitespace-nowrap font-sans
  [font-weight:var(--semantics-typography-body-font-weight)]
  text-(length:--semantics-typography-body-body-md-font-size)
  leading-(--semantics-typography-body-body-md-lh-normal)
  tracking-(--semantics-typography-body-body-md-tracking-tight)
  [color:var(--semantics-colors-foreground-primary)]`;

export interface BagPreviewProductCardProps
  extends Omit<React.ComponentProps<"article">, "children"> {
  device?: BagPreviewProductCardDevice;
  name: string;
  src: string;
  alt: string;
  showQuantity?: boolean;
  quantity?: string;
}

export function BagPreviewProductCard({
  className,
  device = "desktop",
  name,
  src,
  alt,
  showQuantity = false,
  quantity = "x2",
  ref,
  ...props
}: BagPreviewProductCardProps) {
  const sizes = DEVICE[device];

  return (
    <article
      data-slot="bag-preview-product-card"
      className={cn(
        "flex w-full items-center gap-(--primitives-spacing-2)",
        className,
      )}
      {...props}
      ref={ref}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden [background-color:var(--semantics-colors-background-accent)]",
          sizes.thumb,
        )}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-contain"
        />
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col items-start justify-center",
          sizes.infoGap,
        )}
      >
        <p className={nameClassName}>{name}</p>
        {showQuantity ? <p className={quantityClassName}>{quantity}</p> : null}
      </div>
    </article>
  );
}
