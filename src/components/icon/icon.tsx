import type { SVGProps } from "react";
import { iconRegistry, type IconName } from "./icon-registry";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name" | "color"> {
  /** Name of the icon, from the design system's curated icon set. */
  name: IconName;
  /** Icon size in pixels. Defaults to 16, matching the Figma icon grid. */
  size?: number;
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
export function Icon({ name, size = 16, strokeWidth = 2, className, ...props }: IconProps) {
  const IconComponent = iconRegistry[name];

  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} {...props} />;
}
