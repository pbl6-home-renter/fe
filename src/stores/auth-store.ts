import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setUser: (user: User | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  clearAuth: () => void;
}

// Fallback in-memory storage for test/SSR environments without window.localStorage
const memoryStorage: Record<string, string> = {};

const safeStorage: StateStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return memoryStorage[key] ?? null;
      }
    }
    return memoryStorage[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        memoryStorage[key] = value;
        return;
      }
    }
    memoryStorage[key] = value;
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch {
        delete memoryStorage[key];
        return;
      }
    }
    delete memoryStorage[key];
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user: User, accessToken: string) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
        }),

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setAccessToken: (accessToken: string | null) =>
        set((state) => ({
          accessToken,
          isAuthenticated: !!accessToken && !!state.user,
        })),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'rentify_auth_storage',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
