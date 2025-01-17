import type { FileMap } from './unzip';

type Options = {
  key: string;
};

export async function cacheFiles(files: FileMap, options: Options) {
  const { key } = options;

  await caches.delete(key);
  const cache = await caches.open(key);

  await Promise.all(
    Object.entries(files).map(async ([filePath, fileData]) => {
      const { content, mimeType, encoding } = fileData;

      let fileContent;
      if (encoding === 'base64') {
        const binaryString = atob(content);
        const binaryData = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
        fileContent = binaryData;
      } else {
        fileContent = content;
      }

      const blob = new Blob([fileContent], { type: mimeType });

      const headers = new Headers();
      headers.append('content-type', mimeType);
      headers.append('content-length', blob.size.toString());

      const response = new Response(blob, { headers });

      const url = new URL(filePath, location.origin).toString();
      const request = new Request(url, { cache: 'reload', headers });
      await cache.put(request, response);
    })
  );
};
