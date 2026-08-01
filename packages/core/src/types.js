/**
 * Shared type definitions (JSDoc so the packages stay dependency-free JS
 * while still giving full IntelliSense / `tsc --checkJs` coverage).
 *
 * @typedef {'new'|'update'|'bugfix'|'improvement'|'removed'|'soon'} EntryKind
 *
 * @typedef {Object} ChangelogImage
 * @property {string} [src]        Absolute path, URL or data: URI.
 * @property {string} [prompt]     AI prompt used when `src` is missing.
 * @property {string} [alt]
 * @property {'cover'|'contain'} [fit]
 * @property {string} [focal]      CSS object-position, e.g. "50% 30%".
 *
 * @typedef {Object} ChangelogEntry
 * @property {string} title
 * @property {string} [body]        Supports a tiny subset of markdown: **bold**, *italic*, `code`.
 * @property {EntryKind} [kind]     Drives the badge label + color. Default 'new'.
 * @property {string} [badge]       Overrides the badge label.
 * @property {ChangelogImage} [image]
 * @property {boolean} [featured]   Hint for templates that have a hero slot.
 * @property {number} [span]        Grid span hint (1 = half width, 2 = full width).
 * @property {boolean} [dark]       Render this card on the inverted surface.
 * @property {boolean} [heroOnly]   Skip in card rows; only used as hero art.
 *
 * @typedef {Object} ChangelogDoc
 * @property {string} product       e.g. "SuperAge"
 * @property {string} version       e.g. "4.7"
 * @property {string} [tagline]     e.g. "Out now on the App Store"
 * @property {string} [date]        ISO date.
 * @property {'released'|'upcoming'} [status]
 * @property {ChangelogImage} [hero]
 * @property {ChangelogEntry[]} entries
 * @property {string} [footer]
 * @property {Record<string, unknown>} [meta]
 *
 * @typedef {Object} RenderSize
 * @property {number} width         CSS pixels of the design canvas.
 * @property {number} height        CSS pixels of the design canvas.
 * @property {number} [scale]       Device pixel ratio multiplier. Default 1.
 *
 * @typedef {Object} Target
 * @property {'png'|'jpg'|'jpeg'|'webp'|'pdf'|'svg'|'html'} format
 * @property {string} [preset]      Name from SIZE_PRESETS.
 * @property {number} [width]
 * @property {number} [height]
 * @property {number} [scale]
 * @property {number} [quality]     jpg / webp only, 1-100.
 * @property {string} [name]        Output basename override.
 *
 * @typedef {Object} RenderContext
 * @property {ChangelogDoc} doc
 * @property {import('@changelog-kit/brand').BrandKit} brand
 * @property {RenderSize} size
 * @property {Target} target
 * @property {Template} [template]
 * @property {Record<string,string>} [assets]  Resolved image src by key.
 *
 * @typedef {Object} Template
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {[number, number]} [aspect]     Preferred aspect ratio.
 * @property {number} [maxEntries]
 * @property {(ctx: RenderContext) => string} render  Returns a full HTML document.
 *
 * @typedef {Object} RendererResult
 * @property {Buffer|Uint8Array|string} data
 * @property {string} contentType
 *
 * @typedef {Object} Renderer
 * @property {(html: string, ctx: RenderContext) => Promise<RendererResult>} render
 * @property {() => Promise<void>} [dispose]
 */
export {};
