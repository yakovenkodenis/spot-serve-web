export function extractHostname(url: string): string {
  let hostname = url;

  const protocolSeparatorIndex = hostname.indexOf('://');
  if (protocolSeparatorIndex !== -1) {
    hostname = hostname.substring(protocolSeparatorIndex + 3);
  }

  const portIndex = hostname.indexOf(':');
  if (portIndex !== -1) {
    hostname = hostname.substring(0, portIndex);
  }

  const pathIndex = hostname.indexOf('/');
  if (pathIndex !== -1) {
    hostname = hostname.substring(0, pathIndex);
  }

  return hostname;
}
