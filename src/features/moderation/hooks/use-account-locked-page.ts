import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/config/routes.config';
import { getHomePathByRole } from '@/app/routes/route-utils';
import { API_BASE_URL } from '@/lib/api/client';
import { refreshSession } from '@/lib/api/refresh-token';
import { useAuthStore } from '@/stores/auth-store';
import { UserStatus } from '@/types/user';
import { authApi } from '@/features/auth/api/auth.api';
import { useLogoutMutation } from '@/features/auth/hooks/use-logout-mutation';
import { useSocket } from '@/features/realtime/hooks/use-socket';
import { NOTIFICATION_SOCKET_EVENTS } from '@/features/notifications/constants/notification.constants';
import { isNotificationCreatedEvent } from '@/features/notifications/utils/notification-event.guard';
import { MODERATION_QUERY_KEYS } from '../constants/moderation.constants';
import { useMyAppealQuery } from './use-my-appeal-query';

const ACCOUNT_STATUS_QUERY_KEY = [...MODERATION_QUERY_KEYS.ALL, 'account-status'] as const;

/**
 * State of `/account-locked`: lock info, current appeal, and the way out. `/me` is
 * re-read on focus and on `user.unlocked`; once the account is active again the
 * token is refreshed (its `status` claim lags up to 15 minutes) and the user is
 * sent to their home page.
 */
export const useAccountLockedPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logoutMutation = useLogoutMutation();
  const isLeavingRef = useRef(false);

  const profileQuery = useQuery({
    queryKey: ACCOUNT_STATUS_QUERY_KEY,
    queryFn: () => authApi.getProfile(),
    refetchOnWindowFocus: true,
    retry: false,
  });
  const appealQuery = useMyAppealQuery();
  const { refetch: refetchProfile } = profileQuery;

  useEffect(() => {
    const profile = profileQuery.data;
    if (!profile || isLeavingRef.current) return;

    if (profile.status === UserStatus.LOCKED) {
      setUser(profile);
      return;
    }

    isLeavingRef.current = true;
    const wasLocked = useAuthStore.getState().user?.status === UserStatus.LOCKED;
    void (async () => {
      if (wasLocked) {
        try {
          await refreshSession(API_BASE_URL);
        } catch {
          // A failed refresh logs the user out by itself; the next request retries otherwise.
        }
      }
      setUser(profile);
      void queryClient.invalidateQueries();
      navigate(getHomePathByRole(profile.role), { replace: true });
    })();
  }, [navigate, profileQuery.data, queryClient, setUser]);

  useEffect(() => {
    if (!socket) return;
    const onCreated = (payload: unknown) => {
      if (!isNotificationCreatedEvent(payload)) return;
      const messageKey = payload.data?.messageKey;
      if (messageKey === 'user.unlocked') void refetchProfile();
      if (messageKey === 'appeal.rejected' || messageKey === 'user.unlocked') {
        void queryClient.invalidateQueries({ queryKey: MODERATION_QUERY_KEYS.MY_APPEAL });
      }
    };
    socket.on(NOTIFICATION_SOCKET_EVENTS.CREATED, onCreated);
    return () => {
      socket.off(NOTIFICATION_SOCKET_EVENTS.CREATED, onCreated);
    };
  }, [queryClient, refetchProfile, socket]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // The local session is cleared in onError as well.
    } finally {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  const appeal = appealQuery.data;

  return {
    lockReason: appeal?.lockReason ?? profileQuery.data?.lockReason ?? user?.lockReason ?? null,
    lockedAt: appeal?.lockedAt ?? profileQuery.data?.lockedAt ?? user?.lockedAt ?? null,
    appealQuery,
    onLogout: handleLogout,
    isLoggingOut: logoutMutation.isPending,
  };
};
