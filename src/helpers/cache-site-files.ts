import { fetchFiles } from './fetch-site-files';

export const cacheFiles = async () => {
  const { files } = await fetchFiles();
  const cache = await caches.open('website-cache');

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

      const path = filePath.includes('/') ? `/${filePath}` : filePath;
      const url = new URL(path, location.origin).toString();
      const request = new Request(url, { cache: 'reload', headers });
      console.log(request);
      await cache.put(request, response);
    })
  );
};
