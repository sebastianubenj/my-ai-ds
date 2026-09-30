// Development plugin. Figma → Plugins → Development → Import plugin from manifest…
// Downloads figma-variables.raw.json. Save that file as tokens/figma-variables.raw.json.
// Values are copied as the Plugin API returns them. The normalizer turns them into tokens.json.

function compareText(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  if (value.type === "VARIABLE_ALIAS" && typeof value.id === "string") {
    return { type: "VARIABLE_ALIAS", id: value.id };
  }
  if (
    typeof value.r === "number" &&
    typeof value.g === "number" &&
    typeof value.b === "number"
  ) {
    const color = { r: value.r, g: value.g, b: value.b };
    if (typeof value.a === "number") color.a = value.a;
    return color;
  }
  if ("color" in value && "opacity" in value) {
    return {
      color: stableValue(value.color),
      opacity: stableValue(value.opacity),
    };
  }
  const copy = {};
  for (const key of Object.keys(value).sort()) copy[key] = stableValue(value[key]);
  return copy;
}

function stableValuesByMode(valuesByMode) {
  const copy = {};
  for (const modeId of Object.keys(valuesByMode).sort()) {
    copy[modeId] = stableValue(valuesByMode[modeId]);
  }
  return copy;
}

function stableCodeSyntax(codeSyntax) {
  if (!codeSyntax || typeof codeSyntax !== "object") return {};
  const preferred = ["WEB", "ANDROID", "iOS"];
  const keys = [
    ...preferred.filter((key) => typeof codeSyntax[key] === "string"),
    ...Object.keys(codeSyntax)
      .filter((key) => !preferred.includes(key) && codeSyntax[key] != null)
      .sort(),
  ];
  const copy = {};
  for (const key of keys) copy[key] = codeSyntax[key];
  return copy;
}

function rawVariable(variable) {
  return {
    id: variable.id,
    name: variable.name,
    remote: variable.remote,
    key: variable.key,
    variableCollectionId: variable.variableCollectionId,
    resolvedType: variable.resolvedType,
    scopes: Array.isArray(variable.scopes) ? [...variable.scopes] : [],
    codeSyntax: stableCodeSyntax(variable.codeSyntax),
    hiddenFromPublishing: variable.hiddenFromPublishing,
    description: variable.description ?? "",
    valuesByMode: stableValuesByMode(variable.valuesByMode),
  };
}

function rawCollection(collection, variableIds) {
  return {
    id: collection.id,
    name: collection.name,
    remote: collection.remote,
    key: collection.key,
    defaultModeId: collection.defaultModeId,
    hiddenFromPublishing: collection.hiddenFromPublishing,
    modes: [...collection.modes]
      .sort((left, right) => compareText(left.modeId, right.modeId))
      .map((mode) => ({ name: mode.name, modeId: mode.modeId })),
    variableIds,
  };
}

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();
const collectionById = new Map(collections.map((collection) => [collection.id, collection]));

const sortedCollections = [...collections].sort(
  (left, right) => compareText(left.name, right.name) || compareText(left.id, right.id),
);
const sortedVariables = [...variables].sort((left, right) => {
  const leftCollection = collectionById.get(left.variableCollectionId)?.name ?? "";
  const rightCollection = collectionById.get(right.variableCollectionId)?.name ?? "";
  return (
    compareText(leftCollection, rightCollection) ||
    compareText(left.name, right.name) ||
    compareText(left.id, right.id)
  );
});

const idsByCollection = new Map(sortedCollections.map((collection) => [collection.id, []]));
for (const variable of sortedVariables) {
  const ids = idsByCollection.get(variable.variableCollectionId);
  if (ids) ids.push(variable.id);
}

const payload = {
  collections: sortedCollections.map((collection) =>
    rawCollection(collection, idsByCollection.get(collection.id) ?? []),
  ),
  variables: sortedVariables.map(rawVariable),
};

figma.showUI(__html__, { visible: false, width: 1, height: 1 });
figma.ui.onmessage = () => {
  figma.closePlugin(`Downloaded ${sortedVariables.length} variables`);
};
figma.ui.postMessage({
  filename: "figma-variables.raw.json",
  payload,
});
