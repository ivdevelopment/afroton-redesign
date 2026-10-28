// Hand-tuned decorative SVG: palm fronds, sun marks, torn paper edges and a brush underline.
// Everything is generated at build time from a fixed seed, so the shapes stay the same between builds.

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const r1 = (n) => Math.round(n * 10) / 10;

/**
 * A palm frond silhouette: a curved rib with tapered leaflets on both sides.
 * The frond grows from the bottom-left of a 400×600 box towards the top-right.
 */
export function palmFrond({ seed = 7, leaflets = 19, className = '', droop = 0.32 } = {}) {
  const rand = rng(seed);
  const P0 = [40, 590], P1 = [120 + droop * 120, 220], P2 = [360, 40];
  const at = (t) => [
    (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
    (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1],
  ];
  const tangent = (t) => {
    const x = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
    const y = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
    const l = Math.hypot(x, y);
    return [x / l, y / l];
  };
  let d = `M${P0[0]} ${P0[1]} Q${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]} L${P2[0] - 4} ${P2[1] + 6} Q${P1[0] - 8} ${P1[1] + 4} ${P0[0] - 8} ${P0[1]}Z`;
  for (let i = 0; i < leaflets; i++) {
    const t = 0.12 + (i / (leaflets - 1)) * 0.86;
    const [x, y] = at(t);
    const [tx, ty] = tangent(t);
    const len = (60 + 170 * Math.sin(Math.PI * Math.min(1, t * 1.05))) * (0.85 + rand() * 0.3);
    for (const side of [-1, 1]) {
      // leaflets sweep forward (towards the tip) and droop a little
      const nx = -ty * side, ny = tx * side;
      const sweep = 0.55 + rand() * 0.2;
      const ex = x + (nx * (1 - sweep) + tx * sweep) * len;
      const ey = y + (ny * (1 - sweep) + ty * sweep) * len + len * 0.18;
      const w = 7 + rand() * 6;
      const cx = x + nx * len * 0.55 + tx * len * 0.15;
      const cy = y + ny * len * 0.55 + ty * len * 0.15 - side * 4;
      d += ` M${r1(x)} ${r1(y)} Q${r1(cx + tx * w)} ${r1(cy + ty * w)} ${r1(ex)} ${r1(ey)} Q${r1(cx - tx * w)} ${r1(cy - ty * w)} ${r1(x + tx * 9)} ${r1(y + ty * 9)}Z`;
    }
  }
  return `<svg class="frond ${className}" viewBox="0 0 400 600" aria-hidden="true" focusable="false"><path d="${d}" fill="currentColor"/></svg>`;
}

/** Sun mark: a disc with 12 rays (the ticker separator and small accents). */
export function sun({ className = '', rays = 12 } = {}) {
  let d = '';
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const x1 = 12 + Math.cos(a) * 7.2, y1 = 12 + Math.sin(a) * 7.2;
    const x2 = 12 + Math.cos(a) * 10.6, y2 = 12 + Math.sin(a) * 10.6;
    d += `M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`;
  }
  return `<svg class="sun ${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.6" fill="currentColor"/><path d="${d}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;
}

/**
 * Torn paper edge. Filled with currentColor below (edge "top") or above (edge "bottom") the tear.
 * Stretch it across a section boundary; the colour is the colour of the section it belongs to.
 */
export function tornEdge({ seed = 3, edge = 'top', className = '', amp = 16 } = {}) {
  const rand = rng(seed);
  const W = 1440, H = amp + 8;
  const pts = [];
  for (let x = 0; x <= W; x += 14 + rand() * 26) {
    pts.push([r1(x), r1(4 + rand() * amp * (0.35 + 0.65 * Math.abs(Math.sin(x / 190))))]);
  }
  pts.push([W, r1(4 + rand() * amp * 0.5)]);
  const line = pts.map(([x, y]) => `${x} ${y}`).join(' L');
  const d = edge === 'top' ? `M0 ${H} L0 ${pts[0][1]} L${line} L${W} ${H}Z` : `M0 0 L0 ${H - pts[0][1]} L${pts.map(([x, y]) => `${x} ${r1(H - y)}`).join(' L')} L${W} 0Z`;
  return `<svg class="torn torn--${edge} ${className}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${d}" fill="currentColor"/></svg>`;
}

/** Vertical torn edge for split compositions (tear runs top→bottom on the left side of a panel). */
export function tornSide({ seed = 11, className = '', amp = 22 } = {}) {
  const rand = rng(seed);
  const H = 1000, W = amp + 10;
  let d = `M${W} 0 L${r1(6 + rand() * amp)} 0`;
  for (let y = 0; y <= H; y += 12 + rand() * 30) d += ` L${r1(4 + rand() * amp * (0.4 + 0.6 * Math.abs(Math.cos(y / 140))))} ${r1(y)}`;
  d += ` L${r1(6 + rand() * amp)} ${H} L${W} ${H}Z`;
  return `<svg class="torn-side ${className}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${d}" fill="currentColor"/></svg>`;
}

/** Dry-brush underline, drawn in two passes so it reads as paint rather than a vector line. */
export function brushUnderline({ className = '' } = {}) {
  return `<svg class="brush ${className}" viewBox="0 0 480 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
<path d="M8 27 C 90 17, 190 12, 300 13 S 430 19, 472 11" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round"/>
<path d="M30 33 C 120 25, 230 21, 330 22 S 420 25, 452 21" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity=".75"/>
<path d="M60 22 C 140 15, 240 11, 360 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/>
</svg>`;
}

/** Hand-drawn circle scribble, used sparingly to mark a word. */
export function scribbleCircle({ className = '' } = {}) {
  return `<svg class="scribble ${className}" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M150 10 C 90 0, 20 10, 10 38 C 2 64, 70 76, 120 72 C 170 68, 196 52, 190 32 C 184 14, 140 6, 96 8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`;
}
