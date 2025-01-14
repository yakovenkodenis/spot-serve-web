const http = require('http');
const fs = require('fs');
const path = require('path');

// Directory to serve files from
const DIRECTORY = path.join(__dirname, 'sites');

// Function to determine the MIME type based on file extension
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

// Function to read files from the directory and prepare the content map
function readFilesFromDirectory(directory) {
  const files = {};
  const fileList = fs.readdirSync(directory);

  fileList.forEach((fileName) => {
    const filePath = path.join(directory, fileName);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile()) {
      const mimeType = getMimeType(filePath);
      const isTextFile = mimeType.startsWith('text/') || mimeType === 'application/javascript';
      const encoding = isTextFile ? 'utf8' : 'base64';
      const fileContent = fs.readFileSync(filePath, { encoding });

      files[fileName] = {
        content: fileContent,
        mimeType,
        encoding,
      };
    }
  });

  return files;
}

// Create the HTTP server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.url === '/files' && req.method === 'GET') {
    try {
      const files = readFilesFromDirectory(DIRECTORY + '/age-calculator');

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
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
