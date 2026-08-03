/** sharp-based helpers: format conversion, downscaling, srcset-style variants. */

async function sharp() {
  const mod = await import('sharp');
  return mod.default ?? mod;
}

export async function toWebp(buffer: Buffer | Uint8Array, quality = 88): Promise<Buffer> {
  const s = await sharp();
  return s(buffer).webp({ quality }).toBuffer();
}

export async function toJpg(
  buffer: Buffer | Uint8Array,
  quality = 92,
  background = '#ffffff'
): Promise<Buffer> {
  const s = await sharp();
  return s(buffer).flatten({ background }).jpeg({ quality, mozjpeg: true }).toBuffer();
}

export interface ResizeVariant {
  width: number;
  format: string;
  data: Buffer;
}

export interface ResizeVariantsOptions {
  format?: string;
  quality?: number;
}

/** Downscale one master render into several widths — cheaper than re-rendering. */
export async function resizeVariants(
  buffer: Buffer | Uint8Array,
  widths: number[],
  { format = 'png', quality = 90 }: ResizeVariantsOptions = {}
): Promise<ResizeVariant[]> {
  const s = await sharp();
  return Promise.all(
    widths.map(async (width) => {
      let pipe = s(buffer).resize({ width, withoutEnlargement: true, kernel: 'lanczos3' });
      if (format === 'jpg' || format === 'jpeg') pipe = pipe.flatten({ background: '#fff' }).jpeg({ quality, mozjpeg: true });
      else if (format === 'webp') pipe = pipe.webp({ quality });
      else pipe = pipe.png({ compressionLevel: 9 });
      return { width, format, data: await pipe.toBuffer() };
    })
  );
}
