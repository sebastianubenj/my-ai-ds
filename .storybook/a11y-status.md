# Accessibility gate

`parameters.a11y.test` in `preview.tsx` stays `'todo'` until the catalog is clean. Switch it to `'error'` only after the blockers below are gone so CI does not fail on known contrast issues.

## Inventory

Scanned 227 CSF stories with axe-core (WCAG 2.0 A/AA) against `http://localhost:6006` on 6 Oct 2026. Viewport 1280×800. Docs MDX pages were not scanned.

| Status | Count |
| --- | --- |
| Clean | 225 |
| Violations | 2 stories |
| Scan errors (retried clean) | 4 transient “Axe is already running” on first pass |

### Blockers (`color-contrast`, serious)

| Story | Nodes | Target |
| --- | --- | --- |
| `patterns-login--default` | 2 | Inline `Link` underlines on the login form |
| `patterns-register--default` | 1 | Inline `Link` underline on the register form |

axe reports the inherited / underlined link color on those patterns against the page background. Foundations and UI component stories did not fail this rule in the same scan.

## Before `test: 'error'`

1. Fix Link contrast on Login and Register (token, underline treatment, or composition).
2. Re-run the same axe pass on all CSF stories; expect zero violations.
3. Switch `parameters.a11y.test` to `'error'` in `.storybook/preview.tsx`.
4. Keep `npm run check` as the only CI gate; addon-a11y then fails Storybook tests on new violations.
