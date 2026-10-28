// Local preview of dist/. Applies public/_redirects and answers the two endpoints the pages call,
// so the forms can be tried locally:
//   POST /api/subscribe → answers like the real function would when the newsletter is not configured
//                         (MOCK_SUBSCRIBE=ok|invalid|rate-limit|error to try the other states)
//   POST /api/hello     → 204, nothing is forwarded anywhere
// Nothing is sent anywhere: this concept has no backend.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve(import.meta.dirname, '../dist');
const PORT = +process.env.PORT || 4321;
const MOCK = process.env.MOCK_SUBSCRIBE || 'unconfigured';
// --base=/afroton-redesign/ serves dist/ under that path, like GitHub Pages serves a project site
const BASE = ('/' + (process.argv.find((a) => a.startsWith('--base=')) || '--base=/').slice(7) + '/').replace(/\/{2,}/g, '/');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

const redirects = fs.existsSync(path.join(ROOT, '_redirects'))
  ? fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.trim().split(/\s+/))
  : [];

function send(res, status, body, type = 'text/plain') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (BASE !== '/') {
    if (url.pathname === BASE.slice(0, -1)) { res.writeHead(301, { Location: BASE }); return res.end(); }
    if (!url.pathname.startsWith(BASE)) return send(res, 404, 'Not found (this preview lives under ' + BASE + ')');
    url.pathname = '/' + url.pathname.slice(BASE.length);
  }
  if (url.pathname === '/api/subscribe' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      console.log('[dev] /api/subscribe', body);
      const ok = MOCK === 'ok';
      setTimeout(() => send(res, ok ? 200 : MOCK === 'invalid' ? 400 : MOCK === 'rate-limit' ? 429 : 503, JSON.stringify(ok ? { ok: true } : { ok: false, error: MOCK }), 'application/json'), 400);
    });
    return;
  }
  if (url.pathname === '/api/hello') return send(res, 204, '');

  for (const [from, to, code] of redirects) if (url.pathname === from) { res.writeHead(+code || 301, { Location: to }); return res.end(); }

  let file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT)) return send(res, 403, 'Forbidden');
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.pathname.endsWith('/')) { res.writeHead(301, { Location: (BASE === '/' ? '' : BASE.slice(0, -1)) + url.pathname + '/' + url.search }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) {
    const nf = path.join(ROOT, '404.html');
    return send(res, 404, fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found', 'text/html; charset=utf-8');
  }
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  // compress text like a real host would, so local performance measurements are realistic
  const gzip = /text|javascript|json|xml|svg/.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache', ...(gzip ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : {}) });
  (gzip ? fs.createReadStream(file).pipe(zlib.createGzip()) : fs.createReadStream(file)).pipe(res);
}).listen(PORT, () => console.log(`AFROTON preview on http://localhost:${PORT}${BASE} (subscribe mock: ${MOCK})`));
