// Reads the pixel size of a JPEG, PNG or WebP file from its header, so every <img> can carry
// width/height (no layout shift) without an image library.
import fs from 'node:fs';

export function imageSize(file) {
  const fd = fs.openSync(file, 'r');
  try {
    const head = Buffer.alloc(512 * 1024); // JPEG EXIF blocks can push the frame header far in
    const n = fs.readSync(fd, head, 0, head.length, 0);
    const b = head.subarray(0, n);

    // PNG: IHDR is always the first chunk
    if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };

    // WebP: RIFF....WEBP + VP8 / VP8L / VP8X
    if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
      const kind = b.toString('ascii', 12, 16);
      if (kind === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
      if (kind === 'VP8L') {
        const bits = b.readUInt32LE(21);
        return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
      }
      if (kind === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    }

    // JPEG: walk the markers until a start-of-frame
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const marker = b[i + 1];
        const len = b.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
        }
        i += 2 + len;
      }
    }
  } finally {
    fs.closeSync(fd);
  }
  throw new Error('Unknown image format: ' + file);
}
