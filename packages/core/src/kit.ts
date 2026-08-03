import { normalizeDoc, pendingImages } from './doc.js';
import { resolveSize } from './presets.js';
import type { ChangelogDoc, ChangelogEntry, Renderer, RenderContext, RenderSize, Serializer, Target, Template } from './types.js';

export interface ImageGenerateRequest<TBrand = unknown> {
  prompt?: string;
  brand: TBrand;
  doc: ChangelogDoc;
  entry?: ChangelogEntry;
  role: 'hero' | 'card';
  signal?: AbortSignal;
}

export interface ImageGenerateResult {
  url?: string;
  dataUri?: string;
  path?: string;
}

export interface ImageProvider<TBrand = unknown> {
  generate(request: ImageGenerateRequest<TBrand>): Promise<ImageGenerateResult>;
}

export interface ChangelogKitOptions<TBrand = unknown, TElement = unknown> {
  brand: TBrand;
  templates: Record<string, Template<TBrand, TElement>> | Template<TBrand, TElement>[];
  renderer: Renderer<TBrand, TElement>;
  /** Optional separate renderer for pdf. */
  pdfRenderer?: Renderer<TBrand, TElement>;
  /** Turns a template's React element into HTML. */
  serializer: Serializer<TBrand, TElement>;
  imageProvider?: ImageProvider<TBrand>;
  onEvent?: (event: string, payload: unknown) => void;
}

export interface RenderOneOptions<TBrand = unknown> {
  doc: ChangelogDoc;
  template: string;
  target: Target;
  brand?: TBrand;
}

export interface RenderedFile {
  data: Buffer | Uint8Array | string;
  contentType: string;
  size: RenderSize;
  filename: string;
  html?: string;
}

export interface MaterializeImagesOptions<TBrand = unknown> {
  brand?: TBrand;
  force?: boolean;
  signal?: AbortSignal;
}

export interface GenerateOptions<TBrand = unknown> {
  doc: ChangelogDoc;
  template: string | string[];
  targets: Target[];
  brand?: TBrand;
  /** Sink; omit to get buffers back. */
  write?: (file: RenderedFile) => Promise<void>;
  generateImages?: boolean;
}

/**
 * Orchestrates: doc -> (AI images) -> template element -> renderer -> files.
 * Everything pluggable is injected, so the pipeline itself has no I/O deps.
 */
export class ChangelogKit<TBrand = unknown, TElement = unknown> {
  brand: TBrand;
  renderer: Renderer<TBrand, TElement>;
  pdfRenderer: Renderer<TBrand, TElement>;
  serializer: Serializer<TBrand, TElement>;
  imageProvider?: ImageProvider<TBrand>;
  onEvent: (event: string, payload: unknown) => void;
  templates: Record<string, Template<TBrand, TElement>>;

  constructor({
    brand,
    templates,
    renderer,
    pdfRenderer,
    serializer,
    imageProvider,
    onEvent
  }: ChangelogKitOptions<TBrand, TElement>) {
    if (!brand) throw new Error('ChangelogKit: a brand kit is required');
    if (!renderer) throw new Error('ChangelogKit: a renderer is required');
    if (!serializer) {
      throw new Error("ChangelogKit: a serializer is required to turn a template's React element into HTML");
    }
    this.brand = brand;
    this.renderer = renderer;
    this.pdfRenderer = pdfRenderer ?? renderer;
    this.serializer = serializer;
    this.imageProvider = imageProvider;
    this.onEvent = onEvent ?? (() => {});
    this.templates = Array.isArray(templates)
      ? Object.fromEntries(templates.map((t) => [t.id, t]))
      : { ...templates };
  }

  register(template: Template<TBrand, TElement>): this {
    this.templates[template.id] = template;
    return this;
  }

  list(): Template<TBrand, TElement>[] {
    return Object.values(this.templates);
  }

  getTemplate(id: string): Template<TBrand, TElement> {
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
  async materializeImages(
    doc: ChangelogDoc,
    { brand = this.brand, force = false, signal }: MaterializeImagesOptions<TBrand> = {}
  ): Promise<ChangelogDoc> {
    const next = structuredClone(doc);
    const jobs = force
      ? [
          ...(next.hero ? [{ key: 'hero', image: next.hero }] : []),
          ...next.entries
            .map((entry, i) => ({ key: `entry.${i}`, image: entry.image, entry }))
            .filter((j): j is { key: string; image: NonNullable<typeof j.image>; entry: ChangelogEntry } =>
              Boolean(j.image)
            )
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
        entry: 'entry' in job ? job.entry : undefined,
        role: job.key === 'hero' ? 'hero' : 'card',
        signal
      });
      job.image.src = result.dataUri ?? result.url ?? result.path;
      job.image.generated = true;
      this.onEvent('image:done', { ...job, result });
    }
    return next;
  }

  /** Render one target. */
  async render({
    doc,
    template: templateId,
    target,
    brand = this.brand
  }: RenderOneOptions<TBrand>): Promise<RenderedFile> {
    const normalized = normalizeDoc(doc);
    const template = this.getTemplate(templateId);
    const size = resolveSize(target, template);
    const ctx: RenderContext<TBrand, TElement> = { doc: normalized, brand, size, target, template };

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

  /** Render every (template x target) combination. */
  async generate({
    doc,
    template,
    targets,
    brand = this.brand,
    write,
    generateImages = true
  }: GenerateOptions<TBrand>): Promise<RenderedFile[]> {
    let source = normalizeDoc(doc);
    if (generateImages && pendingImages(source).length) {
      source = await this.materializeImages(source, { brand });
    }
    const templateIds = Array.isArray(template) ? template : [template];
    const out: RenderedFile[] = [];
    for (const id of templateIds) {
      for (const t of targets) {
        const file = await this.render({ doc: source, template: id, target: t, brand });
        if (write) await write(file);
        out.push(file);
      }
    }
    return out;
  }

  async dispose(): Promise<void> {
    await this.renderer.dispose?.();
    if (this.pdfRenderer !== this.renderer) await this.pdfRenderer.dispose?.();
  }
}

export function extFor(format: Target['format']): string {
  return format === 'jpeg' ? 'jpg' : format;
}

function slug(value: unknown): string {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function filenameFor(doc: ChangelogDoc, templateId: string, target: Target, size: RenderSize): string {
  const parts = [slug(doc.product || 'changelog'), slug(doc.version), templateId, `${size.width}x${size.height}`];
  if ((size.scale ?? 1) !== 1) parts.push(`@${size.scale}x`);
  return `${parts.join('-')}.${extFor(target.format)}`;
}
