const captionClassName = `m-0 font-sans [font-weight:var(--semantics-typography-label-font-weight)]
  text-(length:--semantics-typography-label-label-md-font-size)
  leading-(--semantics-typography-label-label-md-lh-snug)
  tracking-(--semantics-typography-label-label-md-tracking-0-125)
  text-foreground`;

const metaClassName = `m-0 flex flex-col gap-(--primitives-spacing-1)
  font-sans [font-weight:var(--semantics-typography-body-font-weight)]
  text-(length:--semantics-typography-body-body-sm-font-size)
  leading-(--semantics-typography-body-body-sm-lh-normal)
  tracking-(--semantics-typography-body-body-sm-tracking-tight)
  [color:var(--semantics-colors-foreground-subtle)]`;

const swatchClassName = `box-border w-full shrink-0
  border-solid border-(length:--primitives-stroke-width-border)
  [border-color:var(--semantics-colors-border-default)]
  rounded-(--primitives-radius-rounded-10)`;

function MetaList({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl className={metaClassName}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-wrap gap-(--primitives-spacing-1)">
          <dt className="m-0">{item.label}</dt>
          <dd className="m-0 min-w-0 break-all">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export interface SemanticColorSpecimenProps {
  name: string;
  token: string;
  cssVar: string;
  generated: string;
  alias: string;
}

export function SemanticColorSpecimen({
  name,
  token,
  cssVar,
  generated,
  alias,
}: SemanticColorSpecimenProps) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-3)">
      <div
        className={`${swatchClassName} h-(--primitives-spacing-22)`}
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <figcaption className={captionClassName}>{name}</figcaption>
      <MetaList
        items={[
          { label: "Token", value: token },
          { label: "CSS", value: cssVar },
          { label: "Alias", value: alias },
          { label: "Generated", value: generated },
        ]}
      />
    </figure>
  );
}

export interface PrimitiveColorSpecimenProps {
  name: string;
  token: string;
  cssVar: string;
  hex: string;
  referenced: boolean;
}

export function PrimitiveColorSpecimen({
  name,
  token,
  cssVar,
  hex,
  referenced,
}: PrimitiveColorSpecimenProps) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-2)">
      <div
        className={`${swatchClassName} h-(--primitives-spacing-11)`}
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <figcaption className={captionClassName}>{name}</figcaption>
      <MetaList
        items={[
          { label: "Token", value: token },
          { label: "CSS", value: cssVar },
          { label: "Hex", value: hex },
          { label: "Status", value: referenced ? "Referenced by semantics" : "Unused by semantics" },
        ]}
      />
    </figure>
  );
}
