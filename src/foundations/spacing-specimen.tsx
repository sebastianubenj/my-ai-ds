import type { SpacingTokenRecord } from "./spacing-data";

const captionClassName = `m-0 font-sans [font-weight:var(--semantics-typography-label-font-weight)]
  text-(length:--semantics-typography-label-label-md-font-size)
  leading-(--semantics-typography-label-label-md-lh-snug)
  tracking-(--semantics-typography-label-label-md-tracking-0-125)
  text-foreground`;

const metaClassName = `m-0 flex flex-wrap gap-x-(--primitives-spacing-4) gap-y-(--primitives-spacing-1)
  font-sans [font-weight:var(--semantics-typography-body-font-weight)]
  text-(length:--semantics-typography-body-body-sm-font-size)
  leading-(--semantics-typography-body-body-sm-lh-normal)
  tracking-(--semantics-typography-body-body-sm-tracking-tight)
  [color:var(--semantics-colors-foreground-accent)]`;

export function SpacingSpecimen({
  figmaName,
  token,
  cssVar,
  px,
  rem,
  used,
}: SpacingTokenRecord) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-2)">
      <div className="flex min-w-0 items-baseline justify-between gap-(--primitives-spacing-3)">
        <figcaption className={captionClassName}>{figmaName}</figcaption>
        <span className={`${captionClassName} [color:var(--semantics-colors-foreground-accent)]`}>
          {used ? "Used" : "Unused"}
        </span>
      </div>
      <div
        className={`box-border flex h-(--primitives-spacing-4) w-full max-w-5xl items-stretch overflow-hidden
          border-solid border-(length:--primitives-border-width-border)
          [border-color:var(--semantics-colors-border-default)]
          rounded-(--primitives-radius-rounded-10)
          [background-color:var(--semantics-colors-background-accent)]`}
      >
        {px === 0 ? (
          <div
            className="h-full w-0 shrink-0 border-r-(length:--primitives-border-width-border-2) border-solid
              [border-color:var(--semantics-colors-foreground-default)]"
            aria-hidden
          />
        ) : (
          <div
            className="h-full max-w-full shrink-0 [background-color:var(--semantics-colors-background-primary)]"
            style={{ width: `var(${cssVar})` }}
          />
        )}
      </div>
      <dl className={metaClassName}>
        {[
          { label: "Token", value: token },
          { label: "CSS", value: cssVar },
          { label: "Px", value: `${px}px` },
          { label: "Rem", value: rem },
        ].map((item) => (
          <div key={item.label} className="flex gap-(--primitives-spacing-1)">
            <dt className="m-0">{item.label}</dt>
            <dd className="m-0">{item.value}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
