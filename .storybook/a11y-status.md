# Accessibility gate

`parameters.a11y.test` in `preview.tsx` is `'error'`. CSF stories that fail axe fail `npm test`. MDX docs are not scanned.

## Inventory

Full CSF scan: 27 Oct 2026. `npm test` with the gate on `'error'`: 40 files, 285 tests, WCAG via `@storybook/addon-a11y` (addon-vitest, Chromium). Zero violations.

Previous full scan: 6 Oct 2026 (227 stories). Auth views, FormAlert, Navigation empty, and pattern deletions landed after that scan.

## After a new story

Fix axe issues in the work you touch. Do not set the gate back to `'todo'` to land a story.
