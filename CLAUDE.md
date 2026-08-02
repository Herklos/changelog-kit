# CLAUDE.md

Working notes for this repository. Read before changing code.

## What this is

`changelog-kit` — a pnpm monorepo of plain ESM JavaScript packages that turn one
changelog JSON document into branded visuals (png / jpg / webp / pdf / html) and
into live React Native UI, in many templates, resolutions and brand kits. No
TypeScript, no bundler beyond what a consuming RN app already has, no JSX in
this repo's own source. Types are JSDoc only (`packages/core/src/types.js` is
the reference).

## Architecture invariants

Keep the dependency graph one-directional. Adding an import that violates it is
a bug, not a shortcut:

```
core   (no deps)        brand  (no deps)
   ▲        ▲
   └── templates ───────┘   (ctx) => ReactElement — peers: react, react-native, react-native-svg
        ▲          ▲
        │          └── an RN/Expo app imports this directly, renders it live
   render-web
   (react-native-web + react-dom/server → html)
        ▲
        └── renderer-playwright   ai-images     (independent, know nothing about templates)
                ▲        ▲
                └─ cli ──┘
```

- **core** owns the document model, size resolution and the `ChangelogKit`
  pipeline. It performs no I/O and imports no other workspace package. It
  never imports React — `kit.render()` gets a plain
  `serializer(element, ctx) => html` injected, so core stays render-agnostic.
- **brand** owns every design token. It knows nothing about templates.
- **templates** are pure `(ctx) => ReactElement`. No I/O, no async, no state,
  no HTML, no CSS. This is the **only** package with runtime peer
  dependencies (`react`, `react-native`, `react-native-svg`) — an explicit,
  deliberate exception to the zero-dependency rule below, because the whole
  point of the package is to be renderable by React Native.
- **render-web** is the one place that still touches HTML: it turns a
  template's React element into a full HTML document via
  `react-native-web` + `react-dom/server`, so the existing image/PDF export
  pipeline keeps working unchanged. It is optional — an RN app never imports
  it.
- **renderer-playwright** turns that HTML into bytes (png/jpg/webp/pdf). It
  must not know template internals.
- **ai-images** providers all extend `ImageProvider` and return
  `{ provider, revisedPrompt, dataUri | url | path }`.
- **cli** is the only package allowed to wire concrete implementations
  together (it owns the `serializer: toStaticHtml` wiring).

## Template rules (non-negotiable)

1. **Scale unit is a number, not CSS.** `createScale(size.width, baseWidth)`
   returns `{ unit, u }` where `u(n) = n * unit` (`unit = width / 1080` by
   default) — a plain JS number, passed straight into RN style props. Never a
   raw literal length anywhere in a template; always `u(n)`.
2. **Brand tokens only, via `themeFromContext(ctx)` / `brandToTheme()`.**
   Colors, radii, shadows, fonts come from the resolved `theme`, never a
   literal hex or font family string. `theme.shadow.*` and `theme.colors.*`
   are the brand kit's own CSS-shorthand strings passed straight into RN's
   `boxShadow` style prop — do not hand-parse them.
3. **Style props must exist on both React Native and react-native-web** —
   the same tree renders live in an app and through SSR for image export.
   `experimental_backgroundImage` is banned (unsupported by
   react-native-web); every gradient goes through `LinearFill`/`RadialFill`
   (`gradients.js`, SVG-backed on both platforms). `clip-path` has no RN
   style-prop equivalent at all — reach for `react-native-svg`'s `ClipPath`/
   `Polygon` (see `layouts/split-diagonal.js`) only when there is truly no
   flex/View alternative. `filter`, `mixBlendMode` and `WebkitTextStroke` on
   the other hand *are* plain style props react-native-web forwards straight
   through as real CSS (verified) and RN's own docs list `filter`/
   `mixBlendMode` as View style props too (needs the New Architecture) — see
   `layouts/duotone-cover.js`.
4. **No `esc()`, no `inlineMd()`.** Those are HTML-string helpers from
   `@changelog-kit/core` and must never appear in a template — `<Text>`
   renders children literally, so escaping would print visible `&amp;`. Use
   `RichText` (`text.js`), which renders the same `inlineTokens()` markdown
   spec `inlineMd()` serializes to HTML, into nested `<Text>`.
5. **Unitless line-heights become absolute pixels** — RN needs
   `lineHeight: fontSize * 1.32`, not CSS's unitless `1.32`.
6. **No JSX, no build step.** `const h = React.createElement` (see `h.js`) —
   Metro and Node both import the source directly; a consuming app's own
   Babel config is irrelevant. Every RN primitive comes from the package's
   own `@changelog-kit/templates/rn` / `/svg` self-reference (never a bare
   `import ... from 'react-native'`), which resolves to the real native
   modules under Metro (the `"react-native"` package-exports condition) and
   to `react-native-web` / raw DOM SVG tags under plain Node — see
   `rn.native.js` / `rn.web.js` / `svg.native.js` / `svg.web.js` for exactly
   why (`svg.web.js`'s file comment documents why `react-native-svg` itself
   cannot be loaded under bare Node at all).
7. **Fit the canvas.** A layout's root is exactly `size.width × size.height`
   (`Canvas`, or a hand-built root View for the few layouts that paint their
   own full-bleed background) with `overflow:'hidden'`; content that doesn't
   fit is silently clipped in exports. Flex children that can grow need
   `minHeight: 0`, and lists that can grow need a hard entry cap
   (`maxEntries`) or rely on that same clipping. Verify a new template at its
   own aspect *and* at two other presets before shipping it — run it through
   `render-web`'s `toStaticHtml` and check the HTML for `undefined`/`NaN`
   (see `packages/templates/test/templates.test.js`).

CSS Grid has no RN equivalent — every grid in the old HTML templates became
flex rows with `flexGrow`/`flexBasis` ratios standing in for column/row
spans. This is exact for a simple 2-column grid; for genuinely
auto-placed grids (`bento-mosaic`) it is a deliberate visual approximation,
documented in that file — don't try to replicate CSS Grid auto-placement by
hand, model the *intent* instead.

## Adding things

- **Template** → new file in `packages/templates/src/layouts/`, export a
  `{ id, name, description, aspect, maxEntries, render }` object whose
  `render(ctx)` returns a React element (start from `themeFromContext(ctx)`),
  register it in `packages/templates/src/index.js` (both the export list and
  `builtinTemplates`, whose order is the gallery order), add a row to the
  README table.
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
- No new runtime dependencies without a strong reason. `core`/`brand`/
  `ai-images` install with zero third-party code; `templates`' peer
  dependencies (`react`, `react-native`, `react-native-svg`) are the one
  deliberate exception (see Architecture invariants above) — don't add
  anything beyond those three.
- Public API changes need a CHANGELOG.md entry under `## [Unreleased]`.

## Testing

`pnpm test` runs `node --test` across packages, bare Node, no RN toolchain —
`react`, `react-dom`, `react-native-web` are pure-JS devDependencies, not a
Metro/Xcode/Android setup. Template tests render every built-in layout at
several sizes through `@changelog-kit/render-web`'s `toStaticHtml()` and
assert the output contains no unresolved `undefined`, no `NaN`, and a
`<!doctype html>` prologue — the same assertions the old HTML-string tests
made, now exercised through the real SSR path. Actual pixel rendering
(Playwright/Chromium, or an RN simulator) is not run in CI; use `pnpm example`
locally for the image-export path and `examples/native/` on a simulator for
the RN path.

## Previewing

`examples/preview.html` mounts a template's React element straight into the
DOM with `react-dom/client` + `react-native-web` (no SSR, no build step) — the
fastest feedback loop for a template change. `examples/native/` is a minimal
Expo app for checking the same layouts as live RN UI. Keep both working: if
you change a template, refresh `preview.html` to see it, and sanity-check
against `examples/native/` if the change touches something SVG-based or
native-only (fonts, `boxShadow`, `filter`/`mixBlendMode`).
