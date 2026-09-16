import { cn } from "@/lib/utils";

export interface TypographySpecimenProps {
  /** Visible style name, e.g. Display / Large. */
  name: string;
  /** Representative sample rendered in the style. */
  sample: string;
  /** Classes that apply semantic typography tokens to the sample. */
  className: string;
  token: string;
  family: string;
  weight: string;
  size: string;
  lineHeight: string;
  letterSpacing: string;
}

export function TypographySpecimen({
  name,
  sample,
  className,
  token,
  family,
  weight,
  size,
  lineHeight,
  letterSpacing,
}: TypographySpecimenProps) {
  const meta = [
    { label: "Token", value: token },
    { label: "Family", value: family },
    { label: "Weight", value: weight },
    { label: "Size", value: size },
    { label: "Line height", value: lineHeight },
    { label: "Letter spacing", value: letterSpacing },
  ];

  return (
    <figure className="m-0 flex w-full flex-col gap-(--primitives-spacing-3)">
      <figcaption
        className={`m-0 font-sans [font-weight:var(--semantics-typography-label-font-weight)]
          text-(length:--semantics-typography-label-label-md-font-size)
          leading-(--semantics-typography-label-label-md-lh-snug)
          tracking-(--semantics-typography-label-label-md-tracking-0-125)
          text-foreground`}
      >
        {name}
      </figcaption>
      <p className={cn("m-0 text-foreground", className)}>{sample}</p>
      <dl
        className={`m-0 flex flex-wrap gap-x-(--primitives-spacing-4) gap-y-(--primitives-spacing-1)
          font-sans [font-weight:var(--semantics-typography-body-font-weight)]
          text-(length:--semantics-typography-body-body-sm-font-size)
          leading-(--semantics-typography-body-body-sm-lh-normal)
          tracking-(--semantics-typography-body-body-sm-tracking-tight)
          [color:var(--semantics-colors-foreground-accent)]`}
      >
        {meta.map((item) => (
          <div key={item.label} className="flex gap-(--primitives-spacing-1)">
            <dt className="m-0">{item.label}</dt>
            <dd className="m-0">{item.value}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
