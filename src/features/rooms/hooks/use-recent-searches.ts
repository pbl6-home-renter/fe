import { useCallback, useState } from 'react';
import { MAX_RECENT_SEARCHES, RECENT_SEARCHES_STORAGE_KEY } from '../constants/search.constants';

const readStorage = (): string[] => {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const writeStorage = (items: string[]) => {
  try {
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage might be unavailable or disabled
  }
};

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => readStorage());

  const addSearch = useCallback((rawKeyword: string) => {
    const keyword = rawKeyword.trim();
    if (!keyword) return;

    setRecentSearches((prev) => {
      const next = [keyword, ...prev.filter((item) => item.toLowerCase() !== keyword.toLowerCase())].slice(
        0,
        MAX_RECENT_SEARCHES,
      );
      writeStorage(next);
      return next;
    });
  }, []);

  const removeSearch = useCallback((keywordToRemove: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((item) => item !== keywordToRemove);
      writeStorage(next);
      return next;
    });
  }, []);

  const clearSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch {
      // Storage unavailable
    }
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
  };
};
