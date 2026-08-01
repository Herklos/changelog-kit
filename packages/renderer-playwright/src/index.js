import { chromium } from 'playwright';

const CONTENT_TYPES = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  pdf: 'application/pdf'
};

/**
 * Headless-Chromium renderer. One browser instance is shared across renders;
 * call `dispose()` when done (the CLI and the pipeline do it for you).
 */
export class PlaywrightRenderer {
  /**
   * @param {Object} [options]
   * @param {import('playwright').Browser} [options.browser] Reuse an existing browser.
   * @param {number} [options.timeout] ms, default 30000.
   * @param {boolean} [options.waitForFonts] default true.
   * @param {string} [options.baseUrl] Base for relative image src (file:// dir or http origin).
   */
  constructor(options = {}) {
    this.options = { timeout: 30000, waitForFonts: true, ...options };
    this._browser = options.browser ?? null;
    this._own = !options.browser;
  }

  async browser() {
    if (!this._browser) this._browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
    return this._browser;
  }

  /**
   * @param {string} html
   * @param {import('@changelog-kit/core').RenderContext} ctx
   */
  async render(html, ctx) {
    const { size, target } = ctx;
    const format = target.format === 'jpeg' ? 'jpg' : target.format;
    const browser = await this.browser();
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: format === 'pdf' ? 1 : (size.scale ?? 1),
      baseURL: this.options.baseUrl
    });
    const page = await context.newPage();
    try {
      await page.setContent(html, { waitUntil: 'load', timeout: this.options.timeout });
      if (this.options.waitForFonts) {
        await page.evaluate(() => document.fonts.ready);
      }
      await page.evaluate(async () => {
        const images = [...document.querySelectorAll('img')].map((img) =>
          img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })
        );
        await Promise.all(images.filter(Boolean));
        // Background images: force a paint tick.
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      });

      if (format === 'pdf') {
        const data = await page.pdf({
          width: `${size.width}px`,
          height: `${size.height}px`,
          printBackground: true,
          preferCSSPageSize: false,
          margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });
        return { data, contentType: CONTENT_TYPES.pdf };
      }

      const data = await page.screenshot({
        type: format === 'jpg' ? 'jpeg' : format === 'webp' ? 'png' : 'png',
        quality: format === 'jpg' ? (target.quality ?? 92) : undefined,
        fullPage: false,
        omitBackground: false
      });

      if (format === 'webp') {
        const { toWebp } = await import('./postprocess.js');
        return { data: await toWebp(data, target.quality ?? 88), contentType: CONTENT_TYPES.webp };
      }
      return { data, contentType: CONTENT_TYPES[format] };
    } finally {
      await page.close();
      await context.close();
    }
  }

  async dispose() {
    if (this._browser && this._own) {
      await this._browser.close();
      this._browser = null;
    }
  }
}

export * from './postprocess.js';
export default PlaywrightRenderer;
