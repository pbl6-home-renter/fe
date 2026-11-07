import { Outlet } from 'react-router-dom';
import { ChatRealtimeBridge } from '@/features/chat/components/chat-realtime-bridge';
import { NotificationRealtimeBridge } from '@/features/notifications/components/notification-realtime-bridge';

export const AppRouterLayout = () => (
  <>
    <ChatRealtimeBridge />
    <NotificationRealtimeBridge />
    <Outlet />
  </>
);
