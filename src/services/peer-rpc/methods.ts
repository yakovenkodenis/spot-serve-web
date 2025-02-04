export const rpcMethods = {
  websiteZipArchive: 'website-zip-archive',
} as const;

export type WebsiteZipArchiveResponse = {
  backend: boolean;
  file: Uint8Array;
  host: string;
  port: number;
  tunnel: string;
};
