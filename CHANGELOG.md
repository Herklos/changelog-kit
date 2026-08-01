# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Ten more layouts: `duotone-cover`, `editorial-split`, `card-deck`,
  `metric-cards`, `timeline-rail`, `split-diagonal`, `device-showcase`,
  `mega-type`, `ticket-stub` and `whats-new-sheet` (twenty built-ins total).
- `octobot-halo` brand preset (octobot.cloud landing-page gradient).

### Changed

- OctoBot brand kits rebuilt on the Drakkar Software charte graphique:
  bleu-sombre `#0f1237`, blanc-perle `#f3f6f8`, bleu-givré `#85d6d7`,
  turquoise `#65e7cf`, bleu-octobot `#5ba0cc`, DM Sans typography.
- `badgeCss` extracted from `cardCss` so badge-only layouts style correctly;
  `story-stack` and `teaser-poster` paint their own sheet instead of `body`.

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
