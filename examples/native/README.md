# changelog-kit — React Native example

A minimal Expo app rendering `@changelog-kit/templates` as live UI: a
template switcher across `whats-new-sheet`, `hero-sandwich`, `feature-grid`
and `timeline-rail`, plus `baseWidth`/`scroll` toggles (see `App.js`).

```bash
pnpm install
pnpm --filter @changelog-kit/example-native start
```

`whats-new-sheet` is authored for the 750-wide `in-app` preset, so it's
rendered with `baseWidth={750}` for near-native type sizes; the poster
layouts use the default `baseWidth={1080}` (a faithful, smaller-looking
thumbnail on a phone). See `packages/templates/src/index.js`'s `Changelog`
component doc comment for what `baseWidth`/`scroll` actually do.

Brand fonts (DM Sans) are loaded with `@expo-google-fonts/dm-sans` +
`expo-font` and passed in via the `fontFamilies` prop — a native app can't
use the `<link>`-based Google Fonts loading the web/export path uses (see
`@changelog-kit/brand`'s `fontHead()`).

`changelog.json` has no image `src`s (no AI image provider on-device), so
every art slot falls back to the brand's gradient placeholder — that's
expected, not a bug.

This app was authored but not run in the environment that built it (no
simulator/device available there) — verify on an iOS and Android
simulator before relying on it.
