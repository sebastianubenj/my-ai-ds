# Accessibility gate

`parameters.a11y.test` in `preview.tsx` stays `'todo'` until a full CSF scan is clean. Switch it to `'error'` only then, so CI does not fail on leftover violations.

## Inventory

Last full CSF scan: 6 Oct 2026 (227 stories, WCAG 2.0 A/AA, 1280×800). Docs MDX were not scanned.

Re-checked 6 Oct 2026 after `foreground/highlight` → `cyan/700` (`#008576`):

| Story | Result |
| --- | --- |
| `patterns-login--default` | Clean (previously `color-contrast` on 2 links) |
| `patterns-register--default` | Clean (previously `color-contrast` on 1 link) |

Those two were the only catalog blockers in the full scan.

## Before `test: 'error'`

1. Re-run axe on all CSF stories (not only Login/Register).
2. If zero violations, switch `parameters.a11y.test` to `'error'` in `.storybook/preview.tsx`.
3. Keep `npm run check` as the only CI gate; addon-a11y then fails Storybook tests on new violations.
