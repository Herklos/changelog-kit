import { chromium, type Browser } from 'playwright';
import type { Renderer, RenderContext, RendererResult } from '@changelog-kit/core';

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  pdf: 'application/pdf'
};

export interface PlaywrightRendererOptions {
  /** Reuse an existing browser. */
  browser?: Browser;
  /** ms, default 30000. */
  timeout?: number;
  /** default true. */
  waitForFonts?: boolean;
  /** Base for relative image src (file:// dir or http origin). */
  baseUrl?: string;
}

/**
 * Headless-Chromium renderer. One browser instance is shared across renders;
 * call `dispose()` when done (the CLI and the pipeline do it for you).
 */
export class PlaywrightRenderer implements Renderer {
  options: Required<Pick<PlaywrightRendererOptions, 'timeout' | 'waitForFonts'>> & PlaywrightRendererOptions;
  _browser: Browser | null;
  _own: boolean;

  constructor(options: PlaywrightRendererOptions = {}) {
    this.options = { timeout: 30000, waitForFonts: true, ...options };
    this._browser = options.browser ?? null;
    this._own = !options.browser;
  }

  async browser(): Promise<Browser> {
    if (!this._browser) this._browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
    return this._browser;
  }

  async render(html: string, ctx: RenderContext): Promise<RendererResult> {
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

  async dispose(): Promise<void> {
    if (this._browser && this._own) {
      await this._browser.close();
      this._browser = null;
    }
  }
}

export * from './postprocess.js';
export default PlaywrightRenderer;
