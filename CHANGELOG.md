# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **React Native support.** `@changelog-kit/templates` is rewritten from the
  ground up: every layout is now a pure `(ctx) => ReactElement` — no HTML, no
  CSS — and the package exports a `<Changelog>` component so an RN/Expo app
  can install it directly and render a changelog as live UI. See the
  README's "React Native" section.
- **`@changelog-kit/render-web`** — the new home for what used to live in
  `templates`' HTML shell: `react-native-web` + `react-dom/server` turn a
  template's React element into a full HTML document, so
  `renderer-playwright` keeps producing png/jpg/webp/pdf unchanged. `cli` and
  `examples/generate.mjs` wire it in as `ChangelogKit`'s `serializer` option.
- `examples/native/` rebuilt as a TypeScript Expo Router app: a full template
  gallery (all 20 built-ins, live-rendered via `<Changelog>`), a brand-kit
  switcher, package info cards and a CLI snippet — a native port of the
  project's original `Changelog Kit.dc.html` design brief. Tapping a template
  pushes a full-screen live preview with its own brand picker
  (`@expo/ui`'s `Picker`) — a native-only affordance the flat web brief had no
  room for. Runs on Expo SDK 57.
- `@changelog-kit/core`: `inlineTokens(str)` — tokenizes the tiny inline
  markdown subset (`**bold**`, `*italic*`, `` `code` ``, line breaks) that
  `inlineMd()` serializes to HTML; `templates`' `RichText` renders the same
  tokens into native `<Text>`. One markdown spec, two backends.
- Ten more layouts: `duotone-cover`, `editorial-split`, `card-deck`,
  `metric-cards`, `timeline-rail`, `split-diagonal`, `device-showcase`,
  `mega-type`, `ticket-stub` and `whats-new-sheet` (twenty built-ins total).
- `octobot-halo` brand preset (octobot.cloud landing-page gradient).
- `@changelog-kit/core`'s `Target.format` gained `'native'` — the live React
  Native rendering path (`<Changelog>`'s internal `template.render()` call),
  alongside the export formats (`png`/`jpg`/`jpeg`/`webp`/`pdf`/`svg`/`html`).

### Changed

- **All packages are now TypeScript**, compiled with project references
  (`tsc -b`) — `pnpm build` (or `pnpm test`, which runs it first) must be run
  before consuming `dist/` output; there is no more zero-build "import `src/`
  directly" mode. `RenderContext`/`Template`/`Renderer`/`Serializer` in
  `@changelog-kit/core` stay generic over `TBrand`/`TElement` (default
  `unknown`) so core still imports neither `@changelog-kit/brand` nor
  `react`; `@changelog-kit/templates` specializes them to its own `BrandKit`/
  `ReactElement` via a new `Ctx`/`TemplateDef` pair (`context.ts`). Every
  package's public JS/runtime behavior is unchanged — this is a tooling and
  type-safety change, not an API change.

- **Breaking: the `Template.render(ctx)` contract.** It now returns a React
  element instead of an HTML string. `ChangelogKit` gained a `serializer`
  option (`(element, ctx) => html`) — required for any `render()`/`generate()`
  call that isn't `format: 'html'` against a plain element; pass
  `@changelog-kit/render-web`'s `toStaticHtml`, as `cli` and the examples now
  do. Custom templates written against the old `htmlDocument()`/`card()`/
  `cardCss`/`u()` HTML-string helpers (all removed) need rewriting — see the
  README's "Templates" section for the new shape.
- **Breaking: `inlineMd()` no longer nests emphasis inside bold.** The old
  regex chain accidentally allowed `**bold *italic* still bold**` to render a
  nested `<em>`; tokenizing (see `inlineTokens()` above) makes bold opaque.
  This was never a documented feature ("a tiny subset of markdown"), and no
  known content relied on it.
- OctoBot brand kits rebuilt on the Drakkar Software charte graphique:
  bleu-sombre `#0f1237`, blanc-perle `#f3f6f8`, bleu-givré `#85d6d7`,
  turquoise `#65e7cf`, bleu-octobot `#5ba0cc`, DM Sans typography.
- `story-stack` and `teaser-poster` (and now `whats-new-sheet`,
  `duotone-cover`, `spotlight`, `card-deck`, `device-showcase`,
  `split-diagonal`) paint their own full-bleed root instead of relying on a
  shared canvas background — see `Canvas` in `packages/templates/src/canvas.js`
  for the layouts that don't need to.

### Known limitations of the React Native port

- `backdrop-filter` (used for a frosted-glass chip/scrim in `spotlight` and
  `split-diagonal`) has no RN or react-native-web equivalent — both layouts
  fall back to a plain translucent fill, no blur.
- `bento-mosaic`'s CSS Grid auto-placement (explicit `grid-column`/
  `grid-row` spans) is approximated with nested flex rows and `flexGrow`
  ratios standing in for spans — visually equivalent for the shipped entry
  counts, not a pixel-identical port.
- `card-deck`'s per-card `translateY(±3%)` nudge is dropped — RN transforms
  need fixed pixel offsets, not percentages of an unmeasured height. The
  rotation-based fan effect is unaffected.
- `feature-grid`/`metric-cards`' 2-column grids use `flexWrap` with a
  percentage `flexBasis`; unlike CSS Grid, flexbox doesn't subtract the row
  gap from the track size, so a full row can overrun its container by one
  gap's width — silently clipped by the canvas's `overflow:hidden`.

## [0.1.0] — 2026-08-01

First public release: the whole pipeline, end to end.

### Added

- **`@changelog-kit/core`** — changelog document model with validation and
  defaults (`normalizeDoc`), inline-markdown helpers, thirteen size presets with
  aspect-aware resolution, and the `ChangelogKit` pipeline that renders every
  `template × target` combination.
- **`@changelog-kit/brand`** — brand kits (`defineBrandKit`, deep merge and
  `extends`) compiled to `--brand-*` CSS custom properties, Google/URL/local
  font loading, and four presets: `octobot-dark`, `octobot-light`, `midnight`,
  `paper`.
- **`@changelog-kit/templates`** — ten resolution-independent layouts:
  `hero-sandwich`, `bento-mosaic`, `gradient-hero`, `spotlight`, `story-stack`,
  `teaser-poster`, `feature-grid`, `banner-split`, `terminal-notes`,
  `release-notes`, plus shared card/badge/version components and
  `defineTemplate()` for custom ones.
- **`@changelog-kit/renderer-playwright`** — headless Chromium rendering to png,
  jpg, webp and pdf with device-pixel-ratio control, webfont and image
  readiness waits, and sharp helpers (`toJpg`, `toWebp`, `resizeVariants`).
- **`@changelog-kit/ai-images`** — provider-agnostic image generation: the
  `ImageProvider` interface with brand-aware prompt composition, adapters for
  OpenAI, Stability, Replicate and Google Imagen, a deterministic offline mock,
  a registry and a content-addressed `CachedProvider`.
- **`@changelog-kit/cli`** — `changelog-kit generate|templates|brands|presets`
  with template/format/size matrices, brand-file loading and a JSON manifest.
- **Examples** — `octobot-3.0.json`, an OctoBot brand kit, `generate.mjs`
  covering the full matrix, and `preview.html` for build-free browser previews.
- **`Changelog Kit.dc.html`** — browser gallery rendering all ten templates from
  the real packages, with a live brand switcher.

[Unreleased]: https://github.com/Drakkar-Software/changelog-kit/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Drakkar-Software/changelog-kit/releases/tag/v0.1.0
