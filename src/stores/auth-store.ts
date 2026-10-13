import { create } from 'zustand';
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

export const useAuthStore = create<AuthState>((set) => ({
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
}));
