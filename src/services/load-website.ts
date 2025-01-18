import { unzip } from '@/helpers/unzip';
import { cacheFiles } from '@/helpers/cache-files';

const cacheStoreName = 'website-cache';

export async function loadWebsiteZipFromUrl(url: string): Promise<string> {  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ZIP file: ${response.statusText}`);
  }

  const zipBlob = await response.blob();
  const text = await loadWebsiteZipFromBlob(zipBlob);
  return text;
}

export async function loadWebsiteZipFromBlob(zipBlob: Blob): Promise<string> {
  const filesMap = await unzip(zipBlob);
  console.log({ filesMap })
  const cache = await caches.open(cacheStoreName);
  await cacheFiles(filesMap, { key: cacheStoreName });

  const indexHtmlResponse = await cache.match(new Request('index.html'));

  if (indexHtmlResponse && indexHtmlResponse.ok) {
    const text = await indexHtmlResponse.text();
    return text;
  } else {
    throw new Error('index.html not found in cache');
  }
}
