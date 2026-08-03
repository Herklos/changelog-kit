# changelog-kit — React Native example

A TypeScript Expo Router app that live-renders every `@changelog-kit/templates`
built-in as a template gallery — a native port of the project's
`Changelog Kit.dc.html` design brief. See `app/index.tsx`.

```bash
pnpm install
pnpm --filter @changelog-kit/example-native start
```

## What's here

- `app/index.tsx` — the gallery: header, a brand-kit switcher (a row of
  swatch chips — see "Brand switching" below), a responsive grid of all 20
  templates each live-rendered via `<Changelog>`, package info cards and a
  CLI usage snippet.
- `app/template/[id].tsx` — tapping a card pushes to a full-screen live
  preview of just that template, with its own brand picker (`@expo/ui`'s
  `Picker`, `appearance="menu"`). This screen has no equivalent in the
  original web design brief — a flat mockup can only show small scaled
  thumbnails, but a native app can afford a proper full-screen live view for
  free, so this is the "native-feeling" gap-fill the brief invited.
- `components/` — `BrandChipRow`, `TemplateCard`, `PackageCard`,
  `CliSnippet`, `SectionLabel`.
- `lib/brand-context.tsx` — shares the selected brand between the gallery and
  the pushed detail screen.
- `lib/brand-fonts.ts` — maps each brand kit's font family name to one
  concrete loaded native font-weight constant per role (see below).

## Brand switching

The design brief's brand chips (color swatch + name, one active at a time)
are plain `Pressable`s, not `@expo/ui`'s `Picker` — the universal `Picker`
only offers `'menu'` (a popup) or `'wheel'` (an iOS rotor) appearances,
neither of which can show a swatch per option or all five brands at once.
`Picker` is used instead on the template detail screen, where a compact
native menu is the better fit for a secondary control.

## Fonts

`whats-new-sheet` is authored for the 750-wide `in-app` preset, so the detail
screen renders it with `baseWidth={750}` for near-native type sizes; every
other layout uses the default `baseWidth={1080}` (a faithful, smaller-looking
thumbnail in the gallery grid). See `@changelog-kit/templates`' `Changelog`
component doc comment for what `baseWidth` does.

Every font any shipped brand preset or this app's own chrome needs (DM Sans,
Fraunces, IBM Plex Sans, IBM Plex Mono, Poppins) is loaded once in
`app/_layout.tsx` via `@expo-google-fonts/*` + `expo-font` — a native app
can't use the `<link>`-based Google Fonts loading the web/export path uses
(see `@changelog-kit/brand`'s `fontHead()`). `lib/brand-fonts.ts` maps each
brand's font family name to one concrete loaded weight per role (display/
body) — React Native has no bold-synthesis for custom fonts, so pinning
`fontFamily` to a single loaded weight-specific file is the native-side
equivalent of the web path's full weight range.

`changelog.json` has no image `src`s (no AI image provider on-device), so
every art slot falls back to the brand's gradient placeholder — that's
expected, not a bug.
