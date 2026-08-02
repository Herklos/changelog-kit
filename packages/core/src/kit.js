import { normalizeDoc, pendingImages } from './doc.js';
import { resolveSize } from './presets.js';

/**
 * Orchestrates: doc -> (AI images) -> template HTML -> renderer -> files.
 * Everything pluggable is injected, so the pipeline itself has no I/O deps.
 */
export class ChangelogKit {
  /**
   * @param {Object} options
   * @param {import('@changelog-kit/brand').BrandKit} options.brand
   * @param {Record<string, import('./types.js').Template>|import('./types.js').Template[]} options.templates
   * @param {import('./types.js').Renderer} options.renderer
   * @param {import('./types.js').Renderer} [options.pdfRenderer] Optional separate renderer for pdf.
   * @param {import('./types.js').Serializer} options.serializer Turns a template's React element into HTML.
   * @param {{ generate(req): Promise<{url?:string,dataUri?:string,path?:string}> }} [options.imageProvider]
   * @param {(event: string, payload: object) => void} [options.onEvent]
   */
  constructor({ brand, templates, renderer, pdfRenderer, serializer, imageProvider, onEvent } = {}) {
    if (!brand) throw new Error('ChangelogKit: a brand kit is required');
    if (!renderer) throw new Error('ChangelogKit: a renderer is required');
    if (!serializer) throw new Error('ChangelogKit: a serializer is required to turn a template\'s React element into HTML');
    this.brand = brand;
    this.renderer = renderer;
    this.pdfRenderer = pdfRenderer ?? renderer;
    this.serializer = serializer;
    this.imageProvider = imageProvider;
    this.onEvent = onEvent ?? (() => {});
    this.templates = Array.isArray(templates)
      ? Object.fromEntries(templates.map((t) => [t.id, t]))
      : { ...(templates ?? {}) };
  }

  register(template) {
    this.templates[template.id] = template;
    return this;
  }

  list() {
    return Object.values(this.templates);
  }

  getTemplate(id) {
    const template = this.templates[id];
    if (!template) {
      throw new Error(`Unknown template "${id}". Available: ${Object.keys(this.templates).join(', ')}`);
    }
    return template;
  }

  /**
   * Fill in missing images through the configured AI provider.
   * Mutates a copy of the doc; returns it.
   */
  async materializeImages(doc, { brand = this.brand, force = false, signal } = {}) {
    const next = structuredClone(doc);
    const jobs = force
      ? [
          ...(next.hero ? [{ key: 'hero', image: next.hero }] : []),
          ...next.entries.map((entry, i) => ({ key: `entry.${i}`, image: entry.image, entry })).filter((j) => j.image)
        ]
      : pendingImages(next);

    if (!jobs.length) return next;
    if (!this.imageProvider) {
      throw new Error(
        `${jobs.length} image(s) need generation but no imageProvider was configured on ChangelogKit.`
      );
    }

    for (const job of jobs) {
      this.onEvent('image:start', job);
      const result = await this.imageProvider.generate({
        prompt: job.image.prompt,
        brand,
        doc: next,
        entry: job.entry,
        role: job.key === 'hero' ? 'hero' : 'card',
        signal
      });
      job.image.src = result.dataUri ?? result.url ?? result.path;
      job.image.generated = true;
      this.onEvent('image:done', { ...job, result });
    }
    return next;
  }

  /**
   * Render one target. Returns { data, contentType, size, filename }.
   * @param {Object} options
   * @param {import('./types.js').ChangelogDoc} options.doc
   * @param {string} options.template
   * @param {import('./types.js').Target} options.target
   */
  async render({ doc, template: templateId, target, brand = this.brand }) {
    const normalized = normalizeDoc(doc);
    const template = this.getTemplate(templateId);
    const size = resolveSize(target, template);
    /** @type {import('./types.js').RenderContext} */
    const ctx = { doc: normalized, brand, size, target, template };

    const element = template.render(ctx);
    const html = this.serializer(element, ctx);
    if (target.format === 'html') {
      return {
        data: html,
        contentType: 'text/html',
        size,
        filename: filenameFor(normalized, templateId, target, size)
      };
    }

    const renderer = target.format === 'pdf' ? this.pdfRenderer : this.renderer;
    this.onEvent('render:start', { template: templateId, target, size });
    const result = await renderer.render(html, ctx);
    this.onEvent('render:done', { template: templateId, target, size });

    return {
      ...result,
      size,
      html,
      filename: target.name
        ? `${target.name}.${extFor(target.format)}`
        : filenameFor(normalized, templateId, target, size)
    };
  }

  /**
   * Render every (template x target) combination.
   * @param {Object} options
   * @param {import('./types.js').ChangelogDoc} options.doc
   * @param {string|string[]} options.template
   * @param {import('./types.js').Target[]} options.targets
   * @param {(file:{filename:string,data:any}) => Promise<void>} [options.write] Sink; omit to get buffers back.
   */
  async generate({ doc, template, targets, brand = this.brand, write, generateImages = true }) {
    let source = normalizeDoc(doc);
    if (generateImages && pendingImages(source).length) {
      source = await this.materializeImages(source, { brand });
    }
    const templateIds = Array.isArray(template) ? template : [template];
    const out = [];
    for (const id of templateIds) {
      for (const target of targets) {
        const file = await this.render({ doc: source, template: id, target, brand });
        if (write) await write(file);
        out.push(file);
      }
    }
    return out;
  }

  async dispose() {
    await this.renderer.dispose?.();
    if (this.pdfRenderer !== this.renderer) await this.pdfRenderer.dispose?.();
  }
}

export function extFor(format) {
  return format === 'jpeg' ? 'jpg' : format;
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function filenameFor(doc, templateId, target, size) {
  const parts = [slug(doc.product || 'changelog'), slug(doc.version), templateId, `${size.width}x${size.height}`];
  if ((size.scale ?? 1) !== 1) parts.push(`@${size.scale}x`);
  return `${parts.join('-')}.${extFor(target.format)}`;
}
