# my-ai-ds

React + TypeScript design system. Visual language comes from Figma. Storybook is the working catalog.

Stack: Vite, Tailwind CSS v4, shadcn structure, Base UI, Style Dictionary.

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

`check` runs typecheck, lint, Storybook interaction tests, and the production build. Use it before commit.

`npm run dev` is the leftover Vite app shell. Use Storybook for the design system.

## Tokens

Figma variables are exported with the development plugin in `figma/export-variables/`.

1. In Figma: Plugins → Development → Import plugin from manifest… → `figma/export-variables/manifest.json`.
2. Run **Export variables**. Save the download as `tokens/figma-variables.raw.json`.
3. `npm run tokens:normalize` rewrites primitives and semantics in `tokens/tokens.json`. Font, typography, and effect styles in that file stay as they are.
4. `npm run build:tokens` writes `src/styles/generated/tokens.css`.

Implementation rules (tokens, components, patterns, testing) live in `.cursor/rules/design-system.mdc`. This file does not restate them.

## Layout

| Path | Role |
| --- | --- |
| `src/components/ui/` | Components (Button, Field, Input, Link, …) |
| `src/components/icon/` | Curated icon registry |
| `src/foundations/` | Token specimens (color, type, space, …) |
| `src/patterns/` | Composed screens (Login, Register). Specimens, not product routes |
| `figma/export-variables/` | Figma plugin that downloads every local variable |
| `tokens/figma-variables.raw.json` | Raw variable export. Input to `tokens:normalize` |
| `tokens/tokens.json` | Token source. Primitives and semantics come from the export; font, typography, and effect stay in this file |
| `src/styles/generated/tokens.css` | Generated CSS. Produced by `npm run build:tokens` |

Each UI component has `.tsx`, `.stories.tsx`, and `.mdx`. Usage pages are the MDX files in Storybook.

## License

Private. Not published as an npm package yet.
