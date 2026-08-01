import { parseArgs } from 'node:util';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ChangelogKit, SIZE_PRESETS } from '@changelog-kit/core';
import { builtinTemplates } from '@changelog-kit/templates';
import { brandPresets, getBrandPreset, defineBrandKit } from '@changelog-kit/brand';
import { PlaywrightRenderer } from '@changelog-kit/renderer-playwright';
import { createProvider, CachedProvider, listProviders } from '@changelog-kit/ai-images';

const HELP = `
changelog-kit — generate branded changelog visuals

  changelog-kit generate <doc.json> [options]
  changelog-kit templates
  changelog-kit brands
  changelog-kit presets

Options
  -t, --template <id[,id]>   Template(s). Default: hero-sandwich
  -b, --brand <id|file>      Brand preset id or path to a .js/.json brand kit
  -f, --format <list>        png,jpg,webp,pdf,html   Default: png
  -s, --size <list>          Size preset names or WxH   Default: instagram-portrait
      --scale <n>            Override device pixel ratio
  -o, --out <dir>            Output directory. Default: ./out
      --provider <id>        AI image provider (${listProviders().join(', ')})
      --model <id>           Provider model override
      --cache <dir>          Cache generated images (default .cache/changelog-images)
      --no-images            Skip AI generation; leave image slots empty
      --quality <n>          jpg/webp quality, 1-100
      --json                 Print a JSON manifest of what was written
`;

export async function run(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      template: { type: 'string', short: 't' },
      brand: { type: 'string', short: 'b' },
      format: { type: 'string', short: 'f' },
      size: { type: 'string', short: 's' },
      scale: { type: 'string' },
      out: { type: 'string', short: 'o' },
      provider: { type: 'string' },
      model: { type: 'string' },
      cache: { type: 'string' },
      images: { type: 'boolean', default: true },
      quality: { type: 'string' },
      json: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' }
    }
  });

  const command = positionals[0];
  if (values.help || !command) return console.log(HELP);

  if (command === 'templates') {
    for (const t of Object.values(builtinTemplates)) {
      console.log(`${t.id.padEnd(16)} ${t.aspect?.join(':').padEnd(9)} ${t.description ?? ''}`);
    }
    return;
  }
  if (command === 'brands') {
    for (const b of Object.values(brandPresets)) console.log(`${b.id.padEnd(18)} ${b.name}`);
    return;
  }
  if (command === 'presets') {
    for (const [name, s] of Object.entries(SIZE_PRESETS)) console.log(`${name.padEnd(20)} ${s.width}x${s.height} @${s.scale}x`);
    return;
  }
  if (command !== 'generate') throw new Error(`Unknown command "${command}". Try --help.`);

  const docPath = positionals[1];
  if (!docPath) throw new Error('generate needs a path to a changelog json/js file');

  const doc = await loadModuleOrJson(docPath);
  const brand = await loadBrand(values.brand);
  const templates = (values.template ?? 'hero-sandwich').split(',').map((s) => s.trim());
  const formats = (values.format ?? 'png').split(',').map((s) => s.trim());
  const sizes = (values.size ?? 'instagram-portrait').split(',').map((s) => s.trim());
  const outDir = path.resolve(values.out ?? 'out');

  const targets = [];
  for (const size of sizes) {
    for (const format of formats) {
      const dims = /^\d+x\d+$/.test(size)
        ? { width: Number(size.split('x')[0]), height: Number(size.split('x')[1]) }
        : { preset: size };
      targets.push({
        format,
        ...dims,
        ...(values.scale ? { scale: Number(values.scale) } : {}),
        ...(values.quality ? { quality: Number(values.quality) } : {})
      });
    }
  }

  let imageProvider = await createProvider(values.provider, { model: values.model });
  if (imageProvider && values.cache !== 'false') {
    imageProvider = new CachedProvider(imageProvider, values.cache ? { dir: values.cache } : {});
  }

  const kit = new ChangelogKit({
    brand,
    templates: builtinTemplates,
    renderer: new PlaywrightRenderer({ baseUrl: pathToFileURL(path.dirname(path.resolve(docPath))).href + '/' }),
    imageProvider,
    onEvent: (event, payload) => {
      if (event === 'render:done') console.log(`  ✓ ${payload.template} ${payload.size.width}x${payload.size.height} ${payload.target.format}`);
      if (event === 'image:start') console.log(`  … generating image for ${payload.key}`);
    }
  });

  await mkdir(outDir, { recursive: true });
  const manifest = [];
  try {
    await kit.generate({
      doc,
      template: templates,
      targets,
      generateImages: values.images !== false && Boolean(imageProvider),
      write: async (file) => {
        const dest = path.join(outDir, file.filename);
        await writeFile(dest, file.data);
        manifest.push({ file: dest, width: file.size.width, height: file.size.height, scale: file.size.scale });
      }
    });
  } finally {
    await kit.dispose();
  }

  if (values.json) console.log(JSON.stringify({ out: outDir, files: manifest }, null, 2));
  else console.log(`\n${manifest.length} file(s) → ${outDir}\n`);
}

async function loadModuleOrJson(file) {
  const abs = path.resolve(file);
  if (abs.endsWith('.json')) return JSON.parse(await readFile(abs, 'utf8'));
  const mod = await import(pathToFileURL(abs).href);
  return mod.default ?? mod.doc ?? mod;
}

async function loadBrand(spec) {
  if (!spec) return brandPresets.superageLight;
  if (spec.includes('.') || spec.includes('/')) {
    const loaded = await loadModuleOrJson(spec);
    return defineBrandKit(loaded.brand ?? loaded);
  }
  return getBrandPreset(spec);
}
