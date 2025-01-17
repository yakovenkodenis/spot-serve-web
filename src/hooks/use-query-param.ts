import { useState, useEffect } from 'react';

export const useQueryParam = (param: string): string => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setValue(params.get(param) ?? '');
  }, [param]);

  return value;
};
