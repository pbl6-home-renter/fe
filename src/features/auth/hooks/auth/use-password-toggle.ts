import { useState, useCallback } from 'react';

export const usePasswordToggle = (initialVisible = false) => {
  const [isVisible, setIsVisible] = useState(initialVisible);

  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  return {
    isVisible,
    inputType: isVisible ? ('text' as const) : ('password' as const),
    toggle,
    hide,
    show,
  };
};
