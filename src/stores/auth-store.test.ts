import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/auth-store';
import type { User } from '@/types/user';

describe('Auth Store (fe/src/stores/auth-store.ts)', () => {
  const mockUser: User = {
    id: 'user-uuid-1',
    phone: '0901234567',
    email: 'tenant@example.com',
    name: 'Le Van An',
    role: 'tenant',
    status: 'active',
    createdAt: '2026-10-13T00:00:00Z',
    updatedAt: '2026-10-13T00:00:00Z',
    isDeleted: false,
  };

  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it('initial state should be empty and unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setAuth should save user and accessToken with isAuthenticated = true', () => {
    useAuthStore.getState().setAuth(mockUser, 'test-jwt-token');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe('test-jwt-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('setAccessToken should update accessToken while keeping user', () => {
    useAuthStore.getState().setAuth(mockUser, 'old-token');
    useAuthStore.getState().setAccessToken('new-refreshed-token');

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('new-refreshed-token');
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('clearAuth should reset user, accessToken and isAuthenticated', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

