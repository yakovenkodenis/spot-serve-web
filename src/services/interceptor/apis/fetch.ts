import { Params } from '../types';
import { localHostnames } from '../constants';

export function interceptFetch({ backend, port, tunnel }: Params): void {
  if (!backend) return;

  const _fetch = fetch;

  // @ts-expect-error Monkey-patching fetch
  // eslint-disable-next-line no-global-assign
  fetch = async (resource: RequestInfo, initOptions: RequestInit = {}) => {
    let request: Request;
    if (resource instanceof Request) {
      request = resource.clone();
    } else {
      request = new Request(resource.toString(), initOptions);
    }

    const url = new URL(request.url);

    if (localHostnames.includes(url.hostname) && Number(url.port) === Number(port)) {
      const replacementApiUrl = new URL(tunnel);
      const newUrl = new URL(request.url);
      newUrl.hostname = replacementApiUrl.hostname;
      newUrl.port = replacementApiUrl.port;
      newUrl.protocol = replacementApiUrl.protocol;

      let body;
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        body = await request.clone().blob();
      }

      const requestInit = {
        duplex: 'half',
        method: request.method,
        headers: request.headers,
        mode: request.mode,
        credentials: request.credentials,
        redirect: request.redirect,
        referrer: request.referrer,
        body,
        // body: (request.method === 'GET' || request.method === 'HEAD')
        //   ? undefined
        //   : request.clone().body,
      };
  
      const modifiedRequest = new Request(newUrl.toString(), requestInit);

      return _fetch(modifiedRequest);
    }

    return _fetch(request);
  };
}
