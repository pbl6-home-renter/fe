import { useAuthStore } from '@/stores/auth-store';
import type { Role } from '@/types/role';

export const useCan = () => {
  const user = useAuthStore((state) => state.user);
  const hasRole = (...roles: Role[]) => !!user && roles.includes(user.role);
  return { hasRole, role: user?.role };
};