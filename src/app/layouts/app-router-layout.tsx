import { Outlet } from 'react-router-dom';
import { ChatRealtimeBridge } from '@/features/chat/components/chat-realtime-bridge';
import { NotificationRealtimeBridge } from '@/features/notifications/components/notification-realtime-bridge';
import { useAuthStore } from '@/stores/auth-store';
import { UserStatus } from '@/types/user';

export const AppRouterLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const status = useAuthStore((state) => state.user?.status);
  const isAuth = isAuthenticated || !!accessToken;

  return (
    <>
      {isAuth && (
        <>
          {status !== UserStatus.LOCKED && <ChatRealtimeBridge />}
          <NotificationRealtimeBridge />
        </>
      )}
      <Outlet />
    </>
  );
};
