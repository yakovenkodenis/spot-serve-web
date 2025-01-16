import { API_BASE_URL } from '../config';

type FileResponse = {
  content: string;
  mimeType: string;
  encoding: string;
};

export const fetchFiles = async (): Promise<{
  fileBlobURLs: Record<string, string>;
  files: Record<string, FileResponse>;
}> => {
  const response = await fetch(`${API_BASE_URL}/files`);
  const files = (await response.json()) as Record<string, FileResponse>;

  const fileBlobURLs: Record<string, string> = {};

  Object.entries(files).forEach(([filePath, fileData]) => {
    const { content, mimeType, encoding } = fileData;

    // Decode base64 if the file was encoded that way
    const fileContent = encoding === 'base64' ? Uint8Array.from(atob(content), (c) => c.charCodeAt(0)) : content;

    const blob = new Blob([fileContent], { type: mimeType });
    fileBlobURLs[filePath] = URL.createObjectURL(blob);
  });

  return { fileBlobURLs, files };
};
