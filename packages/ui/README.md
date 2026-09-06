# @claragram/ui

The shared design system for React UI @ Claragram. Components, hooks, utils, fonts, overlays, and design tokens.

## Setup

```bash
npm i @claragram/ui
# or
pnpm i @claragram/ui
```

Import global styles and fonts in your app's root CSS:

```css
@import 'tailwindcss';
@import '@claragram/ui/styles/fonts.css';
@import '@claragram/ui/styles/globals.css';
```

## Usage

```tsx
import {
  Button,
  Grid,
  Card,
  Dialog
} from '@claragram/ui'
```

## local development

two ways to preview components while editing:

### storybook (per-component, primary)

```
pnpm storybook        # dev server on http://localhost:6006
pnpm build-storybook  # static build → ./storybook-static
```

stories live in `stories/*.stories.tsx`. the **Overview** story re-renders
the entire `/ds` page, so you always have a kitchen-sink view alongside the
isolated component stories. the **Lens** toolbar above the preview cycles
between the lens presets (`0`, `1`, `2`, `3`, `4`, `5`, `5i`, `6`).

### next.js showcase (kitchen-sink, secondary)

```
pnpm dev              # next dev on http://localhost:3000 → redirects to /ds
```

`app/ds/page.tsx` is the same content the Overview story renders.

## publishing

```
pnpm build     # tsc → dist/ + copies css / fonts / assets
```

releases are published automatically when PRs merge to `main`. the github
workflow bumps the package version from the merged PR labels (`major`, `minor`,
or `patch`), pushes the tag, publishes to npm via trusted publishing, and
creates a [GitHub Release](https://github.com/NousResearch/design-language/releases)
with notes from `CHANGELOG.md`.

before merging:

1. leave `package.json` at the **current published** version on `main` (CI bumps
   it after merge).
2. label the PR so the bump matches your changelog section:

| PR label | bump from `0.15.0` | changelog heading |
| --- | --- | --- |
| `patch` (default) | `0.15.1` | `## 0.15.1` |
| `minor` | `0.16.0` | `## 0.16.0` |
| `major` | `1.0.0` | `## 1.0.0` |

3. add that `## X.Y.Z` section to [`CHANGELOG.md`](./CHANGELOG.md) — release
   notes are pulled from it for npm and GitHub Releases.

the same file is rendered in Storybook under **Docs → Changelog** and shipped in
the npm tarball.

the published tarball ships `dist/`, `src/`, `README.md`, and `CHANGELOG.md`
(see `files` in `package.json`). inline source maps are embedded in `dist/` so
consumers can debug into the TypeScript source.

## deployment

`vercel.json` builds both and serves them on a single Next.js deployment:

- `/` and `/ds` — the Next.js showcase (same as `pnpm dev`)
- `/storybook` — the static Storybook build (copied to `public/storybook/`
  before `next build` so Next serves it like any other static asset)

Want Storybook-only? replace `buildCommand` with `pnpm build-storybook` and
add `"outputDirectory": "storybook-static"`. `app/ds` can stay for local
`pnpm dev` either way — the Overview story renders the same content.
