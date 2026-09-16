import type {
  EffectShadowLayerRecord,
  SemanticShadowPartRecord,
  ShadowColorRecord,
  ShadowPartRecord,
  ShadowScaleStep,
} from "./shadows-data";
import { SHADOW_SCALE_COLOR_VAR, SHADOW_SCALE_X } from "./shadows-data";

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
  border-solid border-(length:--primitives-border-width-border)
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
  return `var(${SHADOW_SCALE_X.cssVar}) var(${yVar}) var(${blurVar}) var(${spreadVar}) var(${colorVar})`;
}

function composeScaleShadow(step: ShadowScaleStep) {
  return step.layers
    .map((layer) =>
      composeLayer(layer.y.cssVar, layer.blur.cssVar, layer.spread.cssVar, SHADOW_SCALE_COLOR_VAR),
    )
    .join(", ");
}

function partMeta(part: ShadowPartRecord) {
  return [
    { label: "Figma", value: part.figmaName },
    { label: "Token", value: part.token },
    { label: "CSS", value: part.cssVar },
    { label: "Value", value: `${part.px}px / ${part.rem}` },
    { label: "Type", value: part.type },
  ];
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

export function SharedXSpecimen({ part }: { part: ShadowPartRecord }) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-2)">
      <div className="flex min-w-0 items-baseline justify-between gap-(--primitives-spacing-3)">
        <figcaption className={captionClassName}>{part.figmaName}</figcaption>
        <Status used={part.used} />
      </div>
      <p className={noteClassName}>
        Shared offset X for every shadow layer. There is no semantic x token.
      </p>
      <MetaList items={partMeta(part)} />
    </figure>
  );
}

export function PrimitiveScaleSpecimen({ step }: { step: ShadowScaleStep }) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-4)">
      <div className={`${stageClassName} p-(--primitives-spacing-22)`}>
        <div
          className={surfaceClassName}
          style={{ boxShadow: composeScaleShadow(step) }}
          aria-hidden
        />
      </div>
      <div className="flex min-w-0 items-baseline justify-between gap-(--primitives-spacing-3)">
        <figcaption className={captionClassName}>{step.figmaName}</figcaption>
        <Status used={step.used} />
      </div>
      <p className={noteClassName}>
        Primitive scale demonstration composed from existing CSS variables, including shared{" "}
        <code>{SHADOW_SCALE_X.cssVar}</code> and <code>{SHADOW_SCALE_COLOR_VAR}</code>. Not an
        official Effect Style.
      </p>
      {step.layers.map((layer) => (
        <div key={layer.y.token} className="flex min-w-0 flex-col gap-(--primitives-spacing-2)">
          {layer.label ? <p className={captionClassName}>{layer.label}</p> : null}
          <MetaList items={partMeta(layer.y)} />
          <MetaList items={partMeta(layer.blur)} />
          <MetaList items={partMeta(layer.spread)} />
        </div>
      ))}
    </figure>
  );
}

export function PrimitiveShadowColorSpecimen({ color }: { color: ShadowColorRecord }) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-2)">
      <div
        className={`relative h-(--primitives-spacing-22) overflow-hidden
          rounded-(--primitives-radius-rounded-10)
          border-solid border-(length:--primitives-border-width-border)
          [border-color:var(--semantics-colors-border-default)]`}
        style={{
          backgroundImage: `repeating-conic-gradient(var(--semantics-colors-background-default) 0% 25%, var(--semantics-colors-background-accent) 0% 50%)`,
          backgroundSize: `var(--primitives-spacing-2-5) var(--primitives-spacing-2-5)`,
        }}
        aria-hidden
      >
        <div className="size-full" style={{ backgroundColor: `var(${color.cssVar})` }} />
      </div>
      <div className="flex min-w-0 items-baseline justify-between gap-(--primitives-spacing-3)">
        <figcaption className={captionClassName}>{color.figmaName}</figcaption>
        <Status used={color.used} />
      </div>
      <MetaList
        items={[
          { label: "Token", value: color.token },
          { label: "CSS", value: color.cssVar },
          { label: "Value", value: color.hex },
          { label: "Type", value: color.type },
        ]}
      />
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
      value: part.alias ?? "none — raw #0000001a, not aliased to black-10",
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
        Semantic part demonstration for this layer, using shared{" "}
        <code>{SHADOW_SCALE_X.cssVar}</code>. The canonical complete recipe is the Effect Style.
      </p>
      {parts.map((part) => (
        <MetaList key={part.token} items={semanticMeta(part)} />
      ))}
    </figure>
  );
}
