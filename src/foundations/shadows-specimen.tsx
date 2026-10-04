import type { EffectShadowLayerRecord, SemanticShadowPartRecord } from "./shadows-data";

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

const noteClassName = `m-0 font-sans [font-weight:var(--semantics-typography-body-font-weight)]
  text-(length:--semantics-typography-body-body-sm-font-size)
  leading-(--semantics-typography-body-body-sm-lh-normal)
  tracking-(--semantics-typography-body-body-sm-tracking-tight)
  [color:var(--semantics-colors-foreground-subtle)]`;

const surfaceClassName = `box-border size-(--primitives-spacing-20) shrink-0
  rounded-(--primitives-radius-rounded-14)
  border-solid border-(length:--primitives-stroke-width-border)
  [border-color:var(--semantics-colors-border-default)]
  [background-color:var(--semantics-colors-background-default)]`;

const stageClassName = `flex items-center justify-center
  rounded-(--primitives-radius-rounded-10)
  [background-color:var(--semantics-colors-background-accent)]`;

function Status({ used }: { used: boolean }) {
  return (
    <span className={`${captionClassName} [color:var(--semantics-colors-foreground-subtle)]`}>
      {used ? "Used" : "Unused"}
    </span>
  );
}

function MetaList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className={metaClassName}>
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="flex gap-(--primitives-spacing-1)">
          <dt className="m-0">{item.label}</dt>
          <dd className="m-0 min-w-0 break-all">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function composeLayer(
  yVar: string,
  blurVar: string,
  spreadVar: string,
  colorVar: string,
) {
  return `0 var(${yVar}) var(${blurVar}) var(${spreadVar}) var(${colorVar})`;
}

export function PopoverRecipeSpecimen({ layers }: { layers: EffectShadowLayerRecord[] }) {
  const boxShadow = layers.map((layer) => `var(${layer.cssVar})`).join(", ");

  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-4)">
      <div
        className={`${stageClassName} p-(--primitives-spacing-12)`}
      >
        <div className={surfaceClassName} style={{ boxShadow }} aria-hidden />
      </div>
      <div className="flex min-w-0 items-baseline justify-between gap-(--primitives-spacing-3)">
        <figcaption className={captionClassName}>shadows/popover</figcaption>
        <Status used />
      </div>
      <p className={noteClassName}>
        Canonical Effect Style. Applied as{" "}
        <code>box-shadow: var(--effect-shadows-popover-0), var(--effect-shadows-popover-1)</code>.
      </p>
      {layers.map((layer, index) => (
        <div key={layer.token} className="flex min-w-0 flex-col gap-(--primitives-spacing-2)">
          <p className={captionClassName}>layer {index}</p>
          <MetaList
            items={[
              { label: "Figma", value: layer.figmaName },
              { label: "Token", value: layer.token },
              { label: "CSS", value: layer.cssVar },
              { label: "Value", value: layer.cssValue },
              { label: "Type", value: layer.type },
            ]}
          />
        </div>
      ))}
    </figure>
  );
}

function semanticMeta(part: SemanticShadowPartRecord) {
  return [
    { label: "Figma", value: part.figmaName },
    { label: "Token", value: part.token },
    { label: "CSS", value: part.cssVar },
    { label: "Type", value: part.type },
    {
      label: "Alias",
      value: part.alias ?? "none (raw value)",
    },
    { label: "Generated", value: part.generated },
  ];
}

export function SemanticLayerSpecimen({
  label,
  parts,
}: {
  label: string;
  parts: SemanticShadowPartRecord[];
}) {
  const y = parts.find((part) => part.figmaName.endsWith("/y"));
  const blur = parts.find((part) => part.figmaName.endsWith("/blur"));
  const spread = parts.find((part) => part.figmaName.endsWith("/spread"));
  const color = parts.find((part) => part.figmaName.endsWith("/color"));

  const boxShadow =
    y && blur && spread && color
      ? composeLayer(y.cssVar, blur.cssVar, spread.cssVar, color.cssVar)
      : undefined;

  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-4)">
      {boxShadow ? (
        <div className={`${stageClassName} p-(--primitives-spacing-12)`}>
          <div className={surfaceClassName} style={{ boxShadow }} aria-hidden />
        </div>
      ) : null}
      <div className="flex min-w-0 items-baseline justify-between gap-(--primitives-spacing-3)">
        <figcaption className={captionClassName}>shadow/popover/{label}</figcaption>
        <Status used />
      </div>
      <p className={noteClassName}>
        Semantic part demonstration for this layer, with offset X fixed at 0. The canonical complete
        recipe is the Effect Style.
      </p>
      {parts.map((part) => (
        <MetaList key={part.token} items={semanticMeta(part)} />
      ))}
    </figure>
  );
}
