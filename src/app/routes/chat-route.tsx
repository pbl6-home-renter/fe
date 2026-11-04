import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ProtectedRoute } from './protected-route';
import { Role } from '@/types/role';

const ChatPage = lazy(async () => {
  const module = await import('@/features/chat/pages/chat-page');
  return { default: module.ChatPage };
});

export const ChatRoute = () => (
  <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>
    <Suspense
      fallback={
        <div className="flex h-full min-h-0 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ChatPage />
    </Suspense>
  </ProtectedRoute>
);
