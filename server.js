const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const BASE = __dirname;
const ASSETS_BASE = path.join(__dirname, '..', 'Tanska_sivujen_content_ja_media');
const PORT = 8080;

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath.endsWith('/')) urlPath += 'index.html';

  const ext = path.extname(urlPath).toLowerCase();
  let filePath;

  if (urlPath.startsWith('/assets/')) {
    const assetsPath = path.join(ASSETS_BASE, urlPath);
    filePath = fs.existsSync(assetsPath) ? assetsPath : path.join(BASE, urlPath);
  } else {
    filePath = path.join(BASE, urlPath);
  }

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log('Server running at http://localhost:' + PORT + '/en/');
});
