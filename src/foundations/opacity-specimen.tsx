import type { OpacityTokenRecord } from "./opacity-data";

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

export function OpacitySpecimen({
  figmaName,
  token,
  cssVar,
  percent,
  cssValue,
  used,
}: OpacityTokenRecord) {
  return (
    <figure className="m-0 flex min-w-0 items-start gap-(--primitives-spacing-4)">
      <div
        className={`relative size-(--primitives-spacing-20) shrink-0 overflow-hidden
          rounded-(--primitives-radius-rounded-10)
          border-solid border-(length:--primitives-border-width-border)
          [border-color:var(--semantics-colors-border-default)]`}
        style={{
          backgroundImage: `repeating-conic-gradient(var(--semantics-colors-background-default) 0% 25%, var(--semantics-colors-background-accent) 0% 50%)`,
          backgroundSize: `var(--primitives-spacing-2-5) var(--primitives-spacing-2-5)`,
        }}
        aria-hidden
      >
        <div
          className="size-full [background-color:var(--semantics-colors-background-primary)]"
          style={{ opacity: `var(${cssVar})` }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-(--primitives-spacing-2)">
        <div className="flex min-w-0 items-baseline justify-between gap-(--primitives-spacing-3)">
          <figcaption className={captionClassName}>{figmaName}</figcaption>
          <span className={`${captionClassName} [color:var(--semantics-colors-foreground-subtle)]`}>
            {used ? "Used" : "Unused"}
          </span>
        </div>
        <dl className={metaClassName}>
          {[
            { label: "Token", value: token },
            { label: "CSS", value: cssVar },
            { label: "Value", value: `${percent}% / ${cssValue}` },
          ].map((item) => (
            <div key={item.label} className="flex gap-(--primitives-spacing-1)">
              <dt className="m-0">{item.label}</dt>
              <dd className="m-0">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </figure>
  );
}
