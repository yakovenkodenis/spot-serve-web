import { useEffect, useState } from 'react';

type FileResponse = {
  content: string;
  mimeType: string;
  encoding: string;
}

// Function to inject the <base> tag to the index.html content
const injectBaseTag = (htmlContent: string, fileBlobURLs: Record<string, string>): string => {
  // Inject <base> tag to rewrite URLs for assets
  return htmlContent.replace(
    '</head>',
    `<base href="${fileBlobURLs['index.html'] || '/'}"></head>`
  );
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

// const replaceResourceUrls = (htmlContent: string, fileBlobURLs: Record<string, string>): string => {
//   // Replace <script>, <link>, and <img> URLs
//   let modifiedHtml = htmlContent;

//   modifiedHtml = modifiedHtml.replace(/(["'])((?!https?)(?!data:)([^'"]+))\1/g, (match, quote, url) => {
//     // Only replace if the URL exists in the fileBlobURLs map
//     if (fileBlobURLs[url]) {
//       return `${quote}${fileBlobURLs[url]}${quote}`;
//     }
//     return match;
//   });

//   return modifiedHtml;
// }

const App = () => {
  const [fileBlobURLs, setFileBlobURLs] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, FileResponse>>({});

  useEffect(() => {
    const fetchFiles = async () => {
      const { fileBlobURLs: blobs, files } = await loadFiles();
      setFileBlobURLs(blobs);
      setFiles(files);
    };
    
    fetchFiles();
  }, []);

  const renderIframe = () => {
    if (!fileBlobURLs['index.html']) {
      return null;
    }

    // const indexHtmlBlobURL = fileBlobURLs['index.html'];
    const modifiedHtml = injectBaseTag(files['index.html'].content, fileBlobURLs);

    return (
      <iframe
        id="preview"
        title="Website Preview"
        style={{ width: '100%', height: '100vh', border: 'none' }}
        ref={(iframe) => {
          if (iframe && iframe.contentDocument) {
            const doc = iframe.contentDocument;

            // Inject the modified HTML content inside the iframe
            doc.open();
            doc.write(modifiedHtml); // Inject HTML content
            doc.close();

            // Inject script to register the service worker inside the iframe
            const script = doc.createElement('script');
            script.textContent = `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/service-worker.js')
                  .then(() => console.log('Service Worker registered!'))
                  .catch((err) => console.log('Service Worker registration failed:', err));
              }
            `;
            doc.body.appendChild(script);
          }
        }}
      />
    );
  };

  return renderIframe();
};

export default App;
