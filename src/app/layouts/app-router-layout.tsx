import { Outlet } from 'react-router-dom';
import { ChatRealtimeBridge } from '@/features/chat/components/chat-realtime-bridge';

export const AppRouterLayout = () => (
  <>
    <ChatRealtimeBridge />
    <Outlet />
  </>
);
