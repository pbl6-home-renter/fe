import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { LazyMotion, MotionConfig } from 'motion/react';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/query/query-client';
import { i18n } from '@/i18n/i18n';
import { useCurrentUserQuery } from '@/features/auth/hooks/use-current-user-query';
import { SocketSessionProvider } from '@/features/realtime/components/socket-session-provider';

interface AppProviderProps {
  children: ReactNode;
}

const loadMotionFeatures = () => import('@/lib/motion-features').then((module) => module.default);

const AuthSessionInitializer = ({ children }: { children: ReactNode }) => {
  useCurrentUserQuery();
  return <>{children}</>;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="user">
          <LazyMotion features={loadMotionFeatures} strict>
            <AuthSessionInitializer>
              <SocketSessionProvider>{children}</SocketSessionProvider>
            </AuthSessionInitializer>
          </LazyMotion>
        </MotionConfig>
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </I18nextProvider>
  );
};
