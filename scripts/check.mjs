// `npm run check`: static checks that need no dependencies.
//  - every browser script parses (node --check)
//  - every stylesheet has balanced braces and only uses custom properties that are defined somewhere
//  - every source module imports cleanly
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
let failed = 0;
const fail = (msg) => { failed++; console.error('✖ ' + msg); };
const ok = (msg) => console.log('✔ ' + msg);

const scripts = ['src/scripts/site.js', 'public/assets/js/afroton-consent.js', 'public/assets/js/afroton-signup.js', 'public/assets/js/vendor/ot-shop-injector.js'];
for (const s of scripts) {
  try { execFileSync(process.execPath, ['--check', path.join(ROOT, s)], { stdio: 'pipe' }); ok(`parses: ${s}`); }
  catch (e) { fail(`${s}: ${e.stderr}`); }
}

const cssDir = path.join(ROOT, 'src/styles');
const css = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css')).map((f) => ({ f, src: fs.readFileSync(path.join(cssDir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') }));
const defined = new Set();
for (const { src } of css) for (const m of src.matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(m[1]);
// set from inline styles in the markup
for (const v of ['--pos', '--h']) defined.add(v);
for (const { f, src } of css) {
  const open = (src.match(/{/g) || []).length, close = (src.match(/}/g) || []).length;
  if (open !== close) fail(`${f}: ${open} "{" vs ${close} "}"`);
  for (const m of src.matchAll(/var\((--[a-z0-9-]+)(,[^)]*)?\)/gi)) if (!defined.has(m[1]) && !m[2]) fail(`${f}: var(${m[1]}) is never defined`);
}
ok(`stylesheets: ${css.length} files, ${defined.size} custom properties`);

for (const dir of ['src/lib', 'src/data', 'src/components', 'src/pages']) {
  for (const f of fs.readdirSync(path.join(ROOT, dir)).filter((x) => x.endsWith('.mjs'))) {
    try { await import(new URL('file:///' + path.join(ROOT, dir, f).replace(/\\/g, '/')).href); }
    catch (e) { fail(`${dir}/${f}: ${e.message}`); }
  }
}
ok('source modules import');

if (failed) { console.error(`\n${failed} problem(s)`); process.exit(1); }
console.log('\nAll checks passed');
