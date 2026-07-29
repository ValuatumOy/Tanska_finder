const http = require('http');
const https = require('https');
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
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const BASE = __dirname;
const ASSETS_BASE = path.join(__dirname, '..', 'Tanska_sivujen_content_ja_media');
const API_PROXY_HOST = 'sis0e9wy90.execute-api.eu-west-1.amazonaws.com';
const PORT = 8080;
const REDIRECTS = {
  '/': '/en/',
  '/en/product/credit-risk-tool': '/en/products/credit-risk-tool/',
  '/en/product/credit-risk-tool/': '/en/products/credit-risk-tool/',
  '/en/product/company-valuation-tool': '/en/products/company-valuation-tool/',
  '/en/product/company-valuation-tool/': '/en/products/company-valuation-tool/',
  '/en/product/credit-risk-assessment-methods': '/en/products/credit-risk-assessment-methods/',
  '/en/product/credit-risk-assessment-methods/': '/en/products/credit-risk-assessment-methods/',
  '/en/privacy': '/en/privacy-policy/',
  '/en/privacy/': '/en/privacy-policy/',
  '/wp-content/uploads/sites/9/2020/09/DemoReport.pdf': '/assets/wordpress-media/2020/09/DemoReport.pdf'
};

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  const normalizedPath = urlPath.endsWith('/') || path.extname(urlPath) ? urlPath : `${urlPath}/`;

  if (REDIRECTS[normalizedPath]) {
    res.writeHead(301, { Location: REDIRECTS[normalizedPath] });
    res.end();
    return;
  }

  if (urlPath.startsWith('/wp-content/uploads/sites/9/')) {
    res.writeHead(301, { Location: urlPath.replace('/wp-content/uploads/sites/9/', '/assets/wordpress-media/') });
    res.end();
    return;
  }

  if (urlPath.startsWith('/api/')) {
    const proxyPath = urlPath === '/api/create-checkout/'
      ? req.url.replace('/api/create-checkout/', '/api/create-checkout')
      : req.url;
    const proxyReq = https.request(
      {
        hostname: API_PROXY_HOST,
        path: proxyPath,
        method: req.method,
        headers: {
          ...req.headers,
          host: API_PROXY_HOST
        }
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );

    proxyReq.on('error', () => {
      res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'API proxy failed' }));
    });

    req.pipe(proxyReq);
    return;
  }

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
