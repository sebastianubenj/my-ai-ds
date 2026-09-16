import { Icon, type IconName } from "@/components/icon";

import type {
  IconColorExampleRecord,
  IconLibraryRecord,
  IconMappingRecord,
  IconSizeRecord,
} from "./iconography-data";
import {
  FIGMA_UTILITY_ICON_SIZE,
  ICON_COLOR,
  ICON_FAMILY,
  ICON_LIBRARY_BOOLEANS,
  ICON_STROKE,
} from "./iconography-data";

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

const noteClassName = `m-0 font-sans [font-weight:var(--semantics-typography-body-font-weight)]
  text-(length:--semantics-typography-body-body-sm-font-size)
  leading-(--semantics-typography-body-body-sm-lh-normal)
  tracking-(--semantics-typography-body-body-sm-tracking-tight)
  [color:var(--semantics-colors-foreground-accent)]`;

const stageClassName = `flex items-center justify-center
  rounded-(--primitives-radius-rounded-10)
  [background-color:var(--semantics-colors-background-accent)]
  [color:var(--semantics-colors-foreground-default)]`;

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

export function IconFamilySpecimen({
  icons,
  libraries,
}: {
  icons: readonly IconName[];
  libraries: IconLibraryRecord[];
}) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-4)">
      <div
        className={`${stageClassName} gap-(--primitives-spacing-6) p-(--primitives-spacing-8)`}
      >
        {icons.map((name) => (
          <Icon key={name} name={name} aria-hidden="true" />
        ))}
      </div>
      <figcaption className={captionClassName}>
        {ICON_FAMILY.production} — production icon family
      </figcaption>
      <p className={noteClassName}>
        Figma holds about {ICON_FAMILY.figmaComponentCount} Lucide components on the{" "}
        {ICON_FAMILY.figmaPage} page. React ships Lucide only through the curated{" "}
        <code>Icon</code> registry ({ICON_FAMILY.reactRegistryCount} names). This row is a
        representative specimen, not the catalog.
      </p>
      <MetaList
        items={[
          { label: "Package", value: ICON_FAMILY.package },
          { label: "Figma grid", value: ICON_FAMILY.figmaGrid },
          { label: "Master size", value: `${ICON_FAMILY.figmaMasterSize}px` },
        ]}
      />
      <p className={noteClassName}>
        Figma <code>Icon Placeholder</code> can swap the libraries below. Only Lucide is a
        React implementation.
      </p>
      <ul className={`${noteClassName} m-0 flex list-none flex-col gap-(--primitives-spacing-1) p-0`}>
        {libraries.map((library) => (
          <li key={library.name}>
            {library.name}
            {library.production ? " — production" : " — Figma placeholder only"}
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function IconSizeSpecimen({
  record,
  icons,
}: {
  record: IconSizeRecord;
  icons: readonly IconName[];
}) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-4)">
      <div
        className={`${stageClassName} gap-(--primitives-spacing-6) p-(--primitives-spacing-8)`}
      >
        {icons.map((name) => (
          <Icon key={name} name={name} size={record.px} aria-hidden="true" />
        ))}
      </div>
      <figcaption className={captionClassName}>{record.px}px usage</figcaption>
      <p className={noteClassName}>
        Observed control size. Not an icon-size token. React <code>Icon</code> takes a numeric{" "}
        <code>size</code> prop.
      </p>
      <MetaList
        items={[
          { label: "Pixels", value: `${record.px}px` },
          ...(record.spacingNote
            ? [{ label: "Spacing", value: record.spacingNote }]
            : []),
          { label: "Used for", value: record.uses.join(", ") },
        ]}
      />
    </figure>
  );
}

export function IconUtilitySizeNote() {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-2)">
      <figcaption className={captionClassName}>
        {FIGMA_UTILITY_ICON_SIZE}px — Figma utility only
      </figcaption>
      <p className={noteClassName}>
        Figma has a 24×24 <code>Utility / Component Icon</code> wrapper. 24px is not an
        established React Icon size and is not rendered here as a usage step.
      </p>
    </figure>
  );
}

export function IconStrokeSpecimen({
  icons,
}: {
  icons: readonly IconName[];
}) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-4)">
      <div className="flex flex-wrap gap-(--primitives-spacing-6)">
        {[16, 20].map((px) => (
          <div
            key={px}
            className={`${stageClassName} gap-(--primitives-spacing-4) p-(--primitives-spacing-8)`}
          >
            {icons.map((name) => (
              <Icon
                key={`${px}-${name}`}
                name={name}
                size={px}
                strokeWidth={ICON_STROKE.reactStrokeWidth}
                aria-hidden="true"
              />
            ))}
          </div>
        ))}
      </div>
      <figcaption className={captionClassName}>Lucide stroke at 16px and 20px</figcaption>
      <p className={noteClassName}>
        Figma Lucide vectors bind to {ICON_STROKE.figmaName} ({ICON_STROKE.figmaPx}px) at the
        16px master. That token belongs to Borders, not an icon-stroke scale.         React uses Lucide{" "}
        <code>{`strokeWidth={${ICON_STROKE.reactStrokeWidth}}`}</code> on a{" "}
        {ICON_STROKE.lucideViewBox} viewBox, so {ICON_STROKE.at16} and {ICON_STROKE.at20}.
      </p>
      <MetaList
        items={[
          { label: "Figma", value: ICON_STROKE.figmaName },
          { label: "Token", value: ICON_STROKE.token },
          { label: "CSS", value: ICON_STROKE.cssVar },
          { label: "React", value: `strokeWidth={${ICON_STROKE.reactStrokeWidth}}` },
        ]}
      />
    </figure>
  );
}

export function IconFilledExceptionSpecimen() {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-4)">
      <div className={`${stageClassName} p-(--primitives-spacing-8)`}>
        <Icon name="resize-thumb" size={20} aria-hidden="true" />
      </div>
      <figcaption className={captionClassName}>
        {ICON_STROKE.filledException} — filled exception
      </figcaption>
      <p className={noteClassName}>
        Figma Resize Thumb is filled with stroke 0. React draws a custom filled path; the
        Lucide stroke width is not the visible construction.
      </p>
    </figure>
  );
}

export function IconColorSpecimen({
  example,
  iconName,
}: {
  example: IconColorExampleRecord;
  iconName: IconName;
}) {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-4)">
      <div
        className={`${stageClassName} p-(--primitives-spacing-8)`}
        style={{ color: `var(${example.cssVar})` }}
      >
        <Icon name={iconName} size={20} aria-hidden="true" />
      </div>
      <figcaption className={captionClassName}>{example.label}</figcaption>
      <p className={noteClassName}>
        React icons inherit <code>{ICON_COLOR.react}</code>. Color comes from surrounding CSS,
        not from an icon-color token.
      </p>
      <MetaList
        items={[
          { label: "Token", value: example.token },
          { label: "CSS", value: example.cssVar },
        ]}
      />
    </figure>
  );
}

export function IconColorBindingNote() {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-2)">
      <figcaption className={captionClassName}>Figma binding</figcaption>
      <p className={noteClassName}>
        Figma icon strokes and fills bind to {ICON_COLOR.figmaName}. Semantic color stays in
        the Colors foundation.
      </p>
      <MetaList
        items={[
          { label: "Figma", value: ICON_COLOR.figmaName },
          { label: "Token", value: ICON_COLOR.token },
          { label: "CSS", value: ICON_COLOR.cssVar },
          { label: "React", value: ICON_COLOR.react },
        ]}
      />
    </figure>
  );
}

export function IconMappingSpecimen({ mapping }: { mapping: IconMappingRecord }) {
  return (
    <figure className="m-0 flex min-w-0 items-start gap-(--primitives-spacing-4)">
      <div className={`${stageClassName} size-(--primitives-spacing-16) shrink-0`}>
        <Icon name={mapping.reactName} aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-(--primitives-spacing-2)">
        <figcaption className={captionClassName}>{mapping.reactName}</figcaption>
        <MetaList
          items={[
            { label: "Figma", value: mapping.figmaName },
            { label: "React", value: mapping.reactName },
          ]}
        />
        {mapping.note ? <p className={noteClassName}>{mapping.note}</p> : null}
      </div>
    </figure>
  );
}

export function IconPipelineNote() {
  return (
    <figure className="m-0 flex min-w-0 flex-col gap-(--primitives-spacing-2)">
      <figcaption className={captionClassName}>Implementation relationship</figcaption>
      <p className={noteClassName}>
        Figma: Icon Placeholder → library swap → Lucide component. React:{" "}
        <code>{`<Icon name="…" />`}</code> → curated registry → lucide-react.
      </p>
      <p className={noteClassName}>
        About {ICON_FAMILY.figmaComponentCount} Figma Lucide components versus{" "}
        {ICON_FAMILY.reactRegistryCount} React registry names. That gap is a curated Phase 1
        subset, not a missing-catalog bug. Unused Figma icons have not been pixel-verified.
        Semantic <code>icon-library/*</code> booleans drive Figma visibility only; React does
        not consume them.
      </p>
      <MetaList
        items={ICON_LIBRARY_BOOLEANS.map((item) => ({
          label: item.figmaName,
          value: `${item.token} = ${item.value}`,
        }))}
      />
    </figure>
  );
}
