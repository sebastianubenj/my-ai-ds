import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const productCardMediaClassName = `relative w-full overflow-hidden
  [background-color:var(--semantics-colors-background-accent)]`;

const MEDIA_ASPECT = {
  horizontal: "644 / 389",
  vertical: "310 / 389",
  square: "1",
} as const;

const headingClassName = `m-0 w-full overflow-hidden text-ellipsis whitespace-nowrap font-sans
  [font-weight:var(--semantics-typography-heading-font-weight)]
  text-(length:--semantics-typography-heading-heading-lg-font-size)
  leading-(--semantics-typography-heading-heading-lg-lh-tight)
  tracking-(--semantics-typography-heading-heading-lg-tracking-tight)
  [color:var(--semantics-colors-foreground-default)]`;

export type ProductCardLayout = keyof typeof MEDIA_ASPECT;

const IMAGE_BOX: Record<ProductCardLayout, React.CSSProperties> = {
  horizontal: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    height: "100%",
    width: "auto",
    aspectRatio: "1",
    objectFit: "contain",
    transform: "translateX(-50%)",
  },
  vertical: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    width: "100%",
    height: "auto",
    aspectRatio: "1",
    objectFit: "contain",
    transform: "translateY(-50%)",
  },
  square: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
};

export interface ProductCardProps
  extends Omit<React.ComponentProps<"article">, "children"> {
  layout?: ProductCardLayout;
  name: string;
  price: string;
  src: string;
  alt: string;
  actionLabel?: string;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  showAction?: boolean;
}

export function ProductCard({
  className,
  layout = "horizontal",
  name,
  price,
  src,
  alt,
  actionLabel = "Add",
  onAction,
  showAction = true,
  ref,
  ...props
}: ProductCardProps) {
  return (
    <article
      data-slot="product-card"
      className={cn(
        "flex w-full flex-col items-start gap-(--primitives-spacing-2)",
        className,
      )}
      {...props}
      ref={ref}
    >
      <div
        className={productCardMediaClassName}
        style={{ aspectRatio: MEDIA_ASPECT[layout] }}
      >
        <img src={src} alt={alt} style={IMAGE_BOX[layout]} />
      </div>
      <div className="flex w-full items-center justify-between gap-(--primitives-spacing-2)">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-(--primitives-spacing-1)">
          <p className={headingClassName}>{name}</p>
          <p className={headingClassName}>{price}</p>
        </div>
        {showAction ? (
          <Button type="button" variant="primary" size="lg" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </article>
  );
}
