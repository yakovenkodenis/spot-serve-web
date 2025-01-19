/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

type HistoryMethod = (data: any, unused: string, url?: string | URL | null | undefined) => void;

export const useQueryParam = (param: string): string => {
  const [value, setValue] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param) ?? '';
  });

  useEffect(() => {
    const updateValueFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setValue(params.get(param) ?? '');
    };

    window.addEventListener('popstate', updateValueFromUrl);

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args: Parameters<HistoryMethod>) {
      originalPushState.apply(this, args);
      updateValueFromUrl();
    };

    window.history.replaceState = function(...args: Parameters<HistoryMethod>) {
      originalReplaceState.apply(this, args);
      updateValueFromUrl();
    };

    return () => {
      window.removeEventListener('popstate', updateValueFromUrl);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [param]);

  return value;
};
