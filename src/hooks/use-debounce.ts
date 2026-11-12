import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 300, immediateOnEmpty = false): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const wait = immediateOnEmpty && value === '' ? 0 : delay;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, wait);

    return () => {
      clearTimeout(handler);
    };
  }, [value, wait]);

  return immediateOnEmpty && value === '' ? value : debouncedValue;
}
