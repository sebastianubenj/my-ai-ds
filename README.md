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
npm run typecheck
npm run lint
npm test
```

`npm run dev` is the leftover Vite app shell. Use Storybook for the design system.

## Tokens

```
Figma Design Tokens export
  → tokens/tokens.json
  → npm run build:tokens   (build-tokens.js / Style Dictionary)
  → src/styles/generated/tokens.css
```

Do not edit `src/styles/generated/tokens.css`. Change source tokens or `build-tokens.js`, then regenerate.

`scripts/sync-tokens.js` is not part of this pipeline.

Prefer **semantic** tokens in components (`foreground-default`, `label-md`, `spacing/4`). Do not invent tokens or variants that Figma does not define.

Known exporter gaps for a few colors live in `tokens/exporter-overrides.json`. That file is applied in memory during token build.

## Layout

| Path | Role |
| --- | --- |
| `src/components/ui/` | Components (Button, Field, Input, Link, …) |
| `src/components/icon/` | Curated icon registry. Import `Icon`, not Lucide directly |
| `src/foundations/` | Token specimens (color, type, space, …) |
| `src/patterns/` | Composed screens (Login, Register). Specimens, not product routes |

Each UI component has `.tsx`, `.stories.tsx`, and `.mdx`.

## Conventions

- **error** on text/form fields (Input, Select, Field). **invalid** on binary controls (Checkbox, Radio).
- Two focus patterns: compact controls use `:focus-visible` (Button); text-like controls use `focus-intent` (Input).
- Patterns keep `href="#"` and do not validate or route. That belongs in a consuming app.
- Do not add components, dark theme, or size variants without a Figma source.

## License

Private. Not published as an npm package yet.
