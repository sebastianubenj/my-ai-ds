import type { BorderTokenRecord } from "./borders-data";

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
  [color:var(--semantics-colors-foreground-subtle)]`;

function TokenMeta({
  figmaName,
  token,
  cssVar,
  px,
  rem,
  status,
}: BorderTokenRecord) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-(--primitives-spacing-2)">
      <div className="flex min-w-0 items-baseline justify-between gap-(--primitives-spacing-3)">
        <figcaption className={captionClassName}>{figmaName}</figcaption>
        <span className={`${captionClassName} [color:var(--semantics-colors-foreground-subtle)]`}>
          {status}
        </span>
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
    </div>
  );
}

export function BorderWidthSpecimen(record: BorderTokenRecord) {
  return (
    <figure className="m-0 flex min-w-0 items-start gap-(--primitives-spacing-4)">
      <div
        className={`flex size-(--primitives-spacing-20) shrink-0 items-center justify-center
          [background-color:var(--semantics-colors-background-accent)]`}
      >
        <div
          className={`box-border size-(--primitives-spacing-16) shrink-0
            rounded-(--primitives-radius-rounded-10)
            [background-color:var(--semantics-colors-background-default)]
            [border-color:var(--semantics-colors-border-strong)]
            [border-style:solid]`}
          style={{ borderWidth: `var(${record.cssVar})` }}
          aria-hidden
        />
      </div>
      <TokenMeta {...record} />
    </figure>
  );
}

export function FocusRingSpecimen(record: BorderTokenRecord) {
  return (
    <figure className="m-0 flex min-w-0 items-start gap-(--primitives-spacing-4)">
      <div
        className={`flex size-(--primitives-spacing-22) shrink-0 items-center justify-center
          p-(--primitives-spacing-2)
          [background-color:var(--semantics-colors-background-accent)]`}
      >
        <div
          className={`box-border size-(--primitives-spacing-12) shrink-0
            rounded-(--primitives-radius-rounded-18)
            border-solid border-(length:--primitives-stroke-width-border)
            [border-color:var(--semantics-colors-border-default)]
            [background-color:var(--semantics-colors-background-default)]
            [outline-color:var(--semantics-colors-border-ring-focus)]
            [outline-offset:var(--primitives-spacing-0-75)]
            [outline-style:solid]`}
          style={{ outlineWidth: `var(${record.cssVar})` }}
          aria-hidden
        />
      </div>
      <TokenMeta {...record} />
    </figure>
  );
}
