const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;
const BACKEND_URL = 'http://127.0.0.1:8080';
const DIST_DIR = path.join(__dirname, 'frontend', 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Log request for debugging
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // 1. Proxy /api requests to the Spring Boot API Gateway
  if (req.url.startsWith('/api/')) {
    const targetUrl = new URL(req.url, BACKEND_URL);
    
    // Copy incoming headers but override the host header to match the backend target
    const headers = { ...req.headers };
    headers.host = '127.0.0.1:8080';

    const proxyReq = http.request({
      hostname: '127.0.0.1',
      port: 8080,
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers: headers
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('Bad Gateway');
    });

    req.pipe(proxyReq);
    return;
  }

  // 2. Serve static files from dist/
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Clean query parameters/hashes from filename
  filePath = filePath.split('?')[0].split('#')[0];

  const ext = path.extname(filePath);
  let contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // For SPA routing, fallback to index.html if file not found
      filePath = path.join(DIST_DIR, 'index.html');
      contentType = 'text/html';
    }

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(`ShopFlow Production Proxy Server Running`);
  console.log(`Address: http://0.0.0.0:${PORT}`);
  console.log(`Serving assets from: ${DIST_DIR}`);
  console.log(`Proxying /api/* requests to: ${BACKEND_URL}`);
  console.log(`===================================================`);
});
