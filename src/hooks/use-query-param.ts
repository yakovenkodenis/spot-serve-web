import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

export const useQueryParam = (param: string): string => {
  const [value, setValue] = useState('');
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    setValue(params.get(param) ?? '');
  }, [param, search]);
  
  return value;
};
