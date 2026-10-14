import { describe, it, expect, beforeEach } from 'vitest';
import { getHomePathByRole } from '@/app/routes/route-utils';
import { useAuthStore } from '@/stores/auth-store';

describe('Route & Authorization Utils', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it('should return /login when user is null or undefined', () => {
    expect(getHomePathByRole(null)).toBe('/login');
    expect(getHomePathByRole(undefined)).toBe('/login');
  });

  it('should return /admin for admin role', () => {
    expect(getHomePathByRole('admin')).toBe('/admin');
  });

  it('should return /landlord or /dashboard for landlord role', () => {
    expect(getHomePathByRole('landlord')).toBe('/dashboard');
  });

  it('should return /tenant or /dashboard for tenant role', () => {
    expect(getHomePathByRole('tenant')).toBe('/dashboard');
  });

  it('auth store should correctly set and clear user', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();

    useAuthStore.getState().setUser({
      id: '123',
      name: 'Nguyen Van A',
      email: 'a@example.com',
      phone: '0901234567',
      role: 'tenant',
      status: 'active',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      isDeleted: false,
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.role).toBe('tenant');

    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});

