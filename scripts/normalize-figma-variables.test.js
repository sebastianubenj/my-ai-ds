import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { normalizeFigmaVariables } from './normalize-figma-variables.js';

const SOURCE = {
  font: { typography: { display: { lg: { type: 'custom-fontStyle', value: { fontSize: 60 } } } } },
  effect: { shadows: { popover: { 0: { type: 'custom-shadow', value: { offsetX: 0 } } } } },
  primitives: { old: { type: 'dimension', value: 1 } },
  semantics: { old: { type: 'color', value: '#000000ff' } },
  typography: { typography: { display: { lg: { type: 'number', value: 600 } } } },
};

function collection(id, name, modeId, variableIds) {
  return {
    id,
    name,
    remote: false,
    defaultModeId: modeId,
    modes: [{ name: 'Mode 1', modeId }],
    variableIds,
  };
}

function variable(fields) {
  return {
    remote: false,
    key: fields.id,
    scopes: [],
    codeSyntax: {},
    hiddenFromPublishing: false,
    description: '',
    ...fields,
  };
}

function raw(collections, variables) {
  return { collections, variables };
}

function leaf(candidate, path) {
  return path.split('.').reduce((node, key) => node[key], candidate);
}

const prim = collection('c-prim', 'Primitives', 'm-prim', []);
const sem = collection('c-sem', 'Semantics', 'm-sem', []);

test('color literal becomes lowercase 8-digit hex', () => {
  const candidate = normalizeFigmaVariables(raw(
    [prim],
    [variable({
      id: 'VariableID:9:2064',
      name: 'colors/neutral/900',
      variableCollectionId: 'c-prim',
      resolvedType: 'COLOR',
      valuesByMode: {
        'm-prim': { r: 0.09019608050584793, g: 0.09019608050584793, b: 0.09019608050584793, a: 1 },
      },
    })],
  ), SOURCE);

  const token = leaf(candidate, 'primitives.colors.neutral.900');
  assert.equal(token.type, 'color');
  assert.equal(token.value, '#171717ff');
  assert.deepEqual(token.extensions['org.lukasoppermann.figmaDesignTokens'], {
    collection: 'Primitives',
    scopes: [],
    variableId: 'VariableID:9:2064',
    exportKey: 'variables',
  });
});

test('dimension and spacing/0,75 keep the comma in the key', () => {
  const candidate = normalizeFigmaVariables(raw(
    [prim],
    [
      variable({
        id: 'spacing-4',
        name: 'spacing/4',
        variableCollectionId: 'c-prim',
        resolvedType: 'FLOAT',
        scopes: ['WIDTH_HEIGHT', 'GAP'],
        valuesByMode: { 'm-prim': 16 },
      }),
      variable({
        id: 'spacing-0-75',
        name: 'spacing/0,75',
        variableCollectionId: 'c-prim',
        resolvedType: 'FLOAT',
        scopes: ['GAP'],
        valuesByMode: { 'm-prim': 3 },
      }),
    ],
  ), SOURCE);

  assert.equal(leaf(candidate, 'primitives.spacing.4').value, 16);
  assert.equal(leaf(candidate, 'primitives.spacing.4').type, 'dimension');
  assert.deepEqual(leaf(candidate, 'primitives.spacing.4').extensions['org.lukasoppermann.figmaDesignTokens'].scopes, ['WIDTH_HEIGHT', 'GAP']);
  assert.equal(candidate.primitives.spacing['0,75'].value, 3);
  assert.equal(candidate.primitives.spacing['0,75'].type, 'dimension');
});

test('tracking/[-0,125] keeps the bracket key and the raw number', () => {
  const candidate = normalizeFigmaVariables(raw(
    [prim],
    [variable({
      id: 'tracking',
      name: 'tracking/[-0,125]',
      variableCollectionId: 'c-prim',
      resolvedType: 'FLOAT',
      valuesByMode: { 'm-prim': -0.12 },
    })],
  ), SOURCE);

  assert.equal(candidate.primitives.tracking['[-0,125]'].value, -0.12);
  assert.equal(candidate.primitives.tracking['[-0,125]'].type, 'dimension');
});

test('float32 residue snaps to the designed decimal', () => {
  const candidate = normalizeFigmaVariables(raw(
    [prim],
    [
      variable({
        id: 'border-133',
        name: 'border-width/border-1,33',
        variableCollectionId: 'c-prim',
        resolvedType: 'FLOAT',
        valuesByMode: { 'm-prim': 1.3300000429153442 },
      }),
      variable({
        id: 'border-166',
        name: 'border-width/border-1,66',
        variableCollectionId: 'c-prim',
        resolvedType: 'FLOAT',
        valuesByMode: { 'm-prim': 1.659999966621399 },
      }),
    ],
  ), SOURCE);

  assert.equal(candidate.primitives['border-width']['border-1,33'].value, 1.33);
  assert.equal(candidate.primitives['border-width']['border-1,66'].value, 1.66);
});

test('meaningful numeric precision is preserved', () => {
  const samples = [
    ['spacing/4', 16, 16],
    ['spacing/0,75', 0.75, 0.75],
    ['radius/rounded-full', 9999, 9999],
    ['glass/default/light/-45', -45, -45],
    ['border-width/border-1,5', 1.5, 1.5],
    ['typography/line-height/leading-snug', 137.5, 137.5],
    ['typography/label/label-xl/lh-snug', 24.75, 24.75],
    ['typography/display/display-md/lh-tighter', 52.79999923706055, 52.8],
    ['typography/tracking/tracking-tight', -0.02500000037252903, -0.025],
    ['typography/tracking/tracking-[-0,125]', -0.11999999731779099, -0.12],
    ['typography/label/label-xl/tracking-[-0,125]', -0.22499999403953552, -0.225],
    ['typography/label/label-md/tracking-[-0,125]', -0.17499999701976776, -0.175],
  ];
  const candidate = normalizeFigmaVariables(raw(
    [prim],
    samples.map(([name, value], index) => variable({
      id: `n-${index}`,
      name,
      variableCollectionId: 'c-prim',
      resolvedType: 'FLOAT',
      valuesByMode: { 'm-prim': value },
    })),
  ), SOURCE);

  for (const [name, , expected] of samples) {
    const token = name.split('/').reduce((node, key) => node[key], candidate.primitives);
    assert.equal(token.value, expected, name);
    assert.equal(token.type, 'dimension', name);
  }
});

test('simple alias points at the primitive path and does not inline the hex', () => {
  const candidate = normalizeFigmaVariables(raw(
    [prim, sem],
    [
      variable({
        id: 'white',
        name: 'colors/white',
        variableCollectionId: 'c-prim',
        resolvedType: 'COLOR',
        valuesByMode: { 'm-prim': { r: 1, g: 1, b: 1, a: 1 } },
      }),
      variable({
        id: 'foreground',
        name: 'colors/foreground/primary',
        variableCollectionId: 'c-sem',
        resolvedType: 'COLOR',
        scopes: ['SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR'],
        valuesByMode: { 'm-sem': { type: 'VARIABLE_ALIAS', id: 'white' } },
      }),
    ],
  ), SOURCE);

  const token = leaf(candidate, 'semantics.colors.foreground.primary');
  assert.equal(token.type, 'color');
  assert.equal(token.value, '{primitives.colors.white}');
  assert.equal(leaf(candidate, 'primitives.colors.white').value, '#ffffffff');
});

test('semantic alias chain resolves to the primitive that holds the value', () => {
  const candidate = normalizeFigmaVariables(raw(
    [prim, sem],
    [
      variable({
        id: 'white',
        name: 'colors/white',
        variableCollectionId: 'c-prim',
        resolvedType: 'COLOR',
        valuesByMode: { 'm-prim': { r: 1, g: 1, b: 1, a: 1 } },
      }),
      variable({
        id: 'accent',
        name: 'colors/background/accent',
        variableCollectionId: 'c-sem',
        resolvedType: 'COLOR',
        valuesByMode: { 'm-sem': { type: 'VARIABLE_ALIAS', id: 'white' } },
      }),
      variable({
        id: 'link',
        name: 'colors/link',
        variableCollectionId: 'c-sem',
        resolvedType: 'COLOR',
        valuesByMode: { 'm-sem': { type: 'VARIABLE_ALIAS', id: 'accent' } },
      }),
    ],
  ), SOURCE);

  assert.equal(leaf(candidate, 'semantics.colors.background.accent').value, '{primitives.colors.white}');
  assert.equal(leaf(candidate, 'semantics.colors.link').value, '{primitives.colors.white}');
});

test('color alias plus opacity alias becomes 8-digit hex', () => {
  const candidate = normalizeFigmaVariables(raw(
    [prim, sem],
    [
      variable({
        id: 'red',
        name: 'colors/red/500',
        variableCollectionId: 'c-prim',
        resolvedType: 'COLOR',
        valuesByMode: { 'm-prim': { r: 0.8392156958580017, g: 0, b: 0, a: 1 } },
      }),
      variable({
        id: 'opacity-10',
        name: 'opacity/opacity-10',
        variableCollectionId: 'c-prim',
        resolvedType: 'FLOAT',
        valuesByMode: { 'm-prim': 10 },
      }),
      variable({
        id: 'destructive',
        name: 'colors/background/destructive',
        variableCollectionId: 'c-sem',
        resolvedType: 'COLOR',
        scopes: ['FRAME_FILL', 'SHAPE_FILL'],
        valuesByMode: {
          'm-sem': {
            color: { type: 'VARIABLE_ALIAS', id: 'red' },
            opacity: { type: 'VARIABLE_ALIAS', id: 'opacity-10' },
          },
        },
      }),
    ],
  ), SOURCE);

  const token = leaf(candidate, 'semantics.colors.background.destructive');
  assert.equal(token.type, 'color');
  assert.equal(token.value, '#d600001a');
  assert.notEqual(token.value, '#000000ff');
});

test('color alias plus literal opacity becomes 8-digit hex', () => {
  const candidate = normalizeFigmaVariables(raw(
    [prim, sem],
    [
      variable({
        id: 'white',
        name: 'colors/white',
        variableCollectionId: 'c-prim',
        resolvedType: 'COLOR',
        valuesByMode: { 'm-prim': { r: 1, g: 1, b: 1, a: 1 } },
      }),
      variable({
        id: 'accent',
        name: 'colors/background/accent',
        variableCollectionId: 'c-sem',
        resolvedType: 'COLOR',
        valuesByMode: { 'm-sem': { type: 'VARIABLE_ALIAS', id: 'white' } },
      }),
      variable({
        id: 'hover',
        name: 'colors/interaction/secondary/hover',
        variableCollectionId: 'c-sem',
        resolvedType: 'COLOR',
        valuesByMode: {
          'm-sem': {
            color: { type: 'VARIABLE_ALIAS', id: 'accent' },
            opacity: 100,
          },
        },
      }),
    ],
  ), SOURCE);

  assert.equal(leaf(candidate, 'semantics.colors.interaction.secondary.hover').value, '#ffffffff');
});

test('boolean value and scopes are preserved', () => {
  const candidate = normalizeFigmaVariables(raw(
    [sem],
    [variable({
      id: 'lucide',
      name: 'icon-library/lucide',
      variableCollectionId: 'c-sem',
      resolvedType: 'BOOLEAN',
      scopes: ['ALL_SCOPES'],
      valuesByMode: { 'm-sem': true },
    })],
  ), SOURCE);

  const token = leaf(candidate, 'semantics.icon-library.lucide');
  assert.equal(token.type, 'boolean');
  assert.equal(token.value, true);
  assert.deepEqual(token.extensions['org.lukasoppermann.figmaDesignTokens'].scopes, ['ALL_SCOPES']);
});

test('timing becomes a duration in seconds and easing a cubic bezier', () => {
  const candidate = normalizeFigmaVariables(raw(
    [sem],
    [
      variable({
        id: 'base',
        name: 'motion/duration/base',
        variableCollectionId: 'c-sem',
        resolvedType: 'TIMING',
        valuesByMode: { 'm-sem': 0.23999999463558197 },
      }),
      variable({
        id: 'standard',
        name: 'motion/easing/standard',
        variableCollectionId: 'c-sem',
        resolvedType: 'EASING',
        valuesByMode: {
          'm-sem': {
            type: 'CUSTOM_CUBIC_BEZIER',
            easingFunctionCubicBezier: { x1: 0.4000000059604645, y1: 0, x2: 0.6000000238418579, y2: 1 },
          },
        },
      }),
    ],
  ), SOURCE);

  const duration = leaf(candidate, 'semantics.motion.duration.base');
  assert.equal(duration.type, 'duration');
  assert.equal(duration.value, 0.24);
  const easing = leaf(candidate, 'semantics.motion.easing.standard');
  assert.equal(easing.type, 'cubicBezier');
  assert.deepEqual(easing.value, [0.4, 0, 0.6, 1]);
});

test('font, typography, and effect are copied unchanged', () => {
  const candidate = normalizeFigmaVariables(raw([prim], []), SOURCE);
  assert.deepEqual(candidate.font, SOURCE.font);
  assert.deepEqual(candidate.typography, SOURCE.typography);
  assert.deepEqual(candidate.effect, SOURCE.effect);
  assert.deepEqual(Object.keys(candidate), Object.keys(SOURCE));
});

test('an unknown collection fails', () => {
  assert.throws(
    () => normalizeFigmaVariables(raw(
      [collection('c-comp', 'Components', 'm', [])],
      [],
    ), SOURCE),
    /Collection "Components" is not supported/,
  );
});

test('more than one mode fails', () => {
  assert.throws(
    () => normalizeFigmaVariables(raw(
      [{
        ...prim,
        modes: [
          { name: 'Mode 1', modeId: 'm-prim' },
          { name: 'Dark', modeId: 'm-dark' },
        ],
      }],
      [],
    ), SOURCE),
    /Collection "Primitives" has 2 modes/,
  );
});

test('a circular alias fails', () => {
  assert.throws(
    () => normalizeFigmaVariables(raw(
      [sem],
      [
        variable({
          id: 'a',
          name: 'colors/a',
          variableCollectionId: 'c-sem',
          resolvedType: 'COLOR',
          valuesByMode: { 'm-sem': { type: 'VARIABLE_ALIAS', id: 'b' } },
        }),
        variable({
          id: 'b',
          name: 'colors/b',
          variableCollectionId: 'c-sem',
          resolvedType: 'COLOR',
          valuesByMode: { 'm-sem': { type: 'VARIABLE_ALIAS', id: 'a' } },
        }),
      ],
    ), SOURCE),
    /Circular alias: colors\/a → colors\/b → colors\/a/,
  );
});

test('a remote library alias fails', () => {
  assert.throws(
    () => normalizeFigmaVariables(raw(
      [sem],
      [
        variable({
          id: 'local',
          name: 'colors/local',
          variableCollectionId: 'c-sem',
          resolvedType: 'COLOR',
          valuesByMode: { 'm-sem': { type: 'VARIABLE_ALIAS', id: 'VariableID:remote' } },
        }),
        variable({
          id: 'VariableID:remote',
          name: 'colors/library',
          remote: true,
          variableCollectionId: 'c-sem',
          resolvedType: 'COLOR',
          valuesByMode: { 'm-sem': { r: 1, g: 0, b: 0, a: 1 } },
        }),
      ],
    ), SOURCE),
    /not a local variable in this file/,
  );
});

test('the committed raw export reproduces tokens.json', () => {
  const raw = JSON.parse(readFileSync('tokens/figma-variables.raw.json', 'utf8'));
  const source = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'));
  assert.deepEqual(normalizeFigmaVariables(raw, source), source);
});
