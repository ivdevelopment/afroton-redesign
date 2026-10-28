// Responsive images from the files that already exist in /public.
// WordPress uploads come with size variants (name-1024x683.webp); the /media photo sets have -600/-1200 jpgs.
// variants() finds them on disk, so components only name the image they mean.
import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from './image-size.mjs';
import { attrs } from './html.mjs';

const PUBLIC = path.resolve(import.meta.dirname, '../../public');
const cache = new Map();

function fileOf(url) {
  return path.join(PUBLIC, decodeURIComponent(url));
}

/** All same-aspect variants of an image, smallest first: [{url, width, height}] */
export function variants(url) {
  if (cache.has(url)) return cache.get(url);
  const file = fileOf(url);
  if (!fs.existsSync(file)) throw new Error(`Image not found in public/: ${url}`);
  const dir = path.dirname(file);
  const urlDir = path.posix.dirname(url);
  const ext = path.extname(file);
  const name = path.basename(file, ext);
  const own = { url, ...imageSize(file) };
  const ratio = own.width / own.height;
  const list = [own];

  let m;
  if ((m = name.match(/^(.*)-(600|1200)$/))) {
    // /media sets: name-600.jpg + name-1200.jpg
    for (const w of ['600', '1200']) {
      const u = `${urlDir}/${m[1]}-${w}${ext}`;
      if (u !== url && fs.existsSync(fileOf(u))) list.push({ url: u, ...imageSize(fileOf(u)) });
    }
  } else {
    // WordPress: base-WxH.webp next to base(-scaled).ext
    const base = name.replace(/-scaled$/, '').replace(/-\d+x\d+$/, '');
    const re = new RegExp('^' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-(\\d+)x(\\d+)\\.webp$');
    for (const f of fs.readdirSync(dir)) {
      const mm = f.match(re);
      if (!mm) continue;
      const w = +mm[1], h = +mm[2];
      if (Math.abs(w / h - ratio) / ratio > 0.02) continue; // square crops etc.
      const u = `${urlDir}/${f}`;
      if (u !== url) list.push({ url: u, width: w, height: h });
    }
    for (const f of [`${base}.webp`, `${base}-scaled.webp`]) {
      const u = `${urlDir}/${f}`;
      if (u !== url && fs.existsSync(fileOf(u))) {
        const s = imageSize(fileOf(u));
        if (Math.abs(s.width / s.height - ratio) / ratio <= 0.02) list.push({ url: u, ...s });
      }
    }
  }
  const seen = new Set();
  const out = list.filter((v) => !seen.has(v.width) && seen.add(v.width)).sort((a, b) => a.width - b.width);
  cache.set(url, out);
  return out;
}

/** {src, srcset, width, height} — src is the variant closest to `prefer` px wide. */
export function sources(url, prefer = 1024) {
  const v = variants(url);
  const best = v.reduce((a, b) => (Math.abs(b.width - prefer) < Math.abs(a.width - prefer) ? b : a));
  const largest = v[v.length - 1];
  return {
    src: best.url,
    srcset: v.length > 1 ? v.map((x) => `${x.url} ${x.width}w`).join(', ') : null,
    width: largest.width,
    height: largest.height,
  };
}

/**
 * <img> with srcset, intrinsic size and lazy loading by default.
 * opts: alt (required, '' for decorative), sizes, eager, priority, className, prefer, style
 */
export function img(url, opts = {}) {
  if (opts.alt === undefined) throw new Error(`img(${url}) needs an alt (use '' for decorative images)`);
  const s = sources(url, opts.prefer);
  return `<img${attrs({
    src: s.src,
    srcset: s.srcset,
    sizes: s.srcset ? opts.sizes || '100vw' : null,
    width: s.width,
    height: s.height,
    alt: opts.alt,
    class: opts.className,
    style: opts.style,
    loading: opts.eager || opts.priority ? null : 'lazy',
    fetchpriority: opts.priority ? 'high' : null,
    decoding: opts.priority ? null : 'async',
  })}>`;
}

export function exists(url) {
  return fs.existsSync(fileOf(url));
}
