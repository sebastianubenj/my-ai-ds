import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const FIGMA_EXT = 'org.lukasoppermann.figmaDesignTokens';
const COLLECTION_ROOT = {
  Primitives: 'primitives',
  Semantics: 'semantics',
  'Semantic Colors': 'semantics',
};
// Only this collection may carry a Dark mode. Every other collection has one mode.
const THEMED_COLLECTION = 'Semantic Colors';
const DARK_MODE_NAME = /dark/i;
const TOKEN_TYPE = {
  COLOR: 'color',
  FLOAT: 'dimension',
  STRING: 'string',
  BOOLEAN: 'boolean',
  TIMING: 'duration',
  EASING: 'cubicBezier',
};

const SOURCE_PATH = 'tokens/tokens.json';
const DARK_PATH = 'tokens/tokens.dark.json';
const RAW_PATH = 'tokens/figma-variables.raw.json';

function isAlias(value) {
  return Boolean(value) && value.type === 'VARIABLE_ALIAS' && typeof value.id === 'string';
}

function isRgba(value) {
  return Boolean(value)
    && typeof value === 'object'
    && typeof value.r === 'number'
    && typeof value.g === 'number'
    && typeof value.b === 'number';
}

function isComposite(value) {
  return Boolean(value)
    && typeof value === 'object'
    && !isAlias(value)
    && !isRgba(value)
    && 'color' in value
    && 'opacity' in value;
}

// Figma stores FLOAT variables as float32. The Plugin API reads that binary
// value back as a float64, so a designed 1.33 arrives as 1.3300000429153442.
// Keep the shortest decimal that still round-trips to the same float32.
// A fixed decimal count would flatten distinct values such as 19.25 and 1.333.
function normalizeFloat(value) {
  if (!Number.isFinite(value)) return value;
  const bits = Math.fround(value);
  for (let places = 0; places <= 8; places += 1) {
    const decimal = Number(bits.toFixed(places));
    if (Math.fround(decimal) === bits) return decimal;
  }
  return bits;
}

function channelByte(channel, label) {
  const byte = Math.round(channel * 255);
  if (!Number.isInteger(byte) || byte < 0 || byte > 255) {
    throw new Error(`Color channel ${label} is outside 0–1: ${channel}`);
  }
  return byte.toString(16).padStart(2, '0');
}

function rgbaToHex(color) {
  const alpha = color.a ?? 1;
  return `#${channelByte(color.r, 'r')}${channelByte(color.g, 'g')}${channelByte(color.b, 'b')}${channelByte(alpha, 'a')}`;
}

function nameSegments(name) {
  const segments = name.split('/');
  if (segments.some((segment) => segment.length === 0)) {
    throw new Error(`Variable name "${name}" has an empty path segment.`);
  }
  for (const segment of segments) {
    if (segment.includes('.')) {
      throw new Error(
        `Variable name "${name}" contains a dot. Alias paths in tokens.json are dot-separated, so that name cannot be represented.`,
      );
    }
  }
  return segments;
}

function tokenRef(variable, collectionById) {
  const collection = collectionById.get(variable.variableCollectionId);
  const root = COLLECTION_ROOT[collection.name];
  return [root, ...nameSegments(variable.name)].join('.');
}

function themeModes(collection) {
  const modes = collection.modes ?? [];
  const modeNames = modes.map((mode) => mode.name).join(', ') || 'none';
  if (collection.name !== THEMED_COLLECTION) {
    if (modes.length !== 1) {
      throw new Error(
        `Collection "${collection.name}" has ${modes.length} modes (${modeNames}). This token file supports one mode.`,
      );
    }
    return { light: modes[0].modeId, dark: null };
  }
  if (modes.length === 1) return { light: modes[0].modeId, dark: null };
  const dark = modes.filter((mode) => DARK_MODE_NAME.test(mode.name));
  if (modes.length !== 2 || dark.length !== 1) {
    throw new Error(
      `Collection "${collection.name}" has modes (${modeNames}). Expected one mode, or two modes where exactly one is named Dark.`,
    );
  }
  const light = modes.find((mode) => mode !== dark[0]);
  return { light: light.modeId, dark: dark[0].modeId };
}

function buildIndex(raw, theme = 'light') {
  if (!raw || !Array.isArray(raw.collections) || !Array.isArray(raw.variables)) {
    throw new Error('Raw variable file must contain collections and variables arrays.');
  }

  const collectionById = new Map();
  for (const collection of raw.collections) {
    if (!Object.hasOwn(COLLECTION_ROOT, collection.name)) {
      throw new Error(
        `Collection "${collection.name}" is not supported. Expected Primitives, Semantics or Semantic Colors.`,
      );
    }
    const modes = themeModes(collection);
    // Collections without a Dark mode resolve to their only mode in both themes,
    // so a dark color can alias a primitive or a semantic number.
    const activeModeId = theme === 'dark' ? (modes.dark ?? modes.light) : modes.light;
    collectionById.set(collection.id, { ...collection, activeModeId, hasDark: modes.dark !== null });
  }

  const byId = new Map();
  for (const variable of raw.variables) {
    if (byId.has(variable.id)) {
      throw new Error(`Duplicate variable id ${variable.id}.`);
    }
    byId.set(variable.id, variable);
  }

  return { collectionById, byId };
}

function modeValue(variable, collectionById) {
  const collection = collectionById.get(variable.variableCollectionId);
  if (!collection) {
    throw new Error(`Variable "${variable.name}" belongs to an unknown collection.`);
  }
  const modeId = collection.activeModeId;
  if (!Object.hasOwn(variable.valuesByMode, modeId)) {
    throw new Error(`Variable "${variable.name}" has no value for mode ${modeId}.`);
  }
  return variable.valuesByMode[modeId];
}

function mustLocal(id, fromName, byId) {
  const variable = byId.get(id);
  if (!variable || variable.remote) {
    const target = variable ? ` (${variable.name})` : '';
    throw new Error(
      `Alias from "${fromName}" points at ${id}${target}, which is not a local variable in this file.`,
    );
  }
  return variable;
}

function circularError(stack, nextId, byId) {
  const names = [...stack, nextId].map((id) => byId.get(id)?.name ?? id);
  throw new Error(`Circular alias: ${names.join(' → ')}`);
}

function terminalVariable(id, fromName, stack, byId, collectionById) {
  if (stack.includes(id)) circularError(stack, id, byId);
  const variable = mustLocal(id, fromName, byId);
  const value = modeValue(variable, collectionById);
  if (isAlias(value)) {
    return terminalVariable(value.id, fromName, stack.concat(id), byId, collectionById);
  }
  return variable;
}

function resolveNumber(value, fromName, stack, byId, collectionById) {
  if (typeof value === 'number') return value;
  if (isAlias(value)) {
    if (stack.includes(value.id)) circularError(stack, value.id, byId);
    const next = mustLocal(value.id, fromName, byId);
    return resolveNumber(
      modeValue(next, collectionById),
      fromName,
      stack.concat(value.id),
      byId,
      collectionById,
    );
  }
  throw new Error(`Expected a number while resolving opacity for "${fromName}".`);
}

function resolveRgba(value, fromName, stack, byId, collectionById) {
  if (isAlias(value)) {
    if (stack.includes(value.id)) circularError(stack, value.id, byId);
    const next = mustLocal(value.id, fromName, byId);
    return resolveRgba(
      modeValue(next, collectionById),
      fromName,
      stack.concat(value.id),
      byId,
      collectionById,
    );
  }
  if (isComposite(value)) {
    const base = resolveRgba(value.color, fromName, stack, byId, collectionById);
    const opacity = resolveNumber(value.opacity, fromName, stack, byId, collectionById);
    return { r: base.r, g: base.g, b: base.b, a: opacity / 100 };
  }
  if (isRgba(value)) {
    return { r: value.r, g: value.g, b: value.b, a: value.a ?? 1 };
  }
  throw new Error(`Expected a color while resolving "${fromName}".`);
}

function leaf(variable, value, collectionById) {
  const collection = collectionById.get(variable.variableCollectionId);
  const type = TOKEN_TYPE[variable.resolvedType];
  if (!type) {
    throw new Error(`Unsupported resolvedType "${variable.resolvedType}" on "${variable.name}".`);
  }
  return {
    type,
    value,
    extensions: {
      [FIGMA_EXT]: {
        collection: collection.name,
        scopes: [...variable.scopes],
        variableId: variable.id,
        exportKey: 'variables',
      },
    },
  };
}

function setLeaf(tree, segments, token, variableName) {
  let node = tree;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const key = segments[index];
    if (!Object.hasOwn(node, key)) node[key] = {};
    if (node[key] && typeof node[key] === 'object' && 'type' in node[key] && 'value' in node[key]) {
      throw new Error(`Variable "${variableName}" collides with an existing token at "${segments.slice(0, index + 1).join('/')}".`);
    }
    node = node[key];
  }
  const last = segments[segments.length - 1];
  if (Object.hasOwn(node, last) && node[last] && typeof node[last] === 'object' && !('type' in node[last])) {
    throw new Error(`Variable "${variableName}" collides with a token group named "${segments.join('/')}".`);
  }
  if (Object.hasOwn(node, last) && node[last] && typeof node[last] === 'object' && 'type' in node[last]) {
    throw new Error(`Variable "${variableName}" is defined in more than one collection.`);
  }
  node[last] = token;
}

function variableValue(variable, byId, collectionById) {
  const value = modeValue(variable, collectionById);
  if (isAlias(value)) {
    const terminal = terminalVariable(value.id, variable.name, [variable.id], byId, collectionById);
    return `{${tokenRef(terminal, collectionById)}}`;
  }
  if (isComposite(value)) {
    if (variable.resolvedType !== 'COLOR') {
      throw new Error(`Variable "${variable.name}" has a color/opacity value but resolvedType is ${variable.resolvedType}.`);
    }
    return rgbaToHex(resolveRgba(value, variable.name, [variable.id], byId, collectionById));
  }
  if (variable.resolvedType === 'COLOR') return rgbaToHex(value);
  if (variable.resolvedType === 'FLOAT') {
    if (typeof value !== 'number') {
      throw new Error(`Variable "${variable.name}" is FLOAT but its value is not a number.`);
    }
    return normalizeFloat(value);
  }
  if (variable.resolvedType === 'STRING' || variable.resolvedType === 'BOOLEAN') return value;
  // TIMING variables hold seconds. The value stays in seconds here; build-tokens.js
  // formats it as milliseconds for CSS.
  if (variable.resolvedType === 'TIMING') {
    if (typeof value !== 'number') {
      throw new Error(`Variable "${variable.name}" is TIMING but its value is not a number.`);
    }
    return normalizeFloat(value);
  }
  if (variable.resolvedType === 'EASING') {
    const curve = value?.easingFunctionCubicBezier;
    if (!curve) {
      throw new Error(`Variable "${variable.name}" is EASING but is not a cubic bezier.`);
    }
    return [curve.x1, curve.y1, curve.x2, curve.y2].map(normalizeFloat);
  }
  throw new Error(`Unsupported resolvedType "${variable.resolvedType}" on "${variable.name}".`);
}

export function buildVariableTrees(raw, theme = 'light') {
  const { collectionById, byId } = buildIndex(raw, theme);
  const trees = { primitives: {}, semantics: {} };

  for (const variable of raw.variables) {
    const collection = collectionById.get(variable.variableCollectionId);
    if (!collection) {
      throw new Error(`Variable "${variable.name}" belongs to an unknown collection.`);
    }
    if (theme === 'dark' && !collection.hasDark) continue;
    const rootName = COLLECTION_ROOT[collection.name];
    const token = leaf(
      variable,
      variableValue(variable, byId, collectionById),
      collectionById,
    );
    if (isComposite(modeValue(variable, collectionById))) token.type = 'color';
    setLeaf(trees[rootName], nameSegments(variable.name), token, variable.name);
  }

  return trees;
}

// Dark overrides: only the tokens of collections that define a Dark mode.
// Returns null when the file has no Dark mode.
export function buildDarkTree(raw) {
  const { collectionById } = buildIndex(raw, 'dark');
  if (![...collectionById.values()].some((collection) => collection.hasDark)) return null;
  return { semantics: buildVariableTrees(raw, 'dark').semantics };
}

export function normalizeFigmaVariables(raw, source) {
  const trees = buildVariableTrees(raw);
  const candidate = {};
  for (const key of Object.keys(source)) {
    candidate[key] = key === 'primitives' || key === 'semantics' ? trees[key] : source[key];
  }
  if (!Object.hasOwn(candidate, 'primitives')) candidate.primitives = trees.primitives;
  if (!Object.hasOwn(candidate, 'semantics')) candidate.semantics = trees.semantics;
  return candidate;
}

function walkLeaves(node, path, leaves) {
  if (node && typeof node === 'object' && 'type' in node && 'value' in node) {
    leaves.push({ path: path.join('.'), token: node });
    return;
  }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) walkLeaves(node[key], path.concat(key), leaves);
  }
}

function leavesOf(tree, root) {
  const leaves = [];
  walkLeaves(tree ?? {}, [root], leaves);
  return new Map(leaves.map((leaf) => [leaf.path, leaf.token]));
}

function isAliasValue(value) {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

function sameScopes(left, right) {
  const a = left ?? [];
  const b = right ?? [];
  return a.length === b.length && a.every((scope, index) => scope === b[index]);
}

export function diffTokenTrees(current, candidate) {
  const diff = {
    added: [],
    removed: [],
    changedValues: [],
    changedTypes: [],
    changedAliases: [],
    changedScopes: [],
    numericPrecision: [],
  };

  for (const root of ['primitives', 'semantics']) {
    const before = leavesOf(current[root], root);
    const after = leavesOf(candidate[root], root);
    for (const [path, token] of after) {
      if (!before.has(path)) diff.added.push(path);
      else compareLeaf(path, before.get(path), token, diff);
    }
    for (const path of before.keys()) {
      if (!after.has(path)) diff.removed.push(path);
    }
  }

  return diff;
}

function compareLeaf(path, before, after, diff) {
  if (before.type !== after.type) {
    diff.changedTypes.push({ path, from: before.type, to: after.type });
  }
  const beforeScopes = before.extensions?.[FIGMA_EXT]?.scopes ?? [];
  const afterScopes = after.extensions?.[FIGMA_EXT]?.scopes ?? [];
  if (!sameScopes(beforeScopes, afterScopes)) {
    diff.changedScopes.push({ path, from: beforeScopes, to: afterScopes });
  }
  if (JSON.stringify(before.value) === JSON.stringify(after.value)) return;

  if (isAliasValue(before.value) || isAliasValue(after.value)) {
    diff.changedAliases.push({ path, from: before.value, to: after.value });
    return;
  }
  if (typeof before.value === 'number' && typeof after.value === 'number' && Math.abs(before.value - after.value) < 1e-6) {
    diff.numericPrecision.push({ path, from: before.value, to: after.value });
    return;
  }
  diff.changedValues.push({ path, from: before.value, to: after.value });
}

const REVIEW_PATHS = [
  'semantics.colors.background.destructive',
  'semantics.colors.interaction.primary.hover',
  'semantics.colors.interaction.destructive.hover',
  'semantics.colors.interaction.secondary.hover',
  'semantics.colors.interaction.destructive.subtle-hover',
  'semantics.colors.interaction.file-upload.drag-over',
];

export function reviewPaths(current, candidate) {
  const before = new Map([
    ...leavesOf(current.semantics, 'semantics'),
  ]);
  const after = new Map([
    ...leavesOf(candidate.semantics, 'semantics'),
  ]);
  return REVIEW_PATHS.map((path) => ({
    path,
    current: before.get(path)?.value ?? null,
    candidate: after.get(path)?.value ?? null,
  }));
}

function readJsonIfExists(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
}

function runCli() {
  const raw = JSON.parse(readFileSync(RAW_PATH, 'utf8'));
  const source = JSON.parse(readFileSync(SOURCE_PATH, 'utf8'));
  const currentDark = readJsonIfExists(DARK_PATH);
  const candidate = normalizeFigmaVariables(raw, source);
  const dark = buildDarkTree(raw);
  writeFileSync(SOURCE_PATH, `${JSON.stringify(candidate, null, 2)}\n`);
  writeFileSync(DARK_PATH, `${JSON.stringify(dark ?? {}, null, 2)}\n`);
  const diff = diffTokenTrees(source, candidate);
  const darkDiff = diffTokenTrees(currentDark, dark ?? {});
  const preserved = ['font', 'typography', 'effect'].every(
    (key) => JSON.stringify(source[key]) === JSON.stringify(candidate[key]),
  );
  return { diff, darkDiff, preserved, review: reviewPaths(source, candidate) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = runCli();
  console.log(JSON.stringify(report, null, 2));
}
