# changelog-kit

Generate branded product-changelog visuals — the "what's new in 3.0" cards, hero
posters, stories and PDF release notes — from **one JSON document**, in **multiple
templates**, **multiple resolutions** and **multiple output targets**.

```
doc.json ──▶ brand kit ──▶ template (html) ──▶ renderer ──▶ png · jpg · webp · pdf · html
                 ▲                 │
            fonts / colors    AI image provider (optional)
```

Everything is plain ESM JavaScript with JSDoc types — no build step, no framework.

---

## Examples

Every image below comes from the **same** `examples/octobot-3.0.json` — only the
template, the brand kit and the target size change. (Artwork is the built-in
placeholder; with a provider configured those slots hold generated images.)

<table>
<tr>
<td width="50%"><img src="docs/media/ob-hero-sandwich.png" alt="hero-sandwich"><br>
<code>hero-sandwich</code> · <code>octobot-dark</code> · 1080×1350</td>
<td width="50%"><img src="docs/media/ob-bento.png" alt="bento-mosaic"><br>
<code>bento-mosaic</code> · <code>octobot-dark</code> · 1080×1350</td>
</tr>
<tr>
<td><img src="docs/media/ob-duotone-cover.png" alt="duotone-cover"><br>
<code>duotone-cover</code> · <code>octobot-halo</code> · 1080×1350</td>
<td><img src="docs/media/ob-editorial.png" alt="editorial-split"><br>
<code>editorial-split</code> · <code>octobot-light</code> · 1080×1350</td>
</tr>
<tr>
<td><img src="docs/media/ob-deck.png" alt="card-deck"><br>
<code>card-deck</code> · <code>octobot-dark</code> · 1080×1350</td>
<td><img src="docs/media/ob-rail.png" alt="timeline-rail"><br>
<code>timeline-rail</code> · <code>octobot-light</code> · 1080×1350</td>
</tr>
<tr>
<td><img src="docs/media/ob-metrics.png" alt="metric-cards"><br>
<code>metric-cards</code> · <code>octobot-light</code> · 1080×1080</td>
<td><img src="docs/media/ob-terminal.png" alt="terminal-notes"><br>
<code>terminal-notes</code> · <code>octobot-dark</code> · 1080×1350</td>
</tr>
<tr>
<td><img src="docs/media/ob-split-diagonal.png" alt="split-diagonal"><br>
<code>split-diagonal</code> · <code>octobot-dark</code> · 1080×1350</td>
<td><img src="docs/media/ob-mega.png" alt="mega-type"><br>
<code>mega-type</code> · <code>octobot-light</code> · 1080×1350</td>
</tr>
<tr>
<td><img src="docs/media/ob-device-showcase.png" alt="device-showcase"><br>
<code>device-showcase</code> · <code>octobot-dark</code> · 1080×1350</td>
<td><img src="docs/media/ob-ticket-stub.png" alt="ticket-stub"><br>
<code>ticket-stub</code> · <code>octobot-light</code> · 1080×1080</td>
</tr>
<tr>
<td><img src="docs/media/ob-whats-new.png" alt="whats-new-sheet"><br>
<code>whats-new-sheet</code> · <code>octobot-light</code> · 750×1200 (in-app)</td>
<td><img src="docs/media/ob-story9x16.png" alt="story-stack"><br>
<code>story-stack</code> · <code>octobot-dark</code> · 1080×1920</td>
</tr>
<tr>
<td><img src="docs/media/ob-release-notes.png" alt="release-notes"><br>
<code>release-notes</code> · <code>paper</code> · A4 pdf</td>
<td></td>
</tr>
</table>

<img src="docs/media/ob-banner.png" alt="banner-split">

<code>banner-split</code> · <code>octobot-light</code> · 1600×900 — the same document as an OG image.

Reproduce them all:

```bash
pnpm example        # renders the full matrix with the offline mock provider
```

## Contents

- [Examples](#examples)
- [Packages](#packages)
- [Install](#install)
- [Quick start](#quick-start)
- [CLI](#cli)
- [The changelog document](#the-changelog-document)
- [Templates](#templates)
- [Brand kits](#brand-kits)
- [AI images](#ai-images)
- [Output targets & sizes](#output-targets--sizes)
- [Previewing without Chromium](#previewing-without-chromium)
- [Repository layout](#repository-layout)
- [Development](#development)

---

## Packages

| Package | Responsibility | Runtime deps |
| --- | --- | --- |
| `@changelog-kit/core` | Document model + validation, size presets, the `ChangelogKit` pipeline | none |
| `@changelog-kit/brand` | Brand kits → CSS custom properties, font loading | none |
| `@changelog-kit/templates` | Twenty layouts, each a pure `(ctx) => htmlString` | core, brand |
| `@changelog-kit/renderer-playwright` | Headless Chromium → png/jpg/webp/pdf, sharp post-processing | playwright, sharp |
| `@changelog-kit/ai-images` | One `ImageProvider` interface + OpenAI / Stability / Replicate / Gemini / mock | none (fetch) |
| `@changelog-kit/cli` | `changelog-kit generate …` | all of the above |

The dependency graph is strictly one-directional: `core` and `brand` depend on
nothing, `templates` depends on both, the renderer and providers depend on
neither, and only the CLI wires everything together. You can use any package on
its own — e.g. `templates` in a browser to preview, without the renderer.

## Install

```bash
pnpm install
pnpm --filter @changelog-kit/renderer-playwright exec playwright install chromium
```

Node ≥ 20 (uses `node:util` `parseArgs`, `structuredClone`, native `fetch`).

## Quick start

```js
import { ChangelogKit } from '@changelog-kit/core';
import { builtinTemplates } from '@changelog-kit/templates';
import { PlaywrightRenderer } from '@changelog-kit/renderer-playwright';
import { OpenAIImageProvider, CachedProvider } from '@changelog-kit/ai-images';
import { writeFile } from 'node:fs/promises';
import brand from './octobot.brand.js';

const kit = new ChangelogKit({
  brand,
  templates: builtinTemplates,
  renderer: new PlaywrightRenderer(),
  imageProvider: new CachedProvider(new OpenAIImageProvider())   // optional
});

await kit.generate({
  doc,                                    // see "The changelog document"
  template: ['hero-sandwich', 'story-stack', 'release-notes'],
  targets: [
    { format: 'png',  preset: 'instagram-portrait' },   // 1080×1350 @2x
    { format: 'png',  preset: 'instagram-story' },      // 1080×1920 @2x
    { format: 'jpg',  preset: 'og-image', quality: 92 },
    { format: 'webp', width: 1200, height: 1500 },
    { format: 'pdf',  preset: 'a4' }
  ],
  write: (file) => writeFile(`out/${file.filename}`, file.data)
});

await kit.dispose();
```

Every `(template × target)` pair is rendered; `file.filename` is
`octobot-3-0-hero-sandwich-1080x1350-@2x.png`.

Without a `write` sink, `generate()` resolves to an array of
`{ data, contentType, size, filename, html }`.

## CLI

```bash
changelog-kit templates      # list layouts
changelog-kit brands         # list brand presets
changelog-kit presets        # list size presets

changelog-kit generate examples/octobot-3.0.json \
  -b ./examples/octobot.brand.js \
  -t hero-sandwich,bento-mosaic,terminal-notes \
  -f png,jpg,pdf \
  -s instagram-portrait,og-image,1440x1800 \
  --provider openai --cache .cache/images \
  -o out --json
```

| Flag | Meaning |
| --- | --- |
| `-t, --template` | Comma-separated template ids |
| `-b, --brand` | Preset id (`octobot-dark`…) or path to a `.js`/`.json` brand kit |
| `-f, --format` | `png,jpg,webp,pdf,html` |
| `-s, --size` | Size preset names and/or `WxH` |
| `--scale` | Device-pixel-ratio override |
| `--provider` / `--model` | AI image backend |
| `--cache <dir>` | Reuse generated art across runs (default `.cache/changelog-images`) |
| `--no-images` | Skip generation; leave image slots as gradients |
| `-o, --out` | Output directory (default `./out`) |
| `--json` | Print a machine-readable manifest |

## The changelog document

```jsonc
{
  "product": "OctoBot",
  "version": "3.0",
  "date": "2026-08-01",
  "status": "released",                 // or "upcoming" → teaser wording
  "tagline": "Out now — update from your dashboard",
  "hero":    { "prompt": "…" },          // src OR prompt (prompt ⇒ AI-generated)
  "entries": [
    { "kind": "new", "title": "Strategy Designer",
      "body": "Build and wire strategies visually",
      "image": { "src": "./art/designer.png" } },
    { "kind": "bugfix", "title": "Stability",
      "body": "Over **40 fixes** across connectors and order sync" }
  ],
  "footer": "OctoBot — open-source crypto trading bot."
}
```

- `kind`: `new · update · bugfix · improvement · removed · soon` — picks the badge
  label and color from the brand kit. Override the label with `badge`.
- `body` supports a tiny inline markdown subset: `**bold**`, `*italic*`,
  `` `code` ``, newlines.
- `image`: `{ src }` (path, URL or data URI) **or** `{ prompt }` (generated),
  plus optional `fit` (`cover`/`contain`) and `focal` (CSS `object-position`).
- Per-entry layout hints: `span` (2 = full-width in grids), `dark` (invert the
  card), `featured`.

`normalizeDoc()` validates and fills defaults; the pipeline calls it for you.

## Templates

Twenty built-in layouts:

| id | aspect | for |
| --- | --- | --- |
| `hero-sandwich` | 4:5 | 2 cards / artwork hero / 2 cards — the classic release post |
| `bento-mosaic` | 4:5 | Asymmetric bento: tall lead feature, version tile, supporting tiles |
| `duotone-cover` | 4:5 | Full-bleed duotone artwork behind an outlined version numeral |
| `editorial-split` | 4:5 | Magazine spread: kicker rule, oversized version, numbered list beside a tall art column |
| `card-deck` | 4:5 | Fanned stack of feature cards over an oversized version numeral |
| `metric-cards` | 1:1 | Release by the numbers — oversized figures pulled from each entry |
| `timeline-rail` | 4:5 | Connector rail with a node per change |
| `split-diagonal` | 4:5 | One diagonal cut: artwork on one side, version and features on the other |
| `device-showcase` | 4:5 | Artwork inside a phone bezel with feature captions flanking it |
| `mega-type` | 4:5 | Swiss typographic poster — huge version, tight index, no artwork |
| `ticket-stub` | 1:1 | The release as a printed ticket, perforation and serial included |
| `whats-new-sheet` | 5:8 | In-app "What's new" modal with icon rows and a call to action |
| `gradient-hero` | 4:5 | Same rhythm, hero is a brand gradient with a huge version number (no artwork needed) |
| `spotlight` | 1:1 | One feature, full-bleed artwork with a caption plate |
| `story-stack` | 9:16 | Stories and in-app modals — progress pips + numbered feature stack |
| `teaser-poster` | 4:5 | "Coming soon 3.1" single-message poster |
| `feature-grid` | any | Header + 2–8 feature cards; the safe choice at odd sizes |
| `banner-split` | 16:9 | OG images, email heroes, X posts |
| `terminal-notes` | 4:5 | Monospace window chrome with sigil-prefixed lines, for dev audiences |
| `release-notes` | A4 | Typographic PDF release notes, grouped by kind |

A template is just a function:

```js
import { defineTemplate, htmlDocument, card, cardCss, u } from '@changelog-kit/templates';

export const myTemplate = defineTemplate({
  id: 'my-template',
  name: 'My template',
  aspect: [1, 1],
  maxEntries: 3,
  render: (ctx) => htmlDocument(ctx, {
    css: `${cardCss}\n.mine{display:grid;gap:${u(20)}}`,
    body: `<div class="sheet mine">${ctx.doc.entries.map((e) => card(e)).join('')}</div>`
  })
});

kit.register(myTemplate);
```

**Two rules keep templates resolution- and brand-independent:**

1. Every length is `calc(N * var(--u))` — write `u(24)`, never `24px`. `--u` is
   `canvasWidth / 1080`, so the same markup is pixel-correct at 1080px and 4096px.
2. Every color, radius, shadow and font comes from a `--brand-*` custom property.
   No hardcoded hex in a template.

## Brand kits

```js
import { defineBrandKit, octobotDark } from '@changelog-kit/brand';

export default defineBrandKit({
  extends: octobotDark,
  id: 'octobot',
  name: 'OctoBot',
  colors: { primary: '#85d6d7', secondary: '#65e7cf', accent: '#5ba0cc',
            heroFrom: '#26448e', heroTo: '#0f1237' },
  fonts:  { display: { family: 'DM Sans', source: 'google', weights: [700, 900] },
            body:    { family: 'DM Sans', source: 'google', weights: [400, 500, 700] } },
  radius: { card: 24, hero: 30 },
  imagery:{ style: '3D render, stylised octopus mascot with the OctoBot helmet, trading charts',
            background: 'bleu-sombre gradient with a turquoise halo glow',
            negative: 'text, watermark' }
});
```

Fonts can be `google`, `url` (woff2), `local` (file path, `{weight}` placeholder
supported) or `system`; the renderer waits for `document.fonts.ready` before it
shoots. Presets: **`octobot-dark`**, `octobot-light`, `octobot-halo`, `midnight`, `paper` —
the three OctoBot kits follow the Drakkar Software charte graphique (bleu-sombre
`#0f1237`, blanc-perle `#f3f6f8`, bleu-givré `#85d6d7`, turquoise `#65e7cf`, DM Sans).

`brandToCssVars(brand)` / `cssVarBlock(brand)` expose the compiled variables if
you want to reuse the kit in your own web changelog page.

## AI images

Any entry (or the hero) with a `prompt` and no `src` is generated before
rendering. The prompt actually sent is composed from the entry text **plus** the
brand's `imagery` guidance and palette, so art stays consistent release over
release.

| Provider | id | env |
| --- | --- | --- |
| OpenAI (`gpt-image-1`, `dall-e-3`) | `openai` | `OPENAI_API_KEY` |
| Stability (`core`, `ultra`, `sd3`) | `stability` | `STABILITY_API_KEY` |
| Replicate (any image model) | `replicate` | `REPLICATE_API_TOKEN` |
| Google (`imagen-3`) | `gemini` | `GOOGLE_API_KEY` |
| Offline deterministic mock | `mock` | — |

```js
class MyProvider extends ImageProvider {
  static providerId = 'my-provider';
  static defaultModel = 'v1';
  async generate(request) {
    const req = this.prepare(request);       // prompt building, sizing, defaults
    return { provider: this.id, revisedPrompt: req.prompt, dataUri };
  }
}
registerProvider('my-provider', (config) => new MyProvider(config));
```

Wrap any provider in `CachedProvider` to make runs reproducible and free after
the first one; use `MockImageProvider` in CI.

## Output targets & sizes

Formats: `png` · `jpg` · `webp` · `pdf` · `html` (raw markup, for embedding in a
web changelog).

Size comes from a preset or explicit `width`/`height`, times a `scale` DPR:

`instagram-portrait` `instagram-square` `instagram-story` `x-landscape`
`linkedin` `og-image` `appstore-ipad` `appstore-iphone` `a4` `a4-landscape`
`letter` `email-hero` `in-app`

Give only a width and the height follows the template's aspect ratio.
`resizeVariants(buffer, [1200, 800, 400])` derives smaller widths from one master
render instead of re-rendering.

## Previewing without Chromium

Both of these import the real template packages through an import map, so what
you see is what the renderer will shoot:

- `Changelog Kit.dc.html` — gallery of all twenty templates with a brand switcher.
- `examples/preview.html#t=bento-mosaic&b=octobot-dark&w=1080` — one template, full size.

## Repository layout

```
packages/
  core/                 doc model, presets, pipeline          (no deps)
  brand/                brand kits, css vars, fonts           (no deps)
  templates/            base shell, components, 20 layouts
  renderer-playwright/  chromium + sharp
  ai-images/            provider interface, 5 adapters, cache
  cli/                  bin/changelog-kit.js + src/run.js
examples/               octobot-3.0.json, brand kit, generate.mjs, preview.html
docs/media/             README example renders
Changelog Kit.dc.html   browser gallery of every template
```

## Development

```bash
pnpm test          # node:test across packages
pnpm lint
pnpm example       # renders examples/ with the offline mock provider
```

See [CLAUDE.md](./CLAUDE.md) for architecture invariants and conventions when
adding templates, providers or brand kits, and [CHANGELOG.md](./CHANGELOG.md)
for release history.

MIT © Drakkar Software
