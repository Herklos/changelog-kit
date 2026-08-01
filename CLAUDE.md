# CLAUDE.md

Working notes for this repository. Read before changing code.

## What this is

`changelog-kit` — a pnpm monorepo of plain ESM JavaScript packages that turn one
changelog JSON document into branded visuals (png / jpg / webp / pdf / html) in
many templates and resolutions. No TypeScript, no bundler, no framework. Types
are JSDoc only (`packages/core/src/types.js` is the reference).

## Architecture invariants

Keep the dependency graph one-directional. Adding an import that violates it is
a bug, not a shortcut:

```
core   (no deps)        brand  (no deps)
   ▲        ▲
   └── templates ───────┘
renderer-playwright   ai-images     (independent, know nothing about templates)
   ▲        ▲             ▲
   └──────  cli  ─────────┘
```

- **core** owns the document model, size resolution and the `ChangelogKit`
  pipeline. It performs no I/O and imports no other workspace package.
- **brand** owns every design token. It knows nothing about templates.
- **templates** are pure `(ctx) => htmlString`. No I/O, no async, no state.
- **renderer** turns HTML into bytes. It must not know template internals.
- **ai-images** providers all extend `ImageProvider` and return
  `{ provider, revisedPrompt, dataUri | url | path }`.
- **cli** is the only package allowed to wire concrete implementations together.

## Template rules (non-negotiable)

1. **Scale unit.** Every length is `calc(N * var(--u))` — use the `u(n)` helper.
   `--u = canvasWidth / 1080`. A raw `px` value anywhere in a template breaks
   multi-resolution output.
2. **Brand tokens only.** Colors, radii, shadows, fonts come from `--brand-*`.
   Never hardcode a hex value in a template.
3. **Fit the canvas.** `body` is exactly `--w × --h` with `overflow:hidden`;
   content that does not fit is silently clipped in exports. Flex children that
   can grow need `min-height:0`, and lists that can grow need a hard entry cap
   (`maxEntries`) or `overflow:hidden` on their container. Verify a new template
   at its own aspect *and* at two other presets before shipping it.
4. **Escape user content.** Text goes through `esc()` or `inlineMd()` from core.
   Image sources go through `imageBackground()` (it quotes with `'` because the
   result is injected into a double-quoted `style` attribute).
5. Register new layouts in `packages/templates/src/index.js` (both the export
   list and `builtinTemplates`, whose order is the gallery order).

## Adding things

- **Template** → new file in `packages/templates/src/layouts/`, export a
  `{ id, name, description, aspect, maxEntries, render }` object, register it,
  add a row to the README table.
- **Brand preset** → `packages/brand/src/presets.js`, built with
  `defineBrandKit({ extends: … })`, added to `brandPresets`. Every kit must
  define the full `colors.badge` / `colors.badgeInk` maps for all six kinds.
- **Image provider** → `packages/ai-images/src/providers/<id>.js` extending
  `ImageProvider` (set `static providerId` / `static defaultModel`, implement
  `generate()` and `check()`), then `registerProvider()` in the package index.
- **Size preset** → `packages/core/src/presets.js`.

## Conventions

- ESM everywhere, `node:` prefix for builtins, `.js` extensions in relative imports.
- Two-space indent, single quotes, semicolons, ~110 col soft wrap.
- JSDoc on every exported function/class; comments explain *why*, not *what*.
- No new runtime dependencies without a strong reason — the whole point is that
  core/brand/templates/ai-images install with zero third-party code.
- Public API changes need a CHANGELOG.md entry under `## [Unreleased]`.

## Testing

`pnpm test` runs `node --test` across packages. Template tests render every
built-in layout at several sizes and assert the output contains no unresolved
`undefined`, no `NaN`, and a `<!doctype html>` prologue. Renderer tests are not
run in CI (they need a Chromium download); use `pnpm example` locally, which
renders the full matrix with the offline `MockImageProvider`.

## Previewing

`Changelog Kit.dc.html` (gallery) and `examples/preview.html` load the actual
packages in the browser through an import map — no build. If you change a
template, refresh one of those pages to see it. Keep both working: they are the
fastest feedback loop in the repo.
