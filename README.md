# my-ai-ds

React + TypeScript design system. Visual language comes from [Figma](https://www.figma.com/design/PMZpYxijxLhjDlvMbtVY5j/my-ai-ds). Storybook is the working catalog.

Stack: Vite, Tailwind CSS v4, shadcn structure, Base UI, Style Dictionary.

This repo is a catalog, not a product app. Do not add `src/views/` until there is an application to compose. Do not publish an npm package until another repo consumes it. `src/App.tsx` / `npm run dev` is a leftover Vite shell; leave it until that consumer exists.

## Run

```bash
npm install
npx playwright install chromium
npm run storybook
```

Storybook: [http://localhost:6006](http://localhost:6006)

```bash
npm run check
```

`check` runs typecheck, lint, token tests (`tokens:test`), Storybook interaction tests, and the production build. Use it before commit.

Accessibility checks in Storybook stay at `parameters.a11y.test: 'todo'` until the catalog in [`.storybook/a11y-status.md`](.storybook/a11y-status.md) is clean. Then switch that setting to `'error'`.

## Tokens

Figma variables are exported with the development plugin in `figma/export-variables/`.

1. In Figma: Plugins → Development → Import plugin from manifest… → `figma/export-variables/manifest.json`.
2. Run **Export variables**. Save the download as `tokens/figma-variables.raw.json`.
3. `npm run tokens:normalize` rewrites primitives and semantics in `tokens/tokens.json` and the Dark mode of Semantic Colors in `tokens/tokens.dark.json`. Font, typography, and effect styles in `tokens.json` stay as they are.
4. `npm run build:tokens` writes `src/styles/generated/tokens.css` and `tokens.dark.css`.

Dark mode is applied with `data-theme="dark"` on `<html>`. Storybook has a Theme switch in the toolbar.

Implementation rules (tokens, components, patterns, testing) live in `.cursor/rules/design-system.mdc`. This file does not restate them.

## Layout

| Path | Role |
| --- | --- |
| `src/components/ui/` | Components (Button, Field, Input, Link, …) |
| `src/components/icon/` | Curated icon registry |
| `src/foundations/` | Token specimens (color, type, space, …) |
| `src/patterns/` | Composed screens (Login, Register, Home Products). Specimens, not product routes |
| `figma/export-variables/` | Figma plugin that downloads every local variable |
| `tokens/figma-variables.raw.json` | Raw variable export. Input to `tokens:normalize` |
| `tokens/tokens.json` | Token source. Primitives and semantics come from the export; font, typography, and effect stay in this file |
| `tokens/tokens.dark.json` | Dark mode of Semantic Colors. Written by `tokens:normalize` |
| `src/styles/generated/tokens.css`, `tokens.dark.css` | Generated CSS. Produced by `npm run build:tokens` |

Each UI component has `.tsx`, `.stories.tsx`, and `.mdx`. Usage pages are the MDX files in Storybook.

## License

Private. Not published as an npm package yet.
