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

Implementation rules (tokens, components, patterns, testing) live in `.cursor/rules/design-system.mdc`. This file does not restate them.

## Layout

| Path | Role |
| --- | --- |
| `src/components/ui/` | Components (Button, Field, Input, Link, …) |
| `src/components/icon/` | Curated icon registry |
| `src/foundations/` | Token specimens (color, type, space, …) |
| `src/patterns/` | Composed screens (Login, Register). Specimens, not product routes |

Each UI component has `.tsx`, `.stories.tsx`, and `.mdx`. Usage pages are the MDX files in Storybook.

## License

Private. Not published as an npm package yet.
