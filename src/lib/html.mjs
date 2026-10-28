// Tiny templating helpers. Pages and components are plain functions returning strings.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape text for use in HTML content or attribute values. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/**
 * Tagged template: interpolated arrays are joined, null/false/undefined render nothing.
 * Interpolations are NOT escaped — wrap untrusted or data-driven text in esc().
 */
export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    out += (Array.isArray(v) ? v.flat(Infinity).filter((x) => x != null && x !== false).join('') : v == null || v === false ? '' : v) + strings[i + 1];
  }
  return out;
}

/** Build an attribute string from an object; true → bare attribute, null/false → omitted. */
export function attrs(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v != null && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');
}
