import { ZipReader, BlobReader, BlobWriter } from '@zip.js/zip.js';
import { mimeTypes, type FileExtension, type MimeType } from '../constants/mimeTypes';

export type FileEntry = {
  content: string;
  mimeType: string;
  encoding: string;
  contentLength: number;
};

export type FileMap = Record<string, FileEntry>;

function isBinaryMimeType(mimeType: MimeType): boolean {
  return mimeType.startsWith('image/') || 
         mimeType.startsWith('audio/') || 
         mimeType.startsWith('video/') || 
         mimeType.startsWith('application/octet-stream') ||
         mimeType.includes('pdf');
}

export async function unzip(zipBlob: Blob): Promise<FileMap> {
  const zipReader = new ZipReader(new BlobReader(zipBlob));
  const entries = await zipReader.getEntries();

  const fileMap: FileMap = {};

  for (const entry of entries) {
    if (!entry.directory) {
      if (!entry.getData || !entry.filename) continue;

      const blob = await entry.getData(new BlobWriter());
      const arrayBuffer = await blob.arrayBuffer();

      const ext = entry.filename.split('.').pop();
      const mimeType = mimeTypes[`.${ext}` as FileExtension] ?? mimeTypes._default;

      const [, ...pathParts] = entry.filename.split('/')
      const filePathWithoutRoot = pathParts.join('/');

      let content: string;
      let encoding: string;

      if (isBinaryMimeType(mimeType)) {
        // For binary files, convert to base64
        const bytes = new Uint8Array(arrayBuffer);
        content = btoa(
          Array.from(bytes)
            .map(byte => String.fromCharCode(byte))
            .join('')
        );
        encoding = 'base64';
      } else {
        // For text files, use UTF-8
        content = new TextDecoder().decode(arrayBuffer);
        encoding = 'utf-8';
      }

      fileMap[filePathWithoutRoot] = {
        content,
        mimeType,
        contentLength: blob.size,
        encoding,
      };
    }
  }

  await zipReader.close();

  return fileMap;
}
