/** sharp-based helpers: format conversion, downscaling, srcset-style variants. */

async function sharp() {
  const mod = await import('sharp');
  return mod.default ?? mod;
}

export async function toWebp(buffer, quality = 88) {
  const s = await sharp();
  return s(buffer).webp({ quality }).toBuffer();
}

export async function toJpg(buffer, quality = 92, background = '#ffffff') {
  const s = await sharp();
  return s(buffer).flatten({ background }).jpeg({ quality, mozjpeg: true }).toBuffer();
}

/** Downscale one master render into several widths — cheaper than re-rendering. */
export async function resizeVariants(buffer, widths, { format = 'png', quality = 90 } = {}) {
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
