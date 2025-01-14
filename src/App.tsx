import { useEffect, useState } from 'react';

type FileResponse = {
  content: string;
  mimeType: string;
  encoding: string;
}

const loadFiles = async (): Promise<Record<string, string>> => {
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

  const updatedIndexHtml = replaceResourceUrls(files['index.html'].content, fileBlobURLs);
  fileBlobURLs['index.html'] = URL.createObjectURL(new Blob([updatedIndexHtml], { type: 'text/html' }));;

  return fileBlobURLs;
}

const replaceResourceUrls = (htmlContent: string, fileBlobURLs: Record<string, string>): string => {
  // Replace <script>, <link>, and <img> URLs
  let modifiedHtml = htmlContent;

  modifiedHtml = modifiedHtml.replace(/(["'])((?!https?)(?!data:)([^'"]+))\1/g, (match, quote, url) => {
    // Only replace if the URL exists in the fileBlobURLs map
    if (fileBlobURLs[url]) {
      return `${quote}${fileBlobURLs[url]}${quote}`;
    }
    return match;
  });

  return modifiedHtml;
}

// Function to inject the <base> tag to the index.html content
const injectBaseTag = (htmlContent: string, fileBlobURLs: Record<string, string>): string => {
  // Inject <base> tag to rewrite URLs for assets
  return htmlContent.replace(
    '</head>',
    `<base href="${fileBlobURLs['index.html'] || '/'}"></head>`
  );
}

const App = () => {
  const [fileBlobURLs, setFileBlobURLs] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await loadFiles();
      setFileBlobURLs(files);
    };
    
    fetchFiles();
  }, []);

  const renderIframe = () => {
    if (!fileBlobURLs['index.html']) {
      return null;
    }

    const indexHtmlBlobURL = fileBlobURLs['index.html'];
    const modifiedHtml = injectBaseTag(indexHtmlBlobURL, fileBlobURLs);

    return (
      <iframe
        id="preview"
        title="Website Preview"
        src={modifiedHtml}
        style={{ width: '100%', height: '100vh', border: 'none' }}
      />
    );
  };

  return renderIframe();
};

export default App;
