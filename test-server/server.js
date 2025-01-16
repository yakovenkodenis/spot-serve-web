const http = require('http');
const fs = require('fs');
const path = require('path');

// Directory to serve files from
const DIRECTORY = path.join(__dirname, 'sites');

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

function readFilesFromDirectory(directory, baseDirectory = directory) {
  const files = {};
  const entries = fs.readdirSync(directory);
  
  entries.forEach((entry) => {

    if (entry.endsWith('.gz')) return;

    const fullPath = path.join(directory, entry);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      Object.assign(
        files, 
        readFilesFromDirectory(fullPath, baseDirectory)
      );
    } else {
      const mimeType = getMimeType(fullPath);
      const isTextFile = mimeType.startsWith('text/') || mimeType === 'application/javascript';
      const encoding = isTextFile ? 'utf8' : 'base64';
      const fileContent = fs.readFileSync(fullPath, { encoding });
      
      const relativePath = path.relative(baseDirectory, fullPath);
      
      const normalizedPath = relativePath.split(path.sep).join('/');
      
      files[normalizedPath] = {
        content: fileContent,
        mimeType,
        encoding,
      };
    }
  });
  
  return files;
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.url === '/files' && req.method === 'GET') {
    try {
      const files = readFilesFromDirectory(DIRECTORY + '/qn-solutions');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(files));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error: ' + error.message);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
