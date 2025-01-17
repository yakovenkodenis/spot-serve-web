export const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.xml': 'text/xml',
  '.txt': 'text/plain',
  '.js': 'application/javascript',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',

  _default: 'application/octet-stream',
} as const;

export type FileExtension = keyof typeof mimeTypes;
export type MimeType = typeof mimeTypes[keyof typeof mimeTypes];

