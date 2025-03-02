import { Params } from '../types';
import { localHostnames } from '../constants';

export function interceptXHR({ backend, port, tunnel }: Params): void {
  if (!backend) return;

  const XHRProto = XMLHttpRequest.prototype;
  const originalOpen = XHRProto.open;
  const originalSend = XHRProto.send;

  // Monkey patch the open method
  XHRProto.open = function (
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null
  ): void {
    const urlObj = new URL(url.toString());

    if (localHostnames.includes(urlObj.hostname) && Number(urlObj.port) === Number(port)) {
      const replacementApiUrl = new URL(tunnel);
      const newUrl = new URL(url.toString());
      newUrl.hostname = replacementApiUrl.hostname;
      newUrl.port = replacementApiUrl.port;
      newUrl.protocol = replacementApiUrl.protocol;

      // Call original open with modified URL
      originalOpen.call(this, method, newUrl.toString(), async, username, password);
    } else {
      // Call original open with unchanged URL
      originalOpen.call(this, method, url.toString(), async, username, password);
    }
  };

  // Monkey patch the send method to ensure proper handling of the request body
  XHRProto.send = function (body?: XMLHttpRequestBodyInit): void {
    originalSend.call(this, body);
  };
}
