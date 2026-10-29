# weaveui

React + TypeScript design system and storefront in one git repo. Visual language comes from [Figma](https://www.figma.com/design/PMZpYxijxLhjDlvMbtVY5j/weaveui).

- `packages/ds` (`@weaveui/ds`): tokens, foundations, controls, icons, and the six form patterns. Storybook on port 6006 is the DS catalog.
- `apps/store` (`@weaveui/store`): routes, AuthLayout, Navigation, ProductCard, Home, product assets. Consumes the DS. `npm run dev` runs this app.

Do not copy Button or other DS components into the store. Do not publish an npm package until another repo consumes it.

## Run

```bash
npm install
npx playwright install chromium
npm run storybook
```

Design system Storybook: [http://localhost:6006](http://localhost:6006)

```bash
npm run dev
```

Store: [http://localhost:5173](http://localhost:5173)

```bash
npm run storybook:store
```

Store Storybook (views and commerce components): [http://localhost:6007](http://localhost:6007)

```bash
npm run check
```

`check` runs typecheck, lint, token tests, Storybook interaction tests, and production builds for every workspace.

Accessibility: `@storybook/addon-a11y` fails `npm test` on CSF violations (`parameters.a11y.test: 'error'`). See [`packages/ds/.storybook/a11y-status.md`](packages/ds/.storybook/a11y-status.md).

## Tokens

Figma variables are exported with the development plugin in `packages/ds/figma/export-variables/`.

1. In Figma: Plugins → Development → Import plugin from manifest… → `packages/ds/figma/export-variables/manifest.json`.
2. Run **Export variables**. Save the download as `packages/ds/tokens/figma-variables.raw.json`.
3. `npm run tokens:normalize` rewrites primitives and semantics in `packages/ds/tokens/tokens.json` and the Dark mode of Semantic Colors in `packages/ds/tokens/tokens.dark.json`. Font, typography, and effect styles in `tokens.json` stay as they are.
4. `npm run build:tokens` writes `packages/ds/src/styles/generated/tokens.css` and `tokens.dark.css`.

Dark mode is applied with `data-theme="dark"` on `<html>`. Storybook has a Theme switch in the toolbar.

Implementation rules (tokens, components, patterns, testing) live in `.cursor/rules/design-system.mdc`. This file does not restate them.

## Layout

| Path | Role |
| --- | --- |
| `packages/ds/src/components/ui/` | DS components (Button, Field, FormAlert, Input, Link, …) |
| `packages/ds/src/components/icon/` | Curated icon registry |
| `packages/ds/src/foundations/` | Token specimens (color, type, space, …) |
| `packages/ds/src/patterns/` | Form patterns matching Figma Patterns (Log in, Sign up, Forgot password, Check your email, Set a new password, Password updated) |
| `apps/store/src/views/` | Store screens: Home, Login, Register, Forgot password, Reset password, Password updated, Expired link |
| `apps/store/src/components/ui/` | Store chrome: Navigation, ProductCard, bag preview |
| `packages/ds/figma/export-variables/` | Figma plugin that downloads every local variable |
| `packages/ds/tokens/` | Token source and Figma variable export |
| `packages/ds/src/styles/generated/` | Generated CSS from `npm run build:tokens` |

Each DS UI component has `.tsx`, `.stories.tsx`, and `.mdx`. Usage pages are the MDX files in Storybook.

## License

Private. Not published as an npm package yet.
