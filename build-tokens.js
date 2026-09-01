import StyleDictionary from 'style-dictionary';

// ---------------------------------------------------------------------------
// Typography unit strategy
// ---------------------------------------------------------------------------
// Figma exports every semantic typography value (line-height, letter-spacing)
// as an *absolute pixel number* scoped to one specific type-scale entry
// (e.g. "button-xl.lh-snug" = 24.75, "button-xl.font-size" = {ref to 18}).
// That is not how these properties should ship as CSS:
//   - font-size   -> rem   (already handled by size/pxToRem below, since
//                           primitive font-size tokens are plain px numbers)
//   - line-height -> unitless (proportional to font-size, so it keeps scaling
//                           correctly if font-size changes, e.g. user zoom)
//   - letter-spacing -> em (proportional to font-size, same reasoning)
//
// To convert an absolute px line-height/letter-spacing into the correct
// relative unit we must divide it by the font-size it was designed against.
// That font-size lives on a *sibling* token (same parent object, key
// "font-size"), so a plain per-token "value" transform can't compute it in
// isolation. We resolve this in two steps:
//   1. A *preprocessor* walks the raw token tree (before reference
//      resolution) and, for every token whose Figma scope is LINE_HEIGHT or
//      LETTER_SPACING, looks up its sibling "font-size" token, resolves any
//      {alias} reference to a raw px number, and stores the computed ratio
//      on `token.extensions.designSystem`. Tokens are identified by their
//      Figma variable "scope" (FONT_SIZE/LINE_HEIGHT/LETTER_SPACING/
//      FONT_WEIGHT), not by name, since naming is inconsistent
//      (`tracking-tight`, `tracking-normal`, `tracking-[-0,125]`, ...).
//   2. A "value" transform (typography/relativeUnit) formats that
//      precomputed ratio as either a bare unitless number (line-height) or
//      an em value (letter-spacing).
//
// This only touches `semantics.typography.*`, the only place these Figma
// scopes appear. The unrelated `font.typography.*` (composite
// custom-fontStyle tokens) and `typography.typography.*` (an unused,
// duplicate decomposition of the same text styles, with no Figma scope
// metadata at all) collections are untouched by design: they aren't
// referenced anywhere in the app, and the composite-token -> `[object
// Object]` limitation is a separate, already-known issue out of scope here.

const FIGMA_EXT = 'org.lukasoppermann.figmaDesignTokens';

function isTokenLeaf(node) {
  return Boolean(node) && typeof node === 'object' && 'type' in node && 'value' in node;
}

function figmaScopes(node) {
  return node?.extensions?.[FIGMA_EXT]?.scopes ?? [];
}

// Follows a "{a.b.c}" alias reference chain to its final raw value, walking
// the same raw (pre-resolution) tree the preprocessor receives.
function resolveAliasValue(root, value) {
  let current = value;
  let guard = 0;
  while (typeof current === 'string' && /^\{.+\}$/.test(current) && guard < 10) {
    const path = current.slice(1, -1).split('.');
    let node = root;
    for (const key of path) node = node?.[key];
    current = node?.value;
    guard += 1;
  }
  return typeof current === 'number' ? current : null;
}

function roundTo5(n) {
  return Math.round(n * 100000) / 100000;
}

// For a LINE_HEIGHT/LETTER_SPACING leaf, finds its paired font-size (the
// sibling "font-size" key in the same parent object) and returns the ratio
// of the leaf's own px value to that font-size's px value.
function computeRelativeRatio(root, parentNode, leafPxValue) {
  if (leafPxValue === 0) return 0;
  const fontSizeSibling = parentNode?.['font-size'];
  if (!fontSizeSibling || !figmaScopes(fontSizeSibling).includes('FONT_SIZE')) return null;
  const fontSizePx = resolveAliasValue(root, fontSizeSibling.value);
  if (!fontSizePx) return null;
  return roundTo5(leafPxValue / fontSizePx);
}

function annotateTypographyTree(root, node, parentNode) {
  if (!node || typeof node !== 'object') return;

  if (isTokenLeaf(node)) {
    const scopes = figmaScopes(node);
    const isLineHeight = scopes.includes('LINE_HEIGHT');
    const isLetterSpacing = scopes.includes('LETTER_SPACING');
    if ((isLineHeight || isLetterSpacing) && typeof node.value === 'number') {
      const ratio = computeRelativeRatio(root, parentNode, node.value);
      if (ratio !== null) {
        node.extensions = node.extensions ?? {};
        node.extensions.designSystem = {
          unit: isLineHeight ? 'unitless' : 'em',
          ratio,
        };
      }
    }
    return;
  }

  for (const key of Object.keys(node)) {
    annotateTypographyTree(root, node[key], node);
  }
}

StyleDictionary.registerPreprocessor({
  name: 'typography/relative-units',
  preprocessor: (dictionary) => {
    annotateTypographyTree(dictionary, dictionary, null);
    return dictionary;
  },
});

// ---------------------------------------------------------------------------
// Centralized numeric-dimension classifier
// ---------------------------------------------------------------------------
// Figma exports *every* numeric FLOAT-like variable as type "dimension",
// regardless of whether it is actually a physical pixel measurement
// (spacing, radius, width, border/ring width, shadow offsets, font-size...)
// or a different unit family entirely (font-weight, opacity, line-height
// ratios, tracking multipliers). Relying on `type === 'dimension'` alone is
// therefore not a reliable signal, and bolting on an independent
// isXToken()-style exclusion for every non-physical category that turns up
// (font-weight today, opacity/line-height tomorrow, ...) does not scale.
//
// classifyDimension() is the single place that decides which semantic unit
// family a dimension-typed token belongs to. Every transform below is just
// "does this token belong to my family?" — no other file/transform should
// need its own bespoke isXToken() check.
//
// Classification priority:
//   1. Tokens already resolved by the typography/relative-units preprocessor
//      (semantic line-height -> unitless ratio, semantic letter-spacing ->
//      em, computed against each token's paired font-size). Never touch
//      these again here.
//   2. Reliable Figma scope. FONT_WEIGHT and OPACITY are consistently
//      applied by Figma wherever they occur, at both the semantic and
//      primitive layers.
//   3. Path/category fallback for primitive tokens, whose Figma scope
//      metadata is frequently empty — primitives are rarely bound directly
//      to a design property in Figma, so they don't reliably pick up scope
//      the way semantic tokens (which back an actual text style/effect) do.
//   4. Anything else still typed "dimension" is a genuine physical
//      measurement (spacing, radius, border/ring width, width/height/
//      max-width, font-size, shadow offsets/blur/spread, control
//      dimensions, ...) and converts px -> rem as before.
function pathIncludes(token, segment) {
  return Boolean(token.path?.includes(segment));
}

function classifyDimension(token) {
  if (token.extensions?.designSystem) return 'relative-typography';

  const scopes = figmaScopes(token);
  if (scopes.includes('FONT_WEIGHT')) return 'font-weight';
  if (scopes.includes('OPACITY')) return 'opacity';

  if (pathIncludes(token, 'font-weight')) return 'font-weight';
  if (pathIncludes(token, 'opacity')) return 'opacity';
  if (pathIncludes(token, 'line-height')) return 'line-height';
  // primitives.typography.tracking.* is an em-based multiplier, not a
  // physical pixel dimension: the confirmed Figma convention is
  // raw value / 10 -> em (see extractTrackingEmValue below for the
  // bracket-key precision-recovery exception).
  if (pathIncludes(token, 'tracking')) return 'tracking';

  return 'rem';
}

// Figma's numeric input only allows two decimal places and uses a comma as
// the decimal separator, so a bracket-style key like "tracking-[-0,125]"
// (intended value -0.125) gets its raw numeric value silently rounded to
// -0.12 on export. The key name still preserves the true intended
// precision, so for these specific bracket keys we parse the value from
// the token name instead of trusting the rounded raw number. Either way
// (name-parsed or raw), the result is then divided by 10, because the
// primitive tracking scale stores values 10x larger than their intended
// em value (e.g. tracking-widest = 1 -> 0.1em). This is intentionally
// scoped to primitives.typography.tracking.* only — it is NOT a general
// "trust the token name over its value" rule for other tokens.
function extractTrackingEmValue(token) {
  const key = token.path?.[token.path.length - 1] ?? '';
  const match = /^tracking-\[(-?)(\d+),(\d+)\]$/.exec(key);
  if (!match) return token.value;
  const [, sign, intPart, fracPart] = match;
  return Number(`${sign}${intPart}.${fracPart}`);
}

// 1. Line-height -> unitless, letter-spacing -> em, using the ratio the
// typography/relative-units preprocessor computed against each token's
// paired font-size.
StyleDictionary.registerTransform({
  name: 'typography/relativeUnit',
  type: 'value',
  filter: (token) => classifyDimension(token) === 'relative-typography',
  transform: (token) => {
    const { unit, ratio } = token.extensions.designSystem;
    return unit === 'em' ? `${ratio}em` : `${ratio}`;
  },
});

// 2. font-weight -> bare unitless integer (100-900). Figma has no dedicated
// "number" variable type, so these are mistakenly typed "dimension" in the
// source export, which would otherwise make them look like a sizing value.
StyleDictionary.registerTransform({
  name: 'ds/unitlessInteger',
  type: 'value',
  filter: (token) =>
    token.type === 'dimension' &&
    typeof token.value === 'number' &&
    classifyDimension(token) === 'font-weight',
  transform: (token) => `${token.value}`,
});

// 3. opacity / primitive line-height -> unitless. Both are exported as
// percentage-style numbers (e.g. opacity-70 = 70, leading-loose = 200), so
// both need value / 100, not value / 16.
StyleDictionary.registerTransform({
  name: 'ds/percentToUnitless',
  type: 'value',
  filter: (token) => {
    if (token.type !== 'dimension' || typeof token.value !== 'number') return false;
    const family = classifyDimension(token);
    return family === 'opacity' || family === 'line-height';
  },
  transform: (token) => `${roundTo5(token.value / 100)}`,
});

// 4. Primitive tracking -> em, using raw value / 10 (or the bracket-key
// precision-recovered value for the two arbitrary tokens above).
StyleDictionary.registerTransform({
  name: 'ds/emTracking',
  type: 'value',
  filter: (token) =>
    token.type === 'dimension' &&
    typeof token.value === 'number' &&
    classifyDimension(token) === 'tracking',
  transform: (token) => `${roundTo5(extractTrackingEmValue(token) / 10)}em`,
});

// 5. Everything else typed "dimension" is a genuine physical measurement
// (spacing, radius, border/ring width, width/height/max-width, font-size,
// shadow offsets/blur/spread, control dimensions, ...) -> px to rem.
//
// IMPORTANT: this is intentionally named 'ds/pxToRem', NOT 'size/pxToRem'.
// 'size/pxToRem' collides with a *built-in* Style Dictionary v5 transform of
// the exact same name (see node_modules/style-dictionary/lib/common/
// transforms.js). Registering a custom transform under that name does not
// override the built-in — the built-in silently wins, so any custom
// filter/exclusion logic attached to that name is never actually invoked.
// That collision is also *why* the original NaN bug's "matcher -> filter"
// fix appeared to work at all: once the name collided, Style Dictionary's
// own built-in `size/pxToRem` (filter: isDimension || isFontSize) took over
// unconditionally, which happens to convert plain numeric dimensions
// correctly but has no awareness of this project's classification below.
StyleDictionary.registerTransform({
  name: 'ds/pxToRem',
  type: 'value',
  filter: (token) => { // <-- 'matcher' (API de SD v3) renombrado a 'filter' en SD v5; sin este nombre correcto, el transform se aplicaba a TODOS los tokens (no solo dimensiones), causando NaNrem en colores, fuentes y shadows
    if (token.type !== 'dimension' || typeof token.value !== 'number') return false;
    return classifyDimension(token) === 'rem';
  },
  transform: (token) => { // <-- Se cambió 'transformer' por 'transform' para SD v5
    if (token.value === 0) return '0';
    return `${token.value / 16}rem`;
  }
});

// 3. Configurar la compilación de Style Dictionary
const sd = new StyleDictionary({
  source: ['tokens/tokens.json'], // Verifica que esta sea la ruta exacta de tu JSON
  preprocessors: ['typography/relative-units'],
  platforms: {
    css: {
      transforms: [
        'attribute/cti',
        'name/kebab',
        'typography/relativeUnit',
        'ds/unitlessInteger',
        'ds/percentToUnitless',
        'ds/emTracking',
        'ds/pxToRem',
      ],
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true // Preserva las referencias como var(--primitives-...)
          }
        }
      ]
    }
  }
});

// 3. Ejecutar el build
await sd.buildAllPlatforms();
console.log('✨ Tokens generados con éxito en src/styles/generated/tokens.css');