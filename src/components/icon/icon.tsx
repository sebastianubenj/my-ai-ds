import type { SVGProps } from "react";
import { iconRegistry, type IconName } from "./icon-registry";

/**
 * Icon box on the 16px grid. `primitives.spacing.4` is 1rem, so width and
 * height follow the root font size. At the default root this is 16px.
 */
export const iconBox16 = "var(--primitives-spacing-4)";

/**
 * Icon box on the 20px grid. `primitives.spacing.5` is 1.25rem. At the
 * default root this is 20px.
 */
export const iconBox20 = "var(--primitives-spacing-5)";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name" | "color"> {
  /** Name of the icon, from the design system's curated icon set. */
  name: IconName;
  /**
   * Width and height. Defaults to `iconBox16`. A number is a fixed pixel
   * size. `strokeWidth` stays in viewBox units and scales with this box.
   */
  size?: number | string;
  /** Stroke width. Defaults to 2, matching Lucide's default stroke weight. */
  strokeWidth?: number;
}

/**
 * Design system Icon component.
 *
 * Wraps the underlying icon implementation (currently lucide-react) behind a
 * stable, library-independent API. Color is inherited via `currentColor` —
 * style icons the same way you'd style text (e.g. `className="text-muted-foreground"`).
 */
export function Icon({ name, size = iconBox16, strokeWidth = 2, className, ...props }: IconProps) {
  const IconComponent = iconRegistry[name];

  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}
