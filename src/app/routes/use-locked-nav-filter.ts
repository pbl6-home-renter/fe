import { useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { UserStatus } from '@/types/user';
import { isPathAllowedWhileLocked } from './locked-access';

/** Hides navigation entries a locked account cannot open. */
export const useLockedNavFilter = () => {
  const { user } = useAuth();
  const isLocked = user?.status === UserStatus.LOCKED;
  const role = user?.role;

  return useCallback((path: string) => !isLocked || isPathAllowedWhileLocked(path, role), [isLocked, role]);
};
