const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CSV_PATH = path.join(DATA_DIR, 'submissions.csv');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

const CSV_HEADER = 'submitted_at,full_name,year,branch,domain_interest,motivation\n';

function ensureCsvFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, CSV_HEADER, 'utf8');
  }
}

function escapeCsvValue(value) {
  const normalized = String(value ?? '').replace(/\r?\n/g, ' ').trim();
  return `"${normalized.replace(/"/g, '""')}"`;
}

function appendSubmission(payload) {
  ensureCsvFile();

  const row = [
    new Date().toISOString(),
    payload.fullName,
    payload.year,
    payload.branch,
    payload.domainInterest,
    payload.motivation
  ].map(escapeCsvValue).join(',') + '\n';

  fs.appendFileSync(CSV_PATH, row, 'utf8');
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function serveStaticFile(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const requestPath = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const safePath = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(error.code === 'ENOENT' ? 'Not Found' : 'Server Error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

function handleSubmission(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;

    if (body.length > 1e6) {
      req.destroy();
    }
  });

  req.on('end', () => {
    try {
      const payload = JSON.parse(body);
      const requiredFields = ['fullName', 'year', 'branch', 'domainInterest', 'motivation'];
      const hasMissingField = requiredFields.some((field) => !String(payload[field] ?? '').trim());

      if (hasMissingField) {
        sendJson(res, 400, { message: 'All fields are required.' });
        return;
      }

      appendSubmission(payload);
      sendJson(res, 200, { message: 'Application saved successfully.' });
    } catch (error) {
      sendJson(res, 400, { message: 'Invalid submission payload.' });
    }
  });
}

ensureCsvFile();

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/submit-application') {
    handleSubmission(req, res);
    return;
  }

  if (req.method === 'GET') {
    serveStaticFile(req, res);
    return;
  }

  res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Method Not Allowed');
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
