import './index.css'

import { VirtualFS } from './helpers/virtual-fs';

type FileResponse = {
  content: string;
  mimeType: string;
  encoding: string;
}

const loadFiles = async (): Promise<{ fileBlobURLs: Record<string, string>, files: Record<string, FileResponse> }> => {
  const response = await fetch('http://localhost:3000/files');
  const files = await response.json() as Record<string, FileResponse>;

  const fileBlobURLs: Record<string, string> = {};

  Object.entries(files).forEach(([filePath, fileData]) => {
    const { content, mimeType, encoding } = fileData;

    // Decode base64 if the file was encoded that way
    const fileContent =
      encoding === "base64"
        ? Uint8Array.from(atob(content), (c) => c.charCodeAt(0))
        : content;

    const blob = new Blob([fileContent], { type: mimeType });
    fileBlobURLs[filePath] = URL.createObjectURL(blob);
  });

  return { fileBlobURLs, files };
}

function loadSampleContent(sampleFiles: Record<string, FileResponse>) {
  try {
      const fs = new VirtualFS();
      
      Object.entries(sampleFiles).forEach(([path, { content }]) => {
          console.log(path, { content })
          fs.addFile(path, content);
      });

      const processedHTML = fs.processImports(
          fs.getFile('index.html') as string,
          'index.html',
          'html'
      );

      const iframe = document.createElement('iframe');
      const output = document.getElementById('output')!;
      output.innerHTML = '';
      output.appendChild(iframe);

      if (iframe && iframe.contentDocument) {
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';

        iframe.contentDocument.open();
        iframe.contentDocument.write(processedHTML);
        iframe.contentDocument.close();
      }

  } catch (error) {
      const output = document.getElementById('output')!;
      output.innerHTML = `<div class="error">Error rendering content: ${(error as Error).message}</div>`;
  }
}

async function main() {
  const { files } = await loadFiles();
  loadSampleContent(files);
}

main();
