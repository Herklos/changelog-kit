export interface PackageInfo {
  name: string;
  what: string;
}

// The original design brief listed 6 packages — @changelog-kit/render-web
// split out of `templates` after that brief was written (part of the
// React Native rewrite), so the gallery reflects the current 7.
export const PACKAGES: PackageInfo[] = [
  { name: '@changelog-kit/core', what: 'Document model, validation, size presets and the generation pipeline. Zero I/O, zero deps.' },
  { name: '@changelog-kit/brand', what: 'Brand kits — palette, type, radii, shadows, imagery guidance — compiled to CSS variables and font loading.' },
  { name: '@changelog-kit/templates', what: 'Twenty layouts, each a pure (ctx) => ReactElement function using only brand tokens and the u() scale unit.' },
  { name: '@changelog-kit/render-web', what: 'react-native-web + react-dom/server turn a template element into a full HTML document for the export pipeline.' },
  { name: '@changelog-kit/renderer-playwright', what: 'Headless Chromium → png / jpg / webp / pdf, plus sharp resizing into srcset-style variants.' },
  { name: '@changelog-kit/ai-images', what: 'One ImageProvider interface; OpenAI, Stability, Replicate, Gemini adapters, offline mock and a disk cache.' },
  { name: '@changelog-kit/cli', what: 'changelog-kit generate — templates × sizes × formats in a single command.' }
];

export const CLI_SNIPPET = `changelog-kit generate superage-4.7.json \\
  -b ./superage.brand.js \\
  -t hero-sandwich,feature-grid,release-notes \\
  -f png,jpg,pdf \\
  -s instagram-portrait,og-image,a4 \\
  --provider openai --cache .cache/images -o out`;
